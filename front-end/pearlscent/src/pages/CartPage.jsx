import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 1. Added for navigation

const CartPage = () => {
  const { cart, totalAmount, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // 2. State for customer phone number
  const [phoneNumber, setPhoneNumber] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    if (!phoneNumber) return alert("Please enter your phone number!");

    // 3. Prepare Email Details (The Mailto Link)
    const adminEmail = "your-email@gmail.com"; // CHANGE THIS to your admin email
    const subject = encodeURIComponent("New Order - Esther's Scents Touch");
    const itemDetails = cart
      .map((item) => `- ${item.name} (x${item.quantity})`)
      .join("%0D%0A");

    const emailBody = encodeURIComponent(
      `ORDER DETAILS\n` +
        `--------------------------\n` +
        `Items:\n${itemDetails}\n\n` +
        `Total: #${totalAmount.toFixed(2)}\n` +
        `Phone: ${phoneNumber}\n` +
        `--------------------------`
    );

    // ... inside handleCheckout
    const orderData = {
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalAmount,
      phoneNumber: phoneNumber,
      userEmail: "guest@example.com", // ADD THIS LINE (or get from Clerk/Auth)
      shippingAddress: "Customer Address",
    };

    try {
      // 4. Save to Database
      await axios.post(`${API_URL}/api/orders`, orderData);

      // 5. Trigger Email Client
      window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${emailBody}`;

      // 6. Alert and Redirect to Bank Account Page
      alert(
        "Order saved! Please send the generated email and proceed to payment details."
      );
      clearCart();
      navigate("/payment-info");
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Something went wrong with your order.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image} // REMOVED ${API_URL}
                    className="w-16 h-16 object-cover rounded"
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/60?text=No+Image";
                    }}
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      #{item.price} x {item.quantity}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="lg:w-1/3 bg-gray-50 p-6 rounded-lg shadow-sm h-fit">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>

            {/* 7. Phone Number Input UI */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="08012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span>₦{totalAmount.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
            >
              Place Order & Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
