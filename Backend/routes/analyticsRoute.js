import express from "express";

import protect from "../middleware/auth.js";
import admin from "../middleware/admin.js";

import {
  getDashboardStats,
  getLowStockProducts,
  getRecentOrders,
  getRevenue,
  getRevenueChart,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/stats", protect, admin, getDashboardStats);

router.get("/revenue", protect, admin, getRevenue);

router.get("/low-stock", protect, admin, getLowStockProducts);

router.get("/recent-orders", protect, admin, getRecentOrders);

router.get("/revenue-chart", protect, admin, getRevenueChart);

export default router;
