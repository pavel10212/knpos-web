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
      const monthKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      data[monthKey] = {
        month: monthKey,
        revenue: 0,
      };
    }

    // Add revenue for each order
    orders.forEach((order) => {
      const date = new Date(order.order_date_time);
      const monthKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
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
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            tick={{ fontSize: 12 }}
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
