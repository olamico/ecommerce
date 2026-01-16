import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();          // ✅ load env first
connectDB();              // ✅ connect DB BEFORE server starts

const app = express();

// --- Middleware ---
// Replace your current app.use(cors(...)) with this:
app.use(cors({
  origin: [
    "https://estherscentstouch.vercel.app", 
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// --- Routes ---
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ✅ REMOVED: app.use("/uploads", ...) 
// You no longer need this because images are now served by Cloudinary's HTTPS links.

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});