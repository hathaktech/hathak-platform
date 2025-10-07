import axios, { AxiosResponse } from 'axios';
import { LoginFormData, RegisterFormData, AuthResponse, User } from '@/types/auth';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
API.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code;
      const errorMessage = error.response?.data?.message;
      
      // Clear token for any 401 error
      localStorage.removeItem('token');
      
      // Handle specific token errors
      if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'INVALID_TOKEN') {
        console.warn('Authentication token expired or invalid:', errorMessage);
        // Only redirect if not already on login page
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Custom error class
export class AuthError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'AuthError';
  }
}

// Authentication service
export const authService = {
  // Login user
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<any> = await API.post('/api/auth/login', credentials);
      // Backend returns { _id, name, email, role, createdAt, updatedAt, token }
      // We need to transform it to { user: User, token: string }
      const { token, ...userData } = response.data;
      return {
        user: userData,
        token
      };
    } catch (error: any) {
      console.error('Login error details:', {
        message: error?.message || 'Unknown error',
        response: error?.response?.data || 'No response data',
        status: error?.response?.status || 'No status',
        config: error?.config || 'No config',
        code: error?.code || 'No code',
        url: error?.config?.url || 'No URL',
        baseURL: error?.config?.baseURL || 'No base URL',
        fullError: error || 'No error object'
      });
      
      // Check if backend is not running
      if (error?.code === 'ECONNREFUSED' || error?.code === 'ERR_NETWORK') {
        throw new AuthError('Unable to connect to server. Please check if the backend is running on http://localhost:5000');
      }
      
      // Check for specific error messages from backend
      if (error?.response?.data?.message) {
        throw new AuthError(error.response.data.message, error.response.status);
      }
      
      // Check for 400 status code (invalid credentials)
      if (error?.response?.status === 400) {
        throw new AuthError('Invalid email or password');
      }
      
      // Check for 401/403 status codes
      if (error?.response?.status === 401) {
        throw new AuthError('Invalid email or password');
      }
      if (error?.response?.status === 403) {
        throw new AuthError('Account is disabled or locked');
      }
      
      // Check for 500 status code
      if (error?.response?.status === 500) {
        throw new AuthError('Server error. Please try again later.');
      }
      
      // Generic error
      throw new AuthError('Login failed. Please try again.');
    }
  },

  // Register user
  async register(userData: RegisterFormData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<any> = await API.post('/api/auth/register', userData);
      // Backend returns { _id, name, email, role, createdAt, updatedAt, token }
      // We need to transform it to { user: User, token: string }
      const { token, ...user } = response.data;
      return {
        user,
        token
      };
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new AuthError(error.response.data.message, error.response.status);
      }
      throw new AuthError('Registration failed. Please try again.');
    }
  },

  // Get current user
  async getCurrentUser(token: string): Promise<User> {
    try {
      const response: AxiosResponse<{ user: User }> = await API.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.user;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new AuthError(error.response.data.message, error.response.status);
      }
      throw new AuthError('Failed to get user information.');
    }
  },

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response: AxiosResponse<{ user: User }> = await API.put('/api/auth/profile', userData);
      return response.data.user;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new AuthError(error.response.data.message, error.response.status);
      }
      throw new AuthError('Failed to update profile.');
    }
  },

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await API.put('/api/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new AuthError(error.response.data.message, error.response.status);
      }
      throw new AuthError('Failed to change password.');
    }
  },

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    try {
      await API.post('/api/auth/forgot-password', { email });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new AuthError(error.response.data.message, error.response.status);
      }
      throw new AuthError('Failed to send reset email.');
    }
  },

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await API.post('/api/auth/reset-password', {
        token,
        newPassword,
      });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new AuthError(error.response.data.message, error.response.status);
      }
      throw new AuthError('Failed to reset password.');
    }
  },

  // Logout (clear token and notify backend)
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint if token exists
      const token = localStorage.getItem('token');
      if (token) {
        await API.post('/api/auth/logout');
      }
    } catch (error) {
      // Even if backend call fails, we still want to clear the token
      console.warn('Logout API call failed, but clearing token anyway:', error);
    } finally {
      // Always clear the token from localStorage
      localStorage.removeItem('token');
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  },
};
