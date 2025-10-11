"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import RouteProtection from "../../components/RouteProtection";
import { lenderApi } from "@/library/lenderApi";
import { AngleLeftIcon } from "@/icons/index";
import LenderStatistics from "./LenderStatistics";
import LenderInvoices from "./LenderInvoices";
import LenderUsers from "./LenderUsers";
import LenderApi from "./LenderApi";
import LenderCredits from "./LenderCredits";

interface Lender {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const TABS = [
  { id: "statistics", label: "Statistics" },
  { id: "invoices", label: "Invoices" },
  { id: "users", label: "Users" },
  { id: "api", label: "API" },
  { id: "credits", label: "Credits" },
];

export default function LenderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const lenderId = params.id ? parseInt(params.id as string) : null;
  
  const [activeTab, setActiveTab] = useState("statistics");
  const [lender, setLender] = useState<Lender | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLender = async () => {
      if (!lenderId) {
        setError("Invalid lender ID");
        setLoading(false);
        return;
      }

      try {
        const lenders = await lenderApi.getLenders();
        const foundLender = lenders.find(l => l.id === lenderId);
        
        if (!foundLender) {
          setError("Lender not found");
        } else {
          setLender(foundLender);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch lender details");
      } finally {
        setLoading(false);
      }
    };

    fetchLender();
  }, [lenderId]);

  if (loading) {
    return (
      <RouteProtection allowedRoles={["ADMIN"]}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-600">Loading lender details...</div>
        </div>
      </RouteProtection>
    );
  }

  if (error || !lender) {
    return (
      <RouteProtection allowedRoles={["ADMIN"]}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-red-600 text-lg mb-4">{error || "Lender not found"}</div>
          <button
            onClick={() => router.push("/admin/lenders")}
            className="text-brand-500 hover:text-brand-600"
          >
            Back to Lenders
          </button>
        </div>
      </RouteProtection>
    );
  }

  return (
    <RouteProtection allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/lenders")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <AngleLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h2 className="text-title-md2 font-bold text-black dark:text-white">
              {lender.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Lender ID: {lender.id} • Created: {new Date(lender.created_at).toLocaleDateString()}
            </p>
          </div>
          <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
            lender.status === "active" 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {lender.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-1 py-3 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "text-brand-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-brand-600" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "statistics" && <LenderStatistics lenderId={lenderId!} />}
          {activeTab === "invoices" && <LenderInvoices lenderId={lenderId!} />}
          {activeTab === "users" && <LenderUsers lenderId={lenderId!} />}
          {activeTab === "api" && <LenderApi lenderId={lenderId!} />}
          {activeTab === "credits" && <LenderCredits lenderId={lenderId!} />}
        </div>
      </div>
    </RouteProtection>
  );
}

