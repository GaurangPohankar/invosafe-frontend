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

interface PasswordResetRequest {
  email: string;
}

interface PasswordResetVerify {
  email: string;
  otp: string;
  new_password: string;
}

interface PasswordResetResponse {
  message: string;
  success: boolean;
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

  async logout(): Promise<void> {
    const accessToken = localStorage.getItem('access_token');
    
    // Revoke the access token if it exists
    if (accessToken && API_BASE_URL) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        // Continue with logout even if revoke fails
        console.error('Failed to revoke token:', error);
      }
    }
    
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

  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    const response = await fetch(`${API_BASE_URL}/password-reset/request`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to send password reset email');
    }

    return response.json();
  },

  async verifyPasswordReset(email: string, otp: string, newPassword: string): Promise<PasswordResetResponse> {
    const response = await fetch(`${API_BASE_URL}/password-reset/verify`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        otp,
        new_password: newPassword,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to reset password');
    }

    return response.json();
  },
}; 