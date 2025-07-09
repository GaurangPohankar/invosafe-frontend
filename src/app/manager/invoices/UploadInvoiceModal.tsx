import React from "react";
import { Modal } from "@/components/ui/modal";
import { UploadIcon } from "@/icons/index";

export default function UploadInvoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Placeholder state for file and progress
  const [file, setFile] = React.useState<string | null>("your-file-here.PDF");
  const [progress, setProgress] = React.useState(60);

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
            <UploadIcon className="w-12 h-12 text-brand-400 mb-2" />
            <div className="font-semibold text-brand-600">Upload Invoice <span className="font-normal text-gray-500">Drag & drop invoices or <span className="text-brand-500 underline cursor-pointer">Browse</span></span></div>
            <div className="text-xs text-gray-400 mb-3">Supported formats: JPEG, JPG, PNG, PDF</div>
            <div className="flex gap-2">
              <button className="bg-brand-500 text-white px-4 py-1.5 rounded font-medium text-sm">Upload</button>
              <button className="border border-brand-500 text-brand-600 px-4 py-1.5 rounded font-medium text-sm bg-white">Fill Manually</button>
            </div>
          </div>
          <div className="mb-6">
            <div className="text-gray-700 text-sm mb-1">Uploading Invoice</div>
            <div className="flex items-center gap-2">
              <input className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm" value={file || ""} readOnly />
              <button className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="h-1 bg-brand-100 rounded mt-2">
              <div className="h-1 bg-brand-500 rounded" style={{ width: `${progress}%` }} />
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