import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  orderId: {
    type: String,
    required: [true, "provide orderId"],
    unique: true,
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "product",
  },
  product_details: {
    name: String,
    image: Array,
  },
  paymentId: {
    type: String,
    default: "",
  },
  payment_status:{
    type:String,
    default:""
  },
  delivery_address:{
    type:mongoose.Schema.ObjectId,
    ref:"address"
  },
//   delivery_status:{
//     type:
//   }

sub_total:{
    type:Number,
    default:0
},
total_amt:{
    type:Number,
    default:0
},
invoice_receipt:{
    type:String,
    default:""
}
},{timestamps:true});


const orderModel = mongoose.model("order",orderSchema)
export default orderModel