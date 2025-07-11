interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  email: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authenticationApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    formData.append('scope', '');
    formData.append('client_id', 'string');
    formData.append('client_secret', 'string');

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data: LoginResponse = await response.json();
    
    // Store authentication data in localStorage
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('token_type', data.token_type);
    localStorage.setItem('user_id', data.user_id.toString());
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', data.role);
    
    return data;
  },

  logout(): void {
    // Clear authentication data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  },

  getStoredAuthData(): {
    access_token: string | null;
    token_type: string | null;
    user_id: number | null;
    email: string | null;
    role: string | null;
  } {
    return {
      access_token: localStorage.getItem('access_token'),
      token_type: localStorage.getItem('token_type'),
      user_id: localStorage.getItem('user_id') ? parseInt(localStorage.getItem('user_id')!) : null,
      email: localStorage.getItem('email'),
      role: localStorage.getItem('role'),
    };
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  getUserRole(): string | null {
    return localStorage.getItem('role');
  },
}; 