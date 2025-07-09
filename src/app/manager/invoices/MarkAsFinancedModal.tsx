"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";

interface MarkAsFinancedModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export default function MarkAsFinancedModal({ open, onClose, onSubmit }: MarkAsFinancedModalProps) {
  const [form, setForm] = useState({
    loanAmount: "",
    rateOfInterest: "",
    disbursementAmount: "",
    disbursementDate: "",
    creditPeriod: "",
    dueDate: "",
  });

  const isValid = form.loanAmount && form.rateOfInterest && form.disbursementAmount && form.disbursementDate && form.creditPeriod && form.dueDate;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && onSubmit) onSubmit(form);
  };

  return (
    <Modal isOpen={open} onClose={onClose} showCloseButton={true} className="max-w-xl w-full rounded-2xl">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Mark Invoice as Financed</h2>
        <p className="text-gray-500 text-sm mb-6">Please provide us with few details of the invoice.</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount*</label>
            <input name="loanAmount" value={form.loanAmount} onChange={handleChange} placeholder="Enter disbursement amount" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rate of Interest</label>
            <input name="rateOfInterest" value={form.rateOfInterest} onChange={handleChange} placeholder="Enter disbursement amount" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disbursement Amount</label>
            <input name="disbursementAmount" value={form.disbursementAmount} onChange={handleChange} placeholder="Enter disbursement amount" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disbursement Date</label>
            <input name="disbursementDate" value={form.disbursementDate} onChange={handleChange} placeholder="Enter disbursement date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credit Period</label>
            <input name="creditPeriod" value={form.creditPeriod} onChange={handleChange} placeholder="Enter credit period" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input name="dueDate" value={form.dueDate} onChange={handleChange} placeholder="Enter due date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
        </div>
        <button type="submit" disabled={!isValid} className="w-full py-3 rounded-lg bg-gray-200 text-gray-500 font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed bg-brand-500 text-white hover:bg-brand-600 transition disabled:bg-gray-200 disabled:text-gray-500">
          Mark as Financed
        </button>
      </form>
    </Modal>
  );
} 