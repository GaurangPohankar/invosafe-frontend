import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { apiClientApi } from "@/library/apiClientApi";

interface DeleteKeyModalProps {
  open: boolean;
  onClose: () => void;
  keyId: number;
  keyTitle: string;
  onSuccess: () => void;
}

export default function DeleteKeyModal({ open, onClose, keyId, keyTitle, onSuccess }: DeleteKeyModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!keyTitle) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    
    try {
      await apiClientApi.deleteApiClient(keyId);
      
      // Close modal and trigger refresh
      onClose();
      onSuccess();
    } catch (error: any) {
      setError(error.message || 'Failed to delete API key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} showCloseButton={true} className="max-w-md w-full rounded-2xl">
      <div className="bg-white rounded-2xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Delete API Key</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <p className="text-gray-700 mb-6">Are you sure you want to delete API key <span className="font-semibold">{keyTitle}</span>?</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-error-500 text-white font-medium hover:bg-error-600 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
} 