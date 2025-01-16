"use client";

import React, { useState, useEffect } from "react";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuCard from "@/components/menu/MenuCard";
import AddItemModal from "@/components/menu/AddItemModal";

const getUniqueCategories = (menuItems) => {
  const allCategories = Object.values(menuItems)
    .flat()
    .map((item) => item.category);

  return ["All", ...new Set(allCategories)];
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState({});

  const fetchData = async () => {
    try {
      const cachedData = sessionStorage.getItem("menuData");
      if (!cachedData) {
        try {
          console.log("No cached data found, fetching from server...");
          const response = await fetch(
            `http://${process.env.NEXT_PUBLIC_IP}:3000/menu-get`
          );
          const data = await response.json();
          setMenuItems(data);
          sessionStorage.setItem("menuData", JSON.stringify(data));
        } catch (error) {
          alert("Could not fetch from server");
          console.log("Could not fetch from server");
        }
      } else {
        console.log("Cached data found, using that...");
        console.log(cachedData, "my cache");
        setMenuItems(JSON.parse(cachedData));
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tabs = getUniqueCategories(menuItems);
  const [activeTab, setActiveTab] = useState("All");

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const [newItem, setNewItem] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const menuItemData = {
        menu_item_name: newItem.title,
        price: newItem.price,
        description: newItem.description,
        category: newItem.category,
        menu_item_image: null, // TODO: Implement proper image handling later
      };

      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_IP}:3000/menu-insert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(menuItemData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add item");
      }
      const addedItem = await response.json();

      console.log(addedItem, "Server Response");
      setMenuItems((prevItems) => {
        const newState = {
          ...prevItems,
          addedItem,
        };

        sessionStorage.setItem("menuData", JSON.stringify(newState));
        return newState;
      });

      setNewItem({
        title: "",
        price: "",
        description: "",
        image: "",
        category: "",
      });
      setIsAddItemModalOpen(false);
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  console.log(menuItems, "menuitems");

  const handleDeleteItem = (itemId) => {
    setMenuItems((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((item) => item.id !== itemId),
    }));
  };

  const currentItems = Object.values(menuItems)
    .flat()
    .filter(
      (item) => activeTab === "All" || !activeTab || item.category === activeTab
    );

  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);

  // Add this new handler
  const handleAddCategory = async (categoryName) => {
    // TODO: Implement category addition logic
    console.log("Adding new category:", categoryName);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Menu</h1>

      <div className="flex items-center space-x-2 mb-6">
        <div className="flex-grow flex items-center">
          <CategoryTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
        <button
          onClick={() => setIsNewCategoryModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
        >
          <span className="mr-2">+</span> New Category
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {activeTab !== "All" && (
          <div
            className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg h-72 hover:bg-gray-100 cursor-pointer bg-gray-50"
            onClick={() => {
              setNewItem((prev) => ({
                ...prev,
                category: activeTab,
              }));
              setIsAddItemModalOpen(true);
            }}
          >
            <span className="text-4xl font-light text-gray-600">+</span>
          </div>
        )}
        {Array.isArray(currentItems) &&
          currentItems.map((item) => (
            <MenuCard
              key={item.menu_item_id}
              item={{
                id: item.menu_item_id,
                menu_item_name: item.menu_item_name,
                menu_item_image:
                  item.menu_item_image || "/placeholder-image.jpg", // Add a fallback image
                description: item.description,
                price: item.price,
                category: item.category,
              }}
              onDelete={handleDeleteItem}
            />
          ))}
      </div>

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSubmit={handleAddItem}
        newItem={newItem}
        setNewItem={setNewItem}
        activeTab={activeTab}
      />

      {/* Add New Category Modal */}
      {isNewCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">Add New Category</h2>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              placeholder="Category Name"
              // Add necessary handlers
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsNewCategoryModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsNewCategoryModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
