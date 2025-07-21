"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { EyeCloseIcon, DollarLineIcon } from "@/icons/index";
import Badge from "@/components/ui/badge/Badge";
const STATUS_MAP = {
  0: { label: "Searched", color: "warning" },
  1: { label: "Financed", color: "success" },
  2: { label: "Rejected", color: "error" },
  3: { label: "Repaid", color: "info" },
  4: { label: "Trash", color: "dark" },
} as const;

interface InvoiceDetailsModalProps {
  open: boolean;
  onClose: () => void;
  invoice: any | null;
  onMarkAsFinanced?: () => void;
  onRejectFinance?: () => void;
}

interface BusinessDetails {
  pan: string;
  name: string;
}

async function fetchBusinessDetails(pan: string, token: string): Promise<BusinessDetails | null> {
  if (!pan) return null;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/business/?pan=${pan}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) return null;
    const data = await response.json();
    // If API returns an array, take the first item
    if (Array.isArray(data) && data.length > 0) return data[0];
    return data;
  } catch {
    return null;
  }
}

export default function InvoiceDetailsModal({ open, onClose, invoice, onMarkAsFinanced, onRejectFinance }: InvoiceDetailsModalProps) {
  const [buyerBusiness, setBuyerBusiness] = useState<BusinessDetails | null>(null);
  const [sellerBusiness, setSellerBusiness] = useState<BusinessDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && invoice) {
      setLoading(true);
      setBuyerBusiness(null);
      setSellerBusiness(null);
      const token = localStorage.getItem('access_token') || '';
      Promise.all([
        fetchBusinessDetails(invoice.buyer_pan, token),
        fetchBusinessDetails(invoice.seller_pan, token),
      ]).then(([buyer, seller]) => {
        setBuyerBusiness(buyer);
        setSellerBusiness(seller);
        setLoading(false);
      });
    } else {
      setBuyerBusiness(null);
      setSellerBusiness(null);
    }
  }, [open, invoice]);

  if (!invoice) return null;
  const statusNum = Number(invoice.status);
  const showFinanceBox = [
    invoice.loan_amount,
    invoice.interest_rate,
    invoice.disbursement_amount,
    invoice.disbursement_date,
    invoice.credit_period,
    invoice.due_date,
  ].some(v => v !== null && v !== undefined && v !== "");

  return (
    <Modal isOpen={open} onClose={onClose} showCloseButton={true} className="!max-w-2xl !w-full !h-screen !rounded-none !fixed right-0 top-0 !p-0">
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Download Invoice</button>
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Send Invoice</button>
          </div>
        </div>
        {/* Title and Status */}
        <div className="px-8 pt-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Invoice ID - {invoice.invoice_id}</h2>
            <Badge variant="light" color={STATUS_MAP[statusNum as keyof typeof STATUS_MAP]?.color || 'warning'} size="md">
              {STATUS_MAP[statusNum as keyof typeof STATUS_MAP]?.label || invoice.status}
            </Badge>
          </div>
        </div>
        {/* Mark as Financed */}
        {statusNum !== 1 && statusNum !== 3 && (
          <div className="px-8 pt-2 pb-4">
            <div className="flex items-center gap-4 bg-success-50 border border-success-200 rounded-lg p-4 mb-4">
              <DollarLineIcon className="w-6 h-6 text-success-600" />
              <div className="flex-1">
                <div className="font-medium text-success-700">Mark Invoice as Financed</div>
                <div className="text-xs text-success-700">Give us few details above the financing details</div>
              </div>
              <button onClick={onMarkAsFinanced} className="px-4 py-2 rounded-lg bg-success-500 text-white font-medium text-sm hover:bg-success-600">Mark as Financed</button>
            </div>
          </div>
        )}
        {/* Details */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="mb-2 text-xs text-gray-500">Buyer PAN Number</div>
              <div className="font-semibold text-gray-900">{invoice.buyer_pan || '-'}</div>
              <div className="text-xs text-orange-600 bg-orange-50 rounded px-2 py-0.5 inline-block mt-1">
                {loading ? 'Loading...' : (buyerBusiness?.name || 'N/A')}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs text-gray-500">Seller PAN Number</div>
              <div className="font-semibold text-gray-900">{invoice.seller_pan || '-'}</div>
              <div className="text-xs text-orange-600 bg-orange-50 rounded px-2 py-0.5 inline-block mt-1">
                {loading ? 'Loading...' : (sellerBusiness?.name || 'N/A')}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs text-gray-500">User ID</div>
              <div className="font-semibold text-gray-900">{invoice.user_id}</div>
            </div>
            <div>
              <div className="mb-2 text-xs text-gray-500">Tax Amount</div>
              <div className="font-semibold text-gray-900">{invoice.tax_amount}</div>
            </div>
            <div>
              <div className="mb-2 text-xs text-gray-500">Purchase Order No.</div>
              <div className="font-semibold text-gray-900">{invoice.purchase_order_number}</div>
            </div>
            <div>
              <div className="mb-2 text-xs text-gray-500">Lorry Receipt</div>
              <div className="font-semibold text-gray-900">{invoice.lorry_receipt}</div>
            </div>
            <div>
              <div className="mb-2 text-xs text-gray-500">Eway Bill</div>
              <div className="font-semibold text-gray-900">{invoice.eway_bill}</div>
            </div>
            <div>
              <div className="mb-2 text-xs text-gray-500">Invoice Amount</div>
              <div className="font-semibold text-gray-900">₹{invoice.invoice_amount !== undefined ? Number(invoice.invoice_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '-'}</div>
            </div>
          </div>
          {/* Show finance fields if present */}
          {showFinanceBox && (
            <div className="mt-8 bg-success-50 border border-success-200 rounded-lg p-6">
              <div className="text-success-700 font-semibold mb-2">Financed Details</div>
              <div className="grid grid-cols-2 gap-4">
                {invoice.loan_amount && (
                  <div>
                    <div className="text-xs text-gray-500">Loan Amount</div>
                    <div className="font-semibold text-gray-900">{invoice.loan_amount}</div>
                  </div>
                )}
                {invoice.interest_rate && (
                  <div>
                    <div className="text-xs text-gray-500">Interest Rate</div>
                    <div className="font-semibold text-gray-900">{invoice.interest_rate}</div>
                  </div>
                )}
                {invoice.disbursement_amount && (
                  <div>
                    <div className="text-xs text-gray-500">Disbursement Amount</div>
                    <div className="font-semibold text-gray-900">{invoice.disbursement_amount}</div>
                  </div>
                )}
                {invoice.disbursement_date && (
                  <div>
                    <div className="text-xs text-gray-500">Disbursement Date</div>
                    <div className="font-semibold text-gray-900">{invoice.disbursement_date}</div>
                  </div>
                )}
                {invoice.credit_period && (
                  <div>
                    <div className="text-xs text-gray-500">Credit Period</div>
                    <div className="font-semibold text-gray-900">{invoice.credit_period}</div>
                  </div>
                )}
                {invoice.due_date && (
                  <div>
                    <div className="text-xs text-gray-500">Due Date</div>
                    <div className="font-semibold text-gray-900">{invoice.due_date}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-100 flex justify-end flex-shrink-0">
          {statusNum !== 2 && statusNum !== 3 && (
            <button onClick={onRejectFinance} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-error-50 text-error-600 font-medium text-sm hover:bg-error-100">
              <EyeCloseIcon className="w-5 h-5" /> Reject Finance
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
} 