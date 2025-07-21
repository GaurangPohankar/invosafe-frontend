"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { invoiceApi } from "@/library/invoiceApi";

interface DeleteInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoice: any | null;
  onDelete?: () => void;
}

export default function DeleteInvoiceModal({ open, onClose, invoice, onDelete }: DeleteInvoiceModalProps) {
  const [loading, setLoading] = useState(false);
  if (!invoice) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await invoiceApi.updateInvoice(invoice.id, {
        ...invoice,
        status: 4,
      });
      if (onDelete) onDelete();
      onClose();
    } catch (err) {
      alert("Failed to delete invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} showCloseButton={true} className="max-w-md w-full rounded-2xl">
      <div className="bg-white rounded-2xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Invoice</h2>
        <p className="text-gray-700 mb-6">Are you sure you want to move invoice <span className="font-semibold">{invoice.id}</span> to trash</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-5 py-2 rounded-lg bg-error-500 text-white font-medium hover:bg-error-600"
            disabled={loading}
          >
            {loading ? "Moving..." : "Move To Trash"}
          </button>
        </div>
      </div>
    </Modal>
  );
} 