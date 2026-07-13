import express from "express";
import protect from "../middleware/auth.js";
import {
  showCart,
  TotalAmount,
  displayInfo,
  chapaPayment,
  verifyPayment,
} from "../controllers/checkoutController.js";

const router = express.Router();

router.get("/total", protect, TotalAmount);
router.get("/cart", protect, showCart);
router.post("/chapa", protect, chapaPayment);
router.get("/info", protect, displayInfo);
router.get("/verify/:tx_ref", protect, verifyPayment);

export default router;
