"use client";

import React from "react";
import {
  MdAssessment,
  MdInventory,
  MdDashboard,
  MdMenu,
  MdSettings,
  MdChevronLeft,
} from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSidebar } from "./common/SidebarContext";

const Sidebar = () => {
  const { isOpen, toggleSidebar, isMobile } = useSidebar();
  const pathname = usePathname();
  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <MdAssessment className="text-2xl" />,
    },
    {
      title: "Inventory",
      path: "/admin/dashboard/inventory",
      icon: <MdInventory className="text-2xl" />,
    },
    {
      title: "Layout",
      path: "/admin/dashboard/layout",
      icon: <MdDashboard className="text-2xl" />,
    },
    {
      title: "Menu",
      path: "/admin/dashboard/menu",
      icon: <MdMenu className="text-2xl" />,
    },
    {
      title: "Settings",
      path: "/admin/dashboard/settings",
      icon: <MdSettings className="text-2xl" />,
    },
  ];

  return (
    <>
      {/* Toggle Button that moves with the sidebar */}
      {isMobile && (
        <button
          className={`fixed top-4 z-50 p-2 bg-white rounded-lg shadow-md transition-all duration-300 ${
            isOpen ? "left-[15rem]" : "left-4"
          }`}
          onClick={toggleSidebar}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? (
            <MdChevronLeft className="text-2xl text-[#1B59F8]" />
          ) : (
            <MdMenu className="text-2xl text-[#1B59F8]" />
          )}
        </button>
      )}

      <div
        className={`fixed lg:relative inset-y-0 left-0 z-40 
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        transition-transform duration-300 ease-in-out flex flex-col h-full bg-white shadow-md pt-8
        w-64`}
      >
        <div className="flex items-center justify-between px-6 mb-2">
          <Image
            src="/images/logo.png"
            alt="Company Logo"
            width={150}
            height={40}
            priority
          />
        </div>

        <nav className="flex-grow overflow-y-auto py-2 mt-4">
          <ul className="list-none">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.title} className="px-6 py-1">
                  <Link
                    href={item.path}
                    className={`flex items-center gap-2 transition-colors ${
                      isActive
                        ? "bg-[#e8eefd] text-[#1B59F8] rounded-lg p-2"
                        : "text-gray-700 hover:text-[#1B59F8] p-2"
                    }`}
                    onClick={() => {
                      if (isMobile) toggleSidebar();
                    }}
                  >
                    <div className={isActive ? "text-[#1B59F8]" : ""}>
                      {item.icon}
                    </div>
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
