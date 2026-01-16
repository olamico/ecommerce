import express from "express";
import { createOrder, getOrders } from "../controllers/orderController.js";

const router = express.Router();

// Public route: Customer places an order
router.post("/", createOrder);

// Admin route: View all orders
router.get("/", getOrders);

export default router;