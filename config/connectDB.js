import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.MONGO_URI) {
    throw new Error("please provide MONGO_URI in env")
}

console.log(process.env.MONGO_URI);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log("mongo connected successfully");

    } catch (error) {
        console.log("mongo not connected", error);

    }
}

export default connectDB