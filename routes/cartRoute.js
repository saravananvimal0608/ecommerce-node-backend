import express from "express";
import {
  addCart,
  deleteCart,
  getCart,
  updateCart,
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/add", authMiddleware, addCart);
router.get("/get", authMiddleware, getCart);
router.delete("/delete/:id", authMiddleware, deleteCart);
router.put("/update/:id", authMiddleware, updateCart);
export default router;
