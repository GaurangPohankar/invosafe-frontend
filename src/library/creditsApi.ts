interface ApiCredits {
  id: number;
  lender_id: number;
  total_credits: number;
  used_credits: number;
  available_credits: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: number;
  lender_id: number;
  description: string;
  credits_change: number;
  balance_after: number;
  transaction_type: 'purchase' | 'usage' | 'billing';
  status: string;
  created_at: string;
}

interface PurchaseCreditsRequest {
  lender_id: number;
  credits_amount: number;
  description?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const creditsApi = {
  async getApiCredits(): Promise<ApiCredits> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    
    const lenderId = localStorage.getItem('lender_id');
    if (!lenderId) {
      throw new Error('No lender ID found');
    }

    const response = await fetch(`${API_BASE_URL}/api-credit/?lender_id=${lenderId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch API credits');
    }
    
    const data = await response.json();
    // If no credits record exists, return default values
    if (Array.isArray(data) && data.length === 0) {
      return {
        id: 0,
        lender_id: parseInt(lenderId),
        total_credits: 0,
        used_credits: 0,
        available_credits: 0,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    
    return Array.isArray(data) ? data[0] : data;
  },

  async purchaseCredits(purchaseData: PurchaseCreditsRequest): Promise<{ credits: ApiCredits; transaction: Transaction }> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    const response = await fetch(`${API_BASE_URL}/api-credit/purchase`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purchaseData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to purchase credits');
    }
    return await response.json();
  },

  async getTransactions(): Promise<Transaction[]> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    
    const lenderId = localStorage.getItem('lender_id');
    if (!lenderId) {
      throw new Error('No lender ID found');
    }

    const response = await fetch(`${API_BASE_URL}/transactions/?lender_id=${lenderId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch transactions');
    }
    return await response.json();
  },
}; 