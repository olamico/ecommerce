import React, { useState, useEffect } from "react";
import {
  createProduct,
  getProducts,
  deleteProduct,
} from "../services/productService";
import { useAuth } from "@clerk/clerk-react";

const AddProductForm = () => {
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]); // State to store the list
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    rating: 0,
    discount: 0,
    description: "",
  });

  // 1. Fetch products when the component loads
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
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("rating", formData.rating);
    data.append("discount", formData.discount);
    data.append("image", file);

    try {
      const token = await getToken();
      await createProduct(data, token);
      alert("Product added successfully!");

      // Reset Form
      setFormData({
        name: "",
        price: "",
        rating: 0,
        discount: 0,
        description: "",
      });
      setFile(null);
      setPreview("");

      // Refresh the list
      fetchProducts();
    } catch (err) {
      alert(err.response?.status === 403 ? "Admins only!" : "Upload failed.");
    }
  };

  // 2. Handle Delete Function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const token = await getToken();
      await deleteProduct(id, token);

      // Update local state to remove the item immediately
      setProducts(products.filter((p) => p._id !== id));
      alert("Product deleted!");
    } catch (err) {
      alert("Delete failed. Check admin permissions.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* --- FORM SECTION --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow border border-gray-100 h-fit"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Add New Product
          </h2>
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            className="w-full border p-2 mb-2 rounded"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            className="w-full border p-2 mb-2 rounded"
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            className="w-full border p-2 mb-2 rounded"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4 text-sm"
            required
          />
          {preview && (
            <img
              src={preview}
              className="w-32 h-32 object-cover rounded mb-4 shadow-md"
              alt="Product preview"
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700"
          >
            Save Product
          </button>
        </form>

        {/* --- LIST SECTION --- */}
        <div className="bg-white p-6 rounded shadow border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Existing Products
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={product.image} // Cloudinary provides the full URL automatically
                    className="w-12 h-12 object-cover rounded"
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/50?text=Error";
                    }}
                  />
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">${product.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-red-500 hover:text-red-700 text-sm font-bold"
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
