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
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 10,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += `฿${context.parsed.y.toFixed(2)}`;
            }
            return label;
          },
        },
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `฿${value}`,
          font: {
            size: 11,
          },
          maxTicksLimit: 6,
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px] md:h-[350px] lg:h-[400px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyRevenueChart;
