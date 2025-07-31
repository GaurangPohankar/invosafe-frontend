interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  lender_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  lender_id: number;
}

interface UpdateUserStatusRequest {
  status: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const userApi = {
  async getUserById(userId: number): Promise<User> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch user');
    }
    return await response.json();
  },

  async createUser(userData: CreateUserRequest): Promise<User> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    const response = await fetch(`${API_BASE_URL}/user/`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create user');
    }
    return await response.json();
  },

  async getUsersByStatus(status?: string): Promise<User[]> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    
    const lenderId = localStorage.getItem('lender_id');
    if (!lenderId) {
      throw new Error('No lender ID found');
    }

    let url = `${API_BASE_URL}/user/?role=USER&lender_id=${lenderId}`;
    if (status) {
      url += `&status=${status}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch users');
    }
    return await response.json();
  },

  async updateUserStatus(userId: number, status: string): Promise<User> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to update user status');
    }
    return await response.json();
  },

  async deleteUser(userId: number): Promise<void> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to delete user');
    }
  },
}; 