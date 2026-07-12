import express from "express";
import dotenv from "dotenv";
import protect from "../middleware/auth.js";
import { register, login, me, logout } from "../controllers/authControllers.js";

dotenv.config();

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.post("/logout", logout);

export default router;
