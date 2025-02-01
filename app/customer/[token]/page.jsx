"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuItemCard from "@/components/MenuItemCard";
import MenuItemModal from "@/components/MenuItemModal";
import { useCartStore } from "@/store/customerStore";

const getUniqueCategories = (menuItems, inventoryItems) => {
  const allCategories = Object.values(menuItems)
    .flat()
    .map((item) => item.category);

  if (inventoryItems.length > 0) {
    allCategories.push('Drinks');
  }

  return [...new Set(allCategories)];
};

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const categoryRefs = useRef({});
  const { addToCart } = useCartStore();
  const params = useParams()
  const dirtyToken = params.token;
  const token = dirtyToken.replace('token%3D', '')

  sessionStorage.setItem('token', token);

  const fetchData = async () => {
    const storedToken = sessionStorage.getItem('token');

    if (!storedToken) {
      console.log("No token found in local storage");
      return;
    }

    try {
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_IP}:3000/menu-get`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });


      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          sessionStorage.removeItem('token');
          setError("Session expired or invalid token. Please request a new table link.");
          return;
        }
        throw new Error("Failed to fetch menu");
      }

      const data = await response.json();
      setMenuItems(data.menuItems || []);
      setInventoryItems(data.inventoryItems || []);
    } catch (error) {
      console.error("Error fetching menu data:", error);
      setError("Connection error. Please check your network and try again.");
    }
  };

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', token);
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    if (menuItems) {
      setCategories(getUniqueCategories(menuItems, inventoryItems));
    }
  }, [menuItems, inventoryItems]);


  const handleCategoryClick = (category) => {
    const headerHeight = document.querySelector("header").offsetHeight || 180;
    const categoryElement = categoryRefs.current[category];

    if (categoryElement) {
      const elementPosition = categoryElement.getBoundingClientRect().top;
      const offsetPosition = window.scrollY + elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      console.error(`Category "${category}" not found`);
    }
  }

  return (
    <>
      {error ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Access Problem</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <p className="text-gray-600">
              Please ask your server for a new table link or check your URL.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <Head>
            <title>Menu - Restaurant</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="View our menu and place orders!" />
          </Head>

          <Header categories={categories} onCategoryClick={handleCategoryClick} />
          <main className="container mx-auto p-4 flex-grow pb-20 bg-white">
            <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">
              Choose the best dish for you
            </h1>

            <div className="mt-4 space-y-8 pb-4 ">
              {categories.map((category) => (
                <div
                  key={category}
                  ref={(el) => {
                    if (el && !categoryRefs.current[category]) {
                      categoryRefs.current[category] = el;
                    }
                  }}
                  className="pt-4"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-4">{category}</h2>
                  {category === 'Drinks' ? (
                    <div className="grid grid-cols-2 gap-4">
                      {inventoryItems.map((item) => (
                        <div
                          key={item.inventory_item_id}
                          className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                          onClick={() => setSelectedItem({ ...item, isInventoryItem: true })}
                        >
                          <div className="p-4">
                            <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                              <span className="text-4xl">🥤</span>
                            </div>
                            <h3 className="font-medium text-gray-800 text-lg mb-2">
                              {item.inventory_item_name}
                            </h3>
                            <div className="flex items-center justify-between">
                              <span className="text-yellow-500 font-bold">
                                {item.cost_per_unit} THB
                              </span>
                              <button className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-full">
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {menuItems
                        .filter((item) => item.category === category)
                        .map((item) => (
                          <MenuItemCard
                            key={item.menu_item_id}
                            {...item}
                            onClick={() => setSelectedItem(item)}
                          />
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </main>

          <Footer />

          {selectedItem && (
            <MenuItemModal
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
              onAddToCart={addToCart}
              isInventoryItem={selectedItem.isInventoryItem}
            />
          )}
        </div>
      )}
    </>
  );
}


