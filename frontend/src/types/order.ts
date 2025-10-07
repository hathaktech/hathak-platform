export interface OrderProduct {
  productId: string;
  quantity: number;
  price: number;
  options?: Record<string, any>;
}

export interface Order {
  _id: string;
  userId: string;
  products: OrderProduct[];
  totalPrice: number;
  discount: number;
  tax: number;
  notes?: string;
  paymentMethod: string;
  status: 'pending' | 'approved' | 'purchased' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  products: OrderProduct[];
  notes?: string;
  paymentMethod?: string;
}
