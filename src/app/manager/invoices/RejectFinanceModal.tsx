"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Badge from "@/components/ui/badge/Badge";
import { invoiceApi } from "@/library/invoiceApi";

interface RejectFinanceModalProps {
  open: boolean;
  onClose: () => void;
  invoice: any | null;
  onSubmit?: (reason: string) => void;
}

export default function RejectFinanceModal({ open, onClose, invoice, onSubmit }: RejectFinanceModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isValid = !!reason.trim();

  if (!invoice) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError(null);
    try {
      await invoiceApi.updateInvoiceById(invoice.id, {
        ...invoice,
        status: 2,
        rejection_reason: reason,
      });
      if (onSubmit) onSubmit(reason);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to reject invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} showCloseButton={true} className="max-w-xl w-full rounded-2xl">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl">
        <div className="px-8 pt-8 pb-4 bg-blue-50 rounded-t-2xl">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Unique ID - {invoice.invoice_id}</h2>
            <Badge variant="light" color="warning" size="md">Checked</Badge>
          </div>
          <div className="text-gray-500 text-base mb-1">Are you sure you want to reject finance this invoice?</div>
        </div>
        <div className="px-8 pt-6 pb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Rejection Reason</label>
          <textarea
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 min-h-[100px] resize-none"
            placeholder="Enter reason for rejection"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}
        </div>
        <div className="px-8 pb-8 flex justify-center">
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-3 rounded-lg font-semibold text-base transition ${
              !isValid || loading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-brand-500 text-white hover:bg-brand-600'
            }`}
          >
            {loading ? "Rejecting..." : "Confirm"}
          </button>
        </div>
      </form>
    </Modal>
  );
} 