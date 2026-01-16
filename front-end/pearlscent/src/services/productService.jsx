import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://estherscentstouch.onrender.com";
// API_URL now becomes: https://estherscentstouch.onrender.com/api/products
const API_URL = `${BASE_URL.replace(/\/$/, "")}/api/products`;

// 1. GET Products (Public)
export const getProducts = async (searchTerm = "") => {
  try {
    // FIX: Use API_URL directly. Do NOT add "/api/products" again here.
    const response = await axios.get(`${API_URL}?search=${searchTerm}`);
    return response.data;
  } catch (error) {
    console.error("Error in getProducts service:", error);
    throw error;
  }
};

// 2. CREATE Product (Admin Only)
export const createProduct = async (productData, token) => {
  // This correctly points to: .../api/products/add
  const response = await axios.post(`${API_URL}/add`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 3. DELETE Product (Admin Only)
export const deleteProduct = async (productId, token) => {
  // This correctly points to: .../api/products/:id
  const response = await axios.delete(`${API_URL}/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
