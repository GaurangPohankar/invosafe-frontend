"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { invoiceApi } from "@/library/invoiceApi";

interface MarkAsRepaidModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data?: any) => void;
  invoice: any | null;
}

export default function MarkAsRepaidModal({ open, onClose, onSubmit, invoice }: MarkAsRepaidModalProps) {
  const [repaidDate, setRepaidDate] = useState("");
  const [loading, setLoading] = useState(false);

  if (!invoice) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await invoiceApi.updateInvoiceById(invoice.id, {
        ...invoice,
        status: 3,
        repaid_date: repaidDate || undefined,
      });
      if (onSubmit) onSubmit({ repaid_date: repaidDate });
      onClose();
    } catch (err) {
      alert("Failed to mark as repaid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} showCloseButton={true} className="max-w-md w-full rounded-2xl">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Mark Invoice as Repaid</h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Repaid Date (optional)</label>
          <input
            type="date"
            name="repaidDate"
            value={repaidDate}
            onChange={e => setRepaidDate(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed bg-brand-500 text-white hover:bg-brand-600 transition disabled:bg-gray-200 disabled:text-gray-500"
        >
          {loading ? "Marking..." : "Mark as Repaid"}
        </button>
      </form>
    </Modal>
  );
} 