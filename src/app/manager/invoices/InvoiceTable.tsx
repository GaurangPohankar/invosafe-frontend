"use client";
import React, { useState, useEffect } from "react";
import Badge from "@/components/ui/badge/Badge";
import { MoreDotIcon, EyeIcon, DollarLineIcon, EyeCloseIcon, TrashBinIcon, EmptyInvoiceIcon } from "@/icons/index";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import InvoiceDetailsModal from "./InvoiceDetailsModal";
import MarkAsFinancedModal from "./MarkAsFinancedModal";
import RejectFinanceModal from "./RejectFinanceModal";
import DeleteInvoiceModal from "./DeleteInvoiceModal";
import MarkAsRepaidModal from "./MarkAsRepaidModal";
import { invoiceApi } from "@/library/invoiceApi";
import { authenticationApi } from "@/library/authenticationApi";
import Image from "next/image";

interface Invoice {
  id: number;
  user_id: number;
  invoice_id: string;
  lender_id: number;
  tax_amount: number;
  purchase_order_number: string;
  lorry_receipt: string;
  eway_bill: string;
  seller_pan: string;
  buyer_pan: string;
  status: number;
  created_at: string;
  updated_at: string;
}

const STATUS_MAP = {
  0: { label: "Searched", color: "warning" },
  1: { label: "Financed", color: "success" },
  2: { label: "Rejected", color: "error" },
  3: { label: "Repaid", color: "info" },
  4: { label: "Trash", color: "dark" },
} as const;

const TABS = [
  { label: "All", status: null },
  { label: "Searched", status: 0 },
  { label: "Financed", status: 1 },
  { label: "Rejected", status: 2 },
  { label: "Repaid", status: 3 },
  { label: "Trash", status: 4 },
];

export default function InvoiceTable() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [financeModalOpen, setFinanceModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [repaidModalOpen, setRepaidModalOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch invoices on mount and when activeTab changes
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const userDetails = authenticationApi.getUserDetails();
        const lenderId = userDetails.lender_id;
        if (!lenderId) {
          setError('No lender ID found for the current user.');
          setInvoices([]);
          setLoading(false);
          return;
        }
        // Find the status for the active tab
        const tab = TABS.find(t => t.label === activeTab);
        let statusParam = tab && tab.status !== null ? tab.status.toString() : undefined;
        const urlParams = statusParam ? `?status=${statusParam}` : '';
        const fetchedInvoices = await fetchInvoicesByLenderAndStatus(lenderId, statusParam);
        setInvoices(fetchedInvoices);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch invoices:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [activeTab]);

  // Helper to fetch invoices by lender and status
  async function fetchInvoicesByLenderAndStatus(lenderId: number, status?: string) {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token found');
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoice/lender/${lenderId}`;
    if (status !== undefined) url += `?status=${status}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch invoices');
    }
    return await response.json();
  }

  // Filter logic based on search
  const filteredData = invoices.filter(row => {
    if (search && !row.invoice_id?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const isEmpty = filteredData.length === 0;

  const handleView = (invoice: any) => {
    setSelectedInvoice(invoice);
    setModalOpen(true);
    setOpenDropdown(null);
  };

  const handleMarkAsFinanced = (invoice: any) => {
    setSelectedInvoice(invoice);
    setFinanceModalOpen(true);
    setOpenDropdown(null);
  };

  const handleRejectFinance = (invoice: any) => {
    setSelectedInvoice(invoice);
    setRejectModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDeleteInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setDeleteModalOpen(true);
    setOpenDropdown(null);
  };

  const handleMarkAsRepaid = (invoice: any) => {
    setSelectedInvoice(invoice);
    setRepaidModalOpen(true);
    setOpenDropdown(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-0 min-h-[500px] flex flex-col">
        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-4 pb-4 border-b border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`relative px-3 py-1.5 font-medium text-sm focus:outline-none transition-colors
                ${activeTab === tab.label
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900"}
              `}
              style={{ background: "none" }}
            >
              {tab.label}
              {activeTab === tab.label && (
                <span className="absolute left-0 -bottom-2 w-full h-1 bg-gray-900 rounded-t" />
              )}
            </button>
          ))}
        </div>
        {/* Loading, Error, Empty State, or Table */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-16">
            <div className="text-gray-500">Loading invoices...</div>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16">
            <div className="text-red-500 text-center text-base font-medium max-w-md mb-4">
              {error}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
            >
              Retry
            </button>
          </div>
        ) : isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16">
            <div className=" border-brand-300 rounded-lg p-8 bg-white mb-6 flex flex-col items-center">
              {/* Use the provided SVG illustration */}
              <EmptyInvoiceIcon className="mb-4" />
            </div>
            <div className="text-gray-700 text-center text-base font-medium max-w-md">
              You currently don't have any invoices. Add your first invoice from Add invoices.
            </div>
          </div>
        ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {/* Remove checkbox column */}
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Unique ID</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Buyer</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Seller</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Invoice No.</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Invoice Date</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Invoice Amount</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Date & Time</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    {/* Remove checkbox cell */}
                    <td className="px-6 py-4 font-medium text-gray-900">{row.invoice_id}</td>
                    <td className="px-6 py-4">{row.buyer_pan || '-'}</td>
                    <td className="px-6 py-4">{row.seller_pan || '-'}</td>
                    <td className="px-6 py-4">{row.purchase_order_number || '-'}</td>
                    <td className="px-6 py-4">{new Date(row.created_at).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}</td>
                    <td className="px-6 py-4">₹{row.tax_amount?.toLocaleString('en-IN') || '0'}</td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant="light" 
                        color={STATUS_MAP[row.status as keyof typeof STATUS_MAP]?.color || 'warning'} 
                        size="sm"
                      >
                        {STATUS_MAP[row.status as keyof typeof STATUS_MAP]?.label || row.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">{new Date(row.created_at).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</td>
                    <td className="px-6 py-4 text-center relative">
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 dropdown-toggle"
                        onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                      >
                        <MoreDotIcon className="w-5 h-5 text-gray-500" /> 
                      </button>
                      <Dropdown
                        isOpen={openDropdown === idx}
                        onClose={() => setOpenDropdown(null)}
                        className="w-48 p-2 mt-2 -top-2"
                      >
                        <DropdownItem onItemClick={() => handleView(row)} className="flex items-center gap-2 text-gray-700 hover:text-brand-600">
                          <EyeIcon className="w-5 h-5" /> View
                        </DropdownItem>
                        {/* Mark as Financed: hide if status is 1 */}
                        {Number(row.status) !== 1 && (
                          <DropdownItem onItemClick={() => handleMarkAsFinanced(row)} className="flex items-center gap-2 text-gray-700 hover:text-success-600">
                            <DollarLineIcon className="w-5 h-5" /> Mark as Financed
                          </DropdownItem>
                        )}
                        {/* Reject Finance: hide if status is 2 */}
                        {Number(row.status) !== 2 && (
                          <DropdownItem onItemClick={() => handleRejectFinance(row)} className="flex items-center gap-2 text-gray-700 hover:text-error-600">
                            <EyeCloseIcon className="w-5 h-5" /> Reject Finance
                          </DropdownItem>
                        )}
                        {/* Mark as Repaid: hide if status is 3 */}
                        {Number(row.status) !== 3 && (
                          <DropdownItem onItemClick={() => handleMarkAsRepaid(row)} className="flex items-center gap-2 text-gray-700 hover:text-info-600">
                            <DollarLineIcon className="w-5 h-5" /> Mark as Repaid
                          </DropdownItem>
                        )}
                        {/* Delete Invoice: hide if status is 4 */}
                        {Number(row.status) !== 4 && (
                          <DropdownItem onItemClick={() => handleDeleteInvoice(row)} className="flex items-center gap-2 text-gray-700 hover:text-error-600">
                            <TrashBinIcon className="w-5 h-5" /> Delete Invoice
                          </DropdownItem>
                        )}
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        )}
      </div>
      <InvoiceDetailsModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        invoice={selectedInvoice}
        onMarkAsFinanced={() => setFinanceModalOpen(true)}
        onRejectFinance={() => setRejectModalOpen(true)}
      />
      <MarkAsFinancedModal 
        open={financeModalOpen} 
        onClose={() => setFinanceModalOpen(false)} 
        invoice={selectedInvoice}
      />
      <RejectFinanceModal 
        open={rejectModalOpen} 
        onClose={() => setRejectModalOpen(false)} 
        invoice={selectedInvoice}
        onSubmit={() => setRejectModalOpen(false)}
      />
      <DeleteInvoiceModal 
        open={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        invoice={selectedInvoice}
        onDelete={() => setDeleteModalOpen(false)}
      />
      <MarkAsRepaidModal
        open={repaidModalOpen}
        onClose={() => setRepaidModalOpen(false)}
        invoice={selectedInvoice}
      />
    </>
  );
} 