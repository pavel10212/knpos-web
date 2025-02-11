import Sidebar from "@/components/sidebar";

export default function ReportsLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-48 fixed inset-y-0">
        <Sidebar />
      </div>
      <main className="ml-48 flex-1 p-8 w-full">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
