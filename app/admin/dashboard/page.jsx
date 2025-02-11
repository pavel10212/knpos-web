"use client";

import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { fetchOrderData, fetchMenuData } from "@/services/dataService";
import StatsCard from "@/components/StatsCard";
import RecentOrders from "@/components/RecentOrders";
import PopularItems from "@/components/PopularItems";
import OrdersChart from "@/components/OrdersChart";
import ChartPeriodSelector from "@/components/ChartPeriodSelector";
import MonthlyRevenueChart from "@/components/MonthlyRevenueChart";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const Reports = () => {
  const [data, setData] = useState({ orders: [], menuItems: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState("daily");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, menuData] = await Promise.all([
          fetchOrderData(),
          fetchMenuData(),
        ]);
        setData({ orders: ordersData, menuItems: menuData });
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = useMemo(() => {
    const { orders } = data;
    if (!orders.length)
      return {
        dailySales: 0,
        totalOrders: 0,
        averageOrder: 0,
        todayOrderCount: 0,
      };

    const today = new Date();
    const todayOrders = orders.filter((order) => {
      const orderDate = new Date(order.order_date_time);
      return (
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    });

    return {
      dailySales: todayOrders.reduce(
        (acc, order) => acc + order.total_amount,
        0
      ),
      totalOrders: orders.length,
      averageOrder:
        orders.reduce((acc, order) => acc + order.total_amount, 0) /
        orders.length,
      todayOrderCount: todayOrders.length,
    };
  }, [data]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Restaurant Analytics
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Monitor your restaurant's performance and make data-driven
            decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard
            title="Today's Orders"
            value={stats.todayOrderCount.toString()}
            icon={
              <svg
                className="w-6 h-6 text-indigo-600"
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
            }
          />
          <StatsCard
            title="Today's Sales"
            value={`$${stats.dailySales.toFixed(2)}`}
            icon={
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders.toString()}
            icon={
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            }
          />
          <StatsCard
            title="Average Order"
            value={`$${stats.averageOrder.toFixed(2)}`}
            icon={
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            }
          />
          <StatsCard
            title="Total Customers"
            value={stats.totalOrders.toString()}
            icon={
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between ">
              <h2 className="text-xl font-semibold text-gray-900">
                Orders Trend
              </h2>
              <ChartPeriodSelector
                activePeriod={chartPeriod}
                onChange={setChartPeriod}
              />
            </div>
            <OrdersChart orders={data.orders} period={chartPeriod} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Monthly Revenue
            </h2>
            <MonthlyRevenueChart orders={data.orders} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm">
            <RecentOrders orders={data.orders.slice(0, 4)} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm">
            <PopularItems orders={data.orders} menuItems={data.menuItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
