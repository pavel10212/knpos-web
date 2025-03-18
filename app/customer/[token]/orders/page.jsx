"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useDataStore } from "@/store/customerStore";
import { callWaiterForBill } from "@/services/dataService";
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

  // Group identical items function
  const groupIdenticalItems = useCallback((items) => {
    const groupedItems = [];
    const itemMap = new Map();
    
    items.forEach(item => {
      // Create a unique key combining product ID and notes
      const itemType = item.type || 'menu';
      const itemId = itemType === 'inventory' ? item.inventory_item_id : item.menu_item_id;
      const request = item.request || '';
      const status = item.status || '';
      
      const key = `${itemType}-${itemId}-${request}-${status}`;
      
      if (itemMap.has(key)) {
        // Increment quantity for existing item
        const existingItem = itemMap.get(key);
        existingItem.quantity += item.quantity;
        existingItem.originalItems.push(item);
      } else {
        // Create a new group with this item
        const groupedItem = {
          ...item,
          originalItems: [item],
          groupId: key
        };
        itemMap.set(key, groupedItem);
        groupedItems.push(groupedItem);
      }
    });
    
    return groupedItems;
  }, []);

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
  const grandTotal = useMemo(() => {
    return orders.reduce((total, order) => {
      return total + calculateOrderTotal(order);
    }, 0);
  }, [orders, calculateOrderTotal]);

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
        // Don't show an error message here, we'll handle it in the return statement
        setOrders([]);
      }
    };

    loadOrders();
  }, [token]);

  const handleSettleBill = useCallback(() => {
    alert("Waiter has been notified and will bring your bill shortly!");
    callWaiterForBill(token)
  }, [token]);

  // If token is missing or invalid, show a friendly goodbye message
  if (!token) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
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
    <div className="bg-gray-100 min-h-screen pb-32 relative">
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="bg-white text-gray-800 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center"
          >
            <span className="mr-1">←</span> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm animate-fadeIn">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet</p>
            <button
              onClick={() => router.back()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            >
              Browse the Menu
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              // Parse and group order details
              const orderDetails = parseOrderDetails(order.order_details);
              const transformedItems = transformOrderItems(orderDetails);
              const groupedItems = groupIdenticalItems(transformedItems);
              
              return (
                <div 
                  key={order.order_id} 
                  className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {formatDate(order.order_date_time)}
                      </p>
                      <p className="font-semibold text-gray-900 text-lg">
                        Order #{order.order_id} • Table {order.table_num}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.order_status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        order.order_status === 'Ready' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {order.order_status}
                    </span>
                  </div>

                  <div className="space-y-3 mt-4">
                    {groupedItems.map((item) => (
                      <div
                        key={item.groupId}
                        className="flex flex-col text-sm border-b border-gray-100 pb-2 last:border-b-0"
                      >
                        <div className="flex justify-between text-gray-900">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.quantity}x</span> 
                            <span>{item.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <span>{(item.quantity * item.price).toFixed(2)} THB</span>
                        </div>
                        {item.request && (
                          <p className="text-xs text-gray-500 ml-6 mt-1">Note: {item.request}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Order Total</span>
                      <span>{calculateOrderTotal(order).toFixed(2)} THB</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {orders.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 animate-slideUp">
          <div className="container mx-auto max-w-2xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg text-gray-900">Orders Summary</h2>
              <span className="text-xs text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-xl mb-4">
              <span>Total Amount</span>
              <span>{grandTotal.toFixed(2)} THB</span>
            </div>
            <button
              onClick={handleSettleBill}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium"
            >
              Request Bill
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
