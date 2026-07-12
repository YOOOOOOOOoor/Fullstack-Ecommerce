import express from "express";
import dotenv from "dotenv";
import protect from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import {
  Add,
  Edit,
  getAll,
  Delete,
  One,
} from "../controllers/categoryControllers.js";

dotenv.config();

const router = express.Router();

router.post("/", protect, admin, Add);
router.get("/", getAll);
router.get("/:id", One);
router.put("/:id", protect, admin, Edit);
router.delete("/:id", protect, admin, Delete);

export default router;
