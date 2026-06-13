import express from "express";
import { addAddress, deleteAddress, getAddress, updateAddress } from "../controllers/addressController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/add", authMiddleware, addAddress);
router.put("/update/:id", authMiddleware, updateAddress);
router.delete("/delete/:id", authMiddleware, deleteAddress);
router.get("/getAddress", authMiddleware, getAddress);
export default router;
