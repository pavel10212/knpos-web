"use client";

import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuItemCard from "@/components/MenuItemCard";
import MenuItemModal from "@/components/MenuItemModal";
import { useCartStore } from "@/store/customerStore";

const getUniqueCategories = (menuItems) => {
  const allCategories = Object.values(menuItems)
    .flat()
    .map((item) => item.category);

  return [...new Set(allCategories)];
};

export default function Home() {
  const [menuItems, setMenuItems] = useState({});
  const [categories, setCategories] = useState([]);
  const categoryRefs = useRef({});

  const fetchData = async () => {
    try {
      const cachedData = localStorage.getItem("menuData");
      if (!cachedData) {
        try {
          console.log("No cached data found, fetching from server...");
          const response = await fetch(`http://${process.env.NEXT_PUBLIC_IP}:3000/menu-get`);
          const data = await response.json();
          setMenuItems(data);
          localStorage.setItem('menuData', JSON.stringify(data));
        } catch (error) {
          alert("Could not fetch from server");
          console.log("Could not fetch from server");
        }
      } else {
        console.log("Cached data found, using that...");
        setMenuItems(JSON.parse(cachedData));
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (menuItems) {
      setCategories(getUniqueCategories(menuItems));
    }
  }, [menuItems]);

  const handleCategoryClick = (category) => {
    const headerHeight = document.querySelector("header")?.offsetHeight || 180; // Dynamically get header height
    const categoryElement = categoryRefs.current[category]?.current;

    if (categoryElement) {
      const elementPosition = categoryElement.getBoundingClientRect().top;
      const offsetPosition = window.scrollY + elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      console.error(`Category "${category}" not found in refs.`);
      console.log("Current refs:", categoryRefs.current);
    }
  };

  const getCategoryItems = (category) => {
    if (!menuItems) return [];

    return menuItems
      .filter((item) => item.category === category)
      .map((item) => ({
        id: item.menu_item_id,
        name: item.menu_item_name,
        price: item.price,
        image: item.menu_item_image || "/placeholder-image.jpg",
        description: item.description,
        category: item.category,
      }));
  };

  const [selectedItem, setSelectedItem] = useState(null);
  const { addToCart } = useCartStore();

  return (
    <div suppressHydrationWarning>
      <Head>
        <title>Hinkali Georgian Restaurant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Choose the best dish for you!" />
      </Head>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header categories={categories} onCategoryClick={handleCategoryClick} />

        {/* Main Content */}
        <main className="container mx-auto p-4 flex-grow pb-20 bg-white">
          <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">
            Choose the best dish for you
          </h1>

          {/* Menu Sections */}
          <div className="mt-4 space-y-8 pb-4 ">
            {categories.map((category) => (
              <div
                key={category}
                ref={(el) => {
                  if (!categoryRefs.current[category]) {
                    categoryRefs.current[category] = { current: el };
                  }
                }}
                className="pt-4"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">{category}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {getCategoryItems(category).length === 0 ? (
                    <p className="text-gray-500 text-center col-span-2">
                      No items found in this category.
                    </p>
                  ) : (
                    getCategoryItems(category).map((item) => (
                      <MenuItemCard
                        key={item.id}
                        {...item}
                        onClick={() => setSelectedItem(item)}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <Footer />

        {/* Modal */}
        {selectedItem && (
          <MenuItemModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onAddToCart={addToCart}
          />
        )}
      </div>
    </div>
  );
}
