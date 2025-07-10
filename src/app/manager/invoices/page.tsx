"use client";

import type { Metadata } from "next";
import React from "react";
import InvoiceTable from "./InvoiceTable";
import { UploadIcon } from "@/icons/index";
import { useState } from "react";
import UploadInvoiceModal from "./UploadInvoiceModal";
import AddInvoiceModal from "./AddInvoiceModal";


export default function InvoicesPage() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Invoice Check
        </h2>
        <div className="flex gap-3">
          <button
            className="inline-flex items-center justify-center rounded-md bg-white border border-brand-500 px-6 py-2.5 text-center font-medium text-brand-600 hover:bg-brand-50 gap-2"
            onClick={() => setUploadModalOpen(true)}
          >
            <UploadIcon className="w-5 h-5" />
            Upload Invoice
          </button>
          <button
            className="inline-flex items-center justify-center rounded-md bg-brand-500 px-6 py-2.5 text-center font-medium text-white hover:bg-brand-600 gap-2"
            onClick={() => setAddModalOpen(true)}
          >
            + Add Invoices
          </button>
        </div>
      </div>
      <InvoiceTable />
      <UploadInvoiceModal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
      <AddInvoiceModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </div>
  );
} 