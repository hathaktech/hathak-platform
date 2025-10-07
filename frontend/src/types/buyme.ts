export interface BuyMeRequest {
  _id: string;
  userId: string;
  requestNumber: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  productName: string;
  productLink: string;
  notes?: string;
  status: 'pending' | 'approved' | 'purchased' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  // Review fields
  reviewStatus?: 'pending' | 'approved' | 'rejected' | 'needs_modification';
  reviewComments?: {
    comment: string;
    adminName: string;
    adminId: string;
    createdAt: string;
    isInternal: boolean;
  }[];
  rejectionReason?: string;
  // Enhanced fields
  productDetails?: ProductDetails;
  shippingInfo?: ShippingInfo;
  trackingInfo?: TrackingInfo;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  storeName?: string;
  storeUrl?: string;
  quantity?: number;
  estimatedPrice?: number;
  currency?: string;
  serviceFee?: number;
  shippingFee?: number;
  totalCost?: number;
  // Confirmation preferences
  confirmationPreferences?: {
    proceedWithRemaining: boolean;
    cancelEntireOrder: boolean;
    confirmRestrictions: boolean;
  };
  // Track if request was modified by user
  modifiedByUser?: boolean;
  lastModifiedByUser?: string;
  // Track if request was modified but needs modification again
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
  }[];
}

export interface CreateBuyMeRequest {
  productName: string;
  productLink: string;
  notes?: string;
  // Enhanced fields
  images?: string[];
  colors?: string[];
  sizes?: string[];
  quantity?: number;
  estimatedPrice?: number;
  currency?: string;
}

export interface UpdateBuyMeRequest {
  status?: 'pending' | 'approved' | 'purchased' | 'shipped' | 'delivered' | 'cancelled';
  productName?: string;
  productLink?: string;
  notes?: string;
  productDetails?: ProductDetails;
  shippingInfo?: ShippingInfo;
  trackingInfo?: TrackingInfo;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  storeName?: string;
  storeUrl?: string;
  quantity?: number;
  estimatedPrice?: number;
  currency?: string;
  serviceFee?: number;
  shippingFee?: number;
  totalCost?: number;
}

export interface ProductDetails {
  title: string;
  price: string;
  image: string;
  description?: string;
  colors?: string[];
  sizes?: string[];
  brand?: string;
  availability?: string;
  category?: string;
  weight?: string;
  dimensions?: string;
  material?: string;
  condition?: string;
  storeName?: string;
  storeUrl: string;
  quantity?: number;
  notes?: string;
  currency?: string;
  originalCurrency?: string;
}

export interface ShippingInfo {
  method: string;
  estimatedDays: number;
  cost: number;
  currency: string;
  trackingNumber?: string;
  carrier?: string;
}

export interface TrackingInfo {
  trackingNumber: string;
  carrier: string;
  status: string;
  lastUpdate: string;
  estimatedDelivery?: string;
  trackingUrl?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface Brand {
  _id: string;
  name: string;
  logo: string;
  website: string;
  category: string;
  services: string[];
  description?: string;
  rating?: number;
  reviewCount?: number;
}

export interface ProductComparison {
  productId: string;
  storeName: string;
  storeUrl: string;
  price: number;
  currency: string;
  availability: boolean;
  shippingCost: number;
  estimatedDelivery: string;
  rating?: number;
  reviewCount?: number;
}

export interface Review {
  _id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  productName: string;
  storeName: string;
  verified: boolean;
  createdAt: string;
  helpful: number;
}

export interface ShippingCalculator {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  destination: {
    country: string;
    city: string;
    zipCode: string;
  };
  origin: {
    country: string;
    city: string;
  };
}
