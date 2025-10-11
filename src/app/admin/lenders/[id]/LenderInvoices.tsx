"use client";
import React, { useState, useEffect } from "react";
import { invoiceApi } from "@/library/invoiceApi";

const STATUS_MAP = {
  0: { label: "Searched", color: "bg-yellow-100 text-yellow-700" },
  1: { label: "Financed", color: "bg-blue-100 text-blue-700" },
  2: { label: "Rejected", color: "bg-red-100 text-red-700" },
  3: { label: "Repaid", color: "bg-green-100 text-green-700" },
  5: { label: "Already Checked", color: "bg-yellow-100 text-yellow-700" },
  6: { label: "Already Financed", color: "bg-blue-100 text-blue-700" },
} as const;

interface Invoice {
  id: number;
  invoice_id: string;
  status: string;
  invoice_amount?: number;
  disbursement_amount?: string;
  disbursement_date?: string;
  due_date?: string;
  created_at: string;
}

interface LenderInvoicesProps {
  lenderId: number;
}

export default function LenderInvoices({ lenderId }: LenderInvoicesProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError("");
      try {
        const fetchedInvoices = await invoiceApi.getInvoicesByLenderId(lenderId);
        setInvoices(fetchedInvoices);
      } catch (err: any) {
        setError(err.message || "Failed to fetch invoices");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [lenderId]);

  const filteredInvoices = invoices.filter(invoice => {
    if (search && !invoice.invoice_id.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusInfo = (status: string) => {
    const statusNum = Number(status);
    return STATUS_MAP[statusNum as keyof typeof STATUS_MAP] || { 
      label: status, 
      color: "bg-gray-100 text-gray-700" 
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-gray-600">Loading invoices...</div>
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
      {/* Search Bar */}
      <div className="px-6 pt-4 pb-4 border-b border-gray-100">
        <input
          type="text"
          placeholder="Search invoices by ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      {filteredInvoices.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-gray-600">No invoices found</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left font-medium text-gray-500">Invoice ID</th>
                
                <th className="px-6 py-3 text-left font-medium text-gray-500">Invoice Amount</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Disbursed Amount</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b last:border-0">
                  <td className="px-6 py-4 font-medium text-gray-900">{invoice.invoice_id}</td>
                  
                  <td className="px-6 py-4 text-gray-700">
                    ₹{invoice.invoice_amount?.toLocaleString() || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {invoice.disbursement_amount ? `₹${parseFloat(invoice.disbursement_amount).toLocaleString()}` : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusInfo(invoice.status).color}`}>
                      {getStatusInfo(invoice.status).label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(invoice.created_at).toLocaleDateString()}
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

