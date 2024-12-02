"use client";

import React, { useState, useRef } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuItemCard from "@/components/MenuItemCard";
import MenuItemModal from "@/components/MenuItemModal";
import { useCartStore } from "@/store/customerStore";

export default function Home() {
  const categories = ["Most Popular", "Salad", "Pasta", "Desserts", "Beverages"];
  const menuItems = [
    { id: 1, category: "Most Popular", name: "Khinkali dumpling", price: 60, rating: 5.0, image: "/images/khinkalidumplings.jpg", description: "Delicious Georgian dumplings filled with meat or cheese." },
    { id: 2, category: "Most Popular", name: "Khachapuri", price: 290, rating: 5.0, image: "/images/khachapuri.jpg", description: "Cheesy bread with an egg yolk in the center." },
    { id: 3, category: "Salad", name: "Green Salad", price: 150, rating: 4.2, image: "/images/green-salad.jpg", description: "Fresh greens with a light vinaigrette." },
    { id: 4, category: "Salad", name: "Avo Salad", price: 180, rating: 4.8, image: "/images/avo-salad.jpg", description: "Avocado, mixed greens, and a citrus dressing." },
    { id: 5, category: "Pasta", name: "Spaghetti Carbonara", price: 220, rating: 4.6, image: "/images/spaghetti.jpg", description: "Classic Italian pasta with creamy sauce and bacon." },
    { id: 6, category: "Desserts", name: "Cake", price: 220, rating: 4.6, image: "/images/cake.jpg", description: "Classic Italian Cake." },
    { id: 7, category: "Desserts", name: "Ice Cream", price: 220, rating: 4.6, image: "/images/icecream.jpg", description: "Classic Italian Gelato." },
    { id: 8, category: "Beverages", name: "Coke", price: 20, rating: 4.6, image: "/images/coke.jpg", description: "Classic coke." },
    { id: 9, category: "Beverages", name: "Water", price: 10, rating: 4.6, image: "/images/water.jpg", description: "Classic water." },
  ];

  const [selectedItem, setSelectedItem] = useState(null);
  const { addToCart } = useCartStore();
  const categoryRefs = useRef(categories.reduce((acc, category) => {
    acc[category] = React.createRef();
    return acc;
  }, {}));

  const handleCategoryClick = (category) => {
    const headerHeight = 180;
    const elementPosition = categoryRefs.current[category]?.current?.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  };

  const getCategoryItems = (category) => menuItems.filter((item) => item.category === category);

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
          <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">Choose the best dish for you</h1>

          {/* Menu Sections */}
          <div className="mt-4 space-y-8 pb-4 ">
            {categories.map((category) => (
              <div key={category} ref={categoryRefs.current[category]} className="pt-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{category}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {getCategoryItems(category).length === 0 ? (
                    <p className="text-gray-500 text-center col-span-2">No items found in this category.</p>
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
