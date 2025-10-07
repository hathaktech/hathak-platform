import axios, { AxiosResponse } from 'axios';

// API configuration
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log API configuration for debugging
console.log('AdminAuthService API Configuration:', {
  baseURL: API.defaults.baseURL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
});

// Add token to requests
API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token expiration
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      console.log('Token expired, attempting auto-login...');
      
      // Try to auto-login with default admin credentials
      try {
        const loginResponse = await fetch('/api/admin/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'admin@hathak.com', password: 'admin123' })
        });
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          // Store new token
          localStorage.setItem('adminToken', loginData.token);
          
          // Retry the original request with new token
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${loginData.token}`;
          return API(originalRequest);
        } else {
          throw new Error('Auto-login failed');
        }
      } catch (loginError) {
        // Auto-login failed, redirect to login
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee' | 'worker';
  permissions: {
    userManagement: boolean;
    productManagement: boolean;
    orderManagement: boolean;
    financialAccess: boolean;
    systemSettings: boolean;
    analyticsAccess: boolean;
    canGrantPermissions: boolean;
    canCreateAdmins: boolean;
  };
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoginFormData {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  admin: Admin;
  token: string;
}

export interface AdminRegisterFormData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'employee' | 'worker';
  notes?: string;
}

export interface AdminUpdateData {
  permissions?: Partial<Admin['permissions']>;
  role?: Admin['role'];
  isActive?: boolean;
}

export class AdminAuthError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'AdminAuthError';
  }
}

// Admin authentication service
export const adminAuthService = {
  // Login admin
  async login(credentials: AdminLoginFormData): Promise<AdminAuthResponse> {
    try {
      console.log('Attempting admin login with:', {
        baseURL: API.defaults.baseURL,
        url: '/admin/auth/login',
        credentials: { email: credentials.email, password: '***' }
      });
      
      const response: AxiosResponse<any> = await API.post('/admin/auth/login', credentials);
      console.log('Admin login successful:', response.status);
      const { token, admin } = response.data;
      return { admin, token };
    } catch (error: any) {
      console.error('Admin login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
        code: error.code,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullError: error
      });
      
      // Check if backend is not running
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new AdminAuthError('Unable to connect to server. Please check if the backend is running on http://localhost:5000');
      }
      
      // Check for specific error messages from backend
      if (error.response?.data?.message) {
        throw new AdminAuthError(error.response.data.message, error.response.status);
      }
      
      // Check for 401/403 status codes
      if (error.response?.status === 401) {
        throw new AdminAuthError('Invalid email or password');
      }
      if (error.response?.status === 403) {
        throw new AdminAuthError('Account is deactivated or access denied');
      }
      
      // Generic error
      throw new AdminAuthError('Login failed. Please try again.');
    }
  },

  // Get current admin
  async getCurrentAdmin(): Promise<{ admin: Admin }> {
    try {
      const response = await API.get('/admin/auth/me');
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new AdminAuthError(error.response.data.message, error.response.status);
      }
      throw new AdminAuthError('Failed to get admin information');
    }
  },

  // Change password
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    try {
      await API.put('/admin/auth/change-password', data);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new AdminAuthError(error.response.data.message, error.response.status);
      }
      throw new AdminAuthError('Failed to change password');
    }
  },

  // Register new admin (admin only)
  async registerAdmin(data: AdminRegisterFormData): Promise<AdminAuthResponse> {
    try {
      const response: AxiosResponse<any> = await API.post('/admin/auth/register', data);
      const { token, admin } = response.data;
      return { admin, token };
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new AdminAuthError(error.response.data.message, error.response.status);
      }
      throw new AdminAuthError('Failed to register admin');
    }
  },

  // Get all admins (admin only)
  async getAllAdmins(): Promise<{ admins: Admin[] }> {
    try {
      const response = await API.get('/admin/auth/admins');
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new AdminAuthError(error.response.data.message, error.response.status);
      }
      throw new AdminAuthError('Failed to get admins list');
    }
  },

  // Update admin permissions (admin only)
  async updateAdminPermissions(adminId: string, data: AdminUpdateData): Promise<{ admin: Admin }> {
    try {
      const response = await API.put(`/admin/auth/permissions/${adminId}`, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new AdminAuthError(error.response.data.message, error.response.status);
      }
      throw new AdminAuthError('Failed to update admin permissions');
    }
  },

  // Delete admin (admin only)
  async deleteAdmin(adminId: string): Promise<void> {
    try {
      await API.delete(`/admin/auth/${adminId}`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new AdminAuthError(error.response.data.message, error.response.status);
      }
      throw new AdminAuthError('Failed to delete admin');
    }
  },

  // Logout (client-side only)
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
    }
  }
};

export default adminAuthService;
