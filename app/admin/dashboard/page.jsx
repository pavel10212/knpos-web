import React from "react";

const Reports = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Restaurant Analytics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Today's Sales", value: "₱24,589", change: "+12.5%" },
          { title: "Total Orders", value: "156", change: "+8.2%" },
          { title: "Average Order", value: "₱157.62", change: "+3.1%" },
          { title: "Total Customers", value: "89", change: "+5.4%" },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm text-gray-500">{stat.title}</h3>
            <div className="flex items-baseline mt-2">
              <p className="text-2xl text-gray-500">{stat.value}</p>
              <span className="ml-2 text-sm text-green-500">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                {
                  id: "#12345",
                  items: "3",
                  total: "₱458.00",
                  status: "Completed",
                },
                {
                  id: "#12346",
                  items: "1",
                  total: "₱125.00",
                  status: "Processing",
                },
                {
                  id: "#12347",
                  items: "2",
                  total: "₱257.00",
                  status: "Completed",
                },
                {
                  id: "#12348",
                  items: "4",
                  total: "₱652.00",
                  status: "Processing",
                },
              ].map((order, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.items}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.total}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popular Items */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Popular Items</h2>
        <div className="space-y-4">
          {[
            { name: "Chicken Adobo", orders: 45, revenue: "₱4,500" },
            { name: "Sinigang", orders: 38, revenue: "₱3,800" },
            { name: "Sisig", orders: 32, revenue: "₱3,200" },
            { name: "Pancit", orders: 28, revenue: "₱2,800" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.orders} orders</p>
              </div>
              <span className="font-medium">{item.revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
