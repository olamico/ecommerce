import express from "express";
import { upload } from '../config/cloudinary.js'; // This is your new Cloudinary connection
import { getProducts, createProduct, deleteProduct } from "../controllers/productController.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = express.Router();

// --- Routes ---

// GET products (public)
router.get("/", getProducts);

// POST product (admin)
// Note: Changed 'addProduct' to 'createProduct' to match your import above
router.post("/add", upload.single("image"), createProduct);

// DELETE product (admin)
router.delete("/:id", deleteProduct);

export default router;