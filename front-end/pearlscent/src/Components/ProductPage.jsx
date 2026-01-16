import React, { useEffect, useState } from "react";
import axios from "axios";
// 1. ADD THIS IMPORT (Make sure the path to ProductCard is correct)
import ProductCard from "../Components/ProductCard"; 

const ProductGallery = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. USE DYNAMIC API URL (Fixes the production fetch error)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Updated to use the variable instead of hardcoded localhost
        const response = await axios.get(`${API_URL}/api/products`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_URL]); // Added API_URL to dependency array for safety

  if (loading)
    return <div className="text-center mt-10">Loading products...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-pink-600">Our Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;