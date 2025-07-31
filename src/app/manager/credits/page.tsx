"use client";
import React, { useState } from "react";
import RouteProtection from "../components/RouteProtection";
import BuyCreditsModal from "./BuyCreditsModal";



export default function CreditsPage() {
  const [availableCredits, setAvailableCredits] = useState(1250);
  const [buyModalOpen, setBuyModalOpen] = useState(false);

  const handleBuyCredits = (amount: number) => {
    setAvailableCredits((prev) => prev + amount);
  };

  return (
    <RouteProtection allowedRoles={["MANAGER"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-bold text-black dark:text-white">
            Credits & Billing
          </h2>
          <button
            className="inline-flex items-center justify-center rounded-md bg-brand-500 px-6 py-2.5 text-center font-medium text-white hover:bg-brand-600"
            onClick={() => setBuyModalOpen(true)}
          >
            +  Add Credits
          </button>
        </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Available Credits
          </h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-500 mb-2">
              {availableCredits.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Credits remaining
            </p>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Credits Used
          </h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              750
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This month
            </p>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Next Billing
          </h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            ₹99
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Due on Dec 15, 2024
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Credit Usage History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-stroke dark:border-strokedark">
                <th className="text-left py-3 px-4 font-medium text-black dark:text-white">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-black dark:text-white">
                  Description
                </th>
                <th className="text-left py-3 px-4 font-medium text-black dark:text-white">
                  Credits Used
                </th>
                <th className="text-left py-3 px-4 font-medium text-black dark:text-white">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stroke dark:border-strokedark">
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                  Dec 10, 2024
                </td>
                <td className="py-3 px-4 text-sm text-black dark:text-white">
                  Invoice generation
                </td>
                <td className="py-3 px-4 text-sm text-red-600 dark:text-red-400">
                  -5
                </td>
                <td className="py-3 px-4 text-sm text-black dark:text-white">
                  {availableCredits.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b border-stroke dark:border-strokedark">
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                  Dec 8, 2024
                </td>
                <td className="py-3 px-4 text-sm text-black dark:text-white">
                  Credit purchase
                </td>
                <td className="py-3 px-4 text-sm text-green-600 dark:text-green-400">
                  +500
                </td>
                <td className="py-3 px-4 text-sm text-black dark:text-white">
                  {(availableCredits - 5).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                  Dec 5, 2024
                </td>
                <td className="py-3 px-4 text-sm text-black dark:text-white">
                  API calls
                </td>
                <td className="py-3 px-4 text-sm text-red-600 dark:text-red-400">
                  -10
                </td>
                <td className="py-3 px-4 text-sm text-black dark:text-white">
                  {(availableCredits - 5 - 500).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <BuyCreditsModal open={buyModalOpen} onClose={() => setBuyModalOpen(false)} onBuy={handleBuyCredits} />
      </div>
    </RouteProtection>
  );
} 