import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import "./src/config/db.js";

import authRoutes from "./src/routes/auth.Routes.js";
import categoryRoutes from "./src/routes/categories.Route.js";
import productRoutes from "./src/routes/products.Route.js";
import userRoutes from "./src/routes/user.Routes.js";

import { globalLimiter } from "./src/middleware/rateLimit.Middleware.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.Middleware.js";

const app = express();

// ===== Security middlewares =====
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // ضروري عشان الـ cookies تنبعث من React
  })
);
app.use(express.json({ limit: "10kb" })); // بيمنع حدا يبعث body ضخم
app.use(cookieParser());
app.use("/api", globalLimiter);

// ===== Routes =====
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", userRoutes);

// ===== Errors (لازم يكونوا آخر إشي) =====
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));