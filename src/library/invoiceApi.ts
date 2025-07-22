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
  loan_amount?: string;
  interest_rate?: string;
  disbursement_amount?: string;
  disbursement_date?: string;
  credit_period?: string;
  due_date?: string;
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

    const response = await fetch(`${API_BASE_URL}/invoice/${invoiceId}`, {
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

    const data: Invoice = await response.json();
    return data;
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

    const response = await fetch(`${API_BASE_URL}/invoice/${invoiceId}`, {
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
      throw new Error(errorData.detail || 'Failed to update invoice');
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
}; 