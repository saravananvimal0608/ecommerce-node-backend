import crypto from "crypto";
import mongoose from "mongoose";
import razorpay from "../config/razorpay.js";

import CartProductModel from "../model/cartProductModel.js";
import OrderModel from "../model/orderModel.js";
import UserModel from "../model/userModel.js";
import productModel from "../model/productModel.js";

export const pricewithDiscount = (price, dis = 0) => {
  const discountAmount = (price * dis) / 100;
  return Math.round(price - discountAmount);
};

export async function CashOnDeliveryOrderController(req, res) {
  try {
    const userId = req.user.userId;

    const { list_items, addressId } = req.body;

    let totalAmt = 0;

    const payload = await Promise.all(
      list_items.map(async (el) => {
        const product = await productModel.findById(el.productId);

        const subTotal =
          pricewithDiscount(product.price, product.discount) * el.quantity;

        totalAmt += subTotal;

        return {
          userId: userId,
          orderId: `COD_${new mongoose.Types.ObjectId()}`,
          productId: product._id,

          product_details: {
            name: product.name,
            image: product.image,
          },
          payment_status: "CASH ON DELIVERY",
          delivery_address: addressId,
          sub_total: subTotal,
        };
      }),
    );

    // add total amount to every order
    const finalPayload = payload.map((item) => ({
      ...item,
      total_amt: totalAmt,
    }));

    const generatedOrder = await OrderModel.insertMany(finalPayload);

    await CartProductModel.deleteMany({
      userId: userId,
    });

    await UserModel.findByIdAndUpdate(userId, {
      $push: {
        order_history: {
          $each: generatedOrder.map((o) => o._id),
        },
      },
    });

    return res.status(200).json({
      message: "Order placed successfully",
      success: true,
      error: false,
      totalAmt,
      data: generatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function paymentController(request, response) {
  try {
    const userId = request.user.userId;

    const { list_items, addressId } = request.body;

    // total amount calculate from backend
    let totalAmt = 0;

    // latest product details from DB
    const orderProducts = await Promise.all(
      list_items.map(async (el) => {
        const product = await productModel.findById(el.productId);

        // product not found
        if (!product) {
          throw new Error("Product not found");
        }

        // subtotal calculate
        const subTotal =
          pricewithDiscount(product.price, product.discount) * el.quantity;

        // add total amount
        totalAmt += subTotal;

        return {
          productId: product._id,
          product_details: {
            name: product.name,
            image: product.image,
          },
          quantity: el.quantity,
          price: product.price,
          discount: product.discount,
          sub_total: subTotal,
        };
      }),
    );

    // razorpay options
    const options = {
      amount: totalAmt * 100, // paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    // create razorpay order
    const razorpayOrder = await razorpay.orders.create(options);

    return response.status(200).json({
      message: "Razorpay order created",
      error: false,
      success: true,
      total_amount: totalAmt,
      razorpay_order: razorpayOrder,
      products: orderProducts,
      addressId: addressId,
    });


  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// SAVE ORDER AFTER PAYMENT SUCCESS
const getOrderProductItems = async ({
  userId,
  list_items,
  totalAmt,
  addressId,
  razorpay_order_id,
  razorpay_payment_id,
}) => {
  const orderProduct = list_items.map((el) => {
    return {
      userId: userId,

      orderId: razorpay_order_id,

      productId: el.productId._id,

      product_details: {
        name: el.productId.name,
        image: el.productId.image,
      },

      paymentId: razorpay_payment_id,

      payment_status: "PAID",

      delivery_address: addressId,

      sub_total:
        pricewithDiscount(el.productId.price, el.productId.discount) *
        el.quantity,

      total_amt: totalAmt,
    };
  });

  const generatedOrder = await OrderModel.insertMany(orderProduct);

  // clear cart
  await CartProductModel.deleteMany({
    userId: userId,
  });

  // update stock
  for (const item of list_items) {
    await productModel.findByIdAndUpdate(item.productId._id, {
      $inc: {
        stock: -item.quantity,
      },
    });
  }

  // save order history
  await UserModel.findByIdAndUpdate(userId, {
    $push: {
      order_history: {
        $each: generatedOrder.map((o) => o._id),
      },
    },
  });

  return generatedOrder;
};

// VERIFY RAZORPAY PAYMENT
export async function webhookStripe(request, response) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      list_items,
      addressId,
    } = request.body;

    const userId = request.user.userId;

    // verify payment signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return response.status(400).json({
        message: "Payment verification failed",
        error: true,
        success: false,
      });
    }

    // calculate total from backend
    let totalAmt = 0;

    const updatedItems = await Promise.all(
      list_items.map(async (el) => {
        const product = await productModel.findById(el.productId);

        if (!product) {
          throw new Error("Product not found");
        }

        const subTotal =
          pricewithDiscount(product.price, product.discount) * el.quantity;

        totalAmt += subTotal;

        return {
          ...el,
          productId: product,
        };
      }),
    );

    // save order
    const order = await getOrderProductItems({
      userId,
      list_items: updatedItems,
      totalAmt,
      addressId,
      razorpay_order_id,
      razorpay_payment_id,
    });

    return response.status(200).json({
      message: "Payment successful",
      error: false,
      success: true,
      data: order,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getOrderDetailsController(request, response) {

  try {

    const userId = request.user.userId;

    const orderlist = await OrderModel.find({
      userId: userId,
    })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    return response.status(200).json({
      message: "Order list",
      error: false,
      success: true,
      data: orderlist,
    });

  } catch (error) {

    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });

  }
}
