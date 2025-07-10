"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import { EyeCloseIcon, DollarLineIcon } from "@/icons/index";

interface InvoiceDetailsModalProps {
  open: boolean;
  onClose: () => void;
  invoice: any | null;
  onMarkAsFinanced?: () => void;
  onRejectFinance?: () => void;
}

export default function InvoiceDetailsModal({ open, onClose, invoice, onMarkAsFinanced, onRejectFinance }: InvoiceDetailsModalProps) {
  if (!invoice) return null;

  return (
    <Modal isOpen={open} onClose={onClose} showCloseButton={true} className="!max-w-2xl !w-full !h-screen !rounded-none !fixed right-0 top-0 !p-0">
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Download Invoice</button>
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Send Invoice</button>
          </div>
        </div>
        {/* Title */}
        <div className="px-8 pt-6 pb-2 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Unique ID - {invoice.id}</h2>
        </div>
        {/* Mark as Financed */}
        <div className="px-8 pt-2 pb-4">
          <div className="flex items-center gap-4 bg-success-50 border border-success-200 rounded-lg p-4 mb-4">
            <DollarLineIcon className="w-6 h-6 text-success-600" />
            <div className="flex-1">
              <div className="font-medium text-success-700">Mark Invoice as Financed</div>
              <div className="text-xs text-success-700">Give us few details above the financing details</div>
            </div>
            <button onClick={onMarkAsFinanced} className="px-4 py-2 rounded-lg bg-success-500 text-white font-medium text-sm hover:bg-success-600">Mark as Financed</button>
          </div>
        </div>
        {/* Details */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="mb-2 text-xs text-gray-500">Buyer GSTIN Number</div>
              <div className="font-semibold text-gray-900">28NHTYQ777004Z1</div>
              <div className="text-xs text-orange-600 bg-orange-50 rounded px-2 py-0.5 inline-block mt-1">Trade Name: SCL Private Limited</div>
            </div>
            <div>
              <div className="mb-2 text-xs text-gray-500">Seller GSTIN Number</div>
              <div className="font-semibold text-gray-900">12NDGLD1611P1Z3</div>
              <div className="text-xs text-orange-600 bg-orange-50 rounded px-2 py-0.5 inline-block mt-1">Trade Name: Khushal Finnovation Capital Private Limited</div>
            </div>
            <div>
              <div className="mb-2 text-xs text-gray-500">Invoice No.</div>
              <div className="font-semibold text-gray-900">22</div>
            </div>
            <div>
              <div className="mb-2 text-xs text-gray-500">Invoice Date</div>
              <div className="font-semibold text-gray-900">28-05-2024</div>
            </div>
            <div>
              <div className="mb-2 text-xs text-gray-500">Purchase Order No.</div>
              <div className="font-semibold text-gray-900">1233</div>
            </div>
            <div>
              <div className="mb-2 text-xs text-gray-500">E- Invoice</div>
              <div className="font-semibold text-gray-900">12NDGLD1611P1Z3</div>
            </div>
            <div>
              <div className="mb-2 text-xs text-gray-500">Invoice Amount</div>
              <div className="font-semibold text-gray-900">1,23,234</div>
              <div className="text-xs text-blue-700 bg-blue-50 rounded px-2 py-0.5 inline-block mt-1">Total Invoice Amount:- 1,35,897</div>
            </div>
            <div>
              <div className="mb-2 text-xs text-gray-500">Tax Amount</div>
              <div className="font-semibold text-gray-900">12,787</div>
            </div>
            <div className="col-span-2">
              <div className="mb-2 text-xs text-gray-500">Uploaded Invoice Doc</div>
              <div className="flex items-center gap-2">
                <div className="font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded">document-name.PDF</div>
                <button className="text-brand-600 font-medium hover:underline">View Invoice</button>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-100 flex justify-end">
          <button onClick={onRejectFinance} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-error-50 text-error-600 font-medium text-sm hover:bg-error-100">
            <EyeCloseIcon className="w-5 h-5" /> Reject Finance
          </button>
        </div>
      </div>
    </Modal>
  );
} 