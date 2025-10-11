"use client";

import { useSidebar } from "@/context/SidebarContext";
import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";
import AdminBackdrop from "./components/AdminBackdrop";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authenticationApi } from "@/library/authenticationApi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Redirect to signin if user is not authenticated
  useEffect(() => {
    if (!authenticationApi.isAuthenticated()) {
      router.replace("/auth/signin");
    }
  }, [router]);

  // Prevent initial content flash before auth check
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  useEffect(() => {
    const authed = authenticationApi.isAuthenticated();
    setIsAuthorized(authed);
    if (!authed) {
      // Navigation already triggered above; keep page blank
      setIsAuthorized(false);
    }
  }, []);

  // Block rendering until authorized to avoid content flash
  if (isAuthorized !== true) {
    return null;
  }

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AdminSidebar />
      <AdminBackdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AdminHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
} 