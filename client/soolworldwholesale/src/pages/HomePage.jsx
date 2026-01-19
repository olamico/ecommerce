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

  if (error)
    return <div className="text-center text-red-500 p-10">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4">
        <header className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-wide">
            {searchTerm ? `Search Results for "${searchTerm}"` : "New Arrivals"}
          </h2>
          {!searchTerm && (
            <p className="text-sm text-gray-500">Top picks for you today</p>
          )}
        </header>

        {loading ? (
          /* JUMIA-STYLE SKELETON LOADING (The boxes flash while loading) */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded shadow-sm p-2 animate-pulse"
              >
                <div className="bg-gray-200 h-40 w-full rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded mb-1"></div>
                <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-12 rounded-lg text-center shadow-sm">
            <p className="text-gray-600 text-lg">
              No products found matching your search.
            </p>
          </div>
        ) : (
          /* JUMIA/JIJI GRID: 2 COLUMNS ON MOBILE, 5 ON DESKTOP */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="hover:scale-[1.02] transition-transform"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
