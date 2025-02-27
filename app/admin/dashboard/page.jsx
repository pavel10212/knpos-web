"use client";

import React from "react";
import { useState, useEffect, useMemo } from "react";
import { fetchOrderData, fetchMenuData } from "@/services/dataService";
import StatsCard from "@/components/StatsCard";
import RecentOrders from "@/components/RecentOrders";
import PopularItems from "@/components/PopularItems";
import OrdersChart from "@/components/OrdersChart";
import ChartPeriodSelector from "@/components/ChartPeriodSelector";
import MonthlyRevenueChart from "@/components/MonthlyRevenueChart";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PeakSalesHoursChart from "@/components/PeakSalesHoursChart";
import { useLoading } from "@/components/common/LoadingContext";

export default function Reports() {
  const [data, setData] = useState({ orders: [], menuItems: [] });
  const { isLoading, setIsLoading } = useLoading();
  const [mounted, setMounted] = useState(false);
  const [chartPeriod, setChartPeriod] = useState("daily");

  const stats = useMemo(() => {
    const orders = Array.isArray(data.orders) ? data.orders : [];
    if (!orders.length)
      return {
        dailySales: 0,
        totalOrders: 0,
        averageOrder: 0,
        todayOrderCount: 0,
        averageTurnoverTime: 0,
        totalSales: 0,
        monthlySales: 0,
        yearlyTotal: 0,
        weeklyTotal: 0,
        comparisonToLastMonth: 0,
        comparisonToLastYear: 0,
        averagePerDay: 0,
        busyDay: { day: "N/A", amount: 0 },
        slowDay: { day: "N/A", amount: 0 },
      };

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    // Filter orders by date ranges
    const todayOrders = orders.filter((order) => {
      const orderDate = new Date(order.order_date_time);
      return (
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    });

    const monthlyOrders = orders.filter((order) => {
      const orderDate = new Date(order.order_date_time);
      return orderDate >= startOfMonth;
    });

    const lastMonthOrders = orders.filter((order) => {
      const orderDate = new Date(order.order_date_time);
      return orderDate >= startOfLastMonth && orderDate <= endOfLastMonth;
    });

    const yearlyOrders = orders.filter((order) => {
      const orderDate = new Date(order.order_date_time);
      return orderDate >= startOfYear;
    });

    const lastYearOrders = orders.filter((order) => {
      const orderDate = new Date(order.order_date_time);
      return orderDate >= startOfLastYear && orderDate <= endOfLastYear;
    });

    const weeklyOrders = orders.filter((order) => {
      const orderDate = new Date(order.order_date_time);
      return orderDate >= oneWeekAgo;
    });

    // Group orders by day of week to find busiest/slowest day
    const dayOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const salesByDay = {};
    dayOfWeek.forEach((day) => (salesByDay[day] = 0));

    yearlyOrders.forEach((order) => {
      const orderDate = new Date(order.order_date_time);
      const day = dayOfWeek[orderDate.getDay()];
      salesByDay[day] += order.total_amount || 0;
    });

    // Find busiest and slowest days
    let maxSales = -1;
    let minSales = Number.MAX_VALUE;
    let busyDay = { day: "N/A", amount: 0 };
    let slowDay = { day: "N/A", amount: 0 };

    Object.entries(salesByDay).forEach(([day, amount]) => {
      if (amount > maxSales) {
        maxSales = amount;
        busyDay = { day, amount };
      }
      if (amount < minSales && amount > 0) {
        minSales = amount;
        slowDay = { day, amount };
      }
    });

    // Group orders by table_token
    const tableVisits = {};
    orders.forEach((order) => {
      if (!order.table_token || !order.order_date_time) return;

      if (!tableVisits[order.table_token]) {
        tableVisits[order.table_token] = {
          firstOrderTime: new Date(order.order_date_time),
          lastActivityTime: new Date(order.order_date_time),
        };
      } else {
        // Update first order time if this is earlier
        const orderTime = new Date(order.order_date_time);
        if (orderTime < tableVisits[order.table_token].firstOrderTime) {
          tableVisits[order.table_token].firstOrderTime = orderTime;
        }

        // Use completion time if available, otherwise use order time
        const activityTime = order.completion_date_time
          ? new Date(order.completion_date_time)
          : new Date(order.order_date_time);

        // Update last activity time if this is later
        if (activityTime > tableVisits[order.table_token].lastActivityTime) {
          tableVisits[order.table_token].lastActivityTime = activityTime;
        }
      }
    });

    // Calculate total and average duration of table visits
    const tableSessions = Object.values(tableVisits);
    const totalTableTime = tableSessions.reduce((total, visit) => {
      return total + (visit.lastActivityTime - visit.firstOrderTime);
    }, 0);

    const averageTableTimeMinutes = tableSessions.length
      ? totalTableTime / tableSessions.length / 60000
      : 0;

    // Calculate revenue totals
    const dailySales = todayOrders.reduce(
      (acc, order) => acc + (order.total_amount || 0),
      0
    );
    const monthlySales = monthlyOrders.reduce(
      (acc, order) => acc + (order.total_amount || 0),
      0
    );
    const lastMonthSales = lastMonthOrders.reduce(
      (acc, order) => acc + (order.total_amount || 0),
      0
    );
    const yearlySales = yearlyOrders.reduce(
      (acc, order) => acc + (order.total_amount || 0),
      0
    );
    const lastYearSales = lastYearOrders.reduce(
      (acc, order) => acc + (order.total_amount || 0),
      0
    );
    const weeklySales = weeklyOrders.reduce(
      (acc, order) => acc + (order.total_amount || 0),
      0
    );

    // Calculate total sales
    const totalSales = orders.reduce(
      (acc, order) => acc + (order.total_amount || 0),
      0
    );

    // Calculate comparison percentages
    const comparisonToLastMonth =
      lastMonthSales === 0
        ? 100
        : ((monthlySales - lastMonthSales) / lastMonthSales) * 100;

    const comparisonToLastYear =
      lastYearSales === 0
        ? 100
        : ((yearlySales - lastYearSales) / lastYearSales) * 100;

    // Calculate average sales per day in current year
    const daysSoFarThisYear = Math.ceil(
      (today - startOfYear) / (1000 * 60 * 60 * 24)
    );
    const averagePerDay =
      daysSoFarThisYear > 0 ? yearlySales / daysSoFarThisYear : 0;

    return {
      dailySales,
      totalOrders: orders.length,
      averageOrder: orders.length ? totalSales / orders.length : 0,
      todayOrderCount: todayOrders.length,
      averageTurnoverTime: averageTableTimeMinutes,
      totalSales,
      monthlySales,
      yearlyTotal: yearlySales,
      weeklyTotal: weeklySales,
      comparisonToLastMonth,
      comparisonToLastYear,
      averagePerDay,
      busyDay,
      slowDay,
    };
  }, [data]);

  useEffect(() => {
    setMounted(true);
    const loadData = async () => {
      try {
        const [ordersData, menuData] = await Promise.all([
          fetchOrderData(),
          fetchMenuData(),
        ]);
        setData({ orders: ordersData, menuItems: menuData });
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, []);

  // Don't render anything until after first mount
  if (!mounted) {
    return null;
  }

  // Function to determine trend badge style
  const getTrendBadgeClass = (value) => {
    if (value > 0) return "bg-green-100 text-green-800";
    if (value < 0) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  // Function to format large currency values
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `฿${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `฿${(value / 1000).toFixed(1)}K`;
    } else {
      return `฿${value.toFixed(2)}`;
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with summary metrics */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Restaurant Analytics
          </h1>
          <div className="flex items-center mt-2">
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(stats.monthlySales)}
            </span>
            <span className="mx-2 text-gray-500">MTD Revenue</span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTrendBadgeClass(
                stats.comparisonToLastMonth
              )}`}
            >
              {stats.comparisonToLastMonth >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(stats.comparisonToLastMonth).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Key stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Key Time Period Metrics */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Revenue Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Today
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(stats.dailySales)}
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        This Week
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(stats.weeklyTotal)}
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        This Month
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(stats.monthlySales)}
                      </div>
                      <div
                        className={`text-xs font-medium ${getTrendBadgeClass(
                          stats.comparisonToLastMonth
                        )}`}
                      >
                        {stats.comparisonToLastMonth >= 0 ? "↑" : "↓"}{" "}
                        {Math.abs(stats.comparisonToLastMonth).toFixed(1)}% from
                        last month
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        This Year
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(stats.yearlyTotal)}
                      </div>
                      <div
                        className={`text-xs font-medium ${getTrendBadgeClass(
                          stats.comparisonToLastYear
                        )}`}
                      >
                        {stats.comparisonToLastYear >= 0 ? "↑" : "↓"}{" "}
                        {Math.abs(stats.comparisonToLastYear).toFixed(1)}% from
                        last year
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Metrics */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Analytics
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Today&apos;s Orders
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {stats.todayOrderCount}
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Total Orders
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {stats.totalOrders}
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-teal-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Avg. Order Value
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        ฿{stats.averageOrder.toFixed(2)}
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-rose-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Day Performance */}
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-sm overflow-hidden text-white">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Business Pattern Insights
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <div>
                      <div className="text-sm font-medium text-white/70">
                        Busiest Day
                      </div>
                      <div className="text-xl font-bold">
                        {stats.busyDay.day}
                      </div>
                      <div className="text-sm text-white/70">
                        ฿{stats.busyDay.amount.toFixed(2)} avg
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-white/70">
                        Slowest Day
                      </div>
                      <div className="text-xl font-bold">
                        {stats.slowDay.day}
                      </div>
                      <div className="text-sm text-white/70">
                        ฿{stats.slowDay.amount.toFixed(2)} avg
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <RecentOrders
                orders={
                  Array.isArray(data.orders) ? data.orders.slice(0, 4) : []
                }
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <PopularItems
                orders={Array.isArray(data.orders) ? data.orders : []}
                menuItems={Array.isArray(data.menuItems) ? data.menuItems : []}
              />
            </div>
          </div>

          {/* Middle and right columns - Charts and data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance metrics row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-sm overflow-hidden p-6 border border-emerald-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-emerald-600">
                      Daily Avg Revenue
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mt-2">
                      ฿{stats.averagePerDay.toFixed(2)}
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4m16 0a8 8 0 11-16 0 8 8 0 0116 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-sm overflow-hidden p-6 border border-amber-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-amber-600">
                      Avg Table Time
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mt-2">
                      {stats.averageTurnoverTime.toFixed(0)} min
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm overflow-hidden p-6 border border-blue-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-blue-600">
                      Today&apos;s Sales
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mt-2">
                      ฿{stats.dailySales.toFixed(2)}
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts section */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Orders Trend
                  </h2>
                  <ChartPeriodSelector
                    activePeriod={chartPeriod}
                    onChange={setChartPeriod}
                  />
                </div>
                <OrdersChart orders={data.orders} period={chartPeriod} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Monthly Revenue
                </h2>
                <MonthlyRevenueChart orders={data.orders} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Peak Sales Hours
                </h2>
                <PeakSalesHoursChart
                  orders={Array.isArray(data.orders) ? data.orders : []}
                />
              </div>
            </div>

            {/* Remove the Recent orders and popular items grid since it's moved to left column */}
          </div>
        </div>
      </div>
    </div>
  );
}
