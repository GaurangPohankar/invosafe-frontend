"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { authenticationApi } from "@/library/authenticationApi";
import UpdatePasswordCard from "./UpdatePasswordCard";

export default function ManagerAccountSettings() {
  const [userDetails, setUserDetails] = useState<{
    name: string | null;
    email: string | null;
    role: string | null;
  }>({ name: null, email: null, role: null });

  useEffect(() => {
    const details = authenticationApi.getUserDetails();
    setUserDetails({
      name: details.name,
      email: details.email,
      role: details.role,
    });
  }, []);

  const getInitials = (name: string | null): string => {
    if (!name) return 'U';
    
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="mx-auto space-y-8 max-w-6xl">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row md:items-center md:gap-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 bg-blue-500 flex items-center justify-center">
              <span className="text-white font-semibold text-2xl">
                {getInitials(userDetails.name)}
              </span>
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">
                {userDetails.name || 'User'}
              </div>
              <div className="text-gray-500 text-sm">Manager</div>
            </div>
          </div>
        </div>

        {/* Info + Password Cards Side by Side */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Personal Information Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex-1 min-w-0">
            <div className="mb-6">
              <span className="text-lg font-semibold text-gray-900">Personal Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <div className="text-xs text-gray-500 mb-1"> Name</div>
                <div className="font-medium text-gray-900">
                  {userDetails.name || 'Not provided'}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 mb-1">Email address</div>
                <div className="font-medium text-gray-900">
                  {userDetails.email || 'Not provided'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Phone</div>
                <div className="font-medium text-gray-900">Not provided</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs text-gray-500 mb-1">Bio</div>
                <div className="font-medium text-gray-900"> {userDetails.role || 'User'}</div>
              </div>
            </div>
          </div>

          {/* Update Password Card */}
          <UpdatePasswordCard />
        </div>
      </div>
    </div>
  );
} 