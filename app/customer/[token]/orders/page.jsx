"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useDataStore } from "@/store/customerStore";
import { useRouter } from "next/navigation";
import { fetchCustomerOrders } from "@/services/dataService";

// Helper functions moved outside component
const parseOrderDetails = (details) => {
  if (Array.isArray(details)) return details;
  try {
    return typeof details === 'string' ? JSON.parse(details) : [];
  } catch (e) {
    console.error('Error parsing order details:', e);
    return [];
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const menuItems = useDataStore((state) => state.menuItems);
  const inventoryItems = useDataStore((state) => state.inventoryItems);
  const router = useRouter();
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem("token");
    }
    return null;
  });

  const transformOrderItems = useCallback((items = []) => {
    if (!Array.isArray(items)) return [];

    return items.map((item) => {
      const isInventoryItem = item.type === 'inventory';
      const itemDetails = isInventoryItem
        ? inventoryItems.find(i => i.inventory_item_id === item.inventory_item_id)
        : menuItems.find(m => m.menu_item_id === item.menu_item_id);

      return {
        ...item,
        name: isInventoryItem
          ? (itemDetails?.inventory_item_name || 'Unknown Inventory Item')
          : (itemDetails?.menu_item_name || 'Unknown Menu Item'),
        price: isInventoryItem
          ? (itemDetails?.cost_per_unit || 0)
          : (itemDetails?.price || 0),
      };
    });
  }, [inventoryItems, menuItems]);

  const calculateOrderTotal = useCallback((order) => {
    const orderDetails = parseOrderDetails(order.order_details);
    return orderDetails.reduce((total, item) => {
      const isInventoryItem = item.type === 'inventory';
      const itemDetails = isInventoryItem
        ? inventoryItems.find(i => i.inventory_item_id === item.inventory_item_id)
        : menuItems.find(m => m.menu_item_id === item.menu_item_id);
      return total + (item.quantity * (isInventoryItem ? itemDetails?.cost_per_unit : itemDetails?.price) || 0);
    }, 0);
  }, [inventoryItems, menuItems]);

  // Memoize grand total calculation
  const grandTotal = useMemo(() =>
    orders.reduce((sum, order) => sum + calculateOrderTotal(order), 0),
    [orders, calculateOrderTotal]
  );

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) return;

      try {
        const data = await fetchCustomerOrders(token);
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.warn("Loaded data is not an array");
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    };

    loadOrders();
  }, [token]);

  const handleSettleBill = useCallback(() => {
    alert("Waiter has been notified and will bring your bill shortly!");
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-4">No orders yet</p>
            <button onClick={() => router.back()} className="bg-yellow-500 text-white px-6 py-2 rounded-full">
              Go to Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.order_id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-700">
                      {formatDate(order.order_date_time)}
                    </p>
                    <p className="font-semibold text-gray-900">
                      Order #{order.order_id} • Table {order.table_num}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${order.order_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.order_status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {order.order_status}
                  </span>
                </div>

                <div className="space-y-2">
                  {(Array.isArray(order.order_details)
                    ? order.order_details
                    : JSON.parse(order.order_details || '[]')
                  ).map((item) => {
                    const transformedItem = transformOrderItems([item])[0];
                    return (
                      <div
                        key={`${item.type}-${item.type === 'inventory' ? item.inventory_item_id : item.menu_item_id}`}
                        className="flex flex-col text-sm"
                      >
                        <div className="flex justify-between text-gray-900">
                          <div className="flex items-center gap-2">
                            <span>{transformedItem.quantity}x {transformedItem.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${transformedItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              transformedItem.status === 'completed' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                              {transformedItem.status}
                            </span>
                          </div>
                          <span>{transformedItem.price} THB</span>
                        </div>
                        {transformedItem.request && (
                          <p className="text-xs text-gray-500 ml-4">Note: {transformedItem.request}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span>{calculateOrderTotal(order).toFixed(2)} THB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {orders.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-t-md">
            <div className="container mx-auto p-4 max-w-2xl">
              <div className="flex justify-between items-center mb-4 text-xl font-bold text-gray-900">
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
