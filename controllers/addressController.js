import addressModel from "../model/addressModel.js";
import userModel from "../model/userModel.js";

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { address_line, city, state, pincode, country, mobile, status } =
      req.body;

    const createAddress = new addressModel({
      address_line,
      city,
      state,
      country,
      pincode,
      mobile,
      userId: userId,
    });
    const saveAddress = await createAddress.save();

    const addUserAddressId = await userModel.findByIdAndUpdate(userId, {
      $push: {
        address: saveAddress._id,
      },
    });

    return res.status(200).json({
      data: saveAddress,
      message: "address added successfully",
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

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { address_line, city, state, pincode, country, mobile, status } =
      req.body;
    const addressId = req.params.id;

    const update = await addressModel.findByIdAndUpdate(addressId, {
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      status,
      userId: userId,
    });

    return res.status(200).json({
      data: update,
      message: "address updated successfully",
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

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const deleteAdd = await addressModel.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    const deleteUserAddressId = await userModel.findByIdAndUpdate(userId, {
      $pull: {
        address: id,
      },
    });

    if (!deleteAdd) {
      return res.status(404).json({
        message: "address not found",
        success: false,
        error: true,
      });
    }
    return res.status(200).json({
      message: "address deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      stack: error.stack,
      success: false,
    });
  }
};

export const getAddress = async (req, res) => {
  try {
    const userId = req.user.userId;

    const address = await addressModel
      .find({ userId: userId })
      .sort({ createdAt: -1 });

    return res.json({
      data: address,
      message: "List of address",
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
