import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const InventoryTable = ({ data, onEdit, onDelete, onAddStock }) => {
  // Function to determine stock status and styling
  const getStockStatus = (item) => {
    const stockPercentage = (item.quantity / item.max_quantity) * 100;

    if (stockPercentage <= 15) {
      return {
        status: "Critical",
        className: "bg-red-50 text-red-700",
        textClass: "text-red-700 font-semibold",
        badge: "bg-red-100 text-red-800 border-red-200",
      };
    } else if (stockPercentage <= 30) {
      return {
        status: "Low",
        className: "bg-yellow-50 text-yellow-700",
        textClass: "text-yellow-700 font-semibold",
        badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    }
    return {
      status: "Good",
      className: "",
      textClass: "text-green-700",
      badge: "bg-green-100 text-green-800 border-green-200",
    };
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-300">
          <tr>
            <th className="px-6 py-3">Product ID</th>
            <th className="px-6 py-3">Product</th>
            <th className="px-6 py-3">Price Per Product</th>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Sales Channel</th>
            <th className="px-6 py-3">Stock Level</th>
            <th className="px-6 py-3">Max Capacity</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const stockStatus = getStockStatus(item);
            const stockPercentage = Math.round(
              (item.quantity / item.max_quantity) * 100
            );

            return (
              <tr
                key={item.inventory_item_id}
                className={stockStatus.className}
              >
                <td className="px-6 py-4 text-black">
                  {item.inventory_item_id}
                </td>
                <td className="px-6 py-4 text-black">
                  {item.inventory_item_name}
                </td>
                <td className="px-6 py-4 text-black">
                  ฿{parseFloat(item.cost_per_unit).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-black">{item.category}</td>
                <td className="px-6 py-4 text-black">{item.sales_channel}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="mr-2 flex-1 max-w-[200px]">
                      <div className="text-sm font-medium mb-1 flex justify-between">
                        <span className={stockStatus.textClass}>
                          {item.quantity} of {item.max_quantity} {item.unit}s
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            stockPercentage <= 15
                              ? "bg-red-600"
                              : stockPercentage <= 30
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${stockPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stockStatus.badge}`}
                    >
                      {stockStatus.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-black">
                  {item.max_quantity} {item.unit}s
                </td>
                <td className="px-6 py-4 flex space-x-3">
                  <button
                    onClick={() => onAddStock(item)}
                    className="inline-flex items-center px-3 py-1.5 border border-green-600 text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg
                      className="w-3.5 h-3.5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Stock
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(item.inventory_item_id)}
                    className="inline-flex items-center px-3 py-1.5 border border-red-600 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
