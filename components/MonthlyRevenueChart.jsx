import { Line } from "react-chartjs-2";
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
import { useMemo, useId } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Create a unique static chart ID to prevent React key conflicts
const chartId = Math.random().toString(36).substring(2, 15);

const MonthlyRevenueChart = ({ orders }) => {
  // Generate stable unique ID for this component
  const uniqueId = useId();

  const { labels, values } = useMemo(() => {
    let monthlyData = {};
    const today = new Date();

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthlyData[
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
      ] = 0;
    }

    // Add revenue for each order
    orders.forEach((order) => {
      const date = new Date(order.order_date_time);
      const monthKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });

      if (monthKey in monthlyData) {
        monthlyData[monthKey] += order.total_amount;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    return {
      labels: sortedMonths,
      values: sortedMonths.map((month) => monthlyData[month]),
    };
  }, [orders]);

  const chartData = {
    labels,
    datasets: [
      {
        id: `monthly-revenue-dataset-${uniqueId}`, // Add unique id to dataset
        label: "Monthly Revenue",
        data: values,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
    animation: {
      duration: 0, // Disable animations to prevent key conflicts
    },
  };

  // Use a combination of uniqueId and a stable random value as key
  const uniqueChartKey = `monthly-revenue-${uniqueId}-${chartId}`;

  return (
    <div className="bg-blue-50 p-2 rounded-lg shadow-lg">
      <Line 
        data={chartData} 
        options={options} 
        id={uniqueChartKey} 
        key={uniqueChartKey} 
        redraw={true} // Force redraw on each render
      />
    </div>
  );
};

export default MonthlyRevenueChart;
