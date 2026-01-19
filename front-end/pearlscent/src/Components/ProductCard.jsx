import React from "react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 1. PRICE LOGIC (Prioritize promoPrice, then discount, then normal price)
  let finalPrice = product.price;
  let hasSale = false;

  if (product.promoPrice && product.promoPrice > 0) {
    finalPrice = product.promoPrice;
    hasSale = true;
  } else if (product.discount && product.discount > 0) {
    finalPrice = product.price - (product.price * (product.discount / 100));
    hasSale = true;
  }

  // Calculate percentage for the badge if not already set
  const displayDiscount = product.discount > 0 
    ? product.discount 
    : Math.round(((product.price - finalPrice) / product.price) * 100);

  const imageUrl = product.image && product.image.startsWith("http")
    ? product.image
    : `${backendUrl.replace(/\/$/, "")}/${product.image?.replace(/^\//, "")}`;

  return (
    <div className="relative bg-white rounded-md shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col h-full overflow-hidden group">
      
      {/* JUMIA-STYLE SALE BADGE */}
      {hasSale && (
        <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
          -{displayDiscount}%
        </div>
      )}

      {/* IMAGE SECTION */}
      <div className="relative aspect-square bg-white p-2">
        <img
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          src={imageUrl}
          alt={product.name}
          onError={(e) => { e.target.src = "https://placehold.co/300?text=No+Image"; }}
        />
      </div>

      {/* DETAILS SECTION */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm text-gray-700 font-medium line-clamp-2 h-10 mb-1">
          {product.name}
        </h3>

        <div className="flex flex-col mb-1">
          <span className="text-lg font-bold text-gray-900 leading-none">
            ₦{finalPrice.toLocaleString()}
          </span>
          {hasSale && (
            <span className="text-xs text-gray-400 line-through mt-1">
              ₦{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* STOCK STATUS (From your countInStock field) */}
        <div className="mb-2">
           {product.countInStock <= 5 && product.countInStock > 0 ? (
             <span className="text-[10px] text-red-500 font-medium">{product.countInStock} items left</span>
           ) : product.countInStock === 0 ? (
             <span className="text-[10px] text-gray-400 font-medium">Out of stock</span>
           ) : null}
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (product.countInStock > 0) {
              addToCart({ ...product, price: finalPrice });
            }
          }}
          disabled={product.countInStock === 0}
          className={`mt-auto w-full py-2 rounded text-[11px] font-bold uppercase transition-colors ${
            product.countInStock === 0 
            ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
            : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;