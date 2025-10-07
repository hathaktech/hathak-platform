// services/buyForMeCartApi.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const buyForMeCartApi = axios.create({
  baseURL: `${API_BASE_URL}/buyforme-cart`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
buyForMeCartApi.interceptors.request.use(
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

// Response interceptor for error handling
buyForMeCartApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface BuyForMeCartItem {
  _id: string;
  userId: string;
  productName: string;
  productLink: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  quantity: number;
  estimatedPrice: number;
  currency: string;
  notes: string;
  status: 'active' | 'submitted' | 'archived';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  formattedPrice?: string;
  totalCost?: number;
}

export interface CreateCartItemData {
  productName: string;
  productLink: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  quantity?: number;
  estimatedPrice?: number;
  currency?: string;
  notes?: string;
}

export interface UpdateCartItemData {
  productName?: string;
  productLink?: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  quantity?: number;
  estimatedPrice?: number;
  currency?: string;
  notes?: string;
}

export interface CartStats {
  active: {
    count: number;
    totalValue: number;
  };
}

// API Functions

// Get user's cart items
export const getCartItems = async (): Promise<BuyForMeCartItem[]> => {
  try {
    const response = await buyForMeCartApi.get('/');
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching cart items:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch cart items');
  }
};

// Get single cart item
export const getCartItem = async (productId: string): Promise<BuyForMeCartItem> => {
  try {
    const response = await buyForMeCartApi.get(`/${productId}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching cart item:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch cart item');
  }
};

// Create new cart item
export const createCartItem = async (data: CreateCartItemData): Promise<BuyForMeCartItem> => {
  try {
    const response = await buyForMeCartApi.post('/', data);
    return response.data.data;
  } catch (error: any) {
    console.error('Error creating cart item:', error);
    throw new Error(error.response?.data?.message || 'Failed to create cart item');
  }
};

// Update cart item
export const updateCartItem = async (productId: string, data: UpdateCartItemData): Promise<BuyForMeCartItem> => {
  try {
    const response = await buyForMeCartApi.put(`/${productId}`, data);
    return response.data.data;
  } catch (error: any) {
    console.error('Error updating cart item:', error);
    throw new Error(error.response?.data?.message || 'Failed to update cart item');
  }
};

// Delete cart item
export const deleteCartItem = async (productId: string): Promise<void> => {
  try {
    await buyForMeCartApi.delete(`/${productId}`);
  } catch (error: any) {
    console.error('Error deleting cart item:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete cart item');
  }
};

// Submit cart for purchase
export const submitCartForPurchase = async (productIds: string[]): Promise<{ submittedCount: number }> => {
  try {
    const response = await buyForMeCartApi.post('/submit', { productIds });
    return { submittedCount: response.data.submittedCount };
  } catch (error: any) {
    console.error('Error submitting cart:', error);
    throw new Error(error.response?.data?.message || 'Failed to submit cart');
  }
};

// Get cart statistics
export const getCartStats = async (): Promise<CartStats> => {
  try {
    const response = await buyForMeCartApi.get('/stats');
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching cart stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch cart statistics');
  }
};

// Utility functions
export const formatPrice = (price: number, currency: string): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  } catch (error) {
    return `${currency} ${price.toFixed(2)}`;
  }
};

export const calculateTotalCost = (products: BuyForMeCartItem[]): number => {
  return products.reduce((total, product) => {
    return total + (product.estimatedPrice * product.quantity);
  }, 0);
};

export const getMostCommonCurrency = (products: BuyForMeCartItem[]): string => {
  if (products.length === 0) return 'USD';
  
  const currencies = products.map(p => p.currency);
  return currencies.sort((a, b) =>
    currencies.filter(c => c === b).length - currencies.filter(c => c === a).length
  )[0];
};

export default buyForMeCartApi;
