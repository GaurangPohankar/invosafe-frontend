"use client";
import React, { useState, useEffect } from "react";
import { invoiceApi } from "@/library/invoiceApi";
import { userApi } from "@/library/userApi";

interface LenderStatisticsProps {
  lenderId: number;
}

export default function LenderStatistics({ lenderId }: LenderStatisticsProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    pendingInvoices: 0,
    financeInvoices: 0,
    repaidInvoices: 0,
    rejectedInvoices: 0,
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalInvoiceAmount: 0,
    totalDisbursedAmount: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        // Fetch invoices for this lender
        const invoices = await invoiceApi.getInvoicesByLenderId(lenderId);
        
        // Fetch users for this lender
        const allUsers = await userApi.getUsersByStatus(undefined, undefined, false);
        const lenderUsers = allUsers.filter(u => u.lender_id === lenderId);
        
        // Calculate statistics
        const totalInvoiceAmount = invoices.reduce((sum, inv) => 
          sum + (parseFloat(String(inv.invoice_amount || 0))), 0
        );
        
        const totalDisbursedAmount = invoices.reduce((sum, inv) => 
          sum + (parseFloat(inv.disbursement_amount || "0")), 0
        );

        setStats({
          totalInvoices: invoices.length,
          pendingInvoices: invoices.filter(i => Number(i.status) === 0).length,
          financeInvoices: invoices.filter(i => Number(i.status) === 1).length,
          repaidInvoices: invoices.filter(i => Number(i.status) === 3).length,
          rejectedInvoices: invoices.filter(i => Number(i.status) === 2).length,
          totalUsers: lenderUsers.length,
          activeUsers: lenderUsers.filter(u => u.status === "active").length,
          blockedUsers: lenderUsers.filter(u => u.status === "blocked").length,
          totalInvoiceAmount,
          totalDisbursedAmount,
        });
      } catch (error: any) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [lenderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-gray-600">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Invoice Statistics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Invoices"
            value={stats.totalInvoices}
            color="blue"
          />
          <StatCard
            title="Searched"
            value={stats.pendingInvoices}
            color="yellow"
          />
          <StatCard
            title="Financed"
            value={stats.financeInvoices}
            color="green"
          />
          <StatCard
            title="Repaid"
            value={stats.repaidInvoices}
            color="purple"
          />
          <StatCard
            title="Rejected"
            value={stats.rejectedInvoices}
            color="red"
          />
        </div>
      </div>

      {/* Financial Statistics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Total Invoice Amount"
            value={`₹${stats.totalInvoiceAmount.toLocaleString()}`}
            color="blue"
          />
          <StatCard
            title="Total Disbursed Amount"
            value={`₹${stats.totalDisbursedAmount.toLocaleString()}`}
            color="green"
          />
        </div>
      </div>

      {/* User Statistics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            color="blue"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            color="green"
          />
          <StatCard
            title="Blocked Users"
            value={stats.blockedUsers}
            color="red"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    yellow: "bg-yellow-50 border-yellow-200",
    red: "bg-red-50 border-red-200",
    purple: "bg-purple-50 border-purple-200",
  };

  const textColorClasses = {
    blue: "text-blue-900",
    green: "text-green-900",
    yellow: "text-yellow-900",
    red: "text-red-900",
    purple: "text-purple-900",
  };

  return (
    <div className={`rounded-xl border p-6 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
      <p className={`text-2xl font-bold ${textColorClasses[color as keyof typeof textColorClasses]}`}>
        {value}
      </p>
    </div>
  );
}

