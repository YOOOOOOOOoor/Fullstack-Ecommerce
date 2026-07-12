import express from "express";
import auth from "./routes/authRoute.js";
import category from "./routes/categoryRoutes.js";
import product from "./routes/productRoutes.js";
import cart from "./routes/cartRoutes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

const PORT = process.env.PORT || 8000;

app.use("/api/auth", auth);
app.use("/api/category", category);
app.use("/api/products", product);
app.use("/api/cart", cart);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
