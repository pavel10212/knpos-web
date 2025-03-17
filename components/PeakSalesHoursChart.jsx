import React, { useMemo, useId } from "react";
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
  const uniqueId = useId();

  const hourlyData = useMemo(() => {
    if (!Array.isArray(orders) || orders.length === 0) {
      return [];
    }

    const hourlyStats = Array(24)
      .fill()
      .map((_, i) => ({
        id: `hour-${i}-${uniqueId}`,
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

    // Track table sessions
    const tableVisits = {};

    orders.forEach((order) => {
      if (!order.order_date_time) return;

      const orderTime = new Date(order.order_date_time);
      const hour = orderTime.getHours();

      hourlyStats[hour].orderCount += 1;
      hourlyStats[hour].revenue += order.total_amount || 0;

      if (order.table_token) {
        if (!tableVisits[order.table_token]) {
          tableVisits[order.table_token] = {
            firstOrderTime: orderTime,
            lastActivityTime: orderTime,
            hours: new Set([hour]),
          };
        } else {
          if (orderTime < tableVisits[order.table_token].firstOrderTime) {
            tableVisits[order.table_token].firstOrderTime = orderTime;
          }

          const activityTime = order.completion_date_time
            ? new Date(order.completion_date_time)
            : orderTime;

          if (activityTime > tableVisits[order.table_token].lastActivityTime) {
            tableVisits[order.table_token].lastActivityTime = activityTime;
          }

          tableVisits[order.table_token].hours.add(hour);
        }
      }
    });

    Object.values(tableVisits).forEach((visit) => {
      const startHour = visit.firstOrderTime.getHours();
      const endHour = visit.lastActivityTime.getHours();

      if (startHour !== endHour) {
        let currentHour = startHour;
        while (currentHour !== endHour) {
          visit.hours.add(currentHour);
          currentHour = (currentHour + 1) % 24;
        }
        visit.hours.add(endHour);
      }

      visit.hours.forEach((hour) => {
        hourlyStats[hour].tablePresence = (hourlyStats[hour].tablePresence || 0) + 1;
      });
    });

    return hourlyStats;
  }, [orders, uniqueId]);

  const chartId = `peak-sales-${uniqueId}`;

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
          id={chartId}
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
          <Bar
            yAxisId="left"
            dataKey="revenue"
            name="Revenue"
            fill="#8884d8"
            key={`revenue-bar-${uniqueId}`}
          />
          <Bar
            yAxisId="right"
            dataKey="orderCount"
            name="Order Count"
            fill="#82ca9d"
            key={`order-count-bar-${uniqueId}`}
          />
          {hourlyData[0]?.tablePresence !== undefined && (
            <Bar
              yAxisId="right"
              dataKey="tablePresence"
              name="Table Occupancy"
              fill="#ffc658"
              key={`table-presence-bar-${uniqueId}`}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PeakSalesHoursChart;
