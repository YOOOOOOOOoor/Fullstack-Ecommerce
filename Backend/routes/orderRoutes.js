import express from "express";
import protect from "../middleware/auth.js";
import Admin from "../middleware/admin.js";
import {
  getOrderAdmin,
  getOrdersAdmin,
  getOrders,
  getOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", protect, getOrders);
router.get("/:id", protect, getOrder);
router.get("/admin/orders/:id", protect, Admin, getOrderAdmin);
router.get("/admin/orders/", protect, Admin, getOrdersAdmin);
router.patch("/admin/orders/:id", protect, Admin, updateOrderStatus);

export default router;
