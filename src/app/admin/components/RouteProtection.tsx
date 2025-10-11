"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authenticationApi } from "@/library/authenticationApi";

interface RouteProtectionProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

export default function RouteProtection({ 
  children, 
  allowedRoles, 
  fallbackPath = "/admin" 
}: RouteProtectionProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        // Check if user is authenticated
        if (!authenticationApi.isAuthenticated()) {
          router.push("/auth/signin");
          return;
        }

        // Get user role
        const userRole = authenticationApi.getUserRole();
        
        if (!userRole) {
          router.push(fallbackPath);
          return;
        }

        // Check if user role is in allowed roles
        const hasAccess = allowedRoles.includes(userRole);
        
        if (!hasAccess) {
          router.push(fallbackPath);
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Authorization check failed:", error);
        router.push(fallbackPath);
      }
    };

    checkAuthorization();
  }, [router, allowedRoles, fallbackPath]);

  // Show loading or nothing while checking authorization
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Show children only if authorized
  return isAuthorized ? <>{children}</> : null;
} 