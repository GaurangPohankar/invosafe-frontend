import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

export default function BuyCreditsModal({
  open,
  onClose,
  onBuy,
}: {
  open: boolean;
  onClose: () => void;
  onBuy: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(amount, 10);
    if (isNaN(num) || num <= 0) {
      setError("Please enter a valid number of credits.");
      return;
    }
    setError("");
    onBuy(num);
    setAmount("");
    onClose();
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
            />
            {error && <div className="text-error-500 text-xs mt-1">{error}</div>}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
            <Button disabled={!amount || parseInt(amount, 10) <= 0}>Buy Credits</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 