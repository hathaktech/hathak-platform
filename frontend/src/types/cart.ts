export interface CartItem {
  _id?: string;
  product: {
    _id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
  };
  quantity: number;
  price: number;
  options?: Record<string, any>;
}

export interface Cart {
  _id?: string;
  user?: string;
  serviceType?: 'store' | 'buyme';
  items: CartItem[];
  totalPrice: number;
  discount: number;
  tax: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity?: number;
  options?: Record<string, any>;
  serviceType?: 'store' | 'buyme';
}

export interface UpdateCartItemRequest {
  quantity: number;
  options?: Record<string, any>;
}

export interface ApplyCouponRequest {
  code: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
  minCartValue?: number;
  expiresAt?: string;
  active: boolean;
}

export interface Order {
  _id: string;
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
    options?: Record<string, any>;
  }>;
  totalPrice: number;
  discount: number;
  tax: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  notes?: string;
  paymentMethod?: string;
}
