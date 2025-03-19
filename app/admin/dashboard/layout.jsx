"use client";
import ResponsiveSidebar from "@/components/ResponsiveSidebar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  LoadingProvider,
  useLoading,
} from "@/components/common/LoadingContext";

function DashboardContent({ children }) {
  const { isLoading } = useLoading();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ResponsiveSidebar />
      <main className="flex-1 transition-all duration-300 pl-0 md:pl-16 lg:pl-48 w-full">
        <div className="p-3 pt-8 sm:p-4 md:p-6 lg:p-8 w-full">
          {isLoading && <LoadingSpinner text="Loading..." />}
          <div className="w-full">{children}</div>
        </div>
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
