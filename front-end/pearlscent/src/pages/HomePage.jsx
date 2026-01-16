import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../Components/ProductCard";

const HomePage = ({ searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts(searchTerm);
        setProducts(data);
      } catch (err) {
        setError("Failed to load products. Is the server running?");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [searchTerm]);

  if (loading)
    return <div className="text-center p-10">Loading products...</div>;
  if (error)
    return <div className="text-center text-red-500 p-10">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">New Arrivals</h2>
        <p className="text-gray-500">Check out our latest collection</p>
      </header>

      {products.length === 0 ? (
        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <p className="text-blue-600">
            No products found. Go to the Admin Panel to add some!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
