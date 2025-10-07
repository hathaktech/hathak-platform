import axios, { AxiosResponse } from 'axios';
import { LoginFormData, RegisterFormData, AuthResponse, User } from '@/types/auth';

// Create axios instance with base configuration
export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create separate API instance for BuyMe requests (uses frontend API routes)
export const BuyMeAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
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
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Add same interceptors to BuyMeAPI
BuyMeAPI.interceptors.request.use(
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

BuyMeAPI.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Product API calls
export const fetchProducts = () => API.get('/api/products');
export const fetchProductById = (id: string) => API.get(`/api/products/${id}`);
export const createOrder = (data: any) => API.post('/api/orders', data);

// Auth API calls (kept for backward compatibility)
export const loginUser = (data: LoginFormData) => API.post('/api/auth/login', data);
export const registerUser = (data: RegisterFormData) => API.post('/api/auth/register', data);

// User API calls
export const getCurrentUser = () => API.get('/api/auth/me');
export const updateUserProfile = (data: Partial<User>) => API.put('/api/auth/profile', data);

// Order API calls
export const getUserOrders = () => API.get('/api/orders');
export const getOrderById = (id: string) => API.get(`/api/orders/${id}`);

// Cart API calls - using Next.js API routes
export const getCart = (serviceType: 'store' | 'buyme' = 'store') => API.get(`/api/cart?serviceType=${serviceType}`);
export const addToCart = (data: any) => API.post('/api/cart/add', data);
export const updateCartItem = (productId: string, data: any) => API.post('/api/cart/update', { productId, ...data });
export const removeFromCart = (productId: string, options?: Record<string, any>) => API.post('/api/cart/remove', { productId, options });
export const applyCoupon = (data: any) => API.post('/api/cart/apply-coupon', data);
export const checkoutCart = (data: any) => API.post('/api/cart/checkout', data);

// Buy Me API calls - Updated to use unified API
export const createBuyMeRequest = (data: any) => BuyMeAPI.post('/api/user/buyforme-requests', data);
export const getUserBuyMeRequests = () => BuyMeAPI.get('/api/user/buyforme-requests');
export const submitMultipleBuyMeRequests = (data: any) => BuyMeAPI.post('/api/buyme/bulk-submit', data);
export const getBuyMeRequestById = (id: string) => BuyMeAPI.get(`/api/user/buyforme-requests/${id}`);
export const getAllBuyMeRequests = () => BuyMeAPI.get('/api/admin/buyforme-requests');
export const updateBuyMeRequest = (id: string, data: any) => BuyMeAPI.patch(`/api/admin/buyforme-requests/${id}/status`, data);
export const deleteBuyMeRequest = (id: string) => BuyMeAPI.delete(`/api/admin/buyforme-requests/${id}`);
export const processBuyMePayment = (id: string, data: any) => {
  // Use unified API for BuyMe payments
  return fetch(`/api/admin/buyforme-requests/${id}/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
    },
    body: JSON.stringify(data),
  }).then(response => {
    if (!response.ok) {
      return response.json().then(error => Promise.reject(error));
    }
    return response.json();
  });
};

// Notification API calls
export const getUserNotifications = () => API.get('/api/notifications');
export const markNotificationAsRead = (id: string) => API.put(`/api/notifications/${id}/read`);
export const deleteNotification = (id: string) => API.delete(`/api/notifications/${id}`);
