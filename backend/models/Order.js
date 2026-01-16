import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // The items array matches the "items" in your JSON
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    
    // New field we added to track customers
    phoneNumber: { type: String, required: true }, 
    
    // Email for tracking/contacting the user
    userEmail: { type: String, required: true },

    // Status for the Admin Dashboard
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "completed", "cancelled"],
    },
  },
  { timestamps: true } // This automatically creates "createdAt" and "updatedAt"
);

const Order = mongoose.model("Order", orderSchema);
export default Order;