import React from "react";
import AddProductForm from "../Components/AddProductForm";
// 1. FIXED: Corrected spelling to match your likely filename
import OrderDashboard from "./OrderDashbord";
import { SignOutButton } from "@clerk/clerk-react";

const AdminPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Management Dashboard
        </h1>
        {/* 2. ADDED: Logout button for the Admin */}
        <div className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
          <SignOutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Side: Add New Products */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-pink-600">
            Upload New Product
          </h2>
          <AddProductForm />
        </section>

        {/* Right Side: Orders View */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Customer Orders
          </h2>
          <OrderDashboard />
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
