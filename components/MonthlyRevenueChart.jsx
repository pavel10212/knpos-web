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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyRevenueChart = ({ orders }) => {
  const processMonthlyData = () => {
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
  };

  const { labels, values } = processMonthlyData();

  const chartData = {
    labels,
    datasets: [
      {
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
      title: {
        display: true,
        text: "Monthly Revenue",
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
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyRevenueChart;
