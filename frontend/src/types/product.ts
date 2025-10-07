export interface Product {
  _id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock?: number;
  trackQuantity?: boolean;
  allowBackorder?: boolean;
  category?: string | Category;
  subcategory?: string | Category;
  tags?: string[];
  type?: 'simple' | 'variable';
  variants?: string[] | ProductVariant[];
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
    order?: number;
  }>;
  videos?: Array<{
    url: string;
    thumbnail?: string;
    duration?: number;
    type: 'youtube' | 'vimeo' | 'upload';
  }>;
  weight?: {
    value: number;
    unit: 'g' | 'kg' | 'lb' | 'oz';
  };
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in' | 'm';
  };
  seller: string | Seller | SimpleSeller;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    slug?: string;
  };
  status?: 'draft' | 'active' | 'inactive' | 'archived' | 'pending_approval';
  visibility?: 'public' | 'private' | 'unlisted';
  features?: Array<{
    name: string;
    value: string;
    icon?: string;
  }>;
  badges: Array<{
    type: 'new' | 'sale' | 'bestseller' | 'trending' | 'limited' | 'exclusive' | 'featured';
    text: string;
    color: string;
  }>;
  shipping: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    freeShipping: boolean;
    shippingClass?: string;
    handlingTime: number;
    internationalShipping?: boolean;
  };
  analytics: {
    views: number;
    clicks?: number;
    conversions?: number;
    wishlistCount: number;
    lastViewed?: Date;
    lastSold?: Date;
  };
  reviews: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution?: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  publishedAt?: Date;
  lastRestocked?: Date;
  lastSold?: Date;
  createdAt: string;
  updatedAt?: string;
  
  // Virtual fields
  primaryImage?: {
    url: string;
    alt: string;
  };
  availability?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'backorder' | 'unavailable';
}

export interface ProductVariant {
  _id: string;
  productId: string | Product;
  sku?: string;
  options: Record<string, string>; // e.g., { "color": "red", "size": "M" }
  price?: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
  weight?: {
    value: number;
    unit: 'g' | 'kg' | 'lb' | 'oz';
  };
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in' | 'm';
  };
  images?: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
    order: number;
  }>;
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string | {
    url: string;
    alt: string;
  };
  parent?: string | Category;
  path?: string; // e.g., "electronics/laptops"
  level?: number;
  productCount: number;
  isActive?: boolean;
  subcategories?: Array<{
    _id: string;
    name: string;
    slug: string;
    productCount: number;
  }>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  attributes?: Array<{
    name: string;
    type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean';
    options?: string[];
    required: boolean;
    filterable: boolean;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Seller {
  _id: string;
  userId: string;
  businessName: string;
  businessType: 'individual' | 'company' | 'nonprofit';
  description?: string;
  website?: string;
  phone?: string;
  email: string;
  verified?: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    routingNumber?: string;
    swiftCode?: string;
    iban?: string;
  };
  taxInfo: {
    taxId: string;
    taxIdType: 'EIN' | 'SSN' | 'VAT' | 'other';
    taxExempt: boolean;
  };
  documents: {
    businessLicense?: string;
    taxCertificate?: string;
    identityDocument?: string;
    bankStatement?: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  verificationStatus: {
    identity: boolean;
    business: boolean;
    bank: boolean;
    tax: boolean;
  };
  commissionRate: number;
  performance: {
    totalSales: number;
    totalOrders: number;
    averageRating: number;
    responseTime: number; // in hours
    fulfillmentRate: number;
    returnRate: number;
  };
  settings: {
    autoAcceptOrders: boolean;
    notificationEmail: boolean;
    notificationSMS: boolean;
    vacationMode: boolean;
    vacationMessage?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Simplified seller interface for mock data
export interface SimpleSeller {
  businessName: string;
  verified?: boolean;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  rating?: number;
  availability?: string;
  freeShipping?: boolean;
  tags?: string[];
  seller?: string;
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'rating' | 'popular' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: {
    categories: Array<{ _id: string; name: string; count: number }>;
    brands: Array<{ name: string; count: number }>;
    priceRange: { min: number; max: number };
    ratings: Array<{ rating: number; count: number }>;
  };
}

export interface HomepageData {
  categories: Category[];
  featuredProducts: Product[];
  trendingProducts: Product[];
  newProducts: Product[];
  bestsellers: Product[];
  heroBanners: Array<{
    id: string;
    title: string;
    subtitle: string;
    image: string;
    ctaText: string;
    ctaLink: string;
    badge?: string;
    position: 'left' | 'center' | 'right';
  }>;
}
