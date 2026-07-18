import express from "express";
import auth from "./routes/authRoute.js";
import category from "./routes/categoryRoutes.js";
import product from "./routes/productRoutes.js";
import cart from "./routes/cartRoutes.js";
import checkout from "./routes/checkoutRoute.js";
import wishlist from "./routes/wishlistRoute.js";
import order from "./routes/orderRoutes.js";
import reviews from "./routes/reviewRoutes.js";
import analytics from "./routes/analyticsRoute.js";
import settings from "./routes/settingsRoute.js";
import trueanalyticsRoutes from "./routes/Trueanalytics.js";
import adminCustomerRoutes from "./routes/adminCustomer.js";
import seedAdmin from "./routes/seedAdmin.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

// Logging
app.use(morgan("dev"));

// Cookies
app.use(cookieParser());

// Body parser
app.use(express.json());

// =========================
// RATE LIMITING
// =========================

// General API limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: {
    message: "Too many requests. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Auth limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    message: "Too many login attempts. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register and login protection only
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// =========================
// ROUTES
// =========================

app.use("/api/auth", auth);

app.use("/api/category", category);

app.use("/api/products", product);

app.use("/api/cart", cart);

app.use("/api/checkout", checkout);

app.use("/api/orders", order);

app.use("/api/wishlist", wishlist);

app.use("/api/reviews", reviews);

app.use("/api/admin/analytics", analytics);

app.use("/api/settings", settings);

app.use("/api/admin/customers", adminCustomerRoutes);

app.use("/api/trueanalytics", trueanalyticsRoutes);

// =========================
// 404 HANDLER
// =========================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// =========================
// ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Something went wrong",
  });
});

// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 8000;

seedAdmin();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
