import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { creditsApi } from "@/library/creditsApi";

export default function BuyCreditsModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(amount, 10);
    if (isNaN(num) || num <= 0) {
      setError("Please enter a valid number of credits.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const lenderId = localStorage.getItem('lender_id');
      if (!lenderId) {
        throw new Error('No lender ID found');
      }

      await creditsApi.purchaseCredits({
        lender_id: parseInt(lenderId),
        credits_amount: num,
        description: `Credit purchase of ${num} credits`,
      });
      
      // Close modal and trigger refresh
      setAmount("");
      onClose();
      onSuccess();
    } catch (error: any) {
      setError(error.message || 'Failed to purchase credits');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={handleClose} className="max-w-md w-full rounded-2xl">
      <div className="bg-white rounded-2xl p-8">
        <h3 className="text-xl font-semibold mb-4">Buy Credits</h3>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Credits*</label>
            <input
              type="number"
              min="1"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-2"
              placeholder="Enter credits to buy"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <Button disabled={!amount || parseInt(amount, 10) <= 0 || loading}>
              {loading ? 'Purchasing...' : 'Buy Credits'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 