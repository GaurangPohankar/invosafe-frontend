import type { Metadata } from "next";
import React from "react";
import InvoiceTable from "./InvoiceTable";

export const metadata: Metadata = {
  title: "Invoices | InvoSafe - Invoice Management System",
  description: "Manage and view all invoices in the system",
};

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Invoice Check
        </h2>
        <button className="inline-flex items-center justify-center rounded-md bg-brand-500 px-6 py-2.5 text-center font-medium text-white hover:bg-brand-600">
          + Add Invoices
        </button>
      </div>
      <InvoiceTable />
    </div>
  );
} 