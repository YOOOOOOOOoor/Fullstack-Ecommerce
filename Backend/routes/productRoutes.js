import express from "express";
import upload from "../middleware/upload.js";
import Admin from "../middleware/admin.js";
import protect from "../middleware/auth.js";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductCustomer,
  getProductsCustomer,
  getColor,
} from "../controllers/productController.js";

const router = express.Router();

// Static routes
router.get("/color", getColor);
router.get("/customer", getProductsCustomer);
router.get("/customer/:id", getProductCustomer);

// Admin
router.post("/", protect, Admin, upload.single("image"), createProduct);
router.get("/", protect, Admin, getProducts);

// Parameterized routes LAST
router.get("/:id", protect, Admin, getProduct);
router.put("/:id", protect, Admin, upload.single("image"), updateProduct);
router.delete("/:id", protect, Admin, deleteProduct);

export default router;
