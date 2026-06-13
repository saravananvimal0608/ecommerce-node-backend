import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  CashOnDeliveryOrderController,
  getOrderDetailsController,
  paymentController,
  webhookStripe,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/cod", authMiddleware, CashOnDeliveryOrderController);
router.post("/onlinePayment", authMiddleware, paymentController);
router.post("/webhook", authMiddleware, webhookStripe);
router.get("/getOrderDetails", authMiddleware, getOrderDetailsController);

export default router;
