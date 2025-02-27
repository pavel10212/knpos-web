"use client";
import Sidebar from "@/components/sidebar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  LoadingProvider,
  useLoading,
} from "@/components/common/LoadingContext";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/common/SidebarContext";

function DashboardContent({ children }) {
  const { isLoading } = useLoading();
  const { isOpen, isMobile } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main
        className={`flex-1 transition-all duration-300 ease-in-out p-4 md:p-8 w-full ${
          isOpen && !isMobile ? "lg:ml-64" : ""
        }`}
      >
        {/* Add padding top for mobile to avoid title overlap with toggle button */}
        <div className={`w-full ${isMobile ? "pt-8" : ""}`}>
          {isLoading && <LoadingSpinner text="Loading..." />}
          {children}
        </div>
      </main>
    </div>
  );
}

export default function ReportsLayout({ children }) {
  return (
    <LoadingProvider>
      <SidebarProvider>
        <DashboardContent>{children}</DashboardContent>
      </SidebarProvider>
    </LoadingProvider>
  );
}
