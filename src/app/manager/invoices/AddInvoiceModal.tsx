import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { businessApi } from "@/library/businessApi";
import { invoiceApi } from "@/library/invoiceApi";
import { authenticationApi } from "@/library/authenticationApi";

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

  // Invoice form fields
  const [invoiceId, setInvoiceId] = useState("");
  const [purchaseOrderNo, setPurchaseOrderNo] = useState("");
  const [eInvoice, setEInvoice] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [lorryReceipt, setLorryReceipt] = useState("");
  const [ewayBill, setEwayBill] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
        setSellerSelectedGST(sellerInput.trim()); // GST is directly set
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
        setSellerSelectedGST(""); // Require user to select GST
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
        setBuyerSelectedGST(buyerInput.trim()); // GST is directly set
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
        setBuyerSelectedGST(""); // Require user to select GST
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

  // Reset business and GST state when input changes
  const handleSellerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSellerInput(e.target.value);
    setSellerBusiness(null);
    setSellerGSTList([]);
    setSellerSelectedGST("");
  };
  const handleBuyerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuyerInput(e.target.value);
    setBuyerBusiness(null);
    setBuyerGSTList([]);
    setBuyerSelectedGST("");
  };

  // Validation
  function validateForm() {
    if (!sellerBusiness || !sellerSelectedGST) return "Select a valid seller and GST";
    if (!buyerBusiness || !buyerSelectedGST) return "Select a valid buyer and GST";
    if (!invoiceId.trim()) return "Invoice ID is required";
    if (!invoiceAmount || isNaN(Number(invoiceAmount)) || Number(invoiceAmount) <= 0) return "Enter a valid invoice amount";
    if (!taxAmount || isNaN(Number(taxAmount)) || Number(taxAmount) < 0) return "Enter a valid tax amount";
    return null;
  }

  const isFormValid =
    !!sellerBusiness && !!sellerSelectedGST &&
    !!buyerBusiness && !!buyerSelectedGST &&
    !!invoiceId.trim() &&
    !!invoiceAmount && !isNaN(Number(invoiceAmount)) && Number(invoiceAmount) > 0 &&
    !!taxAmount && !isNaN(Number(taxAmount)) && Number(taxAmount) >= 0;

  // Analyse handler
  const handleAnalyse = async () => {
    setFormError(null);
    setSuccessMsg(null);
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormLoading(true);
    try {
      // Check for duplicate invoice
      const accessToken = localStorage.getItem('access_token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const checkRes = await fetch(`${API_BASE_URL}/invoice/?invoice_id=${encodeURIComponent(invoiceId)}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (checkRes.ok) {
        const data = await checkRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setFormError("Invoice with this ID already exists.");
          setFormLoading(false);
          return;
        }
      }
      // Get user_id and lender_id
      const userDetails = authenticationApi.getUserDetails();
      if (!userDetails.user_id || !userDetails.lender_id) {
        setFormError("User or lender information missing. Please re-login.");
        setFormLoading(false);
        return;
      }
      // Create invoice
      await invoiceApi.createInvoice({
        invoice_id: invoiceId.trim(),
        seller_id: sellerBusiness.id,
        seller_gst: sellerSelectedGST,
        buyer_id: buyerBusiness.id,
        buyer_gst: buyerSelectedGST,
        purchase_order_number: purchaseOrderNo,
        lorry_receipt: lorryReceipt,
        eway_bill: ewayBill,
        invoice_amount: Number(invoiceAmount),
        tax_amount: Number(taxAmount),
        user_id: userDetails.user_id,
        lender_id: userDetails.lender_id,
        // Add more fields as needed
      });
      setSuccessMsg("Invoice created successfully!");
      setFormLoading(false);
      // Reset form and close modal
      setTimeout(() => {
        setSellerInput(""); setSellerBusiness(null); setSellerGSTList([]); setSellerSelectedGST("");
        setBuyerInput(""); setBuyerBusiness(null); setBuyerGSTList([]); setBuyerSelectedGST("");
        setInvoiceId(""); setPurchaseOrderNo(""); setEInvoice(""); setInvoiceAmount(""); setTaxAmount(""); setLorryReceipt(""); setEwayBill("");
        setFormError(null); setSuccessMsg(null);
        onClose();
      }, 500);
    } catch (err: any) {
      setFormError(err.message || "Failed to create invoice");
      setFormLoading(false);
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
                  onChange={handleSellerInputChange}
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
                  onChange={handleBuyerInputChange}
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
              <input className="border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Invoice ID" value={invoiceId} onChange={e => setInvoiceId(e.target.value)} />
              <input className="border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Purchase Order No." value={purchaseOrderNo} onChange={e => setPurchaseOrderNo(e.target.value)} />
              <input className="border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Invoice Amount" value={invoiceAmount} onChange={e => setInvoiceAmount(e.target.value)} />
              <input className="border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Tax Amount" value={taxAmount} onChange={e => setTaxAmount(e.target.value)} />
              <input className="border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Lorry Receipt" value={lorryReceipt} onChange={e => setLorryReceipt(e.target.value)} />
              <input className="border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Eway Bill" value={ewayBill} onChange={e => setEwayBill(e.target.value)} />
            </div>
            {formError && <div className="text-xs text-error-500 mt-2">{formError}</div>}
            {successMsg && <div className="text-xs text-success-600 mt-2">{successMsg}</div>}
          </div>
          <div className="flex justify-end gap-3">
            <button className="px-6 py-2 rounded bg-gray-100 text-gray-700 font-medium" onClick={onClose}>Cancel</button>
            <button
              className={`px-6 py-2 rounded bg-brand-500 text-white font-medium ${formLoading || !isFormValid ? 'opacity-60 cursor-not-allowed' : ''}`}
              type="button"
              onClick={handleAnalyse}
              disabled={formLoading || !isFormValid}
            >
              {formLoading ? "Analysing..." : "Analyse"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
} 