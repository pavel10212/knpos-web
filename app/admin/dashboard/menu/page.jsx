"use client";

import React, { useState, useEffect } from "react";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuCard from "@/components/menu/MenuCard";
import AddItemModal from "@/components/menu/AddItemModal";

const getUniqueCategories = (menuItems) => {
  const allCategories = Object.values(menuItems)
    .flat()
    .map(item => item.category);

  return ['All', ...new Set(allCategories)];
}

const Menu = () => {
  const [menuItems, setMenuItems] = useState({});

  const fetchData = async () => {
    try {
      const cachedData = localStorage.getItem('menuData');
      if (!cachedData) {
        try {
          console.log("No cached data found, fetching from server...");
          const response = await fetch(`http://${process.env.NEXT_PUBLIC_IP}:3000/menu-get`);
          const data = await response.json();
          setMenuItems(data);
          localStorage.setItem('menuData', JSON.stringify(data));
        } catch (error) {
          alert("Could not fetch from server")
          console.log("Could not fetch from server")
        }
      } else {
        console.log("Cached data found, using that..."); console.log(cachedData, "my cache")
        setMenuItems(JSON.parse(cachedData));
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  console.log(menuItems);

  const tabs = getUniqueCategories(menuItems);
  const [activeTab, setActiveTab] = useState("");

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const [newItem, setNewItem] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    category: ""
  });

  const handleAddItem = async (e) => {
    e.preventDefault();

    try {
      const menuItemData = {
        menu_item_name: newItem.title,
        price: newItem.price,
        description: newItem.description,
        category: newItem.category,
        menu_item_image: null // TODO: Implement proper image handling later
      };

      const response = await fetch(`http://${process.env.NEXT_PUBLIC_IP}:3000/menu-insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(menuItemData)
      });

      if (!response.ok) {

        throw new Error('Failed to add item');
      }


      const addedItem = await response.json();



      console.log(addedItem, "Server Response")
      setMenuItems(prevItems => {
        const newState = {
          ...prevItems, addedItem
        };

        localStorage.setItem('menuData', JSON.stringify(newState));
        return newState;
      });


      setNewItem({ title: "", price: "", description: "", image: "", category: "" });
      setIsAddItemModalOpen(false);

    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  console.log(menuItems, "menuitems")

  const handleDeleteItem = (itemId) => {
    setMenuItems((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((item) => item.id !== itemId),
    }));
  };

  const currentItems = Object.values(menuItems)
    .flat()
    .filter(item => activeTab === "All" || !activeTab || item.category === activeTab);


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Menu</h1>

      <CategoryTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="grid grid-cols-4 gap-4">
        {Array.isArray(currentItems) && currentItems.map((item) => (
          <MenuCard
            key={item.menu_item_id}
            item={{
              id: item.menu_item_id,
              menu_item_name: item.menu_item_name,
              menu_item_image: item.menu_item_image || '/placeholder-image.jpg', // Add a fallback image
              description: item.description,
              price: item.price,
              category: item.category
            }}
            onDelete={handleDeleteItem}
          />
        ))}
        <div
          className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg h-48 hover:bg-gray-100 cursor-pointer bg-gray-50"
          onClick={() => {
            setNewItem(prev => ({
              ...prev,
              category: activeTab !== "All" ? activeTab : ""
            }));
            setIsAddItemModalOpen(true);
          }}
        >
          <span className="text-4xl font-light text-gray-600">+</span>
        </div>
      </div>

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSubmit={handleAddItem}
        newItem={newItem}
        setNewItem={setNewItem}
        activeTab={activeTab}
      />
    </div>
  );
};

export default Menu;
