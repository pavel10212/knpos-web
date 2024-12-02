"use client";

import React, { useState } from "react";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuCard from "@/components/menu/MenuCard";
import AddCategoryModal from "@/components/menu/AddCategoryModal";
import AddItemModal from "@/components/menu/AddItemModal";

const Menu = () => {
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

  const handleDeleteItem = (itemId) => {
    setMenuItems((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((item) => item.id !== itemId),
    }));
  };

  const currentItems = menuItems[activeTab] || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Menu</h1>

      <CategoryTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAddCategory={() => setIsModalOpen(true)}
      />

      <div className="grid grid-cols-4 gap-4">
        {currentItems.map((item) => (
          <MenuCard key={item.id} item={item} onDelete={handleDeleteItem} />
        ))}
        <div
          className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg h-48 hover:bg-gray-100 cursor-pointer bg-gray-50"
          onClick={() => setIsAddItemModalOpen(true)}
        >
          <span className="text-4xl font-light text-gray-600">+</span>
        </div>
      </div>

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(e) => {
          e.preventDefault();
          setTabs([...tabs, newCategory]);
          setNewCategory("");
          setIsModalOpen(false);
        }}
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSubmit={handleAddItem}
        newItem={newItem}
        setNewItem={setNewItem}
      />
    </div>
  );
};

export default Menu;
