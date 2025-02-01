"use client";

import { useCartStore } from '@/store/customerStore'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default function Cart() {
  const cart = useCartStore((state) => state.cart);
  const calculateTotal = useCartStore((state) => state.calculateTotal);
  const setCart = useCartStore((state) => state.setCart);
  const saveOrder = useCartStore((state) => state.saveOrder);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const router = useRouter();
  const total = calculateTotal();
  const [token, setToken] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const handleSendOrder = () => {
    if (!token) return;
    saveOrder(cart, total, token);
    router.push(`/customer/${token}/order-confirmation?total=${total}`);
    setCart([]);
  };

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-2xl text-black font-bold mb-4">Your Order</h1>

        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-4 text-black">Your cart is empty</p>
            <button onClick={() => router.back()} className="bg-yellow-500 text-white px-6 py-2 rounded-full">
              Return to Menu
            </button>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={`${item.menu_item_id || item.inventory_item_id}-${item.request}`}
                className="flex items-start gap-4 bg-white shadow-sm rounded-lg p-4 mb-4"
              >
                {!item.isInventoryItem ? (
                  // Menu item display
                  <Image
                    width={64}
                    height={64}
                    src={item.menu_item_image || "/images/logo.png"}
                    alt={item.menu_item_name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  // Inventory item placeholder image
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-2xl">🥤</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">
                    {item.isInventoryItem ? item.inventory_item_name : item.menu_item_name}
                  </h3>
                  {!item.isInventoryItem && (
                    <p className="text-sm text-gray-500 mb-2">⭐ 4.9 (120 reviews)</p>
                  )}
                  {item.request && (
                    <div 
                      className="text-sm text-gray-500 cursor-pointer break-words max-w-[200px]"
                      onClick={() => toggleExpand(item.menu_item_id || item.inventory_item_id)}
                    >
                      {expandedItems[item.menu_item_id || item.inventory_item_id] 
                        ? item.request
                        : truncateText(item.request, 50)}
                      {item.request.length > 50 && (
                        <span className="text-yellow-500 ml-1 whitespace-nowrap">
                          {expandedItems[item.menu_item_id || item.inventory_item_id] ? 'Show less' : 'Show more'}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="font-semibold text-yellow-500 mt-1">
                    {item.isInventoryItem ? item.cost_per_unit : item.price} THB
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button
                    onClick={() => removeFromCart(item.isInventoryItem ? item.inventory_item_id : item.menu_item_id)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(
                        item.isInventoryItem ? item.inventory_item_id : item.menu_item_id, 
                        item.quantity - 1
                      )}
                      className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(
                        item.isInventoryItem ? item.inventory_item_id : item.menu_item_id, 
                        item.quantity + 1
                      )}
                      className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => router.back()}
              className="text-yellow-500 text-center block mt-4 mb-6 font-medium"
            >
              + Add more food to order
            </button>

            <div className="text-right">
              <p className="text-lg font-bold">Total: {total.toFixed(2)} THB</p>
            </div>
          </>
        )}
      </div>

      <div className="bg-white shadow-t-md p-4 sticky bottom-0">
        <button
          onClick={handleSendOrder}
          className="bg-yellow-500 text-white w-full py-3 rounded-lg font-bold">
          Send order →
        </button>
      </div>
    </div>
  );
}
