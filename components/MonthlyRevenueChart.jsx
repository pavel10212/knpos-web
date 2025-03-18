import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MonthlyRevenueChart = ({ orders }) => {
  const monthlyData = useMemo(() => {
    let data = {};
    const today = new Date();

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      // Use shorter month format
      const monthKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short", // Changed from 'long' to 'short'
      });
      data[monthKey] = {
        month: monthKey,
        revenue: 0,
      };
    }

    // Add revenue for each order
    orders.forEach((order) => {
      const date = new Date(order.order_date_time);
      // Use the same shorter month format for consistency
      const monthKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short", // Changed from 'long' to 'short'
      });
      if (monthKey in data) {
        data[monthKey].revenue += order.total_amount;
      }
    });

    // Convert to array and sort
    return Object.values(data).sort(
      (a, b) => new Date(a.month) - new Date(b.month)
    );
  }, [orders]);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={monthlyData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 50, // Increased from 30 to 50 to provide more space for labels
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            angle={-45}
            textAnchor="end"
            height={65} // Increased from 60 to 65
            interval={0}
            tick={{ fontSize: 11 }} // Reduced from 12 to 11
            dy={10} // Add vertical offset to push labels down a bit
          />
          <YAxis
            tickFormatter={(value) => `฿${value.toFixed(0)}`}
          />
          <Tooltip 
            formatter={(value) => [`฿${value.toFixed(2)}`, "Revenue"]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Monthly Revenue"
            stroke="#4ade80"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyRevenueChart;
