"use client";
import React, { useState, useEffect } from "react";
import { EyeIcon } from "@/icons/index";
import { lenderApi } from "@/library/lenderApi";
import { useRouter } from "next/navigation";

interface Lender {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function LenderTable({
  refreshTrigger,
}: {
  refreshTrigger?: number;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch lenders
  const fetchLenders = async () => {
    setLoading(true);
    setError("");
    try {
      const fetchedLenders = await lenderApi.getLenders();
      setLenders(fetchedLenders);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch lenders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLenders();
  }, [refreshTrigger]);

  // Filter logic - for search functionality
  const filteredLenders = lenders.filter(lender => {
    if (search && !lender.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const isEmpty = filteredLenders.length === 0;

  const handleViewLender = (lenderId: number) => {
    router.push(`/admin/lenders/${lenderId}`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-0 flex flex-col">
      {/* Search Bar */}
      <div className="px-6 pt-4 pb-4 border-b border-gray-100">
        <div>
          <input
            type="text"
            placeholder="Search lenders by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Table or Empty State */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16">
          <div className="text-gray-700 text-center text-base font-medium">
            Loading lenders...
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16">
          <div className="text-red-700 text-center text-base font-medium">
            {error}
          </div>
        </div>
      ) : isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16">
          <div className="text-gray-700 text-center text-base font-medium max-w-md">
            No lenders found.
          </div>
        </div>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Created At</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLenders.map((lender) => (
              <tr key={lender.id} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {lender.name}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${lender.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {lender.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {new Date(lender.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewLender(lender.id)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    <EyeIcon className="w-4 h-4" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

