"use client";

import React, { useState, useEffect } from "react";
import {
  MdAssessment,
  MdInventory,
  MdDashboard,
  MdMenu,
  MdPlayCircle,
  MdSettings,
  MdClose,
} from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const ResponsiveSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Check screen size and set states accordingly
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setIsOpen(false);
      } else {
        setIsMobile(false);
        setIsOpen(true);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on navigation if on mobile
  useEffect(() => {
    if (isMobile && pathname !== prevPathname) {
      setIsOpen(false);
      setPrevPathname(pathname);
    }
  }, [pathname, isMobile, prevPathname]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  const handleNavLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

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
      {/* Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed z-50 top-4 ${isOpen ? "left-48" : "left-4"} 
                  p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-[#1B59F8] transition-all duration-300`}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? (
          <MdClose className="text-2xl" />
        ) : (
          <MdMenu className="text-2xl" />
        )}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md z-40 transition-all duration-300 ease-in-out
                  ${
                    isOpen
                      ? "w-48"
                      : isMobile
                      ? "w-0 -translate-x-full"
                      : "w-48"
                  } 
                  overflow-hidden`}
      >
        <div className="flex flex-col h-full pt-8">
          <div className="px-6 mb-2">
            <Image
              src="/images/logo.png"
              alt="Company Logo"
              width={150}
              height={40}
              priority
            />
          </div>

          <nav className="flex-grow overflow-y-auto py-2">
            <ul className="list-none">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.title} className="px-6 py-1">
                    <Link
                      href={item.path}
                      onClick={handleNavLinkClick}
                      className={`flex items-center gap-2 transition-colors ${
                        isActive
                          ? "bg-[#e8eefd] text-[#1B59F8] rounded-lg p-2"
                          : "text-gray-700 hover:text-[#1B59F8] p-2"
                      }`}
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
      </div>
    </>
  );
};

export default ResponsiveSidebar;
