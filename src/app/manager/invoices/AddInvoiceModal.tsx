import React from "react";
import { Modal } from "@/components/ui/modal";

export default function AddInvoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={open} onClose={onClose} className="max-w-xl w-full rounded-2xl">
      <div className="bg-white rounded-2xl p-8">
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-xl font-semibold">Add Invoice</h3>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-3 py-1 text-sm font-medium">
            <span className="text-yellow-500">🪙</span>
            <span className="text-green-600 font-semibold">₹1500</span> Credits
          </div>
        </div>
        <div className="pt-2 pb-6">
          <div className="border border-dashed border-brand-200 rounded-lg p-6 flex flex-col items-center mb-6">
            <div className="font-semibold text-brand-600">Add <span className="text-brand-500">Manual</span> Invoice <span className="font-normal text-gray-500">All the invoice data to be filled carefully as per actual invoice</span></div>
            <button className="bg-brand-500 text-white px-4 py-1.5 rounded font-medium text-sm mt-3">Upload</button>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Add invoice details</div>
            <div className="mb-3 p-3 rounded bg-yellow-50">
              <div className="font-medium text-sm mb-1">Seller's Details</div>
              <div className="flex gap-2">
                <input className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Search by PAN/GSTIN" />
                <button className="bg-brand-500 text-white px-4 py-1.5 rounded font-medium text-sm">Search</button>
              </div>
            </div>
            <div className="mb-3 p-3 rounded bg-blue-50">
              <div className="font-medium text-sm mb-1">Buyer's Details</div>
              <div className="flex gap-2">
                <input className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Search by PAN/GSTIN" />
                <button className="bg-brand-500 text-white px-4 py-1.5 rounded font-medium text-sm">Search</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <input className="border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Purchase Order No." />
              <input className="border border-gray-200 rounded px-3 py-2 text-sm" placeholder="E Invoice" />
              <input className="border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Invoice Amount" />
              <input className="border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Tax Amount" />
              <input className="border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Lorry Receipt" />
              <input className="border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Eway Bill" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button className="px-6 py-2 rounded bg-gray-100 text-gray-700 font-medium" onClick={onClose}>Cancel</button>
            <button className="px-6 py-2 rounded bg-brand-500 text-white font-medium">Analyse</button>
          </div>
        </div>
      </div>
    </Modal>
  );
} 