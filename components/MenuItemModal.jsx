"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useDataStore } from '@/store/customerStore';

export default function MenuItemModal({ item, onClose, onAddToCart, isInventoryItem = false }) {
  const [quantity, setQuantity] = useState(1);
  const [request, setRequest] = useState("");
  const inventoryItems = useDataStore((state) => state.inventoryItems);

  // Get current stock if it's an inventory item
  const currentStock = useMemo(() => {
    if (!isInventoryItem || !item.menu_item_id) return null;
    const inventoryId = item.menu_item_id.split("-")[1];
    const inventoryItem = inventoryItems.find(i => i.inventory_item_id.toString() === inventoryId);
    return inventoryItem?.quantity || 0;
  }, [isInventoryItem, item.menu_item_id, inventoryItems]);

  const increaseQuantity = () => {
    if (isInventoryItem && currentStock !== null && quantity >= currentStock) {
      toast.error("Cannot add more items than available in stock");
      return;
    }
    setQuantity(quantity + 1);
  };
  
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleAddToCart = () => {
    if (isInventoryItem && currentStock !== null) {
      if (quantity > currentStock) {
        toast.error("Not enough items in stock");
        return;
      }
    }
    
    if (isInventoryItem) {
      onAddToCart(item, quantity);
    } else {
      onAddToCart(item, quantity, request);
    }
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

        {isInventoryItem ? (
          // Inventory item display - no request field
          <>
            <h2 className="text-2xl text-black font-bold mb-2">{item.inventory_item_name}</h2>
            <p className="text-customYellow font-semibold text-lg mb-4">฿{item.cost_per_unit}</p>
            {currentStock !== null && (
              <p className={`text-sm mb-4 ${currentStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentStock > 0 ? `${currentStock} items in stock` : 'Out of stock'}
              </p>
            )}
          </>
        ) : (
          // Regular menu item display
          <>
            {item.menu_item_image && (
              <Image
                src={item.menu_item_image}
                width={400}
                height={300}
                quality={95}
                alt={item.menu_item_name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-2xl text-black font-bold mb-2">{item.menu_item_name}</h2>
            <p className="text-customYellow font-semibold text-lg mb-2">฿{item.price}</p>
            <p className="text-gray-600 mb-4">Ingredients: {item.description}</p>
            <textarea
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="Add a request (e.g., No onions)"
              maxLength={250}
              className="w-full border border-gray-300 rounded-lg text-gray-500 p-2 mb-4"
            />
          </>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={decreaseQuantity}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-black"
            >
              -
            </button>
            <span className="text-black text-lg font-bold">{quantity}</span>
            <button
              onClick={increaseQuantity}
              disabled={isInventoryItem && currentStock !== null && quantity >= currentStock}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${
                isInventoryItem && currentStock !== null && quantity >= currentStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-black cursor-pointer'
              }`}
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isInventoryItem && currentStock !== null && (currentStock === 0 || quantity > currentStock)}
            className={`px-6 py-2 rounded-full ${
              isInventoryItem && currentStock !== null && (currentStock === 0 || quantity > currentStock)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-customYellow text-white'
            }`}
          >
            Add to Cart ({parseFloat(isInventoryItem ? item.cost_per_unit : item.price) * quantity} THB)
          </button>
        </div>
      </div>
    </div>
  );
}
