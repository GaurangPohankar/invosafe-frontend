import React, { useState, useRef, useCallback } from "react";
import { Modal } from "@/components/ui/modal";
import { UploadIcon } from "@/icons/index";
import { businessApi } from "@/library/businessApi";
import { invoiceApi } from "@/library/invoiceApi";
import { authenticationApi } from "@/library/authenticationApi";

interface CSVRow {
  invoice_id: string;
  seller_gst: string;
  buyer_gst: string;
  purchase_order_number: string;
  invoice_amount: string;
  tax_amount: string;
  lorry_receipt: string;
  eway_bill: string;
}

interface ValidationResult {
  row: number;
  invoice_id: string;
  status: 'success' | 'error';
  message: string;
  data?: any;
}

function isGSTIN(value: string) {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(value.trim());
}

export default function UploadInvoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [currentStep, setCurrentStep] = useState<'upload' | 'processing' | 'results'>('upload');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedFile, setProcessedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse CSV file
  const parseCSV = (file: File): Promise<CSVRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim());
          
          const expectedHeaders = [
            'invoice_id', 'seller_gst', 'buyer_gst', 
            'purchase_order_number', 'invoice_amount', 'tax_amount', 
            'lorry_receipt', 'eway_bill'
          ];

          if (!expectedHeaders.every(header => headers.includes(header))) {
            reject(new Error('Invalid CSV format. Please use the sample file as template.'));
            return;
          }

          const data: CSVRow[] = [];
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length === expectedHeaders.length) {
              data.push({
                invoice_id: values[0],
                seller_gst: values[1],
                buyer_gst: values[2],
                purchase_order_number: values[3],
                invoice_amount: values[4],
                tax_amount: values[5],
                lorry_receipt: values[6],
                eway_bill: values[7]
              });
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

  // Validate individual row
  const validateRow = async (row: CSVRow, rowIndex: number): Promise<ValidationResult> => {
    try {
      // Basic validation
      if (!row.invoice_id.trim()) {
        return {
          row: rowIndex + 1,
          invoice_id: row.invoice_id,
          status: 'error',
          message: 'Invoice ID is required'
        };
      }

      if (!row.seller_gst.trim()) {
        return {
          row: rowIndex + 1,
          invoice_id: row.invoice_id,
          status: 'error',
          message: 'Seller GST is required'
        };
      }

      if (!row.buyer_gst.trim()) {
        return {
          row: rowIndex + 1,
          invoice_id: row.invoice_id,
          status: 'error',
          message: 'Buyer GST is required'
        };
      }

      if (!row.invoice_amount || isNaN(Number(row.invoice_amount)) || Number(row.invoice_amount) <= 0) {
        return {
          row: rowIndex + 1,
          invoice_id: row.invoice_id,
          status: 'error',
          message: 'Invalid invoice amount'
        };
      }

      if (!row.tax_amount || isNaN(Number(row.tax_amount)) || Number(row.tax_amount) < 0) {
        return {
          row: rowIndex + 1,
          invoice_id: row.invoice_id,
          status: 'error',
          message: 'Invalid tax amount'
        };
      }

      // Validate seller GST
      let sellerBusiness = null;
      let sellerGST = '';
      
      if (isGSTIN(row.seller_gst)) {
        sellerBusiness = await businessApi.getBusinessInfoByGst(row.seller_gst.trim());
        sellerGST = row.seller_gst.trim();
      } else {
        return {
          row: rowIndex + 1,
          invoice_id: row.invoice_id,
          status: 'error',
          message: 'Invalid seller GST format'
        };
      }

      // Validate buyer GST
      let buyerBusiness = null;
      let buyerGST = '';
      
      if (isGSTIN(row.buyer_gst)) {
        buyerBusiness = await businessApi.getBusinessInfoByGst(row.buyer_gst.trim());
        buyerGST = row.buyer_gst.trim();
      } else {
        return {
          row: rowIndex + 1,
          invoice_id: row.invoice_id,
          status: 'error',
          message: 'Invalid buyer GST format'
        };
      }

      // Check for duplicate invoice
      const accessToken = localStorage.getItem('access_token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const checkRes = await fetch(`${API_BASE_URL}/invoice/?invoice_id=${encodeURIComponent(row.invoice_id)}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (checkRes.ok) {
        const data = await checkRes.json();
        if (Array.isArray(data) && data.length > 0) {
          return {
            row: rowIndex + 1,
            invoice_id: row.invoice_id,
            status: 'error',
            message: 'Invoice ID already exists'
          };
        }
      }

      // Get user details
      const userDetails = authenticationApi.getUserDetails();
      if (!userDetails.user_id || !userDetails.lender_id) {
        return {
          row: rowIndex + 1,
          invoice_id: row.invoice_id,
          status: 'error',
          message: 'User or lender information missing'
        };
      }

      // Create invoice
      const invoiceData = {
        invoice_id: row.invoice_id.trim(),
        seller_id: sellerBusiness.id,
        seller_gst: sellerGST,
        buyer_id: buyerBusiness.id,
        buyer_gst: buyerGST,
        purchase_order_number: row.purchase_order_number,
        lorry_receipt: row.lorry_receipt,
        eway_bill: row.eway_bill,
        invoice_amount: Number(row.invoice_amount),
        tax_amount: Number(row.tax_amount),
        user_id: userDetails.user_id,
        lender_id: userDetails.lender_id,
      };

      const createdInvoice = await invoiceApi.createInvoice(invoiceData);

      return {
        row: rowIndex + 1,
        invoice_id: row.invoice_id,
        status: 'success',
        message: 'Invoice created successfully',
        data: createdInvoice
      };

    } catch (error: any) {
      return {
        row: rowIndex + 1,
        invoice_id: row.invoice_id,
        status: 'error',
        message: error.message || 'Failed to process invoice'
      };
    }
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
    setProcessedFile(null); // Reset processed file state for new file
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

  // Process CSV data
  const handleAnalyse = async () => {
    if (csvData.length === 0) {
      alert('Please upload a CSV file first');
      return;
    }

    setIsProcessing(true);
    setCurrentStep('processing');
    setValidationResults([]);

    const results: ValidationResult[] = [];
    
    for (let i = 0; i < csvData.length; i++) {
      const progress = ((i + 1) / csvData.length) * 100;
      setUploadProgress(progress);
      
      const result = await validateRow(csvData[i], i);
      results.push(result);
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setValidationResults(results);
    setCurrentStep('results');
    setIsProcessing(false);
    // Mark this file as processed
    if (selectedFile) {
      setProcessedFile(selectedFile.name);
    }
  };

  // Reset modal
  const handleClose = () => {
    setCsvData([]);
    setValidationResults([]);
    setCurrentStep('upload');
    setUploadProgress(0);
    setSelectedFile(null);
    setProcessedFile(null);
    setIsProcessing(false);
    onClose();
  };

  const successCount = validationResults.filter(r => r.status === 'success').length;
  const errorCount = validationResults.filter(r => r.status === 'error').length;

  return (
    <Modal isOpen={open} onClose={handleClose} className="max-w-4xl w-full rounded-2xl">
      <div className="bg-white rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-xl font-semibold">Upload Invoices</h3>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-3 py-1 text-sm font-medium">
            <span className="text-yellow-500">🪙</span>
            <span className="text-green-600 font-semibold">₹1500</span> Credits
          </div>
        </div>

        {currentStep === 'upload' && (
          <div className="pt-2 pb-6">
            <div className="mb-4">
              <a
                href="/sample-invoice.csv"
                download
                className="inline-block px-4 py-2 rounded bg-blue-50 text-blue-700 font-semibold text-sm border border-blue-200 hover:bg-blue-100 hover:text-blue-800 transition"
                style={{ textDecoration: 'none' }}
              >
                📥 Download sample CSV file
              </a>
            </div>

            <div 
              className="border border-dashed border-brand-200 rounded-lg p-8 flex flex-col items-center mb-6"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <UploadIcon className="w-16 h-16 text-brand-400 mb-4" />
              <div className="font-semibold text-brand-600 text-lg mb-2">
                Upload Invoice CSV
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
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      {selectedFile.name}
                      {processedFile === selectedFile.name && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          ✓ Processed
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {csvData.length} invoices found
                    </div>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setSelectedFile(null);
                      setCsvData([]);
                      setProcessedFile(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button className="px-6 py-2 rounded bg-gray-100 text-gray-700 font-medium" onClick={handleClose}>
                Cancel
              </button>
              <button 
                className={`px-6 py-2 rounded bg-brand-500 text-white font-medium ${
                  csvData.length === 0 || processedFile === selectedFile?.name ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                onClick={handleAnalyse}
                disabled={csvData.length === 0 || processedFile === selectedFile?.name}
              >
                {processedFile === selectedFile?.name ? 'Already Processed' : 'Analyse & Upload'}
              </button>
            </div>
          </div>
        )}

        {currentStep === 'processing' && (
          <div className="pt-2 pb-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
              <div className="text-lg font-medium text-gray-900 mb-2">Processing Invoices</div>
              <div className="text-gray-500 mb-4">
                Validating and uploading {csvData.length} invoices...
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {Math.round(uploadProgress)}% complete
              </div>
            </div>
          </div>
        )}

        {currentStep === 'results' && (
          <div className="pt-2 pb-6">
            <div className="mb-6">
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
                      <th className="text-left p-3 font-medium">Row</th>
                      <th className="text-left p-3 font-medium">Invoice ID</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validationResults.map((result, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="p-3">{result.row}</td>
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
            </div>

            <div className="flex justify-end gap-3">
              <button 
                className="px-6 py-2 rounded bg-gray-100 text-gray-700 font-medium"
                onClick={() => {
                  setCurrentStep('upload');
                  setCsvData([]);
                  setSelectedFile(null);
                  setProcessedFile(null);
                  setValidationResults([]);
                }}
              >
                Upload More
              </button>
              <button 
                className="px-6 py-2 rounded bg-brand-500 text-white font-medium"
                onClick={handleClose}
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