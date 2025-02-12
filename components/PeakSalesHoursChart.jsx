import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PeakSalesHoursChart = ({ orders }) => {
  const calculateAverageOrdersByHour = (orders) => {
    // Initialize counters for each hour
    const hourlyTotals = Array(24).fill(0);
    const daysWithOrders = new Set();

    orders.forEach((order) => {
      const date = new Date(order.timestamp);
      const hour = date.getHours();
      const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      hourlyTotals[hour]++;
      daysWithOrders.add(dayKey);
    });

    // Calculate average by dividing by number of unique days
    const numberOfDays = Math.max(daysWithOrders.size, 1);
    return hourlyTotals.map((count) => (count / numberOfDays).toFixed(1));
  };

  const data = calculateAverageOrdersByHour(orders);

  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Average Orders per Hour",
        data: data,
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Average Orders: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Hour of Day",
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-blue-50 p-2 rounded-lg shadow-lg ">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PeakSalesHoursChart;
