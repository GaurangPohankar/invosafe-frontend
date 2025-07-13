"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { authenticationApi } from "@/library/authenticationApi";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    if (authenticationApi.isAuthenticated()) {
      const userRole = authenticationApi.getUserRole();
      
      // Redirect based on user role
      switch (userRole) {
        case "MANAGER":
          router.push("/manager");
          break;
        case "ADMIN":
          router.push("/admin");
          break;
        default:
          // Default fallback
          router.push("/admin");
      }
    }
  }, [router]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ThemeProvider>
        <div className="flex min-h-screen">
          {/* Left side - Auth form */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              {/* Logo */}
              <div className="text-center">
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="inline-block"
                >
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-12 bg-brand-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xl">IS</span>
                    </div>
                    <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">
                      InvoSafe
                    </span>
                  </div>
                </button>
              </div>
              
              {/* Auth content */}
              {children}
            </div>
          </div>
          
          {/* Right side - Hero section */}
          <div className="hidden lg:block lg:w-1/2 bg-brand-500 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-700"></div>
            <div className="relative h-full flex items-center justify-center px-12">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-6">
                  Streamline Your Invoicing
                </h1>
                <p className="text-xl text-brand-100 mb-8">
                  Manage invoices, track payments, and grow your business with our comprehensive invoice management system.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Create professional invoices in minutes</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Track payments and outstanding balances</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Generate detailed financial reports</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
} 