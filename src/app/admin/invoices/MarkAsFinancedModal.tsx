"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { invoiceApi } from "@/library/invoiceApi";

interface MarkAsFinancedModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  invoice: any | null;
}

export default function MarkAsFinancedModal({ open, onClose, onSubmit, invoice }: MarkAsFinancedModalProps) {
  const [form, setForm] = useState({
    loanAmount: "",
    rateOfInterest: "",
    disbursementAmount: "",
    disbursementDate: "",
    creditPeriod: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function validate() {
    const errs: { [key: string]: string } = {};
    if (form.loanAmount && (isNaN(Number(form.loanAmount)) || Number(form.loanAmount) < 0)) {
      errs.loanAmount = "Enter a valid loan amount (>= 0)";
    }
    if (form.rateOfInterest && (isNaN(Number(form.rateOfInterest)) || Number(form.rateOfInterest) < 0)) {
      errs.rateOfInterest = "Enter a valid interest rate (>= 0)";
    }
    if (form.disbursementAmount && (isNaN(Number(form.disbursementAmount)) || Number(form.disbursementAmount) < 0)) {
      errs.disbursementAmount = "Enter a valid disbursement amount (>= 0)";
    }
    if (form.creditPeriod && (isNaN(Number(form.creditPeriod)) || Number(form.creditPeriod) < 0 || !Number.isInteger(Number(form.creditPeriod)))) {
      errs.creditPeriod = "Enter a valid credit period (integer >= 0)";
    }
    if (form.disbursementDate && isNaN(Date.parse(form.disbursementDate))) {
      errs.disbursementDate = "Enter a valid disbursement date";
    }
    if (form.dueDate && isNaN(Date.parse(form.dueDate))) {
      errs.dueDate = "Enter a valid due date";
    }
    if (form.disbursementDate && form.dueDate && form.dueDate < form.disbursementDate) {
      errs.dueDate = "Due date cannot be before disbursement date";
    }
    return errs;
  }

  const isValid = Object.keys(validate()).length === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setLoading(true);
    try {
      await invoiceApi.updateInvoiceById(invoice.id, {
        ...invoice,
        loan_amount: form.loanAmount,
        interest_rate: form.rateOfInterest,
        disbursement_amount: form.disbursementAmount,
        disbursement_date: form.disbursementDate,
        credit_period: form.creditPeriod,
        due_date: form.dueDate,
        status: 1,
      });
      if (onSubmit) onSubmit(form);
      onClose();
    } catch (err) {
      alert("Failed to mark as financed");
    } finally {
      setLoading(false);
    }
  };

  if (!invoice) return null;

  return (
    <Modal isOpen={open} onClose={onClose} showCloseButton={true} className="max-w-xl w-full rounded-2xl">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Mark Invoice as Financed</h2>
        <p className="text-gray-500 text-sm mb-6">Please provide us with few details of the invoice.</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount*</label>
            <input name="loanAmount" type="number" min="0" step="0.01" value={form.loanAmount} onChange={handleChange} placeholder="Enter loan amount" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
            {errors.loanAmount && <div className="text-xs text-error-500 mt-1">{errors.loanAmount}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rate of Interest (%)</label>
            <input name="rateOfInterest" type="number" min="0" max="100" step="0.01" value={form.rateOfInterest} onChange={handleChange} placeholder="Enter interest rate" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
            {errors.rateOfInterest && <div className="text-xs text-error-500 mt-1">{errors.rateOfInterest}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disbursement Amount</label>
            <input name="disbursementAmount" type="number" min="0" step="0.01" value={form.disbursementAmount} onChange={handleChange} placeholder="Enter disbursement amount" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
            {errors.disbursementAmount && <div className="text-xs text-error-500 mt-1">{errors.disbursementAmount}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disbursement Date</label>
            <input name="disbursementDate" type="date" value={form.disbursementDate} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
            {errors.disbursementDate && <div className="text-xs text-error-500 mt-1">{errors.disbursementDate}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credit Period (months)</label>
            <input name="creditPeriod" type="number" min="1" step="1" value={form.creditPeriod} onChange={handleChange} placeholder="Enter credit period" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
            {errors.creditPeriod && <div className="text-xs text-error-500 mt-1">{errors.creditPeriod}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
            {errors.dueDate && <div className="text-xs text-error-500 mt-1">{errors.dueDate}</div>}
          </div>
        </div>
        <button type="submit" disabled={!isValid || loading} className="w-full py-3 rounded-lg font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed bg-brand-500 text-white hover:bg-brand-600 transition disabled:bg-gray-200 disabled:text-gray-500">
          {loading ? "Marking..." : "Mark as Financed"}
        </button>
      </form>
    </Modal>
  );
} 