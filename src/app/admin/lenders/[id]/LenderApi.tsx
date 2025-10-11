"use client";
import React, { useState, useEffect } from "react";
import { apiClientApi } from "@/library/apiClientApi";

interface ApiClient {
  id: number;
  name: string;
  api_key: string;
  lender_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface LenderApiProps {
  lenderId: number;
}

export default function LenderApi({ lenderId }: LenderApiProps) {
  const [apiClients, setApiClients] = useState<ApiClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApiClients = async () => {
      setLoading(true);
      setError("");
      try {
        const clients = await apiClientApi.getApiClients();
        const lenderClients = clients.filter(c => c.lender_id === lenderId);
        setApiClients(lenderClients);
      } catch (err: any) {
        setError(err.message || "Failed to fetch API clients");
      } finally {
        setLoading(false);
      }
    };

    fetchApiClients();
  }, [lenderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-gray-600">Loading API clients...</div>
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
    <div className="bg-white rounded-xl border border-gray-200">
      {apiClients.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-gray-600">No API clients found</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left font-medium text-gray-500">Name</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">API Key</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {apiClients.map((client) => (
                <tr key={client.id} className="border-b last:border-0">
                  <td className="px-6 py-4 font-medium text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 text-gray-700 font-mono text-xs">
                    {client.api_key.substring(0, 20)}...
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      client.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {client.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(client.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

