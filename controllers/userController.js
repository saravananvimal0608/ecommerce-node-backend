import userModel from "../model/userModel.js";
import bcrypt, { hash } from "bcryptjs";
import { emailSend } from "../utils/emailSend.js";
import verifyEmail from "../utils/verifyEmail.js";
import forgotPasswordEmail from "../utils/forgotPasswordEmail.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
        error: true,
        success: false,
      });
    }

    // Check if user already exists
    const existUser = await userModel.findOne({ email });

    if (existUser) {
      // Resend verification email if account exists but email is not verified
      if (!existUser.verify_email) {
        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${existUser._id}`;

        await emailSend({
          email,
          subject: "Verify Email From Ecommerce",
          html: verifyEmail(existUser.name, verifyEmailUrl),
        });

        return res.status(200).json({
          message:
            "Your account is not verified. A new verification email has been sent.",
          error: false,
          status: true,
        });
      }

      // Return error if account is already verified
      return res.status(400).json({
        message: "An account with this email already exists. Please log in.",
        error: true,
        status: false,
      });
    }

    // Generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create user payload
    const payload = {
      name,
      email,
      password: hashPassword,
    };

    // Save new user
    const newUser = new userModel(payload);
    const save = await newUser.save();

    // Generate email verification link
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;

    // Send verification email
    await emailSend({
      email,
      subject: "Verify Email From Ecommerce",
      html: verifyEmail(name, verifyEmailUrl),
    });

    return res.status(200).json({
      message:
        "Registration successful. Please check your email to verify your account.",
      error: false,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const verifyEmailId = async (req, res) => {
  const { code } = req.body;
  try {
    const validUser = await userModel.findOne({ _id: code });
    if (!validUser)
      return res
        .status(400)
        .json({ message: "invalid code", error: true, status: false });

    const updateUser = await userModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      },
    );
    return res.status(200).json({
      message: "email verified successfully",
      error: false,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "required all fields", error: true, status: false });
    }
    const emailCheck = await userModel.findOne({ email });

    if (!emailCheck.verify_email) {
      return res.status(400).json({
        message: "Please verify your email to continue",
        status: false,
        error: true,
      });
    }

    const checkPassword = await bcrypt.compare(password, emailCheck.password);

    if (!checkPassword || !emailCheck) {
      return res
        .status(400)
        .json({ message: "invalid credentials", status: false, error: true });
    }

    const Token = await generateToken({
      userId: emailCheck._id,
      name: emailCheck.name,
      role: emailCheck.role,
    });

    return res.status(200).json({
      message: "login successfully",
      error: false,
      status: true,
      email: email,
      token: Token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.userId; // its coming from auth

    const image = req.file;
    const updateAvatar = await userModel.findByIdAndUpdate(
      { _id: userId },
      { avatar: image.path },
      {
        returnDocument: "after",
      },
    );

    return res.status(200).json({
      message: "avatar uploaded successfully",
      error: false,
      success: true,
      data: updateAvatar,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
      stack: error.stack,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.userId; // its coming from auth
    const { email, name, password } = req.body;

    let hashPassword = "";
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    }
    const updateUser = await userModel.findByIdAndUpdate(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(password && { password: hashPassword }),
      },
    );
    return res.json({
      message: "Updated successfully",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "email is required",
        error: true,
        success: false,
      });
    }
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "invalid email",
        error: true,
        success: false,
      });
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expireTime = new Date(Date.now() + 60 * 60 * 1000); // 1hr

    const update = await userModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: token,
      forgot_password_expiry: expireTime,
    });

    await emailSend({
      email: user.email,
      subject: "Reset Password",
      html: forgotPasswordEmail(user.name, token, expireTime),
    });

    return res.json({
      message: `Otp Sent Your ${email}`,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({
        message: "all fields are required",
        error: true,
        success: false,
      });

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "invalid email", error: true, success: false });
    }

    if (otp !== user.forgot_password_otp) {
      return res.status(400).json({
        message: "invalid otp",
        error: true,
        success: false,
      });
    }
    const currentTime = new Date();

    if (user.forgot_password_expiry < currentTime) {
      return res.status(400).json({
        message: "Otp is expired",
        error: true,
        success: false,
      });
    }

    const updateUser = await userModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: null,
      forgot_password_expiry: null,
      otp_verified: true,
    });

    return res.json({
      message: "Verify otp successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
      stack: error.stack,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "all fields are required",
        error: true,
        success: false,
      });
    }

    const user = await userModel.findOne({ email });

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        error: true,
        success: false,
      });
    }

    if (!user.otp_verified) {
      return res.status(400).json({
        message: "Please verify OTP first",
        error: true,
        success: false,
      });
    }

    if (!user) {
      return res.status(400).json({
        message: "invalid email",
        error: true,
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    const updateUser = await userModel.findByIdAndUpdate(user._id, {
      password: hashPassword,
    });

    return res.json({
      message: "Password updated successfully.",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const userDetails = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await userModel.findById(userId).select("-password");

    return res.json({
      message: "user details",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
