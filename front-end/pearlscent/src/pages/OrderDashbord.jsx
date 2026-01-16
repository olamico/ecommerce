import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://estherscentstouch.onrender.com";

const OrderDashbord = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/orders`);
        // Sort: Newest orders at the top
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedData);
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-pink-600 font-semibold">Loading orders...</div>
    );

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg border border-pink-100 overflow-hidden">
      <div className="p-4 bg-pink-50 border-b border-pink-100">
        <h2 className="text-xl font-bold text-pink-800">Recent Orders</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                ID
              </th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                Customer & Phone
              </th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                Products
              </th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                Total
              </th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-pink-50/30 transition-colors"
                >
                  <td className="p-4 text-xs font-mono text-gray-400">
                    ₦{order._id.slice(-6)}
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-900">
                      {order.userEmail || "Guest User"}
                    </p>
                    <p className="text-sm text-pink-600 font-semibold">
                      {order.phoneNumber || "No Phone"}
                    </p>
                  </td>
                  <td className="p-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-700">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-400 ml-1">
                          x{item.quantity}
                        </span>
                      </div>
                    ))}
                  </td>
                  <td className="p-4 font-bold text-gray-900">
                    ₦{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-10 text-center text-gray-400 italic"
                >
                  No orders have been placed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDashbord;
