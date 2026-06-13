import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addProduct,
  deleteProduct,
  getAllBestSellerProduct,
  getAllOfferProduct,
  getAllProduct,
  getAllTopProduct,
  getAllTrendingProduct,
  getProductByCategory,
  getSingleProduct,
  updateProduct,
  getRelatedProducts,
  rating,
} from "../controllers/productController.js";
import upload from "../middleware/upload.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();
router.post(
  "/add",
  upload.array("product-image", 5),
  authMiddleware,
  adminMiddleware,
  addProduct,
);
router.get("/all", getAllProduct);
router.get("/singleProduct/:id", getSingleProduct);
router.put("/update/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteProduct);
router.get("/productByCategory/:id", getProductByCategory);
router.get("/allOfferProduct", getAllOfferProduct);
router.get("/allTrendingProduct", getAllTrendingProduct);
router.get("/allBestSellerProduct", getAllBestSellerProduct);
router.get("/allTopProduct", getAllTopProduct);
router.get("/relatedProducts/:id", getRelatedProducts);
router.post('/rating/:productId',authMiddleware,rating)

export default router;
