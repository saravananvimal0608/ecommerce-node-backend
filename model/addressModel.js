import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address_line: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  state: {
    type: String,
    default: "",
  },
  pincode: {
    type: String,
  },
  country: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  status:{
    type:Boolean,
    default:true
  },
  userId:{
    type:mongoose.Schema.ObjectId,
    ref:"user"
  }
},{
    timestamps:true
});

const addressModel = mongoose.model("address",addressSchema)

export default addressModel