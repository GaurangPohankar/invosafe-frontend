"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Badge from "@/components/ui/badge/Badge";

interface RejectFinanceModalProps {
  open: boolean;
  onClose: () => void;
  invoice: any | null;
  onSubmit?: (reason: string) => void;
}

export default function RejectFinanceModal({ open, onClose, invoice, onSubmit }: RejectFinanceModalProps) {
  const [reason, setReason] = useState("");
  const isValid = !!reason.trim();

  if (!invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && onSubmit) onSubmit(reason);
  };

  return (
    <Modal isOpen={open} onClose={onClose} showCloseButton={true} className="max-w-xl w-full rounded-2xl">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl">
        <div className="px-8 pt-8 pb-4 bg-blue-50 rounded-t-2xl">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Unique ID - {invoice.id}</h2>
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
        </div>
        <div className="px-8 pb-8 flex justify-center">
          <button
            type="submit"
            disabled={!isValid}
            className="w-full py-3 rounded-lg bg-gray-200 text-gray-500 font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed bg-brand-500 text-white hover:bg-brand-600 transition disabled:bg-gray-200 disabled:text-gray-500"
          >
            Confirm
          </button>
        </div>
      </form>
    </Modal>
  );
} 