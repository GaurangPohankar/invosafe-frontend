"use client";
import React, { useState } from "react";
import RouteProtection from "../components/RouteProtection";
import Button from "@/components/ui/button/Button";
import { TrashBinIcon } from "@/icons/index";
import GenerateKeyModal from "./GenerateKeyModal";
import DeleteKeyModal from "./DeleteKeyModal";

// export const metadata: Metadata = { ... } // (removed per your last edit)

// Mocked API keys data
const MOCK_API_KEYS = [
  {
    id: 1,
    label: "Production Key",
    key: "sk_live_1234567890abcdef...",
    status: "Active",
    created: "Jan 24, 2024",
    lastUsed: "within the last week",
    permission: "Read/write",
  },
  {
    id: 2,
    label: "Test Key",
    key: "sk_test_1234567890abcdef...",
    status: "Test Mode",
    created: "Jan 28, 2025",
    lastUsed: "within the last 6 months",
    permission: "Read/write",
  },
];

export default function MyApiPage() {
  const [apiKeys, setApiKeys] = useState(MOCK_API_KEYS);
  const [showModal, setShowModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<{ id: number; label: string } | null>(null);
  const [generatedKey, setGeneratedKey] = useState("");
  const [generatedTitle, setGeneratedTitle] = useState("");

  const handleDelete = (id: number) => {
    setApiKeys(keys => keys.filter(k => k.id !== id));
  };

  const handleGenerateKey = () => {
    // Simulate key generation
    const newKey = `sk_${Math.random().toString(36).slice(2, 18)}`;
    const newTitle = "New Key";
    setGeneratedKey(newKey);
    setGeneratedTitle(newTitle);
    setShowModal(true);
    // Do NOT add to apiKeys here
  };

  const handleDeleteClick = (key: { id: number; label: string }) => {
    setKeyToDelete(key);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (keyToDelete) {
      setApiKeys(keys => keys.filter(k => k.id !== keyToDelete.id));
      setKeyToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  return (
    <RouteProtection allowedRoles={["MANAGER"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-bold text-black dark:text-white">
            My API
          </h2>
          <Button onClick={handleGenerateKey}>
            +  Generate New API Key
          </Button>
        </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-0 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold text-black dark:text-white px-6 pt-6 pb-2">
            API Keys
          </h3>
          <div className="divide-y divide-gray-100">
            {apiKeys.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No API keys found.</div>
            ) : (
              apiKeys.map((key) => (
                <div key={key.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-base">{key.label}</div>
                      <div className="text-xs text-gray-500 mb-1">{key.key}</div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span>Added on {key.created}</span>
                        <span className="text-green-600">Last used {key.lastUsed}</span>
                        <span className="text-gray-400">— {key.permission}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(key)}
                      className="px-5 py-2 rounded-lg bg-error-500 text-white font-medium hover:bg-error-600 flex items-center gap-2"
                    >
                      <TrashBinIcon className="w-5 h-5" /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <GenerateKeyModal open={showModal} onClose={() => setShowModal(false)} />
      <DeleteKeyModal
        open={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setKeyToDelete(null); }}
        keyTitle={keyToDelete?.label || ""}
        onDelete={handleDeleteConfirm}
      />
      </div>
    </RouteProtection>
  );
} 