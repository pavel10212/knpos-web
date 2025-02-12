import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CategorySalesChart = ({ salesData }) => {
  const sortedData = [...salesData].sort((a, b) => b.amount - a.amount);

  const data = {
    labels: sortedData.map((item) => item.category),
    datasets: [
      {
        label: "Total Sales ($)",
        data: sortedData.map((item) => item.amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.formattedValue}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
        },
        title: {
          display: true,
          text: "Sales Amount ($)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Categories",
        },
      },
    },
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Sales by Category
      </h2>
      <div style={{ height: "400px" }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default CategorySalesChart;
