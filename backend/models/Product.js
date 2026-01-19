import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
 {
    name: { type: String, required: true },
    price: { type: Number, required: true },      // Original Price (e.g., 20000)
    promoPrice: { type: Number, default: null },   // Sale Price (e.g., 15000)
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },       // Percentage off (Optional)
    description: { type: String },
    category: { type: String },                   // Added for "Jumia" filtering
    countInStock: { type: Number, default: 10 }   // Added to prevent overselling
  },
  { timestamps: true }
);


export default mongoose.model("Product", productSchema);
