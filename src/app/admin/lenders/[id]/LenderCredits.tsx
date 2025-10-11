"use client";
import React, { useState, useEffect } from "react";
import { creditsApi } from "@/library/creditsApi";

interface ApiCredits {
  id: number;
  lender_id: number;
  remaining_credits: number;
  total_credits: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: number;
  lender_id: number;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: string;
}

interface LenderCreditsProps {
  lenderId: number;
}

export default function LenderCredits({ lenderId }: LenderCreditsProps) {
  const [credits, setCredits] = useState<ApiCredits | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCredits = async () => {
      setLoading(true);
      setError("");
      try {
        const fetchedCredits = await creditsApi.getApiCreditsByLenderId(lenderId);
        setCredits(fetchedCredits);

        const fetchedTransactions = await creditsApi.getCreditTransactionsByLenderId(lenderId);
        setTransactions(fetchedTransactions);
      } catch (err: any) {
        setError(err.message || "Failed to fetch credits");
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [lenderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-gray-600">Loading credits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Credits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Total Credits</p>
          <p className="text-2xl font-bold text-blue-900">
            {credits?.total_credits?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Remaining Credits</p>
          <p className="text-2xl font-bold text-green-900">
            {credits?.remaining_credits?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Used Credits</p>
          <p className="text-2xl font-bold text-purple-900">
            {((credits?.total_credits || 0) - (credits?.remaining_credits || 0)).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Credit Transactions</h3>
        </div>

        {transactions.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-gray-600">No transactions found</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Type</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Amount</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Description</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b last:border-0">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        transaction.transaction_type === "credit" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {transaction.transaction_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {transaction.transaction_type === "credit" ? "+" : "-"}
                      {transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{transaction.description}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

