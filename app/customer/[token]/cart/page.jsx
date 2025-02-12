"use client";

import { useCartStore } from '@/store/customerStore'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

export default function Cart() {
  const cart = useCartStore((state) => state.cart);
  const calculateTotal = useCartStore((state) => state.calculateTotal);
  const setCart = useCartStore((state) => state.setCart);
  const updateRequest = useCartStore((state) => state.updateRequest);
  const saveOrder = useCartStore((state) => state.saveOrder);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const router = useRouter();
  const total = calculateTotal();
  const [token, setToken] = useState(null);

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
                key={item.cartItemId}
                className="flex items-start gap-4 bg-white shadow-sm rounded-lg p-4 mb-4"
              >
                {!item.isInventoryItem ? (
                  <Image
                    width={64}
                    height={64}
                    src={item.menu_item_image || "/images/logo.png"}
                    alt={item.menu_item_name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-2xl">🥤</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-700">
                    {item.isInventoryItem ? item.inventory_item_name : item.menu_item_name}
                  </h3>
                  {!item.isInventoryItem && (
                    <p className="text-sm text-gray-500 mb-2">⭐ 4.9 (120 reviews)</p>
                  )}
                  <textarea
                    value={item.request || ''}
                    onChange={(e) => updateRequest(item.cartItemId, e.target.value)}
                    className="text-sm text-gray-500 w-full p-1 border rounded"
                    placeholder="Special requests..."
                    rows="2"
                  />
                  <p className="font-semibold text-yellow-500 mt-1">
                    {item.isInventoryItem ? item.cost_per_unit : item.price} THB
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
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
              <p className="text-lg font-bold text-gray-600">Total: {total.toFixed(2)} THB</p>
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
