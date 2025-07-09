"use client";
import React from "react";
import Image from "next/image";

export default function ManagerAccountSettings() {
  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="mx-auto space-y-8 max-w-6xl">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row md:items-center md:gap-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200">
              <Image src="/images/user/owner.jpg" width={80} height={80} alt="user" />
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">Musharof Chowdhury</div>
              <div className="text-gray-500 text-sm">Team Manager &nbsp; | &nbsp; Arizona, United States</div>
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
                <div className="text-xs text-gray-500 mb-1">First Name</div>
                <div className="font-medium text-gray-900">Musharof</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Last Name</div>
                <div className="font-medium text-gray-900">Chowdhury</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Email address</div>
                <div className="font-medium text-gray-900">randomuser@pimjo.com</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Phone</div>
                <div className="font-medium text-gray-900">+09 363 398 46</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs text-gray-500 mb-1">Bio</div>
                <div className="font-medium text-gray-900">Team Manager</div>
              </div>
            </div>
          </div>

          {/* Update Password Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex-1 min-w-0">
            <div className="mb-6">
              <span className="text-lg font-semibold text-gray-900">Update Password</span>
            </div>
            <form className="space-y-5 max-w-md">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Current Password</label>
                <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" placeholder="Enter current password" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" placeholder="Enter new password" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" placeholder="Confirm new password" />
              </div>
              <button type="submit" className="px-6 py-2 rounded bg-brand-500 text-white font-medium">Update Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 