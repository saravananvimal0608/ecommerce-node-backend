import express from "express";
import authMiddleware from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
  addSubCategory,
  getAllSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subCategoryController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/add-subcategory",
  authMiddleware,
  upload.single("subcategory-image"),
  adminMiddleware,
  addSubCategory,
);
router.get("/getAllSubCategory", authMiddleware, getAllSubCategory);
router.put(
  "/update-subcategory/:id",
  authMiddleware,
  upload.single("subcategory-image"),
  adminMiddleware,
  updateSubCategory,
);
router.delete(
  "/delete-subcategory/:id",
  authMiddleware,
  adminMiddleware,
  deleteSubCategory,
);

export default router;
