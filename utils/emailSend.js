import nodemailer from "nodemailer";

if (!process.env.GOOGLE_APP_PASSWORD) {
  console.log("GOOGLE_APP_PASSWORD is required in env");
}

export const emailSend = async ({ email, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saravananvimal0608@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    await transporter.verify();
    console.log("SMTP Connected");

    const info = await transporter.sendMail({
      from: "saravananvimal0608@gmail.com",
      to: email,
      subject,
      html,
    });

    console.log("Email sent:", info.response);

    return info;
  } catch (err) {
    console.error("Email Error:", err);
    throw err;
  }
};