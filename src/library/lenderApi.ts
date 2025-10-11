const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Lender {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CreateLenderRequest {
  name: string;
}

interface UpdateLenderRequest {
  name: string;
}

export const lenderApi = {
  async getLenders(): Promise<Lender[]> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token found');
    
    const response = await fetch(`${API_BASE_URL}/lender/`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch lenders');
    }
    
    return await response.json();
  },

  async createLender(data: CreateLenderRequest): Promise<Lender> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token found');
    
    const response = await fetch(`${API_BASE_URL}/lender/`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create lender');
    }
    
    return await response.json();
  },

  async updateLender(id: number, data: UpdateLenderRequest): Promise<string> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token found');
    
    const response = await fetch(`${API_BASE_URL}/lender/${id}`, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to update lender');
    }
    
    return await response.json();
  },
};

