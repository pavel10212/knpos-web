"use client";

import { useCart } from "@/components/context/CartContext";
import Link from "next/link";

export default function Orders() {
  const { orders } = useCart();

  const handleSettleBill = () => {
    alert("Waiter has been notified and will bring your bill shortly!");
  };

  const grandTotal = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <div className="container mx-auto p-4 max-w-2xl">
        {/* Modified header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/customer" className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold">Order History</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-4">No orders yet</p>
            <Link href="/customer" className="bg-yellow-500 text-white px-6 py-2 rounded-full">
              Go to Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <>
                <h2 className="font-semibold text-lg text-gray-700 mb-2">
                  {index === 0 ? 'First' : index === 1 ? 'Second' : `${index + 1}th`} Order
                </h2>
                <div key={order.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleString()}
                      </p>
                      <p className="font-semibold">
                        Order #{order.id}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>{(item.price * item.quantity).toFixed(2)} THB</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{order.total.toFixed(2)} THB</span>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        )}

        {/* Added grand total and settle bill section */}
        {orders.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-t-md">
            <div className="container mx-auto p-4 max-w-2xl">
              <div className="flex justify-between items-center mb-4 text-xl font-bold">
                <span>Grand Total</span>
                <span>{grandTotal.toFixed(2)} THB</span>
              </div>
              <button
                onClick={handleSettleBill}
                className="w-full bg-customYellow text-white py-3 rounded-lg font-bold"
              >
                Settle Bill
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}