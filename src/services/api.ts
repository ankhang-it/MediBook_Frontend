const API_BASE_URL = 'http://localhost:8000/api';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  error?: string;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  phone?: string;
  role: 'patient' | 'doctor' | 'admin';
}

export interface LoginResponse {
  user: User;
  profile?: any;
  token: string;
  token_type: string;
  expires_in: number;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  role: 'patient' | 'doctor';
  fullname: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  medical_history?: string;
  // Doctor specific fields
  specialty_id?: string;
  experience?: string;
  license_number?: string;
}

// API Service class
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Set token if login successful
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async register(data: RegisterData): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Set token if registration successful
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/logout', {
      method: 'POST',
    });
    
    if (response.success) {
      this.setToken(null);
    }
    
    return response;
  }

  async getMe(): Promise<ApiResponse<{ user: User; profile?: any }>> {
    return this.request<{ user: User; profile?: any }>('/me');
  }

  async refreshToken(): Promise<ApiResponse<{ token: string; token_type: string; expires_in: number }>> {
    return this.request<{ token: string; token_type: string; expires_in: number }>('/refresh', {
      method: 'POST',
    });
  }

  async updateProfile(data: Partial<RegisterData>): Promise<ApiResponse> {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    return this.request('/change-password', {
      method: 'PUT',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPassword,
      }),
    });
  }

  async uploadAvatar(file: File): Promise<ApiResponse<{ avatar_url: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.request<{ avatar_url: string }>('/upload-avatar', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, let browser set it with boundary for FormData
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  // Token management
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }
}

// Export singleton instance
export const apiService = new ApiService(API_BASE_URL);
export default apiService;
