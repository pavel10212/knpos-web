"use client";


import Image from "next/image";
import { useState } from "react";

export default function MenuItemModal({ item, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
      onClick={handleBackdropClick} // Handle clicks outside the modal
    >
      <div className="bg-white rounded-t-lg shadow-lg w-full max-w-md p-6 relative transform transition-transform duration-300 ease-out translate-y-0 animate-slide-up">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          ✕
        </button>

        {/* Item Image */}
        <Image src={item.image}
          width={70} height={70}
          alt={item.name} className="w-full h-48 object-cover rounded-lg mb-4" />

        {/* Item Details */}
        <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
        <p className="text-customYellow font-semibold text-lg mb-2">{item.price} THB</p>
        <p className="text-gray-600 mb-4">Ingredients: {item.description}</p>

        {/* Add a Request */}
        <textarea
          placeholder="Add a request (e.g., No onions)"
          maxLength={250}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        />

        {/* Quantity and Add to Cart */}
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
            Add to Cart ({parseFloat(item.price) * quantity} THB)
          </button>
        </div>
      </div>
    </div>
  );
}
