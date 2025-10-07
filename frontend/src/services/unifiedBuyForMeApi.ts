// services/unifiedBuyForMeApi.ts - Unified BuyForMe API Service
import { BuyForMeRequest } from '@/types/unifiedBuyForMe';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API Response interface
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

// Request parameters interface
interface RequestParams {
  page?: number;
  limit?: number;
  status?: string;
  subStatus?: string;
  priority?: string;
  customerId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Statistics interface
interface Statistics {
  totalRequests: number;
  totalValue: number;
  averageValue: number;
  statusCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
}

// Create request interface
interface CreateRequestData {
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  items: Array<{
    name: string;
    url: string;
    quantity: number;
    price: number;
    currency?: string;
    description?: string;
    sizes?: string[];
    colors?: string[];
    images?: string[];
  }>;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
    phone?: string;
  };
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
}

// Update status interface
interface UpdateStatusData {
  status: string;
  subStatus?: string;
  adminId?: string;
}

// Review request interface
interface ReviewRequestData {
  reviewStatus: 'approved' | 'rejected' | 'needs_modification';
  comment?: string;
  rejectionReason?: string;
  isInternal?: boolean;
  adminId: string;
  adminName: string;
}

// Process payment interface
interface ProcessPaymentData {
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';
  transactionId: string;
  amount: number;
  adminId: string;
}

// Mark as purchased interface
interface MarkAsPurchasedData {
  supplier: string;
  purchaseOrderNumber?: string;
  estimatedDelivery?: string;
  adminId: string;
}

// Update shipping interface
interface UpdateShippingData {
  status: 'shipped' | 'delivered';
  trackingNumber?: string;
  carrier?: string;
  estimatedArrival?: string;
  adminId: string;
}

// Admin control interface
interface AdminControlData {
  controlNotes: string;
  photos?: string[];
  itemConditions?: Array<{
    itemId: string;
    condition: 'excellent' | 'good' | 'fair' | 'damaged' | 'defective';
    notes?: string;
    photos?: string[];
  }>;
  adminId: string;
}

// Customer review interface
interface CustomerReviewData {
  customerDecision: 'approved' | 'rejected' | 'needs_replacement';
  customerNotes?: string;
  rejectedItems?: Array<{
    itemId: string;
    reason: string;
    action: 'return' | 'replace' | 'refund';
  }>;
}

// Packing choice interface
interface PackingChoiceData {
  choice: 'pack_now' | 'wait_in_box';
  customerNotes?: string;
  adminId: string;
}

// Return/replacement interface
interface ReturnReplacementData {
  action: 'return' | 'replace';
  items?: string[];
  reason: string;
  replacementDetails?: {
    newItems?: any[];
    estimatedDelivery?: string;
  };
  adminId: string;
}

// Get authentication token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Create headers with authentication
const createHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Handle API errors
const handleApiError = async (response: Response): Promise<never> => {
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
};

// Admin API functions
export const adminBuyForMeApi = {
  // Get all requests
  getAllRequests: async (params: RequestParams = {}): Promise<ApiResponse<{
    requests: BuyForMeRequest[];
    pagination: any;
    statusCounts: Record<string, number>;
    priorityCounts: Record<string, number>;
  }>> => {
    const searchParams = new URLSearchParams();
    // Default to fetch all requests (increased limit)
    if (!params.limit) params.limit = 1000;
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/admin/buyforme-requests?${searchParams}`, {
      method: 'GET',
      headers: createHeaders()
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Get statistics
  getStatistics: async (startDate?: string, endDate?: string): Promise<ApiResponse<Statistics>> => {
    const searchParams = new URLSearchParams();
    if (startDate) searchParams.append('startDate', startDate);
    if (endDate) searchParams.append('endDate', endDate);

    const response = await fetch(`${API_BASE_URL}/admin/buyforme-requests/statistics?${searchParams}`, {
      method: 'GET',
      headers: createHeaders()
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Get single request
  getRequestById: async (id: string): Promise<ApiResponse<BuyForMeRequest>> => {
    const response = await fetch(`${API_BASE_URL}/admin/buyforme-requests/${id}`, {
      method: 'GET',
      headers: createHeaders()
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Create request
  createRequest: async (data: CreateRequestData): Promise<ApiResponse<BuyForMeRequest>> => {
    const response = await fetch(`${API_BASE_URL}/admin/buyforme-requests`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Update status
  updateStatus: async (id: string, data: UpdateStatusData): Promise<ApiResponse<BuyForMeRequest>> => {
    const response = await fetch(`${API_BASE_URL}/admin/buyforme-requests/${id}/status`, {
      method: 'PATCH',
      headers: createHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Review request
  reviewRequest: async (id: string, data: ReviewRequestData): Promise<ApiResponse<BuyForMeRequest>> => {
    const response = await fetch(`${API_BASE_URL}/admin/buyforme-requests/${id}/review`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Process payment
  processPayment: async (id: string, data: ProcessPaymentData): Promise<ApiResponse<BuyForMeRequest>> => {
    const response = await fetch(`${API_BASE_URL}/admin/buyforme-requests/${id}/payment`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Mark as purchased
  markAsPurchased: async (id: string, data: MarkAsPurchasedData): Promise<ApiResponse<BuyForMeRequest>> => {
    const response = await fetch(`${API_BASE_URL}/admin/buyforme-requests/${id}/purchase`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Update shipping
  updateShipping: async (id: string, data: UpdateShippingData): Promise<ApiResponse<BuyForMeRequest>> => {
    const response = await fetch(`${API_BASE_URL}/admin/buyforme-requests/${id}/shipping`, {
      method: 'PATCH',
      headers: createHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Admin control
  adminControl: async (id: string, data: AdminControlData): Promise<ApiResponse<BuyForMeRequest>> => {
    const response = await fetch(`${API_BASE_URL}/admin/buyforme-requests/${id}/control`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Customer review
  customerReview: async (id: string, data: CustomerReviewData): Promise<ApiResponse<BuyForMeRequest>> => {
    const response = await fetch(`${API_BASE_URL}/admin/buyforme-requests/${id}/customer-review`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Packing choice
  packingChoice: async (id: string, data: PackingChoiceData): Promise<ApiResponse<BuyForMeRequest>> => {
    const response = await fetch(`${API_BASE_URL}/admin/buyforme-requests/${id}/packing`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Handle return/replacement
  handleReturnReplacement: async (id: string, data: ReturnReplacementData): Promise<ApiResponse<BuyForMeRequest>> => {
    const response = await fetch(`${API_BASE_URL}/admin/buyforme-requests/${id}/return-replacement`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Delete request
  deleteRequest: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE_URL}/admin/buyforme-requests/${id}`, {
      method: 'DELETE',
      headers: createHeaders()
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  }
};

// User API functions
export const userBuyForMeApi = {
  // Get user's requests
  getUserRequests: async (params: RequestParams = {}): Promise<ApiResponse<{
    requests: BuyForMeRequest[];
    pagination: any;
  }>> => {
    const searchParams = new URLSearchParams();
    // Default to fetch all user requests (increased limit)
    if (!params.limit) params.limit = 1000;
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/user/buyforme-requests?${searchParams}`, {
      method: 'GET',
      headers: createHeaders()
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Get user's single request
  getUserRequestById: async (id: string): Promise<ApiResponse<BuyForMeRequest>> => {
    const response = await fetch(`${API_BASE_URL}/user/buyforme-requests/${id}`, {
      method: 'GET',
      headers: createHeaders()
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Create request
  createRequest: async (data: CreateRequestData): Promise<ApiResponse<BuyForMeRequest>> => {
    const response = await fetch(`${API_BASE_URL}/user/buyforme-requests`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  }
};

// Export default API object
export default {
  admin: adminBuyForMeApi,
  user: userBuyForMeApi
};