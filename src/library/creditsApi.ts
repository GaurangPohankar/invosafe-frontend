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

interface CreateUpdateCreditsRequest {
  lender_id: number;
  total_credits: number;
  used_credits: number;
}

interface CreateTransactionRequest {
  lender_id: number;
  description: string;
  credits_change: number;
  balance_after: number;
  transaction_type: 'purchase' | 'usage' | 'billing';
  status?: string;
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
    
    // First, get current credits to calculate new total
    const currentCredits = await this.getApiCredits();
    const newTotalCredits = currentCredits.total_credits + purchaseData.credits_amount;
    
    // Create or update credits record
    const creditsResponse = await fetch(`${API_BASE_URL}/api-credit/`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lender_id: purchaseData.lender_id,
        total_credits: newTotalCredits,
        used_credits: currentCredits.used_credits,
      }),
    });
    if (!creditsResponse.ok) {
      const errorData = await creditsResponse.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to purchase credits');
    }
    
    const updatedCredits = await creditsResponse.json();
    
    // Create transaction record
    const transactionResponse = await fetch(`${API_BASE_URL}/transactions/`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lender_id: purchaseData.lender_id,
        description: purchaseData.description || `Credit purchase of ${purchaseData.credits_amount} credits`,
        credits_change: purchaseData.credits_amount,
        balance_after: updatedCredits.available_credits,
        transaction_type: 'purchase',
        status: 'active',
      }),
    });
    
    let transaction: Transaction;
    if (transactionResponse.ok) {
      transaction = await transactionResponse.json();
    } else {
      // If transaction creation fails, create a mock transaction
      console.warn('Failed to create transaction record:', await transactionResponse.text());
      transaction = {
        id: Date.now(), // Temporary ID
        lender_id: purchaseData.lender_id,
        description: purchaseData.description || `Credit purchase of ${purchaseData.credits_amount} credits`,
        credits_change: purchaseData.credits_amount,
        balance_after: updatedCredits.available_credits,
        transaction_type: 'purchase',
        status: 'active',
        created_at: new Date().toISOString(),
      };
    }
    
    return {
      credits: updatedCredits,
      transaction: transaction,
    };
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

  async createOrUpdateCredits(creditsData: CreateUpdateCreditsRequest): Promise<ApiCredits> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    const response = await fetch(`${API_BASE_URL}/api-credit/`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creditsData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create or update credits');
    }
    return await response.json();
  },

  async createTransaction(transactionData: CreateTransactionRequest): Promise<Transaction> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    const response = await fetch(`${API_BASE_URL}/transactions/`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create transaction');
    }
    return await response.json();
  },
}; 