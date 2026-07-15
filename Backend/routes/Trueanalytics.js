import express from "express";

import protect from "../middleware/auth.js";
import admin from "../middleware/admin.js";

import { getAnalytics } from "../controllers/TrueanalyticsController.js";

const router = express.Router();

router.get("/", protect, admin, getAnalytics);

export default router;
