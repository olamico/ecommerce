import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import Navbar from "./Components/Navbar"; // Import the new component
import PaymentInfo from "./pages/PaymentInfo";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Render the separate Navbar component */}
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="container mx-auto py-6">
          <Routes>
            <Route path="/" element={<HomePage searchTerm={searchTerm} />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/payment-info" element={<PaymentInfo />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
