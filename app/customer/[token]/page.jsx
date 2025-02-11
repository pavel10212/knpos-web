"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuItemCard from "@/components/MenuItemCard";
import MenuItemModal from "@/components/MenuItemModal";
import { useCartStore } from "@/store/customerStore";
import { fetchCategoryData } from "@/services/dataService";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
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
    } catch (error) {
      console.error("Error fetching menu data:", error);
      setError("Connection error. Please check your network and try again.");
    }
  };

  const fetchCategories = async () => {
    try {
      const categoryData = await fetchCategoryData();
      setCategories(categoryData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []); 

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', token);
    }
    fetchData();
  }, [token]);

  const handleCategoryClick = (categoryId) => {
    const headerHeight = document.querySelector("header").offsetHeight || 180;
    const categoryElement = categoryRefs.current[categoryId];

    if (categoryElement) {
      const elementPosition = categoryElement.getBoundingClientRect().top;
      const offsetPosition = window.scrollY + elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
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

            <div className="mt-4 space-y-8 pb-4">
              {categories.map((category) => (
                <div
                  key={category.category_id}
                  ref={(el) => {
                    if (el && !categoryRefs.current[category.category_id]) {
                      categoryRefs.current[category.category_id] = el;
                    }
                  }}
                  className="pt-4"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-4">{category.category_name}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {menuItems
                      .filter((item) => item.category_id === category.category_id)
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

          <Footer />

          {selectedItem && (
            <MenuItemModal
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
              onAddToCart={addToCart}
            />
          )}
        </div>
      )}
    </>
  );
}


