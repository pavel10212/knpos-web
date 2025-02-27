"use client";
import Sidebar from "@/components/sidebar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  LoadingProvider,
  useLoading,
} from "@/components/common/LoadingContext";

function DashboardContent({ children }) {
  const { isLoading } = useLoading();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-48 fixed inset-y-0">
        <Sidebar />
      </div>
      <main className="ml-48 flex-1 p-8 w-full">
        {isLoading && <LoadingSpinner text="Loading..." />}
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}

export default function ReportsLayout({ children }) {
  return (
    <LoadingProvider>
      <DashboardContent>{children}</DashboardContent>
    </LoadingProvider>
  );
}
