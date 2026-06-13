import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    images: {
      type: Array,
      default: [],
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "category",
      },
    ],
    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    unit: {
      type: String,
    },
    stock: {
      type: Number,
    },
    price: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    product_type: {
      type: String,
      enum: [
        "offer-product",
        "trending-product",
        "normal-product",
        "best-seller",
        "top-product",
      ],
      default: "normal-product",
    },
    description: {
      type: String,
    },
    more_details: {
      type: Object,
      default: {},
    },
    publish: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "user",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],
  },

  {
    timestamps: true,
  },
);

const productModel = mongoose.model("product", productSchema);

export default productModel;
