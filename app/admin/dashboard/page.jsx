"use client";

import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { fetchOrderData, fetchMenuData } from "@/services/dataService";
import StatsCard from "../../../components/StatsCard";
import RecentOrders from "../../../components/RecentOrders";
import PopularItems from "../../../components/PopularItems";
import OrdersChart from "@/components/OrdersChart";
import ChartPeriodSelector from "@/components/ChartPeriodSelector";
import MonthlyRevenueChart from "@/components/MonthlyRevenueChart";

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
    return <div className="p-4">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Restaurant Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 ">
        <StatsCard
          title="Today's Orders"
          value={stats.todayOrderCount.toString()}
        />
        <StatsCard
          title="Today's Sales"
          value={`$${stats.dailySales.toFixed(2)}`}
        />
        <StatsCard title="Total Orders" value={stats.totalOrders.toString()} />
        <StatsCard
          title="Average Order"
          value={`$${stats.averageOrder.toFixed(2)}`}
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalOrders.toString()}
        />
      </div>

      <div>
        <ChartPeriodSelector
          activePeriod={chartPeriod}
          onChange={setChartPeriod}
        />
        <OrdersChart orders={data.orders} period={chartPeriod} />
      </div>

      <div className="mt-6">
        <MonthlyRevenueChart orders={data.orders} />
      </div>

      <RecentOrders orders={data.orders.slice(0, 4)} />
      <PopularItems orders={data.orders} menuItems={data.menuItems} />
    </div>
  );
};

export default Reports;
