"use client";

import PinField from "react-pin-field";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";

const Page = () => {
  const router = useRouter();
  const pinRef = useRef();
  const [pinValue, setPinValue] = useState("");
  const [loading, setLoading] = useState(true);
  const { setIsAdmin, isAdmin } = useAdminStore();

  useEffect(() => {
    // Only redirect to dashboard if we're on the admin login page
    if (isAdmin && window.location.pathname === "/admin") {
      router.push("/admin/dashboard");
    }
    setLoading(false);
  }, [isAdmin, router]);

  useEffect(() => {
    if (pinValue === "1234") {
      setIsAdmin();
      router.push("/admin/dashboard");
    }
  }, [pinValue, setIsAdmin, router]);

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
            Enter Security PIN
          </h1>

          <div className="items-center justify-center flex">
            <PinField
              ref={pinRef}
              onChange={(pinCode) => setPinValue(pinCode)}
              validate="0123456789"
              length={4}
              className="w-12 text-gray-400 h-11 border-2 border-gray-300 rounded-lg mx-1 text-center text-xl font-semibold focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
