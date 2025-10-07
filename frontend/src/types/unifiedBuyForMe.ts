// types/unifiedBuyForMe.ts - Unified BuyForMe Types
export interface BuyForMeRequest {
  _id: string;
  requestNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    _id?: string;
    name: string;
    url: string;
    quantity: number;
    price: number;
    currency: string;
    description?: string;
    sizes?: string[];
    colors?: string[];
    images?: string[];
    received?: boolean;
    receivedAt?: string;
    condition?: 'excellent' | 'good' | 'fair' | 'damaged' | 'defective';
    notes?: string;
  }>;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'approved' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled';
  subStatus?: 'under_review' | 'payment_pending' | 'payment_completed' | 'purchased' | 'to_be_shipped_to_box' | 'arrived_to_box' | 'admin_control' | 'customer_review' | 'customer_approved' | 'customer_rejected' | 'packing_choice' | 'packed' | 'return_requested' | 'replacement_requested';
  priority: 'low' | 'medium' | 'high';
  reviewStatus: 'pending' | 'approved' | 'rejected' | 'needs_modification';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';
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
  packagingChoice?: 'original' | 'grouped' | 'mixed';
  photos?: string[];
  notes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  reviewComments?: Array<{
    _id?: string;
    comment: string;
    adminId: string;
    adminName: string;
    createdAt: string;
    isInternal: boolean;
  }>;
  orderDetails?: {
    purchaseDate?: string;
    purchasedBy?: string;
    supplier?: string;
    purchaseOrderNumber?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
    trackingNumber?: string;
  };
  controlDetails?: {
    controlledBy?: string;
    controlDate?: string;
    controlNotes?: string;
    photos?: string[];
    itemConditions?: Array<{
      itemId: string;
      condition: 'excellent' | 'good' | 'fair' | 'damaged' | 'defective';
      notes?: string;
      photos?: string[];
    }>;
  };
  customerReview?: {
    reviewedAt?: string;
    customerDecision?: 'approved' | 'rejected' | 'needs_replacement';
    customerNotes?: string;
    rejectedItems?: Array<{
      itemId: string;
      reason: string;
      action: 'return' | 'replace' | 'refund';
    }>;
  };
  packingChoice?: {
    choice?: 'pack_now' | 'wait_in_box';
    chosenAt?: string;
    customerNotes?: string;
  };
  estimatedDelivery?: string;
  actualDelivery?: string;
  cancelledAt?: string;
  cancellationReason?: string;
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
  modificationHistory?: Array<{
    modificationNumber: number;
    modifiedAt: string;
    previousValues: {
      productName?: string;
      productLink?: string;
      notes?: string;
      quantity?: number;
      estimatedPrice?: number;
      currency?: string;
    };
    newValues: {
      productName?: string;
      productLink?: string;
      notes?: string;
      quantity?: number;
      estimatedPrice?: number;
      currency?: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  
  // Comprehensive process history tracking
  processHistory?: Array<{
    processId: string;
    processType: string;
    processAt: string;
    processedBy: string;
    processedByName: string;
    processTitle: string;
    processDescription: string;
    previousValue?: any;
    newValue?: any;
    metadata?: any;
  }>;
}

// Status display helpers
export const getStatusDisplay = (status: string, subStatus?: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'Pending Review',
    'approved': 'Approved',
    'in_progress': 'In Progress',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };

  const subStatusMap: Record<string, string> = {
    'under_review': 'Under Review',
    'payment_pending': 'Payment Pending',
    'payment_completed': 'Payment Completed',
    'purchased': 'Purchased',
    'to_be_shipped_to_box': 'Shipping to Box',
    'arrived_to_box': 'Arrived at Box',
    'admin_control': 'Admin Control',
    'customer_review': 'Customer Review',
    'customer_approved': 'Customer Approved',
    'customer_rejected': 'Customer Rejected',
    'packing_choice': 'Packing Choice',
    'packed': 'Packed',
    'return_requested': 'Return Requested',
    'replacement_requested': 'Replacement Requested'
  };

  if (subStatus && subStatusMap[subStatus]) {
    return `${statusMap[status] || status} - ${subStatusMap[subStatus]}`;
  }

  return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-purple-100 text-purple-800',
    'shipped': 'bg-indigo-100 text-indigo-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };

  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (priority: string): string => {
  const colorMap: Record<string, string> = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-red-100 text-red-800'
  };

  return colorMap[priority] || 'bg-gray-100 text-gray-800';
};

export const getPaymentStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'paid': 'bg-green-100 text-green-800',
    'failed': 'bg-red-100 text-red-800',
    'refunded': 'bg-gray-100 text-gray-800'
  };

  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

// Request creation interface
export interface CreateBuyForMeRequest {
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

// Request update interface
export interface UpdateBuyForMeRequest {
  status?: string;
  subStatus?: string;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  adminNotes?: string;
  trackingNumber?: string;
  packagingChoice?: 'original' | 'grouped' | 'mixed';
}

// Filter interface
export interface BuyForMeFilter {
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
export interface BuyForMeStatistics {
  totalRequests: number;
  totalValue: number;
  averageValue: number;
  statusCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
}

// Pagination interface
export interface Pagination {
  current: number;
  pages: number;
  total: number;
  limit: number;
}

// API Response interface
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
}
