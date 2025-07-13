import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

export default function GenerateKeyModal({
  open,
  onClose,
  onKeyGenerated,
}: {
  open: boolean;
  onClose: () => void;
  onKeyGenerated?: (title: string, key: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = `sk_${Math.random().toString(36).slice(2, 18)}`;
    setGeneratedKey(key);
    setGeneratedTitle(title);
    setSubmitted(true);
    if (onKeyGenerated) onKeyGenerated(title, key);
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Title*</label>
              <input
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-2"
                placeholder="e.g. Production Key"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={!title} className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:opacity-50 disabled:cursor-not-allowed">
                Generate Key
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
              <Button onClick={handleClose}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
} 