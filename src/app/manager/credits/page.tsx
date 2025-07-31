"use client";
import React, { useState, useEffect } from "react";
import RouteProtection from "../components/RouteProtection";
import BuyCreditsModal from "./BuyCreditsModal";
import { creditsApi } from "@/library/creditsApi";

interface ApiCredits {
  id: number;
  lender_id: number;
  total_credits: number;
  used_credits: number;
  available_credits: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: number;
  lender_id: number;
  description: string;
  credits_change: number;
  balance_after: number;
  transaction_type: 'purchase' | 'usage' | 'billing';
  status: string;
  created_at: string;
}

export default function CreditsPage() {
  const [apiCredits, setApiCredits] = useState<ApiCredits | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buyModalOpen, setBuyModalOpen] = useState(false);

  // Fetch credits and transactions data
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [creditsData, transactionsData] = await Promise.all([
        creditsApi.getApiCredits(),
        creditsApi.getTransactions(),
      ]);
      setApiCredits(creditsData);
      setTransactions(transactionsData);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch credits data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBuyCreditsSuccess = () => {
    fetchData(); // Refresh data after purchase
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

      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading credits data...</div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-600">{error}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              Available Credits
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-500 mb-2">
                {apiCredits?.available_credits.toLocaleString() || '0'}
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
                {apiCredits?.used_credits.toLocaleString() || '0'}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total used
              </p>
            </div>
          </div>

          <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              Total Credits
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                {apiCredits?.total_credits.toLocaleString() || '0'}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total purchased
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Credit Usage History
        </h3>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading transactions...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600">{error}</div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">No transactions found.</div>
            </div>
          ) : (
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
                    Credits Change
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-black dark:text-white">
                    Balance After
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-black dark:text-white">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-stroke dark:border-strokedark">
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-black dark:text-white">
                      {transaction.description}
                    </td>
                    <td className={`py-3 px-4 text-sm ${
                      transaction.credits_change > 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.credits_change > 0 ? '+' : ''}{transaction.credits_change}
                    </td>
                    <td className="py-3 px-4 text-sm text-black dark:text-white">
                      {transaction.balance_after.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {transaction.transaction_type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <BuyCreditsModal open={buyModalOpen} onClose={() => setBuyModalOpen(false)} onSuccess={handleBuyCreditsSuccess} />
      </div>
    </RouteProtection>
  );
} 