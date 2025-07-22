const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const businessApi = {
  async getGstListByPan(pan: string) {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token found');
    const response = await fetch(`${API_BASE_URL}/business/gst-list`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pan }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch GST list');
    }
    return await response.json();
  },
  async getBusinessInfoByGst(gst: string) {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token found');
    const response = await fetch(`${API_BASE_URL}/business-gst/business-info`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gst }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch business info');
    }
    return await response.json();
  },
}; 