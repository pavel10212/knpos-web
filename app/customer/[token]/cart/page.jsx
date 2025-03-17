"use client";

import { useCartStore, useDataStore } from '@/store/customerStore'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from 'react';
import { FiArrowLeft, FiArrowRight, FiPlus, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { toast } from 'sonner';

export default function Cart() {
  const cart = useCartStore((state) => state.cart);
  const calculateTotal = useCartStore((state) => state.calculateTotal);
  const setCart = useCartStore((state) => state.setCart);
  const updateRequest = useCartStore((state) => state.updateRequest);
  const saveOrder = useCartStore((state) => state.saveOrder);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const inventoryItems = useDataStore((state) => state.inventoryItems);
  const router = useRouter();
  const total = calculateTotal();
  const [token, setToken] = useState(null);

  // Group inventory items, keep menu items individual
  const groupedCart = useMemo(() => {
    const inventoryGroups = new Map();
    const menuItems = [];

    cart.forEach(item => {
      if (item.isInventoryItem) {
        const key = item.inventory_item_id;
        if (inventoryGroups.has(key)) {
          const group = inventoryGroups.get(key);
          group.quantity += 1;
        } else {
          // Find current stock level
          const inventoryItem = inventoryItems.find(i => i.inventory_item_id.toString() === item.inventory_item_id.toString());
          inventoryGroups.set(key, {
            ...item,
            quantity: 1,
            currentStock: inventoryItem?.quantity || 0
          });
        }
      } else {
        menuItems.push(item);
      }
    });

    return [...menuItems, ...Array.from(inventoryGroups.values())];
  }, [cart, inventoryItems]);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const handleSendOrder = () => {
    if (!token) return;
    
    // Check if any items are out of stock
    const outOfStockItems = groupedCart.filter(item => 
      item.isInventoryItem && item.quantity > item.currentStock
    );

    if (outOfStockItems.length > 0) {
      toast.error("Some items in your cart are out of stock. Please remove them to continue.");
      return;
    }

    saveOrder(cart, total, token);
    router.push(`/customer/${token}/order-confirmation?total=${total}`);
    setCart([]);
  };

  const handleRemoveInventoryItem = (inventoryItemId) => {
    // Remove all instances of this inventory item
    cart.forEach(item => {
      if (item.isInventoryItem && item.inventory_item_id === inventoryItemId) {
        removeFromCart(item.cartItemId);
      }
    });
  };

  // If token is missing or invalid, show a friendly goodbye message
  if (!token) {
    return (
      <div className="bg-neutral-50 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">Thank You!</h2>
          <p className="text-gray-700 mb-4">
            Thank you for dining with us! We hope to see you again soon.
          </p>
          <p className="text-gray-600">
            Your session has ended. We appreciate your business!
          </p>
        </div>
      </div>
    );
  }

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
              {groupedCart.map((item) => {
                const isOutOfStock = item.isInventoryItem && item.quantity > item.currentStock;
                
                return (
                  <div
                    key={item.cartItemId}
                    className={`flex items-start gap-6 bg-white border border-gray-100 rounded-xl p-4 shadow-sm ${
                      isOutOfStock ? 'border-red-300 bg-red-50' : ''
                    }`}
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
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-400">×{item.quantity}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {item.isInventoryItem ? item.inventory_item_name : item.menu_item_name}
                          </h3>
                          {item.isInventoryItem && (
                            <>
                              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                              {isOutOfStock && (
                                <p className="text-sm text-red-600 font-medium mt-1">
                                  Only {item.currentStock} left in stock
                                </p>
                              )}
                            </>
                          )}
                        </div>
                        <p className="font-semibold text-gray-900">
                          {item.isInventoryItem 
                            ? `${(item.cost_per_unit * item.quantity).toFixed(2)}`
                            : item.price.toFixed(2)} THB
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
                        onClick={() => item.isInventoryItem 
                          ? handleRemoveInventoryItem(item.inventory_item_id)
                          : removeFromCart(item.cartItemId)
                        }
                        className="flex items-center gap-1 text-red-500 text-sm font-medium hover:text-red-600 transition-colors bg-red-50 px-3 py-1.5 rounded-lg"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Remove {item.isInventoryItem ? 'all' : 'item'}
                      </button>
                    </div>
                  </div>
                );
              })}
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
              disabled={groupedCart.some(item => item.isInventoryItem && item.quantity > item.currentStock)}
              className={`w-full transition-colors text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 ${
                groupedCart.some(item => item.isInventoryItem && item.quantity > item.currentStock)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600'
              }`}
            >
              {groupedCart.some(item => item.isInventoryItem && item.quantity > item.currentStock)
                ? 'Remove Out of Stock Items to Continue'
                : 'Confirm Order'}
              <FiArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}