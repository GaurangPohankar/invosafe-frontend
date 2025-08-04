interface Invoice {
  id: number;
  user_id: number;
  invoice_id: string;
  lender_id: number;
  tax_amount: number;
  purchase_order_number: string;
  lorry_receipt: string;
  eway_bill: string;
  seller_id: number;
  seller_pan: string;
  seller_gst: string;
  buyer_id: number;
  buyer_pan: string;
  buyer_gst: string;
  status: number;
  created_at: string;
  updated_at: string;
  loan_amount?: string;
  interest_rate?: string;
  disbursement_amount?: string;
  disbursement_date?: string;
  credit_period?: string;
  due_date?: string;
  invoice_amount?: number;
}

interface InvoiceResponse {
  data: Invoice[];
  success: boolean;
  message?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const invoiceApi = {
  async getInvoicesByLenderId(lenderId: number): Promise<Invoice[]> {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/invoice/lender/${lenderId}`, {
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

    const data: Invoice[] = await response.json();
    return data;
  },

  async getInvoiceById(invoiceId: string): Promise<Invoice> {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/invoice/?invoice_id=${encodeURIComponent(invoiceId)}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch invoice');
    }

    const data: Invoice[] = await response.json();
    
    // Since the API returns a list, we need to get the first item
    if (data && data.length > 0) {
      return data[0];
    } else {
      throw new Error('Invoice not found');
    }
  },

  async createInvoice(invoiceData: Partial<Invoice>): Promise<Invoice> {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/invoice`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create invoice');
    }

    const data: Invoice = await response.json();
    return data;
  },

  async updateInvoice(invoiceId: string, invoiceData: Partial<Invoice>): Promise<Invoice> {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/invoice/invoice-id/${invoiceId}`, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle structured error responses
      if (errorData.detail && Array.isArray(errorData.detail)) {
        const errorMessages = errorData.detail.map((err: any) => {
          if (err.msg) {
            return `${err.loc?.join('.') || 'Field'}: ${err.msg}`;
          }
          return err;
        }).join(', ');
        throw new Error(errorMessages);
      } else if (errorData.detail) {
        throw new Error(errorData.detail);
      } else {
        throw new Error('Failed to update invoice');
      }
    }

    const data: Invoice = await response.json();
    return data;
  },

  async deleteInvoice(invoiceId: string): Promise<void> {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/invoice/${invoiceId}`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to delete invoice');
    }
  },

  async uploadInvoice(file: File): Promise<Invoice> {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/invoice/upload`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to upload invoice');
    }

    const data: Invoice = await response.json();
    return data;
  },

  async markAsFinanced(invoiceId: string): Promise<Invoice> {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/invoice/${invoiceId}/mark-financed`, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to mark invoice as financed');
    }

    const data: Invoice = await response.json();
    return data;
  },

  async rejectFinance(invoiceId: string, reason?: string): Promise<Invoice> {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/invoice/${invoiceId}/reject-finance`, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to reject finance');
    }

    const data: Invoice = await response.json();
    return data;
  },

  async checkInvoiceExists(invoiceId: string): Promise<boolean> {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/invoice/?invoice_id=${encodeURIComponent(invoiceId)}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to check invoice existence');
    }

    const data = await response.json();
    return Array.isArray(data) && data.length > 0;
  },
}; 