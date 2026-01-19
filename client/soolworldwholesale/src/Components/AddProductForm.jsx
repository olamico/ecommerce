import React, { useState, useEffect } from "react";
import {
  createProduct,
  getProducts,
  deleteProduct,
} from "../services/productService";
import { useAuth } from "@clerk/clerk-react";

const AddProductForm = () => {
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    promoPrice: "", // Added
    rating: 5,
    discount: 0,
    description: "",
    category: "", // Added
    countInStock: 10, // Added
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    // Append all fields to FormData
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append("image", file);

    try {
      const token = await getToken();
      await createProduct(data, token);
      alert("Product added successfully!");
      setFormData({
        name: "",
        price: "",
        promoPrice: "",
        rating: 5,
        discount: 0,
        description: "",
        category: "",
        countInStock: 10,
      });
      setFile(null);
      setPreview("");
      fetchProducts();
    } catch (err) {
      alert(err.response?.status === 403 ? "Admins only!" : "Upload failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const token = await getToken();
      await deleteProduct(id, token);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert("Delete failed.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- FORM SECTION --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
            Add New Product
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-600 uppercase">
                Product Name
              </label>
              <input
                type="text"
                placeholder="e.g. Designer Perfume"
                value={formData.name}
                className="w-full border p-2 mb-3 rounded"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">
                Original Price (₦)
              </label>
              <input
                type="number"
                placeholder="20000"
                value={formData.price}
                className="w-full border p-2 mb-3 rounded"
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-orange-600 uppercase">
                Promo Price (₦)
              </label>
              <input
                type="number"
                placeholder="15000"
                value={formData.promoPrice}
                className="w-full border border-orange-200 p-2 mb-3 rounded bg-orange-50"
                onChange={(e) =>
                  setFormData({ ...formData, promoPrice: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">
                Stock Count
              </label>
              <input
                type="number"
                value={formData.countInStock}
                className="w-full border p-2 mb-3 rounded"
                onChange={(e) =>
                  setFormData({ ...formData, countInStock: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">
                Category
              </label>
              <select
                className="w-full border p-2 mb-3 rounded"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
                <option value="Oil">Perfume Oil</option>
              </select>
            </div>
          </div>

          <label className="text-xs font-bold text-gray-600 uppercase">
            Description
          </label>
          <textarea
            placeholder="Tell customers about the scent..."
            value={formData.description}
            className="w-full border p-2 mb-3 rounded"
            rows="3"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4 text-sm w-full"
            required
          />
          {preview && (
            <img
              src={preview}
              className="w-32 h-32 object-cover rounded mb-4 border-2 border-blue-500 shadow-sm"
              alt="Preview"
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition-colors uppercase tracking-widest"
          >
            Publish Product
          </button>
        </form>

        {/* --- LIST SECTION --- */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
            Inventory ({products.length})
          </h2>
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between border-b pb-3 hover:bg-gray-50 p-2 rounded transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    className="w-14 h-14 object-cover rounded shadow-sm"
                    alt={product.name}
                  />
                  <div>
                    <p className="font-bold text-gray-800">{product.name}</p>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-bold text-green-600">
                        ₦{product.promoPrice || product.price}
                      </span>
                      {product.promoPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₦{product.price}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500">
                      Stock: {product.countInStock} | {product.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-50 text-red-500 p-2 rounded hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
