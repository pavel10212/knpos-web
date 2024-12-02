"use client";
import React, { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const sampleData = [
  {
    id: "P001",
    product: "Coca-Cola",
    category: "Drinks",
    channel: "Store Front",
    stock: 150,
    maxCapacity: 200,
  },
  {
    id: "P002",
    product: "Sprite",
    category: "Drinks",
    channel: "Vending Machine",
    stock: 85,
    maxCapacity: 200,
  },
  {
    id: "P003",
    product: "Salted Peanuts",
    category: "Snacks",
    channel: "Store Front",
    stock: 200,
    maxCapacity: 200,
  },
  {
    id: "P004",
    product: "Mixed Nuts",
    category: "Snacks",
    channel: "Vending Machine",
    stock: 45,
    maxCapacity: 200,
  },
];

const Inventory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    id: "",
    product: "",
    category: "",
    channel: "",
    stock: "",
    maxCapacity: "",
  });
  const [editStock, setEditStock] = useState("");

  const handleDelete = (productId) => {
    // Add actual delete logic here
    console.log("Deleting product:", productId);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Updating stock for product:",
      selectedProduct.id,
      "New stock:",
      editStock
    );
    setIsEditModalOpen(false);
    // Add actual update logic here
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New product:", newProduct);
    setIsModalOpen(false);
    // Add logic to save the new product
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Report</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          onClick={() => setIsModalOpen(true)}
        >
          + New Product
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Add New Product
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Product ID
                  </label>
                  <input
                    type="text"
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={newProduct.id}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, id: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={newProduct.product}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, product: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Sales Channel
                  </label>
                  <input
                    type="text"
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={newProduct.channel}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, channel: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock Level
                  </label>
                  <input
                    type="number"
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={newProduct.maxCapacity}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        maxCapacity: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Stock Modal */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Edit Stock Level - {selectedProduct.product}
            </h2>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Stock Level
                  </label>
                  <input
                    type="number"
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-300">
            <tr>
              <th className="px-6 py-3">Product ID</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Sales Channel</th>
              <th className="px-6 py-3">Stock Level</th>
              <th className="px-6 py-3">Max Capacity</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((item) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-black">{item.id}</td>
                <td className="px-6 py-4 text-black">{item.product}</td>
                <td className="px-6 py-4 text-black">{item.category}</td>
                <td className="px-6 py-4 text-black">{item.channel}</td>
                <td className="px-6 py-4 ">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.stock <= 50
                        ? "bg-red-100 text-red-800"
                        : item.stock <= 100
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.stock} items
                  </span>
                </td>
                <td className="px-6 py-4 text-black">
                  {item.maxCapacity} items
                </td>
                <td className="px-6 py-4 flex space-x-3">
                  <button
                    onClick={() => {
                      setSelectedProduct(item);
                      setEditStock(item.stock.toString());
                      setIsEditModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
