import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, totalAmount, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const target = 15000;
  const amountToWholesale = target - totalAmount;
  const progressPercentage = Math.min((totalAmount / target) * 100, 100);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // --- PRICING LOGIC ---
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isRetail = totalAmount < 15000 && totalItems < 2;
  const surcharge = isRetail ? totalAmount * 0.15 : 0;
  const finalPayableAmount = totalAmount + surcharge;

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    if (!phoneNumber || !shippingAddress || !userEmail) {
      return alert("Please fill in all contact details!");
    }

    const adminEmail = "estherscentstouch@gmail.com";
    const whatsappNumber = "2348130082382";

    const itemDetails = cart
      .map((item) => `- ${item.name} (x${item.quantity})`)
      .join("%0D%0A");

    const messageBody =
      `ORDER DETAILS\n` +
      `--------------------------\n` +
      `Items:\n${itemDetails.replace(/%0D%0A/g, "\n")}\n\n` +
      `Subtotal: ₦${totalAmount.toFixed(2)}\n` +
      `Surcharge (Retail): ₦${surcharge.toFixed(2)}\n` +
      `*Total Payable: ₦${finalPayableAmount.toFixed(2)}*\n` +
      `Phone: ${phoneNumber}\n` +
      `Address: ${shippingAddress}\n` +
      `--------------------------`;

    const orderData = {
      items: cart,
      totalAmount: finalPayableAmount,
      phoneNumber,
      shippingAddress,
      userEmail,
      orderType: isRetail ? "Retail" : "Wholesale",
    };

    try {
      await axios.post(`${API_URL}/api/orders`, orderData);
      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageBody)}`,
        "_blank",
      );
      window.location.href = `mailto:${adminEmail}?subject=New Order&body=${encodeURIComponent(messageBody)}`;

      alert("Order saved! Please send the messages and proceed to payment.");
      clearCart();
      navigate("/payment-info");
    } catch (err) {
      alert("Something went wrong with your order.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">
        Shopping Cart
      </h2>

      {cart.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow text-center">
          <p className="text-gray-500 italic">Your cart is empty.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-blue-600 font-bold"
          >
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SIDE: ITEM LIST */}
          <div className="lg:w-2/3 bg-white rounded-lg shadow-sm p-4 h-fit">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    className="w-16 h-16 object-cover rounded shadow-sm"
                    alt={item.name}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      ₦{item.price.toLocaleString()} x {item.quantity}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:font-bold text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE: SUMMARY & CHECKOUT */}
          <div className="lg:w-1/3 space-y-4">
            {/* 1. WHOLESALE STATUS CARD */}
            <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-blue-500">
              <h4 className="text-xs font-black text-gray-400 uppercase mb-3">
                Wholesale Progress
              </h4>
              {totalAmount >= target ? (
                <div className="bg-green-50 p-3 rounded border border-green-200 flex items-center gap-2">
                  <span className="text-green-600 font-bold text-sm">
                    ✓ WHOLESALE UNLOCKED
                  </span>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-sm font-bold text-blue-700 mb-1">
                    <span>₦{totalAmount.toLocaleString()}</span>
                    <span>Goal: ₦15,000</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-gray-500 italic">
                    Add{" "}
                    <span className="text-blue-600 font-bold">
                      ₦{amountToWholesale.toLocaleString()}
                    </span>{" "}
                    more to avoid the 15% retail fee!
                  </p>
                </div>
              )}
            </div>

            {/* 2. CHECKOUT DETAILS CARD */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
                Delivery Details
              </h3>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border p-2 mb-3 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <textarea
                placeholder="Shipping Address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full border p-2 mb-3 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                rows="2"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full border p-2 mb-4 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₦{totalAmount.toLocaleString()}</span>
                </div>
                {isRetail && (
                  <div className="flex justify-between text-red-500 text-sm font-bold">
                    <span>Retail Fee (15%)</span>
                    <span>+₦{surcharge.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-black text-gray-900 pt-3 border-t">
                  <span>Total</span>
                  <span>₦{finalPayableAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg mt-6 shadow-lg transform active:scale-95 transition"
              >
                Place Order & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
