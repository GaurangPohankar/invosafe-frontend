interface ApiClient {
  id: number;
  lender_id: number;
  name: string;
  api_key: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CreateApiClientRequest {
  lender_id: number;
  name: string;
  api_key: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiClientApi = {
  async getApiClients(): Promise<ApiClient[]> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    
    const lenderId = localStorage.getItem('lender_id');
    if (!lenderId) {
      throw new Error('No lender ID found');
    }

    const response = await fetch(`${API_BASE_URL}/api-client/?lender_id=${lenderId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch API clients');
    }
    return await response.json();
  },

  async createApiClient(clientData: CreateApiClientRequest): Promise<ApiClient> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    const response = await fetch(`${API_BASE_URL}/api-client/`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create API client');
    }
    return await response.json();
  },

  async deleteApiClient(clientId: number): Promise<void> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    const response = await fetch(`${API_BASE_URL}/api-client/${clientId}`, {
      method: 'DELETE',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to delete API client');
    }
  },
}; 