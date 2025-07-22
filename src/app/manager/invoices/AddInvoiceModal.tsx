import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { businessApi } from "@/library/businessApi";

function isGSTIN(value: string) {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(value.trim());
}
function isPAN(value: string) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(value.trim());
}

function BusinessInfoCard({ business }: { business: any }) {
  if (!business) return null;
  return (
    <div className="mt-2 p-3 rounded border border-gray-200 bg-gray-50">
      <div className="font-semibold text-gray-900">{business.name}</div>
      <div className="text-xs text-gray-500">PAN: {business.pan}</div>
      <div className="text-xs text-gray-500">Address: {business.address}</div>
      <div className="text-xs text-gray-500">Status: {business.status}</div>
    </div>
  );
}

export default function AddInvoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Seller states
  const [sellerInput, setSellerInput] = useState("");
  const [sellerLoading, setSellerLoading] = useState(false);
  const [sellerError, setSellerError] = useState<string | null>(null);
  const [sellerGSTList, setSellerGSTList] = useState<string[]>([]);
  const [sellerSelectedGST, setSellerSelectedGST] = useState<string>("");
  const [sellerBusiness, setSellerBusiness] = useState<any>(null);

  // Buyer states
  const [buyerInput, setBuyerInput] = useState("");
  const [buyerLoading, setBuyerLoading] = useState(false);
  const [buyerError, setBuyerError] = useState<string | null>(null);
  const [buyerGSTList, setBuyerGSTList] = useState<string[]>([]);
  const [buyerSelectedGST, setBuyerSelectedGST] = useState<string>("");
  const [buyerBusiness, setBuyerBusiness] = useState<any>(null);

  // Seller search handler
  const handleSellerSearch = async () => {
    setSellerError(null);
    setSellerBusiness(null);
    setSellerGSTList([]);
    setSellerSelectedGST("");
    if (isGSTIN(sellerInput)) {
      setSellerLoading(true);
      try {
        const business = await businessApi.getBusinessInfoByGst(sellerInput.trim());
        setSellerBusiness(business);
      } catch (err: any) {
        setSellerError(err.message || "Failed to fetch business info");
      } finally {
        setSellerLoading(false);
      }
    } else if (isPAN(sellerInput)) {
      setSellerLoading(true);
      try {
        const { business, gst_list } = await businessApi.getGstListByPan(sellerInput.trim());
        setSellerBusiness(business);
        setSellerGSTList(gst_list);
      } catch (err: any) {
        setSellerError(err.message || "Failed to fetch GST list");
      } finally {
        setSellerLoading(false);
      }
    } else {
      setSellerError("Enter a valid PAN or GSTIN");
    }
  };

  // Seller GST selection
  const handleSellerGSTSelect = async (gst: string) => {
    setSellerSelectedGST(gst);
    setSellerLoading(true);
    setSellerError(null);
    try {
      const business = await businessApi.getBusinessInfoByGst(gst);
      setSellerBusiness(business);
    } catch (err: any) {
      setSellerError(err.message || "Failed to fetch business info");
    } finally {
      setSellerLoading(false);
    }
  };

  // Buyer search handler
  const handleBuyerSearch = async () => {
    setBuyerError(null);
    setBuyerBusiness(null);
    setBuyerGSTList([]);
    setBuyerSelectedGST("");
    if (isGSTIN(buyerInput)) {
      setBuyerLoading(true);
      try {
        const business = await businessApi.getBusinessInfoByGst(buyerInput.trim());
        setBuyerBusiness(business);
      } catch (err: any) {
        setBuyerError(err.message || "Failed to fetch business info");
      } finally {
        setBuyerLoading(false);
      }
    } else if (isPAN(buyerInput)) {
      setBuyerLoading(true);
      try {
        const { business, gst_list } = await businessApi.getGstListByPan(buyerInput.trim());
        setBuyerBusiness(business);
        setBuyerGSTList(gst_list);
      } catch (err: any) {
        setBuyerError(err.message || "Failed to fetch GST list");
      } finally {
        setBuyerLoading(false);
      }
    } else {
      setBuyerError("Enter a valid PAN or GSTIN");
    }
  };

  // Buyer GST selection
  const handleBuyerGSTSelect = async (gst: string) => {
    setBuyerSelectedGST(gst);
    setBuyerLoading(true);
    setBuyerError(null);
    try {
      const business = await businessApi.getBusinessInfoByGst(gst);
      setBuyerBusiness(business);
    } catch (err: any) {
      setBuyerError(err.message || "Failed to fetch business info");
    } finally {
      setBuyerLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} className="max-w-xl w-full rounded-2xl">
      <div className="bg-white rounded-2xl p-8">
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-xl font-semibold">Add Invoice</h3>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-3 py-1 text-sm font-medium mr-10">
            <span className="text-yellow-500">🪙</span>
            <span className="text-green-600 font-semibold">₹1500</span> Credits
          </div>
        </div>
        <div className="pt-2 pb-6">
          <div className="mb-4">
            <div className="mb-3 p-3 rounded bg-yellow-50">
              <div className="font-medium text-sm mb-1">Seller's Details</div>
              <div className="flex gap-2">
                <input
                  className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm"
                  placeholder="Search by PAN/GSTIN"
                  value={sellerInput}
                  onChange={e => setSellerInput(e.target.value)}
                  disabled={sellerLoading}
                />
                <button
                  className="bg-brand-500 text-white px-4 py-1.5 rounded font-medium text-sm"
                  type="button"
                  onClick={handleSellerSearch}
                  disabled={sellerLoading}
                >
                  {sellerLoading ? "Searching..." : "Search"}
                </button>
              </div>
              {sellerError && <div className="text-xs text-error-500 mt-1">{sellerError}</div>}
              {sellerGSTList.length > 0 && (
                <div className="mt-2">
                  <label className="block text-xs font-medium mb-1">Select GST</label>
                  <select
                    className="border border-gray-200 rounded px-3 py-2 text-sm w-full"
                    value={sellerSelectedGST}
                    onChange={e => handleSellerGSTSelect(e.target.value)}
                  >
                    <option value="">Select GST</option>
                    {sellerGSTList.map(gst => (
                      <option key={gst} value={gst}>{gst}</option>
                    ))}
                  </select>
                </div>
              )}
              <BusinessInfoCard business={sellerBusiness} />
            </div>
            <div className="mb-3 p-3 rounded bg-blue-50">
              <div className="font-medium text-sm mb-1">Buyer's Details</div>
              <div className="flex gap-2">
                <input
                  className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm"
                  placeholder="Search by PAN/GSTIN"
                  value={buyerInput}
                  onChange={e => setBuyerInput(e.target.value)}
                  disabled={buyerLoading}
                />
                <button
                  className="bg-brand-500 text-white px-4 py-1.5 rounded font-medium text-sm"
                  type="button"
                  onClick={handleBuyerSearch}
                  disabled={buyerLoading}
                >
                  {buyerLoading ? "Searching..." : "Search"}
                </button>
              </div>
              {buyerError && <div className="text-xs text-error-500 mt-1">{buyerError}</div>}
              {buyerGSTList.length > 0 && (
                <div className="mt-2">
                  <label className="block text-xs font-medium mb-1">Select GST</label>
                  <select
                    className="border border-gray-200 rounded px-3 py-2 text-sm w-full"
                    value={buyerSelectedGST}
                    onChange={e => handleBuyerGSTSelect(e.target.value)}
                  >
                    <option value="">Select GST</option>
                    {buyerGSTList.map(gst => (
                      <option key={gst} value={gst}>{gst}</option>
                    ))}
                  </select>
                </div>
              )}
              <BusinessInfoCard business={buyerBusiness} />
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