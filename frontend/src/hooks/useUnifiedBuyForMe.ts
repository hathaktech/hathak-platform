// hooks/useUnifiedBuyForMe.ts - Unified BuyForMe Hook
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useModernNotification } from '@/context/ModernNotificationContext';
import { 
  BuyForMeRequest, 
  BuyForMeFilter, 
  BuyForMeStatistics,
  CreateBuyForMeRequest,
  UpdateBuyForMeRequest,
  Pagination
} from '@/types/unifiedBuyForMe';
import { adminBuyForMeApi, userBuyForMeApi } from '@/services/unifiedBuyForMeApi';

interface UseUnifiedBuyForMeReturn {
  // Data
  requests: BuyForMeRequest[];
  currentRequest: BuyForMeRequest | null;
  statistics: BuyForMeStatistics | null;
  statusCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
  pagination: Pagination | null;
  
  // Loading states
  loading: boolean;
  submitting: boolean;
  error: string | null;
  
  // Actions
  fetchRequests: (params?: BuyForMeFilter) => Promise<void>;
  fetchRequestById: (id: string) => Promise<void>;
  fetchStatistics: (startDate?: string, endDate?: string) => Promise<void>;
  createRequest: (data: CreateBuyForMeRequest) => Promise<BuyForMeRequest | null>;
  updateRequest: (id: string, data: UpdateBuyForMeRequest) => Promise<BuyForMeRequest | null>;
  deleteRequest: (id: string) => Promise<boolean>;
  reviewRequest: (id: string, reviewData: any) => Promise<BuyForMeRequest | null>;
  processPayment: (id: string, paymentData: any) => Promise<BuyForMeRequest | null>;
  markAsPurchased: (id: string, purchaseData: any) => Promise<BuyForMeRequest | null>;
  updateShipping: (id: string, shippingData: any) => Promise<BuyForMeRequest | null>;
  adminControl: (id: string, controlData: any) => Promise<BuyForMeRequest | null>;
  customerReview: (id: string, reviewData: any) => Promise<BuyForMeRequest | null>;
  packingChoice: (id: string, packingData: any) => Promise<BuyForMeRequest | null>;
  handleReturnReplacement: (id: string, returnData: any) => Promise<BuyForMeRequest | null>;
  
  // Utilities
  clearError: () => void;
  clearCurrentRequest: () => void;
  refreshRequests: () => Promise<void>;
}

export const useUnifiedBuyForMe = (isAdmin: boolean = false): UseUnifiedBuyForMeReturn => {
  const { isAuthenticated, user } = useAuth();
  const { showNotification } = useModernNotification();
  
  // State
  const [requests, setRequests] = useState<BuyForMeRequest[]>([]);
  const [currentRequest, setCurrentRequest] = useState<BuyForMeRequest | null>(null);
  const [statistics, setStatistics] = useState<BuyForMeStatistics | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [priorityCounts, setPriorityCounts] = useState<Record<string, number>>({});
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear current request
  const clearCurrentRequest = useCallback(() => {
    setCurrentRequest(null);
  }, []);

  // Fetch requests
  const fetchRequests = useCallback(async (params: BuyForMeFilter = {}) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const api = isAdmin ? adminBuyForMeApi : userBuyForMeApi;
      const response = await api.getAllRequests(params);
      
      if (isAdmin) {
        const { requests: fetchedRequests, pagination: paginationData, statusCounts: statusData, priorityCounts: priorityData } = response.data;
        setRequests(fetchedRequests);
        setPagination(paginationData);
        setStatusCounts(statusData);
        setPriorityCounts(priorityData);
      } else {
        const { requests: fetchedRequests, pagination: paginationData } = response.data;
        setRequests(fetchedRequests);
        setPagination(paginationData);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch requests';
      setError(errorMessage);
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin, showNotification]);

  // Fetch single request
  const fetchRequestById = useCallback(async (id: string) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const api = isAdmin ? adminBuyForMeApi : userBuyForMeApi;
      const response = await api.getRequestById(id);
      setCurrentRequest(response.data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch request';
      setError(errorMessage);
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin, showNotification]);

  // Fetch statistics (admin only)
  const fetchStatistics = useCallback(async (startDate?: string, endDate?: string) => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminBuyForMeApi.getStatistics(startDate, endDate);
      setStatistics(response.data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch statistics';
      setError(errorMessage);
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, showNotification]);

  // Create request
  const createRequest = useCallback(async (data: CreateBuyForMeRequest): Promise<BuyForMeRequest | null> => {
    if (!isAuthenticated) return null;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const api = isAdmin ? adminBuyForMeApi : userBuyForMeApi;
      const response = await api.createRequest(data);
      
      showNotification('success', 'Request created successfully');
      
      // Refresh requests list
      await fetchRequests();
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create request';
      setError(errorMessage);
      showNotification('error', errorMessage);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [isAuthenticated, isAdmin, showNotification, fetchRequests]);

  // Update request
  const updateRequest = useCallback(async (id: string, data: UpdateBuyForMeRequest): Promise<BuyForMeRequest | null> => {
    if (!isAuthenticated) return null;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await adminBuyForMeApi.updateStatus(id, data);
      
      showNotification('success', 'Request updated successfully');
      
      // Update local state
      setRequests(prev => prev.map(req => req._id === id ? response.data : req));
      if (currentRequest?._id === id) {
        setCurrentRequest(response.data);
      }
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update request';
      setError(errorMessage);
      showNotification('error', errorMessage);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [isAuthenticated, showNotification, currentRequest]);

  // Delete request
  const deleteRequest = useCallback(async (id: string): Promise<boolean> => {
    if (!isAdmin) return false;
    
    try {
      setSubmitting(true);
      setError(null);
      
      await adminBuyForMeApi.deleteRequest(id);
      
      showNotification('success', 'Request deleted successfully');
      
      // Update local state
      setRequests(prev => prev.filter(req => req._id !== id));
      if (currentRequest?._id === id) {
        setCurrentRequest(null);
      }
      
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete request';
      setError(errorMessage);
      showNotification('error', errorMessage);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [isAdmin, showNotification, currentRequest]);

  // Review request
  const reviewRequest = useCallback(async (id: string, reviewData: any): Promise<BuyForMeRequest | null> => {
    if (!isAdmin) return null;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await adminBuyForMeApi.reviewRequest(id, reviewData);
      
      showNotification('success', 'Request reviewed successfully');
      
      // Update local state
      setRequests(prev => prev.map(req => req._id === id ? response.data : req));
      if (currentRequest?._id === id) {
        setCurrentRequest(response.data);
      }
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to review request';
      setError(errorMessage);
      showNotification('error', errorMessage);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [isAdmin, showNotification, currentRequest]);

  // Process payment
  const processPayment = useCallback(async (id: string, paymentData: any): Promise<BuyForMeRequest | null> => {
    if (!isAdmin) return null;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await adminBuyForMeApi.processPayment(id, paymentData);
      
      showNotification('success', 'Payment processed successfully');
      
      // Update local state
      setRequests(prev => prev.map(req => req._id === id ? response.data : req));
      if (currentRequest?._id === id) {
        setCurrentRequest(response.data);
      }
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to process payment';
      setError(errorMessage);
      showNotification('error', errorMessage);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [isAdmin, showNotification, currentRequest]);

  // Mark as purchased
  const markAsPurchased = useCallback(async (id: string, purchaseData: any): Promise<BuyForMeRequest | null> => {
    if (!isAdmin) return null;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await adminBuyForMeApi.markAsPurchased(id, purchaseData);
      
      showNotification('success', 'Order marked as purchased');
      
      // Update local state
      setRequests(prev => prev.map(req => req._id === id ? response.data : req));
      if (currentRequest?._id === id) {
        setCurrentRequest(response.data);
      }
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to mark as purchased';
      setError(errorMessage);
      showNotification('error', errorMessage);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [isAdmin, showNotification, currentRequest]);

  // Update shipping
  const updateShipping = useCallback(async (id: string, shippingData: any): Promise<BuyForMeRequest | null> => {
    if (!isAdmin) return null;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await adminBuyForMeApi.updateShipping(id, shippingData);
      
      showNotification('success', 'Shipping status updated');
      
      // Update local state
      setRequests(prev => prev.map(req => req._id === id ? response.data : req));
      if (currentRequest?._id === id) {
        setCurrentRequest(response.data);
      }
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update shipping';
      setError(errorMessage);
      showNotification('error', errorMessage);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [isAdmin, showNotification, currentRequest]);

  // Admin control
  const adminControl = useCallback(async (id: string, controlData: any): Promise<BuyForMeRequest | null> => {
    if (!isAdmin) return null;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await adminBuyForMeApi.adminControl(id, controlData);
      
      showNotification('success', 'Admin control completed');
      
      // Update local state
      setRequests(prev => prev.map(req => req._id === id ? response.data : req));
      if (currentRequest?._id === id) {
        setCurrentRequest(response.data);
      }
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to complete admin control';
      setError(errorMessage);
      showNotification('error', errorMessage);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [isAdmin, showNotification, currentRequest]);

  // Customer review
  const customerReview = useCallback(async (id: string, reviewData: any): Promise<BuyForMeRequest | null> => {
    if (!isAdmin) return null;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await adminBuyForMeApi.customerReview(id, reviewData);
      
      showNotification('success', 'Customer review recorded');
      
      // Update local state
      setRequests(prev => prev.map(req => req._id === id ? response.data : req));
      if (currentRequest?._id === id) {
        setCurrentRequest(response.data);
      }
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to record customer review';
      setError(errorMessage);
      showNotification('error', errorMessage);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [isAdmin, showNotification, currentRequest]);

  // Packing choice
  const packingChoice = useCallback(async (id: string, packingData: any): Promise<BuyForMeRequest | null> => {
    if (!isAdmin) return null;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await adminBuyForMeApi.packingChoice(id, packingData);
      
      showNotification('success', 'Packing choice recorded');
      
      // Update local state
      setRequests(prev => prev.map(req => req._id === id ? response.data : req));
      if (currentRequest?._id === id) {
        setCurrentRequest(response.data);
      }
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to record packing choice';
      setError(errorMessage);
      showNotification('error', errorMessage);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [isAdmin, showNotification, currentRequest]);

  // Handle return/replacement
  const handleReturnReplacement = useCallback(async (id: string, returnData: any): Promise<BuyForMeRequest | null> => {
    if (!isAdmin) return null;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await adminBuyForMeApi.handleReturnReplacement(id, returnData);
      
      showNotification('success', `${returnData.action} processed successfully`);
      
      // Update local state
      setRequests(prev => prev.map(req => req._id === id ? response.data : req));
      if (currentRequest?._id === id) {
        setCurrentRequest(response.data);
      }
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || `Failed to process ${returnData.action}`;
      setError(errorMessage);
      showNotification('error', errorMessage);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [isAdmin, showNotification, currentRequest]);

  // Refresh requests
  const refreshRequests = useCallback(async () => {
    await fetchRequests();
  }, [fetchRequests]);

  // Initial data fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
      if (isAdmin) {
        fetchStatistics();
      }
    }
  }, [isAuthenticated, fetchRequests, fetchStatistics, isAdmin]);

  return {
    // Data
    requests,
    currentRequest,
    statistics,
    statusCounts,
    priorityCounts,
    pagination,
    
    // Loading states
    loading,
    submitting,
    error,
    
    // Actions
    fetchRequests,
    fetchRequestById,
    fetchStatistics,
    createRequest,
    updateRequest,
    deleteRequest,
    reviewRequest,
    processPayment,
    markAsPurchased,
    updateShipping,
    adminControl,
    customerReview,
    packingChoice,
    handleReturnReplacement,
    
    // Utilities
    clearError,
    clearCurrentRequest,
    refreshRequests
  };
};