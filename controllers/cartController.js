import cartProductModel from "../model/cartProductModel.js";
import userModel from "../model/userModel.js";

export const addCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "product id is required",
        success: false,
        error: true,
      });
    }

    const checkCartItem = await cartProductModel.findOne({
      userId: userId,
      productId: productId,
    });

    if (checkCartItem) {
      return res.status(400).json({
        message: "item already in cart",
      });
    }

    const cartItem = new cartProductModel({
      quantity: 1,
      productId: productId,
      userId: userId,
    });
    const saveCart = await cartItem.save();

    const updateUserCartId = await userModel.updateOne(
      { _id: userId },
      { $push: { shopping_cart: saveCart._id } },
    );

    return res.json({
      data: saveCart,
      message: "Item add successfully",
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

export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const populateCart = await cartProductModel
      .find({ userId: userId })
      .populate("productId");

    return res.json({
      data: populateCart,
      message: "cart items",
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

export const deleteCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const deleteCart = await cartProductModel.deleteOne({
      _id: id,
      userId: userId,
    });
    return res.json({
      message: "Item remove",
      error: false,
      success: true,
      data: deleteCart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {id} = req.params
    const { qty } = req.body;

    console.log('id' , id , 'qty', qty)

    if (!id || !qty) {
      return res.status(400).json({
        message: "provide _id, qty",
      });
    }

    const updateCartitem = await cartProductModel.updateOne(
      {
        _id: id,
        userId: userId,
      },
      {
        quantity: qty,
      },
    );

    return res.json({
      message: "Update cart",
      success: true,
      error: false,
      data: updateCartitem,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
