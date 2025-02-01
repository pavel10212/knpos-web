"use client";

import Image from "next/image";
import { useState } from "react";

export default function MenuItemModal({ item, onClose, onAddToCart, isInventoryItem = false }) {
  const [quantity, setQuantity] = useState(1);
  const [request, setRequest] = useState("");

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleAddToCart = () => {
    onAddToCart(item, quantity, request);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
      onClick={handleBackdropClick}>
      <div className="bg-white rounded-t-lg shadow-lg w-full max-w-md p-6 relative transform transition-transform duration-300 ease-out translate-y-0 animate-slide-up">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          ✕
        </button>

        {!isInventoryItem ? (
          // Regular menu item display
          <>
            <Image src={item.menu_item_image || "/images/logo.png"}
              width={400} height={300} quality={95}
              alt={item.menu_item_name} 
              className="w-full h-48 object-cover rounded-lg mb-4" 
            />
            <h2 className="text-2xl text-black font-bold mb-2">{item.menu_item_name}</h2>
            <p className="text-customYellow font-semibold text-lg mb-2">{item.price} THB</p>
            <p className="text-gray-600 mb-4">Ingredients: {item.description}</p>
            <textarea
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="Add a request (e.g., No onions)"
              maxLength={250}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            />
          </>
        ) : (
          // Inventory item display
          <>
            <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-6xl">🥤</span>
            </div>
            <h2 className="text-2xl text-black font-bold mb-2">{item.inventory_item_name}</h2>
            <p className="text-customYellow font-semibold text-lg mb-4">{item.cost_per_unit} THB</p>
          </>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={decreaseQuantity}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-customYellow text-white px-6 py-2 rounded-full"
          >
            Add to Cart ({parseFloat(isInventoryItem ? item.cost_per_unit : item.price) * quantity} THB)
          </button>
        </div>
      </div>
    </div>
  );
}
