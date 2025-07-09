import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "My API | InvoSafe - Invoice Management System",
  description: "Manage API keys and integrations",
};

export default function MyApiPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          My API
        </h2>
        <button className="inline-flex items-center justify-center rounded-md bg-brand-500 px-6 py-2.5 text-center font-medium text-white hover:bg-brand-600">
          Generate New API Key
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            API Keys
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Production Key
                </span>
                <span className="text-xs text-green-600 dark:text-green-400">
                  Active
                </span>
              </div>
              <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                sk_live_1234567890abcdef...
              </code>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Test Key
                </span>
                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                  Test Mode
                </span>
              </div>
              <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                sk_test_1234567890abcdef...
              </code>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            API Usage
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Requests Today
              </span>
              <span className="text-sm font-medium text-black dark:text-white">
                1,234
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Requests This Month
              </span>
              <span className="text-sm font-medium text-black dark:text-white">
                45,678
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Rate Limit
              </span>
              <span className="text-sm font-medium text-black dark:text-white">
                10,000/hour
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 