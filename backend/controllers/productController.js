import Product from "../models/Product.js";

// @desc    Get all products (Public)
export const getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    // If there is a search term, find products with names containing that term
    if (search) {
      query.name = { $regex: search, $options: "i" }; // "i" means case-insensitive
    }
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (Admins Only)
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, rating, discount } = req.body;
    
    // --- UPDATED LINE ---
    // Cloudinary automatically gives you the full URL in req.file.path
    const imageUrl = req.file ? req.file.path : "";

    const newProduct = new Product({
      name,
      price,
      description,
      rating,
      discount,
      image: imageUrl, // Now saves "https://res.cloudinary.com/..."
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// @desc    Delete a product (Admins Only)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Just delete from MongoDB. 
    // (If it's a Cloudinary image, it stays there, or you can add Cloudinary delete logic later)
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};