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

const OrdersChart = ({ orders, period = "weekly" }) => {
  const chartData = useMemo(() => {
    let ordersByDate = {};
    const today = new Date();

    // Initialize dates up to today
    const initializeDates = () => {
      const dates = {};
      
      switch (period) {
        case "daily":
          // Go back 30 days
          for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = date.toLocaleDateString();
            dates[dateKey] = {
              date: dateKey,
              orders: 0
            };
          }
          break;
        case "weekly":
          // Go back 8 weeks
          for (let i = 8; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - (date.getDay() - 1) - 7 * i);
            const dateKey = date.toLocaleDateString();
            dates[dateKey] = {
              date: "Week of " + dateKey,
              orders: 0
            };
          }
          break;
        case "monthly":
          // Go back 12 months
          for (let i = 11; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            });
            dates[monthKey] = {
              date: monthKey,
              orders: 0
            };
          }
          break;
        case "yearly":
          // Go back 5 years
          for (let i = 4; i >= 0; i--) {
            const year = today.getFullYear() - i;
            dates[year.toString()] = {
              date: year.toString(),
              orders: 0
            };
          }
          break;
      }
      return dates;
    };

    // Initialize with zero values
    ordersByDate = initializeDates();

    // Add actual order counts
    orders.forEach((order) => {
      let dateKey;
      const date = new Date(order.order_date_time);

      switch (period) {
        case "daily":
          dateKey = date.toLocaleDateString();
          break;
        case "weekly":
          const day = date.getDay();
          const diff = date.getDate() - day + (day === 0 ? -6 : 1);
          dateKey = new Date(date.setDate(diff)).toLocaleDateString();
          break;
        case "monthly":
          dateKey = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          });
          break;
        case "yearly":
          dateKey = date.getFullYear().toString();
          break;
      }

      if (dateKey in ordersByDate) {
        ordersByDate[dateKey].orders++;
      }
    });

    // Convert to array and sort
    return Object.values(ordersByDate).sort((a, b) => {
      if (period === "monthly") {
        return new Date(a.date) - new Date(b.date);
      }
      return new Date(a.date) - new Date(b.date);
    });
  }, [orders, period]);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="orders"
            name="Number of Orders"
            stroke="#3b82f6"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersChart;
