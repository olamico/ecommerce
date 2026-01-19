import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  useUser,
} from "@clerk/clerk-react";
import { Menu, X } from "lucide-react";
import { FaSearch, FaRegUser } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import SearchBar from "./SearchBar"; // Importing your new component

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const { cart } = useCart();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = user?.publicMetadata?.role === "admin";
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl py-3 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
          {/* 1. LOGO & HOME LINK */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <Link to="/" className="text-2xl font-bold text-pink-600 italic">
              Soolworld Wholesale Hub
            </Link>
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* 2. SEARCH COMPONENT */}
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* 3. ACTIONS (Home, Cart, Login) */}
          <div className="flex items-center justify-end space-x-6 w-full md:w-auto">
            {/* Home Link (Visible on desktop) */}
            <Link
              to="/"
              className="hidden md:block text-gray-700 hover:text-pink-600 font-medium"
            >
              Home
            </Link>

            {/* Admin Panel */}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-xs bg-red-600 text-white px-2 py-1 rounded"
              >
                ADMIN
              </Link>
            )}

            {/* CART BUTTON */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-pink-600"
            >
              <TiShoppingCart size={28} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* LOGIN / USER BUTTON */}
            <div className="flex items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-full text-sm hover:bg-pink-700 transition">
                    <FaRegUser /> Login
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4">
          <Link
            to="/"
            className="block text-gray-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/cart"
            className="block text-gray-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Cart ({totalItems})
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
