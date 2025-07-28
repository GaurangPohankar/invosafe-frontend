import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "@/components/ui/modal";
import { DollarLineIcon, EyeCloseIcon, UploadIcon } from "@/icons/index";
import { invoiceApi } from "@/library/invoiceApi";
import { authenticationApi } from "@/library/authenticationApi";

interface Invoice {
  id: number;
  invoice_id: string;
  status: number;
  loan_amount?: string;
  interest_rate?: string;
  disbursement_amount?: string;
  disbursement_date?: string;
  credit_period?: string;
  due_date?: string;
}

interface CSVRow {
  invoice_id: string;
  loan_amount?: string;
  interest_rate?: string;
  disbursement_amount?: string;
  disbursement_date?: string;
  credit_period?: string;
  due_date?: string;
}

interface BulkUpdateModalProps {
  open: boolean;
  onClose: () => void;
  currentTab: string;
  onSubmit: () => void;
}

const STATUS_MAP = {
  0: { label: "Searched", color: "warning" },
  1: { label: "Financed", color: "success" },
  2: { label: "Rejected", color: "error" },
  3: { label: "Repaid", color: "info" },
} as const;

export default function BulkUpdateModal({ 
  open, 
  onClose, 
  currentTab,
  onSubmit 
}: BulkUpdateModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'form' | 'processing' | 'results'>('form');
  const [results, setResults] = useState<Array<{ invoice_id: string; status: 'success' | 'error'; message: string }>>([]);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [updateType, setUpdateType] = useState<'finance' | 'reject' | 'repaid'>('finance');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setCurrentStep('form');
      setUpdateProgress(0);
      setResults([]);
      setCsvData([]);
      setSelectedFile(null);
      
      // Set update type based on current tab
      if (currentTab === 'Searched') {
        setUpdateType('finance');
      } else if (currentTab === 'Financed') {
        setUpdateType('repaid');
      } else if (currentTab === 'Rejected') {
        setUpdateType('repaid');
      } else if (currentTab === 'Repaid') {
        setUpdateType('finance');
      } else {
        setUpdateType('finance');
      }
    }
  }, [open, currentTab]);

  // Parse CSV file
  const parseCSV = (file: File): Promise<CSVRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim());
          
          // Check if this is a full export format (has all fields) or just update format
          const isFullExport = headers.includes('status') && headers.length > 7;
          
          let expectedHeaders: string[] = ['invoice_id'];
          
          if (updateType === 'finance') {
            if (isFullExport) {
              // For full export format, we need to find the financing fields
              expectedHeaders = ['invoice_id', 'loan_amount', 'interest_rate', 'disbursement_amount', 'disbursement_date', 'credit_period', 'due_date'];
            } else {
              expectedHeaders = ['invoice_id', 'loan_amount', 'interest_rate', 'disbursement_amount', 'disbursement_date', 'credit_period', 'due_date'];
            }
          } 

          if (!expectedHeaders.every(header => headers.includes(header))) {
            reject(new Error(`Invalid CSV format. Expected headers: ${expectedHeaders.join(', ')}`));
            return;
          }

          const data: CSVRow[] = [];
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length >= headers.length) {
              const row: CSVRow = {
                invoice_id: values[0]
              };
              
              if (updateType === 'finance') {
                if (isFullExport) {
                  // For full export format, find the financing fields by their position
                  const loanAmountIndex = headers.indexOf('loan_amount');
                  const interestRateIndex = headers.indexOf('interest_rate');
                  const disbursementAmountIndex = headers.indexOf('disbursement_amount');
                  const disbursementDateIndex = headers.indexOf('disbursement_date');
                  const creditPeriodIndex = headers.indexOf('credit_period');
                  const dueDateIndex = headers.indexOf('due_date');
                  
                  row.loan_amount = values[loanAmountIndex] || '';
                  row.interest_rate = values[interestRateIndex] || '';
                  row.disbursement_amount = values[disbursementAmountIndex] || '';
                  row.disbursement_date = values[disbursementDateIndex] || '';
                  row.credit_period = values[creditPeriodIndex] || '';
                  row.due_date = values[dueDateIndex] || '';
                } else {
                  // For simple update format
                  row.loan_amount = values[1] || '';
                  row.interest_rate = values[2] || '';
                  row.disbursement_amount = values[3] || '';
                  row.disbursement_date = values[4] || '';
                  row.credit_period = values[5] || '';
                  row.due_date = values[6] || '';
                }
              } else if (updateType === 'repaid') {
                if (isFullExport) {
                  const dueDateIndex = headers.indexOf('due_date');
                  row.due_date = values[dueDateIndex] || '';
                } else {
                  row.due_date = values[1] || '';
                }
              }
              
              data.push(row);
            }
          }
          resolve(data);
        } catch (error) {
          reject(new Error('Failed to parse CSV file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // Validate CSV data
  const validateCSVData = (data: CSVRow[]): string | null => {
    if (data.length === 0) {
      return 'CSV file is empty';
    }

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      if (!row.invoice_id.trim()) {
        return `Row ${i + 2}: Invoice ID is required`;
      }

      if (updateType === 'finance') {
        if (!row.loan_amount || isNaN(Number(row.loan_amount)) || Number(row.loan_amount) <= 0) {
          return `Row ${i + 2}: Invalid loan amount`;
        }
        if (!row.interest_rate || isNaN(Number(row.interest_rate)) || Number(row.interest_rate) < 0) {
          return `Row ${i + 2}: Invalid interest rate`;
        }
        if (!row.disbursement_amount || isNaN(Number(row.disbursement_amount)) || Number(row.disbursement_amount) <= 0) {
          return `Row ${i + 2}: Invalid disbursement amount`;
        }
        if (!row.disbursement_date) {
          return `Row ${i + 2}: Disbursement date is required`;
        }
        if (!row.credit_period || isNaN(Number(row.credit_period)) || Number(row.credit_period) <= 0) {
          return `Row ${i + 2}: Invalid credit period`;
        }
        if (!row.due_date) {
          return `Row ${i + 2}: Due date is required`;
        }
      } else if (updateType === 'repaid') {
        if (!row.due_date) {
          return `Row ${i + 2}: Due date is required`;
        }
      }
    }
    
    return null;
  };

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  // Handle file selection
  const handleFileSelect = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setSelectedFile(file);
    try {
      const data = await parseCSV(file);
      setCsvData(data);
    } catch (error: any) {
      alert(error.message);
      setSelectedFile(null);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Process bulk update
  const handleSubmit = async () => {
    if (!selectedFile || csvData.length === 0) {
      alert('Please upload a CSV file first');
      return;
    }

    const validationError = validateCSVData(csvData);
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsProcessing(true);
    setCurrentStep('processing');

    const results: Array<{ invoice_id: string; status: 'success' | 'error'; message: string }> = [];
    
    // Get user details to fetch all invoices for the lender
    const userDetails = authenticationApi.getUserDetails();
    const lenderId = userDetails.lender_id;
    
    if (!lenderId) {
      results.push({
        invoice_id: 'System',
        status: 'error',
        message: 'No lender ID found for the current user.'
      });
      setResults(results);
      setCurrentStep('results');
      setIsProcessing(false);
      return;
    }

    // Fetch all invoices for the current lender
    let allInvoices: any[] = [];
    try {
      allInvoices = await invoiceApi.getInvoicesByLenderId(lenderId);
    } catch (error: any) {
      results.push({
        invoice_id: 'System',
        status: 'error',
        message: error.message || 'Failed to fetch invoices'
      });
      setResults(results);
      setCurrentStep('results');
      setIsProcessing(false);
      return;
    }
    
    for (let i = 0; i < csvData.length; i++) {
      const progress = ((i + 1) / csvData.length) * 100;
      setUpdateProgress(progress);
      
      const row = csvData[i];
      
      // Find the invoice in all invoices
      const invoice = allInvoices.find(inv => inv.invoice_id === row.invoice_id);
      if (!invoice) {
        results.push({
          invoice_id: row.invoice_id,
          status: 'error',
          message: 'Invoice not found'
        });
        continue;
      }

      // Prepare update data
      const updateData: any = {};

      if (updateType === 'finance') {
        updateData.status = 1; // Financed
        updateData.loan_amount = row.loan_amount;
        updateData.interest_rate = row.interest_rate;
        updateData.disbursement_amount = row.disbursement_amount;
        updateData.disbursement_date = row.disbursement_date;
        updateData.credit_period = row.credit_period;
        updateData.due_date = row.due_date;
      } else if (updateType === 'repaid') {
        updateData.status = 3; // Repaid
        updateData.due_date = row.due_date;
      } else if (updateType === 'reject') {
        updateData.status = 2; // Rejected
      }

      // Add invoice_id to the update data if the API expects it
      updateData.invoice_id = row.invoice_id;

      try {
        await invoiceApi.updateInvoice(invoice.invoice_id, updateData);
        
        results.push({
          invoice_id: row.invoice_id,
          status: 'success',
          message: `Successfully updated to ${STATUS_MAP[updateData.status as keyof typeof STATUS_MAP]?.label}`
        });
      } catch (error: any) {
        // Handle error messages more gracefully
        let errorMessage = 'Failed to update invoice';
        
        if (error.message) {
          // If it's already a formatted error message from the API
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error.detail) {
          // Handle structured error responses
          if (Array.isArray(error.detail)) {
            errorMessage = error.detail.map((err: any) => {
              if (err.msg) {
                return `${err.loc?.join('.') || 'Field'}: ${err.msg}`;
              }
              return err;
            }).join(', ');
          } else {
            errorMessage = error.detail;
          }
        }
        
        results.push({
          invoice_id: row.invoice_id,
          status: 'error',
          message: errorMessage
        });
      }
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setResults(results);
    setCurrentStep('results');
    setIsProcessing(false);
  };

  // Handle close
  const handleClose = () => {
    setCurrentStep('form');
    setUpdateProgress(0);
    setResults([]);
    setCsvData([]);
    setSelectedFile(null);
    setIsProcessing(false);
    onClose();
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  // Get expected CSV format based on update type
  const getExpectedFormat = () => {
    if (updateType === 'finance') {
      return 'invoice_id,loan_amount,interest_rate,disbursement_amount,disbursement_date,credit_period,due_date';
    } else {
      return 'invoice_id';
    }
  };

  return (
    <Modal isOpen={open} onClose={handleClose} className="max-w-2xl w-full rounded-2xl">
      <div className="bg-white rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-xl font-semibold">Bulk Update Invoices</h3>
          <div className="text-sm text-gray-500">
            Upload CSV to update invoices
          </div>
        </div>

        {currentStep === 'form' && (
          <div className="space-y-6">
            {/* Update Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Type
              </label>
              <select
                value={updateType}
                onChange={(e) => setUpdateType(e.target.value as 'finance' | 'reject' | 'repaid')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="finance">Mark as Financed</option>
                <option value="repaid">Mark as Repaid</option>
                <option value="reject">Mark as Rejected</option>
              </select>
            </div>

            {/* CSV Upload Area */}
            <div>
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Expected CSV Format:</div>
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
                  {getExpectedFormat()}
                </div>
                <div className="mt-2">
                  <a
                    href={
                      updateType === 'finance' ? '/sample-bulk-update-finance.csv' : 
                      updateType === 'repaid' ? '/sample-bulk-update-repaid.csv' :
                      updateType === 'reject' ? '/sample-bulk-update-reject.csv' :
                      '/sample-bulk-update-finance.csv'
                    }
                    download
                    className="inline-block px-3 py-1 rounded bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200 hover:bg-blue-100 hover:text-blue-800 transition"
                    style={{ textDecoration: 'none' }}
                  >
                    📥 Download sample CSV file
                  </a>
                </div>
              </div>

              <div 
                className="border border-dashed border-brand-200 rounded-lg p-8 flex flex-col items-center"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <UploadIcon className="w-16 h-16 text-brand-400" />
                <div className="font-semibold text-brand-600 text-lg mb-2">
                  Upload Update CSV
                </div>
                <div className="text-gray-500 mb-4">
                  Drag & drop CSV file or <span className="text-brand-500 underline cursor-pointer" onClick={() => fileInputRef.current?.click()}>Browse</span>
                </div>
                <div className="text-xs text-gray-400 mb-4">Supported format: CSV only</div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                
                <button 
                  className="bg-brand-500 text-white px-6 py-2 rounded font-medium"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </button>
              </div>

              {selectedFile && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{selectedFile.name}</div>
                      <div className="text-sm text-gray-500">
                        {csvData.length} rows found
                      </div>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => {
                        setSelectedFile(null);
                        setCsvData([]);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button 
                className="px-6 py-2 rounded bg-gray-100 text-gray-700 font-medium"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button 
                className={`px-6 py-2 rounded bg-brand-500 text-white font-medium ${
                  !selectedFile || csvData.length === 0 ? 'opacity-60 cursor-not-allowed' : 'hover:bg-brand-600'
                }`}
                onClick={handleSubmit}
                disabled={!selectedFile || csvData.length === 0}
                              >
                  Update Invoices
                </button>
            </div>
          </div>
        )}

        {currentStep === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <div className="text-lg font-medium text-gray-900 mb-2">Updating Invoices</div>
            <div className="text-gray-500 mb-4">
              Processing {csvData.length} invoices...
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${updateProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {Math.round(updateProgress)}% complete
            </div>
          </div>
        )}

        {currentStep === 'results' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Success: {successCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">Failed: {errorCount}</span>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-3 font-medium">Invoice ID</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="p-3 font-medium">{result.invoice_id}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          result.status === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.status === 'success' ? 'Success' : 'Failed'}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{result.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                className="px-6 py-2 rounded bg-gray-100 text-gray-700 font-medium"
                onClick={() => {
                  setCurrentStep('form');
                  setResults([]);
                }}
              >
                Update More
              </button>
              <button 
                className="px-6 py-2 rounded bg-brand-500 text-white font-medium"
                onClick={() => {
                  handleClose();
                  onSubmit();
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
} 