"use client";

import { useCartStore, useUserStore } from "@/store/customerStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header({ categories, onCategoryClick }) {
  const { cart } = useCartStore();
  const router = useRouter();
  const [token, setToken] = useState(null);
  const cartItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const basePath = `/customer/token=${token}`;
  const ordersPath = `${basePath}/orders`;
  const cartPath = `${basePath}/cart`;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-custom">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <button onClick={() => router.push(basePath)} className="transform text-left transition hover:scale-105">
          <h1 className="text-xl font-bold">
            <span className="block text-primary">Hinkali</span>
            <span className="block text-secondary">Georgian</span>
            <span className="block text-titleColour">Restaurant</span>
          </h1>
        </button>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push(ordersPath)} className="text-gray-600 hover:text-primary transition-colors">
            Orders
          </button>
          <Link
            href={cartPath}
            className="bg-customYellow text-white px-4 py-2 rounded-full shadow-md 
                     flex items-center gap-2 transform transition-all hover:scale-105 
                     hover:bg-yellow-600"
          >
            <i className="fas fa-shopping-cart"></i>
            <span className="font-medium">Cart ({cartItemCount})</span>
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-background py-3 border-t relative">
        {/* Left fade gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10"></div>

        <div className="container mx-auto relative">
          <div className="flex overflow-x-scroll gap-4 no-scrollbar px-8 py-1 scroll-smooth">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => onCategoryClick(category)}
                className="bg-white text-gray-700 px-6 py-2 rounded-full shadow-md 
                         whitespace-nowrap flex-shrink-0 border border-gray-200
                         transition-all hover:bg-customYellow hover:text-white 
                         hover:border-transparent hover:scale-105"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Right fade gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10"></div>
      </div>
    </header>
  );
}
