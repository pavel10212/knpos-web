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

const OrdersChart = ({ orders, period = "weekly" }) => {
  const processOrderData = () => {
    let ordersByDate = {};
    const today = new Date();

    // Initialize dates up to today
    const initializeDates = () => {
      const dates = {};
      const current = new Date();

      switch (period) {
        case "daily":
          // Go back 30 days
          for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates[date.toLocaleDateString()] = 0;
          }
          break;
        case "weekly":
          // Go back 8 weeks
          for (let i = 8; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - (date.getDay() - 1) - 7 * i);
            dates[date.toLocaleDateString()] = 0;
          }
          break;
        case "monthly":
          // Go back 12 months
          for (let i = 11; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            dates[
              date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })
            ] = 0;
          }
          break;
        case "yearly":
          // Go back 5 years
          for (let i = 4; i >= 0; i--) {
            const year = today.getFullYear() - i;
            dates[year.toString()] = 0;
          }
          break;
      }
      return dates;
    };

    // Initialize with zero values up to today
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
        ordersByDate[dateKey]++;
      }
    });

    const sortedDates = Object.keys(ordersByDate).sort((a, b) => {
      if (period === "monthly") {
        return new Date(a) - new Date(b);
      }
      return new Date(a) - new Date(b);
    });

    return {
      labels: sortedDates,
      values: sortedDates.map((date) => ordersByDate[date]),
    };
  };

  const { labels, values } = processOrderData();

  const data = {
    labels,
    datasets: [
      {
        label: "Number of Orders",
        data: values,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
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
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-blue-50 p-2 rounded-lg shadow-lg">
      <Line options={options} data={data} />
    </div>
  );
};

export default OrdersChart;
