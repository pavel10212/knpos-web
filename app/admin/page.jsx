"use client";

import PinField from "react-pin-field";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";
import { verifyAdminPassword } from "@/services/dataService";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const pinRef = useRef();
  const [pinValue, setPinValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const { setIsAdmin, isAdmin } = useAdminStore();

  useEffect(() => {
    // Only redirect to dashboard if we're on the admin login page
    if (isAdmin && window.location.pathname === "/admin") {
      router.push("/admin/dashboard");
    }
    setLoading(false);
  }, [isAdmin, router]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const isValid = await verifyAdminPassword(password);
      
      if (isValid) {
        setIsAdmin();
        router.push("/admin/dashboard");
      } else {
        toast.error("Invalid password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white text-black min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-2">
      <div className="flex items-center justify-center bg-white">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={400}
          height={400}
          className="object-contain"
          priority
        />
      </div>

      <div className="flex items-center justify-center bg-[#7F8CD9]">
        <div className="max-w-md w-full p-8 bg-white backdrop-blur-sm rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold text-center text-black mb-6">
            Admin Login
          </h1>

          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                placeholder="Enter your admin password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 mt-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
