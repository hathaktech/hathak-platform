// hooks/useBuyForMeRequests.ts - Custom Hook for BuyForMe Request Management
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useModernNotification } from '@/context/ModernNotificationContext';

export interface BuyForMeRequest {
  _id: string;
  requestNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: {
    _id: string;
    name: string;
    url: string;
    quantity: number;
    price: number;
    currency: string;
    description?: string;
    sizes?: string[];
    colors?: string[];
    images?: string[];
  }[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'approved' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled';
  subStatus?: string;
  priority: 'low' | 'medium' | 'high';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  transactionId?: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
    phone?: string;
  };
  trackingNumber?: string;
  packagingChoice?: string;
  photos?: string[];
  notes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  reviewStatus: 'pending' | 'approved' | 'rejected' | 'needs_modification';
  reviewComments?: {
    _id: string;
    comment: string;
    adminId: string;
    adminName: string;
    createdAt: string;
    isInternal: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
  modifiedByUser?: boolean;
  modifiedByAdmin?: boolean;
  adminModificationDate?: string;
  adminModificationNote?: string;
  lastModifiedByAdmin?: string;
  lastModifiedByUser?: string;
  modifiedButNeedsModification?: boolean;
  originalValues?: {
    productName?: string;
    productLink?: string;
    notes?: string;
    quantity?: number;
    estimatedPrice?: number;
    currency?: string;
  };
  modificationHistory?: {
    modificationNumber: number;
    modifiedAt: string;
    previousValues: any;
    newValues: any;
  }[];
}

export interface RequestFilters {
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

export interface RequestStatistics {
  totalRequests: number;
  totalValue: number;
  averageValue: number;
  statusCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
}

export interface PaginationInfo {
  current: number;
  pages: number;
  total: number;
  limit: number;
}

// Customer grouping interfaces
export interface CustomerInfo {
  _id: string;
  name: string;
  email: string;
  requestCount: number;
  totalAmount: number;
  latestRequest: string;
  statuses: string[];
  requestNumbers: string[];
  requestIds: string[];
}

export interface CustomerRequestGroup {
  customerInfo: CustomerInfo;
  requests: BuyForMeRequest[];
}

export interface ApiResponseData {
  requests: BuyForMeRequest[];
  pagination: PaginationInfo;
  statusCounts?: Record<string, number>;
  priorityCounts?: Record<string, number>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    type: string;
    message: string;
    statusCode: number;
  };
}

const API_BASE = '/api/admin/buyforme-requests';

// Helper function to handle response errors properly
const handleResponseError = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
  } else {
    // If it's HTML (like a 404 page), throw a more descriptive error
    throw new Error(`Server error: ${response.status} ${response.statusText}. Please check if the backend server is running.`);
  }
};

export const useBuyForMeRequests = () => {
  const [requests, setRequests] = useState<BuyForMeRequest[]>([]);
  const [customerGroups, setCustomerGroups] = useState<CustomerRequestGroup[]>([]);
  const [isGroupedByCustomer, setIsGroupedByCustomer] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current: 1,
    pages: 1,
    total: 0,
    limit: 10
  });
  const [statistics, setStatistics] = useState<RequestStatistics | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [priorityCounts, setPriorityCounts] = useState<Record<string, number>>({});

  const { showNotification } = useModernNotification();

  // Fetch requests with filters
  const fetchRequests = useCallback(async (filters: RequestFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE}?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        await handleResponseError(response);
      }

      const data: ApiResponse<ApiResponseData> = await response.json();

      if (data.success) {
        // Individual requests only
        setRequests(data.data.requests || []);
        setCustomerGroups([]);
        setIsGroupedByCustomer(false);
        setPagination(data.data.pagination);
        // Status and priority counts are available in individual mode only
        if (data.data.statusCounts) setStatusCounts(data.data.statusCounts);
        if (data.data.priorityCounts) setPriorityCounts(data.data.priorityCounts);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch requests');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch requests';
      setError(errorMessage);
      showNotification('error', errorMessage);
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Fetch statistics
  const fetchStatistics = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }

      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await fetch(`${API_BASE}/statistics?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        await handleResponseError(response);
      }

      const data: ApiResponse<RequestStatistics> = await response.json();

      if (data.success) {
        setStatistics(data.data);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch statistics');
      }
    } catch (err: any) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  // Get single request by ID
  const getRequestById = useCallback(async (id: string): Promise<BuyForMeRequest | null> => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await fetch(`${API_BASE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        await handleResponseError(response);
      }

      const data: ApiResponse<BuyForMeRequest> = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error?.message || 'Failed to fetch request');
      }
    } catch (err: any) {
      console.error('Error fetching request:', err);
      showNotification('error', err.message || 'Failed to fetch request');
      return null;
    }
  }, [showNotification]);

  // Update request status
  const updateRequestStatus = useCallback(async (
    id: string, 
    updates: {
      status?: string;
      subStatus?: string;
      notes?: string;
      adminNotes?: string;
      trackingNumber?: string;
      packagingChoice?: string;
    }
  ) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await fetch(`${API_BASE}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        await handleResponseError(response);
      }

      const data: ApiResponse<BuyForMeRequest> = await response.json();

      if (data.success) {
        // Update the request in the local state
        setRequests(prev => prev.map(req => 
          req._id === id ? { ...req, ...data.data } : req
        ));
        
        // Force a re-fetch to ensure data consistency
        setTimeout(() => {
          fetchRequests();
        }, 100);
        
        showNotification('success', data.message || 'Request updated successfully');
        return data.data;
      } else {
        throw new Error(data.error?.message || 'Failed to update request');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update request';
      showNotification('error', errorMessage);
      console.error('Error updating request:', err);
      throw err;
    }
  }, [showNotification, fetchRequests]);

  // Review request
  const reviewRequest = useCallback(async (
    id: string,
    reviewData: {
      reviewStatus: 'approved' | 'rejected' | 'needs_modification';
      comment?: string;
      rejectionReason?: string;
      isInternal?: boolean;
      modifiedItems?: any[];
    }
  ) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await fetch(`${API_BASE}/${id}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        // Check if response is JSON or HTML
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        } else {
          // If it's HTML (like a 404 page), throw a more descriptive error
          throw new Error(`Server error: ${response.status} ${response.statusText}. Please check if the backend server is running.`);
        }
      }

      const data: ApiResponse<BuyForMeRequest> = await response.json();

      if (data.success) {
        // Update the request in the local state
        setRequests(prev => prev.map(req => 
          req._id === id ? { ...req, ...data.data } : req
        ));
        
        // Force a re-fetch to ensure data consistency
        setTimeout(() => {
          fetchRequests();
        }, 100);
        
        showNotification('success', data.message || 'Request reviewed successfully');
        return data.data;
      } else {
        throw new Error(data.error?.message || 'Failed to review request');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to review request';
      showNotification('error', errorMessage);
      console.error('Error reviewing request:', err);
      throw err;
    }
  }, [showNotification]);

  // Delete request
  const deleteRequest = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        await handleResponseError(response);
      }

      const data: ApiResponse<null> = await response.json();

      if (data.success) {
        // Remove the request from local state
        setRequests(prev => prev.filter(req => req._id !== id));
        showNotification('success', data.message || 'Request deleted successfully');
      } else {
        throw new Error(data.error?.message || 'Failed to delete request');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete request';
      showNotification('error', errorMessage);
      console.error('Error deleting request:', err);
      throw err;
    }
  }, [showNotification]);

  // Memoized filtered requests
  const filteredRequests = useMemo(() => {
    return requests;
  }, [requests]);

  // Memoized status options
  const statusOptions = useMemo(() => [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ], []);

  // Memoized priority options
  const priorityOptions = useMemo(() => [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ], []);

  // Memoized sort options
  const sortOptions = useMemo(() => [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'updatedAt', label: 'Last Updated' },
    { value: 'totalAmount', label: 'Total Amount' },
    { value: 'priority', label: 'Priority' },
    { value: 'status', label: 'Status' }
  ], []);

  return {
    // State
    requests: filteredRequests,
    customerGroups,
    isGroupedByCustomer,
    loading,
    error,
    pagination,
    statistics,
    statusCounts,
    priorityCounts,

    // Actions
    fetchRequests,
    fetchStatistics,
    getRequestById,
    updateRequestStatus,
    reviewRequest,
    deleteRequest,

    // Options
    statusOptions,
    priorityOptions,
    sortOptions,

    // Utilities
    setError,
    clearError: () => setError(null)
  };
};

export default useBuyForMeRequests;
