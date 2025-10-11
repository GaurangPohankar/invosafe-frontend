import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { apiClientApi } from "@/library/apiClientApi";

export default function GenerateKeyModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const lenderId = localStorage.getItem('lender_id');
      if (!lenderId) {
        throw new Error('No lender ID found');
      }

      const key = `sk_${Math.random().toString(36).slice(2, 18)}`;
      
      await apiClientApi.createApiClient({
        lender_id: parseInt(lenderId),
        name: title,
        api_key: key,
      });
      
      setGeneratedKey(key);
      setGeneratedTitle(title);
      setSubmitted(true);
    } catch (error: any) {
      setError(error.message || 'Failed to create API key');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setGeneratedKey("");
    setGeneratedTitle("");
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={handleClose} className="max-w-md w-full rounded-2xl">
      <div className="bg-white rounded-2xl p-8">
        <h3 className="text-xl font-semibold mb-2">Generate API Key</h3>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Title*</label>
              <input
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-2"
                placeholder="e.g. Production Key"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={!title || loading} 
                className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Generate Key'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Here is your new API key. Please copy and store it securely. You won’t be able to see it again!</div>
              <div className="font-medium text-gray-900 mb-1">{generatedTitle}</div>
              <code className="block w-full bg-gray-100 text-gray-800 px-3 py-2 rounded font-mono text-sm mb-2">{generatedKey}</code>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => {
                handleClose();
                onSuccess();
              }}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
} 