"use client";

import { useCartStore } from '@/store/customerStore'
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { cart, calculateTotal, setCart, saveOrder, removeFromCart, updateQuantity } = useCartStore();
  const router = useRouter();
  const total = calculateTotal();

  const handleSendOrder = () => {
    saveOrder(cart, total);
    router.push(`/customer/order-confirmation?total=${total}`);
    setCart([]);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-2xl text-black font-bold mb-4">Your Order</h1>
        {/* Removed the "First Order" heading */}

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
                key={item.menu_item_id}
                className="flex items-center gap-4 bg-white shadow-sm rounded-lg p-4 mb-4"
              >
                <Image
                  width={64}
                  height={64}
                  src={item.menu_item_image || "/images/logo.png"}
                  alt={item.menu_item_name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.menu_item_name}</h3>
                  <p className="text-sm text-gray-500 mb-2">⭐ 4.9 (120 reviews)</p>
                  <p className="font-semibold text-yellow-500">
                    {item.price} THB
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeFromCart(item.menu_item_id)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <Link
              href="/customer/"
              className="text-yellow-500 text-center block mt-4 mb-6 font-medium"
            >
              + Add more food to order
            </Link>

            <div className="text-right">
              <p className="text-lg font-bold">Total: {total.toFixed(2)} THB</p>
            </div>
          </>
        )}
      </div>

      {/* Footer Button */}
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
