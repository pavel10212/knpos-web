"use client";

import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

const Menu = () => {
  // Add state for managing menu items
  const [menuItems, setMenuItems] = useState({
    Starter: [
      {
        id: 1,
        title: "Spring Rolls",
        price: "$6.00",
        image: "https://via.placeholder.com/150",
        description: "Crispy spring rolls with vegetable filling",
      },
      {
        id: 2,
        title: "Soup",
        price: "$5.00",
        image: "https://via.placeholder.com/150",
      },
    ],
    "Main Course": [
      {
        id: 3,
        title: "Steak",
        price: "$25.00",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 4,
        title: "Pasta",
        price: "$15.00",
        image: "https://via.placeholder.com/150",
      },
    ],
    Drinks: [
      {
        id: 5,
        title: "Cola",
        price: "$3.00",
        image: "https://via.placeholder.com/150",
      },
    ],
    Desserts: [
      {
        id: 6,
        title: "Ice Cream",
        price: "$7.00",
        image: "https://via.placeholder.com/150",
      },
    ],
  });

  const [activeTab, setActiveTab] = useState("Starter");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [tabs, setTabs] = useState([
    "Starter",
    "Main Course",
    "Drinks",
    "Desserts",
  ]);

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
  });

  const handleAddItem = (e) => {
    e.preventDefault();
    const file = e.target.image.files[0];
    const imageUrl = URL.createObjectURL(file);

    // Format price to include $ if it doesn't start with it
    const formattedPrice = newItem.price.startsWith("$")
      ? newItem.price
      : `$${newItem.price}`;

    const newMenuItem = {
      id: Date.now(),
      ...newItem,
      price: formattedPrice,
      image: imageUrl,
    };

    setMenuItems((prev) => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newMenuItem],
    }));

    setNewItem({ title: "", price: "", description: "", image: "" });
    setIsAddItemModalOpen(false);
  };

  // Get current category items
  const currentItems = menuItems[activeTab] || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Menu</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${
              activeTab === tab ? "bg-blue-500" : "bg-blue-300"
            } text-white py-2 px-4 rounded-md shadow-md focus:outline-none`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        <button
          className="bg-gray-200 text-black py-2 px-4 rounded-md shadow-md focus:outline-none"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-4 gap-4">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h2>
              <p className="text-gray-600 text-sm mt-1 mb-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-bold">{item.price}</span>
                <button
                  className="text-red-600 hover:text-red-800"
                  title="Remove"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* Add Item Card */}
        <div
          className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg h-48 hover:bg-gray-100 cursor-pointer bg-gray-50"
          onClick={() => setIsAddItemModalOpen(true)}
        >
          <span className="text-4xl font-light text-gray-600">+</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Add New Category
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTabs([...tabs, newCategory]);
                setNewCategory("");
                setIsModalOpen(false);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Category Title
                  </label>
                  <input
                    type="text"
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
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
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Add New Item
            </h2>
            <form onSubmit={handleAddItem}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={newItem.title}
                    onChange={(e) =>
                      setNewItem({ ...newItem, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={newItem.price}
                    onChange={(e) => {
                      const value = e.target.value.replace(/^\$/, ""); // Remove existing $ if present
                      setNewItem({ ...newItem, price: value });
                    }}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Description
                  </label>
                  <textarea
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                    required
                    rows="3"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => setIsAddItemModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
