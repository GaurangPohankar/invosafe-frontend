"use client";
import React, { useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import { MoreDotIcon, EyeIcon, DollarLineIcon, EyeCloseIcon, TrashBinIcon } from "@/icons/index";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import InvoiceDetailsModal from "./InvoiceDetailsModal";

const TABS = [
  { label: "All", count: 150, color: "light" },
  { label: "Searched", count: 200, color: "warning" },
  { label: "Financed", count: 150, color: "success" },
  { label: "Repaid", count: 50, color: "error" },
];

const TABLE_DATA = [
  {
    id: "ICV8993",
    buyer: "Tushar",
    seller: "Yash",
    invoiceNo: "24",
    invoiceDate: "24th Mar, 2025",
    invoiceAmount: "₹32,07,450.00",
    status: "Checked",
    dateTime: "24th Mar, 2025 10:30 AM",
  },
  // ... more rows (mocked for now)
  ...Array(8).fill({
    id: "ICV8993",
    buyer: "-",
    seller: "-",
    invoiceNo: "-",
    invoiceDate: "-",
    invoiceAmount: "-",
    status: "Checked",
    dateTime: "24th Mar, 2025 10:30 AM",
  }),
];

const STATUS_COLORS = {
  Checked: { variant: "light", color: "warning" },
  // Add more status mappings if needed
};

export default function InvoiceTable() {
  const [activeTab, setActiveTab] = useState("Searched");
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Filter logic can be added here based on activeTab and search
  const filteredData = TABLE_DATA.filter(row => {
    if (search && !row.id.toLowerCase().includes(search.toLowerCase())) return false;
    // Add more search logic as needed
    return true;
  });

  const handleView = (invoice: any) => {
    setSelectedInvoice(invoice);
    setModalOpen(true);
    setOpenDropdown(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-0 overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-2 px-6 pt-6">
          {TABS.map(tab => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`px-0.5 pb-2 border-b-2 font-medium text-sm flex items-center gap-1 transition-colors ${
                activeTab === tab.label
                  ?
                    tab.label === "Searched" ? "border-brand-500 text-brand-600" :
                    tab.label === "Financed" ? "border-success-500 text-success-600" :
                    tab.label === "Repaid" ? "border-error-500 text-error-600" :
                    "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500"
              }`}
            >
              {tab.label}
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                tab.label === "Searched" ? "bg-brand-100 text-brand-600" :
                tab.label === "Financed" ? "bg-success-100 text-success-600" :
                tab.label === "Repaid" ? "bg-error-100 text-error-600" :
                "bg-gray-100 text-gray-600"
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>
        {/* Search */}
        <div className="px-6 pt-4 pb-2">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500"><input type="checkbox" /></th>
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
                  <td className="px-4 py-4"><input type="checkbox" /></td>
                  <td className="px-6 py-4 font-medium text-gray-900">{row.id}</td>
                  <td className="px-6 py-4">{row.buyer}</td>
                  <td className="px-6 py-4">{row.seller}</td>
                  <td className="px-6 py-4">{row.invoiceNo}</td>
                  <td className="px-6 py-4">{row.invoiceDate}</td>
                  <td className="px-6 py-4">{row.invoiceAmount}</td>
                  <td className="px-6 py-4">
                    <Badge variant="light" color="warning" size="sm">Checked</Badge>
                  </td>
                  <td className="px-6 py-4">{row.dateTime}</td>
                  <td className="px-6 py-4 text-right relative">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 dropdown-toggle"
                      onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                    >
                      <MoreDotIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    <Dropdown
                      isOpen={openDropdown === idx}
                      onClose={() => setOpenDropdown(null)}
                      className="w-48 p-2 mt-2"
                    >
                      <DropdownItem onItemClick={() => handleView(row)} className="flex items-center gap-2 text-gray-700 hover:text-brand-600">
                        <EyeIcon className="w-5 h-5" /> View
                      </DropdownItem>
                      <DropdownItem onItemClick={() => setOpenDropdown(null)} className="flex items-center gap-2 text-gray-700 hover:text-success-600">
                        <DollarLineIcon className="w-5 h-5" /> Mark as Financed
                      </DropdownItem>
                      <DropdownItem onItemClick={() => setOpenDropdown(null)} className="flex items-center gap-2 text-gray-700 hover:text-error-600">
                        <EyeCloseIcon className="w-5 h-5" /> Reject Finance
                      </DropdownItem>
                      <DropdownItem onItemClick={() => setOpenDropdown(null)} className="flex items-center gap-2 text-gray-700 hover:text-error-600">
                        <TrashBinIcon className="w-5 h-5" /> Delete Invoice
                      </DropdownItem>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <InvoiceDetailsModal open={modalOpen} onClose={() => setModalOpen(false)} invoice={selectedInvoice} />
    </>
  );
} 