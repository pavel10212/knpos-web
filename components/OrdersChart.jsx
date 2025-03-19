import React, { useMemo, useState, useEffect } from "react";
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
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Add window resize listener to detect small screens
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640); // 640px is the sm breakpoint in Tailwind
    };

    // Set initial value
    handleResize();

    // Add listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chartData = useMemo(() => {
    // Reset error state before processing
    setError(null);
    setIsLoading(true);

    try {
      if (!orders || !Array.isArray(orders)) {
        throw new Error("Invalid orders data");
      }

      let ordersByDate = {};
      const today = new Date();

      // Initialize dates up to today
      const initializeDates = () => {
        const dates = {};

        switch (period) {
          case "daily":
            // Use fewer days (10 instead of 30) on small screens
            const daysToShow = isSmallScreen ? 10 : 30;
            for (let i = daysToShow - 1; i >= 0; i--) {
              const date = new Date(today);
              date.setDate(date.getDate() - i);
              const dateKey = date.toLocaleDateString();
              dates[dateKey] = {
                date: dateKey,
                orders: 0,
              };
            }
            break;
          case "weekly":
            // Go back 8 weeks
            for (let i = 8; i >= 0; i--) {
              const date = new Date(today);
              date.setDate(date.getDate() - (date.getDay() - 1) - 7 * i);
              // Format date as MM/DD only for display
              const displayDate = date.toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
              });
              const dateKey = date.toLocaleDateString();
              dates[dateKey] = {
                // Use "W: MM/DD" format for more compact display
                date: `W: ${displayDate}`,
                orders: 0,
              };
            }
            break;
          case "monthly":
            // Go back 12 months
            for (let i = 11; i >= 0; i--) {
              const date = new Date(
                today.getFullYear(),
                today.getMonth() - i,
                1
              );
              const monthKey = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short", // Changed to short month name
              });
              dates[monthKey] = {
                date: monthKey,
                orders: 0,
              };
            }
            break;
          case "yearly":
            // Go back 5 years
            for (let i = 4; i >= 0; i--) {
              const year = today.getFullYear() - i;
              dates[year.toString()] = {
                date: year.toString(),
                orders: 0,
              };
            }
            break;
        }
        return dates;
      };

      // Initialize with zero values
      ordersByDate = initializeDates();

      // Add actual order counts - with error handling for each order
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];

        try {
          if (!order.order_date_time) continue;

          let dateKey;
          const date = new Date(order.order_date_time);

          // Skip invalid dates
          if (isNaN(date.getTime())) continue;

          switch (period) {
            case "daily":
              dateKey = date.toLocaleDateString();
              break;
            case "weekly":
              const day = date.getDay();
              // Create a new date object to avoid modifying the original date
              const weekStartDate = new Date(date);
              const diff = date.getDate() - day + (day === 0 ? -6 : 1);
              weekStartDate.setDate(diff);
              dateKey = weekStartDate.toLocaleDateString();
              break;
            case "monthly":
              dateKey = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short", // Changed to short month name for consistency
              });
              break;
            case "yearly":
              dateKey = date.getFullYear().toString();
              break;
          }

          if (dateKey in ordersByDate) {
            ordersByDate[dateKey].orders++;
          }
        } catch (orderError) {
          console.error("Error processing order:", orderError);
          // Continue processing other orders
        }
      }

      // Convert to array and sort
      const result = Object.values(ordersByDate).sort((a, b) => {
        // For monthly, parse the date correctly
        if (period === "monthly") {
          return new Date(a.date) - new Date(b.date);
        }
        return new Date(a.date) - new Date(b.date);
      });

      setIsLoading(false);
      return result;
    } catch (e) {
      console.error("Error processing chart data:", e);
      setError(e.message || "Error processing data");
      setIsLoading(false);
      return [];
    }
  }, [orders, period, isSmallScreen]); // Add isSmallScreen to dependencies

  // Effect to set loading state to false after processing completes
  useEffect(() => {
    if (chartData.length > 0) {
      setIsLoading(false);
    }
  }, [chartData]);

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-red-500 font-medium">Error loading chart data</p>
          <p className="text-gray-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      </div>
    );
  }

  // Modify x-axis configuration based on screen size and period
  const getXAxisConfig = () => {
    const baseConfig = {
      dataKey: "date",
      angle: -45,
      textAnchor: "end",
      height: 70,
      tick: { fontSize: 11 },
      dy: 10,
    };

    // For small screens in daily mode, show fewer ticks
    if (isSmallScreen && period === "daily") {
      return {
        ...baseConfig,
        interval: Math.ceil(chartData.length / 5) - 1, // Show ~5 ticks
      };
    }

    return {
      ...baseConfig,
      interval: 0, // Show all ticks
    };
  };

  return (
    <div className="h-80">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 45, // Increased bottom margin to provide more space
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...getXAxisConfig()} />
            <YAxis allowDecimals={false} />
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
      ) : (
        <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No data available for the selected period
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersChart;
