"use client";
import React, { useState, useEffect } from "react";
import RouteProtection from "../components/RouteProtection";
import Button from "@/components/ui/button/Button";
import { TrashBinIcon } from "@/icons/index";
import GenerateKeyModal from "./GenerateKeyModal";
import DeleteKeyModal from "./DeleteKeyModal";
import { apiClientApi } from "@/library/apiClientApi";

interface ApiClient {
  id: number;
  lender_id: number;
  name: string;
  api_key: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function MyApiPage() {
  const [apiKeys, setApiKeys] = useState<ApiClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<{ id: number; name: string } | null>(null);

  // Fetch API keys
  const fetchApiKeys = async () => {
    setLoading(true);
    setError("");
    try {
      const fetchedKeys = await apiClientApi.getApiClients();
      setApiKeys(fetchedKeys);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleGenerateKey = () => {
    setShowModal(true);
  };

  const handleDeleteClick = (key: ApiClient) => {
    setKeyToDelete({ id: key.id, name: key.name });
    setDeleteModalOpen(true);
  };

  const handleSuccess = () => {
    fetchApiKeys();
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
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading API keys...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : apiKeys.length === 0 ? (
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
                      <div className="font-medium text-gray-900 dark:text-white text-base">{key.name}</div>
                      <div className="text-xs text-gray-500 mb-1">{key.api_key}</div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span>Added on {new Date(key.created_at).toLocaleDateString()}</span>
                        <span className="text-green-600">Status: {key.status}</span>
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
      <GenerateKeyModal open={showModal} onClose={() => setShowModal(false)} onSuccess={handleSuccess} />
      <DeleteKeyModal
        open={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setKeyToDelete(null); }}
        keyId={keyToDelete?.id || 0}
        keyTitle={keyToDelete?.name || ""}
        onSuccess={handleSuccess}
      />
      </div>
    </RouteProtection>
  );
} 