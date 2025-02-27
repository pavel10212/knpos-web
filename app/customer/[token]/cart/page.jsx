"use client";

import { useCartStore } from '@/store/customerStore'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiPlus, FiShoppingCart, FiTrash2 } from 'react-icons/fi';

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
    <div className="bg-neutral-50 min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Cart</h1>
          </div>
          <span className="text-gray-500 font-medium">{cart.length} items</span>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full">
              <FiShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-6 text-lg">Your cart is empty</p>
            <button
              onClick={() => router.back()}
              className="bg-yellow-500 hover:bg-yellow-600 transition-colors text-white px-8 py-3 rounded-lg font-medium"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-start gap-6 bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex-shrink-0">
                    {!item.isInventoryItem ? (
                      <Image
                        width={96}
                        height={96}
                        src={item.menu_item_image || "/images/logo.png"}
                        alt={item.menu_item_name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {item.isInventoryItem ? item.inventory_item_name : item.menu_item_name}
                      </h3>
                      <p className="font-semibold text-gray-900">
                        {item.isInventoryItem ? item.cost_per_unit : item.price} THB
                      </p>
                    </div>

                    {!item.isInventoryItem && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Special Instructions</label>
                        <textarea
                          value={item.request || ''}
                          onChange={(e) => updateRequest(item.cartItemId, e.target.value)}
                          className="w-full p-2 text-sm text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                          placeholder="e.g. No onions, extra sauce..."
                          rows="2"
                        />
                      </div>
                    )}

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="flex items-center gap-1 text-red-500 text-sm font-medium hover:text-red-600 transition-colors bg-red-50 px-3 py-1.5 rounded-lg"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Remove item
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => router.back()}
                  className="bg-white border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <FiPlus className="w-5 h-5" />
                  Add more items
                </button>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{total.toFixed(2)} THB</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {cart.length > 0 && (
        <div className="sticky bottom-0 bg-white border-t border-gray-100 mt-auto">
          <div className="container mx-auto max-w-4xl px-4 py-4">
            <button
              onClick={handleSendOrder}
              className="w-full bg-yellow-500 hover:bg-yellow-600 transition-colors text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              Confirm Order
              <FiArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}