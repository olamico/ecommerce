import React from "react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const discountedPrice =
    product.price - product.price * (product.discount / 100);

  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:border-blue-300 cursor-pointer group">
      {/* Image Section */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        <img
          className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          src={
            product.image && product.image.startsWith("http")
              ? product.image
              : `${backendUrl.replace(/\/$/, "")}/${product.image?.replace(
                  /^\//,
                  ""
                )}`
          }
          alt={product.name}
          onError={(e) => {
            e.target.src = "https://placehold.co/300?text=No+Image";
          }}
        />
      </div>

      {/* Details Section */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            ★ {product.rating}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-green-600">
            ₦{discountedPrice.toFixed(2)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₦{product.price}
            </span>
          )}
        </div>
      </div>

      {/* Action Section */}
      <div className="px-6 pb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="w-full bg-blue-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded transition-colors active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
