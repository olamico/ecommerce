import React from "react";
import { FaSearch } from "react-icons/fa";

// The function name must match the export name
const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="w-full md:flex-1 max-w-sm">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink-600 transition-colors">
          <FaSearch size={16} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar; // <--- Make sure this is here and spelled correctly
