"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const categoryRefs = useRef({});
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { addToCart } = useCartStore();

  const fetchData = async () => {
    try {
      if (!token) {
        alert("No token found. Please scan the QR code again.");
        console.error("Missing token");
        return;
      }
      localStorage.setItem("token", token);

      const cachedData = localStorage.getItem("menuData");
      if (!cachedData) {
        console.log("No cached data found, fetching from server...");
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_IP}:3000/menu-get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            alert("Invalid or expired token. Please scan the QR code again.");
            localStorage.removeItem("token");
          } else {
            throw new Error("Failed to fetch menu");
          }
        }


        const data = await response.json();

        console.log(data, "Our data")
        setMenuItems(data.menuItems || []);

        localStorage.setItem("menuData", JSON.stringify(data.menuItems || []));
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
    <div>
      <Head>
        <title>Menu Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="View our menu and place orders!" />
      </Head>

      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header categories={categories} onCategoryClick={handleCategoryClick} />

        {/* Main Content */}
        <main className="container mx-auto p-4 flex-grow pb-20 bg-white">
          <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">
            Choose the best dish for you
          </h1>

          <div className="mt-4 space-y-8 pb-4 ">
            {categories.map((category) => (
              <div key={category}
                ref={(el) => {
                  if (!categoryRefs.current[category]) {
                    categoryRefs.current[category] = el;
                  }
                }
                }
                className="pt-4"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">{category}</h2>
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


