import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PeakSalesHoursChart = ({ orders }) => {
  const hourlyData = useMemo(() => {
    // Early return if no orders
    if (!Array.isArray(orders) || orders.length === 0) {
      return [];
    }

    // Initialize hours data structure (0-23 hours)
    const hourlyStats = Array(24)
      .fill()
      .map((_, i) => ({
        hour: i,
        revenue: 0,
        orderCount: 0,
        displayHour:
          i === 0
            ? "12 AM"
            : i < 12
            ? `${i} AM`
            : i === 12
            ? "12 PM"
            : `${i - 12} PM`,
      }));

    // Track table sessions similar to how average table time is calculated
    const tableVisits = {};

    orders.forEach((order) => {
      if (!order.order_date_time) return;

      const orderTime = new Date(order.order_date_time);
      const hour = orderTime.getHours();

      // Add to hourly order count
      hourlyStats[hour].orderCount += 1;

      // Add to hourly revenue
      hourlyStats[hour].revenue += order.total_amount || 0;

      // Track table sessions if table_token exists
      if (order.table_token) {
        if (!tableVisits[order.table_token]) {
          tableVisits[order.table_token] = {
            firstOrderTime: orderTime,
            lastActivityTime: orderTime,
            hours: new Set([hour]), // Keep track of hours this table was active
          };
        } else {
          // Update first order time if this is earlier
          if (orderTime < tableVisits[order.table_token].firstOrderTime) {
            tableVisits[order.table_token].firstOrderTime = orderTime;
          }

          // Use completion time if available, otherwise use order time
          const activityTime = order.completion_date_time
            ? new Date(order.completion_date_time)
            : orderTime;

          // Update last activity time if this is later
          if (activityTime > tableVisits[order.table_token].lastActivityTime) {
            tableVisits[order.table_token].lastActivityTime = activityTime;
          }

          // Add this hour to the set of active hours for this table
          tableVisits[order.table_token].hours.add(hour);
        }
      }
    });

    // Add "table presence" data to our hourly stats
    Object.values(tableVisits).forEach((visit) => {
      // For each table session, distribute its presence across the hours it was active
      const startHour = visit.firstOrderTime.getHours();
      const endHour = visit.lastActivityTime.getHours();

      // If session spans multiple hours, mark all those hours
      if (startHour !== endHour) {
        let currentHour = startHour;
        while (currentHour !== endHour) {
          visit.hours.add(currentHour);
          currentHour = (currentHour + 1) % 24;
        }
        visit.hours.add(endHour);
      }

      // Increment table presence count for each hour
      visit.hours.forEach((hour) => {
        if (!hourlyStats[hour].tablePresence) {
          hourlyStats[hour].tablePresence = 0;
        }
        hourlyStats[hour].tablePresence += 1;
      });
    });

    return hourlyStats;
  }, [orders]);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={hourlyData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="displayHour"
            tick={{ fontSize: 12 }}
            interval={1}
            angle={-45}
            textAnchor="end"
          />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Revenue") return [`฿${value.toFixed(2)}`, name];
              return [value, name];
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#8884d8" />
          <Bar
            yAxisId="right"
            dataKey="orderCount"
            name="Order Count"
            fill="#82ca9d"
          />
          {hourlyData[0]?.tablePresence !== undefined && (
            <Bar
              yAxisId="right"
              dataKey="tablePresence"
              name="Table Occupancy"
              fill="#ffc658"
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PeakSalesHoursChart;
