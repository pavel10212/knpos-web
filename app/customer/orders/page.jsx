"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState({});

  // Fetch orders from the database
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://44.202.118.242:3000/orders-get");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Fetch menu items to map names and prices
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("http://44.202.118.242:3000/menu-get");
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const data = await response.json();
        setMenuItems(
          data.reduce((acc, item) => {
            acc[item.menu_item_id] = item; // Map menu_item_id to the full menu item
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleSettleBill = () => {
    alert("Waiter has been notified and will bring your bill shortly!");
  };

  const transformOrderItems = (items) =>
    items.map((item) => {
      const menuItem = menuItems[item.menu_item_id];
      return {
        ...item,
        name: menuItem?.menu_item_name || "Unknown Item",
        price: menuItem?.price || 0,
      };
    });

  const grandTotal = orders.reduce((sum, order) => sum + order.total_amount, 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <div className="container mx-auto p-4 max-w-2xl">
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
              <div key={order.order_id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.order_date_time).toLocaleString()}
                    </p>
                    <p className="font-semibold">Order #{order.order_id}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {order.order_status}
                  </span>
                </div>

                <div className="space-y-2">
                  {transformOrderItems(order.order_details.items).map((item) => (
                    <div key={item.menu_item_id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>{(item.price * item.quantity).toFixed(2)} THB</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{order.total_amount.toFixed(2)} THB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {orders.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-t-md">
            <div className="container mx-auto p-4 max-w-2xl">
              <div className="flex justify-between items-center mb-4 text-xl font-bold">
                <span>Grand Total</span>
                <span>{grandTotal.toFixed(2)} THB</span>
              </div>
              <button
                onClick={handleSettleBill}
                className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold"
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
