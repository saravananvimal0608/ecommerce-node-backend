import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/connectDB.js";
import dns from "dns";
import userRouter from "./routes/userRoutes.js";
import categoryRouter from "./routes/categoryRoute.js";
import productRouter from "./routes/productRoute.js";
import addressRouter from "./routes/addressRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from './routes/orderRoute.js'
import subCategoryRouter from './routes/subCategoryRoute.js'

dns.setServers(["8.8.8.8", "8.8.4.4"]);

connectDB();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8080;

app.use("/api/user", userRouter);
app.use("/api/address", addressRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/subcategory", subCategoryRouter);

app.use("/", (req, res) => {
  res.send("api is running");
});

app.listen(PORT, () => {
  console.log(`server running in ${PORT}`);
});
