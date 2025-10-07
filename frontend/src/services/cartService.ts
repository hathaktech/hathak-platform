import { getCart as getCartAPI, addToCart as addToCartAPI, updateCartItem as updateCartItemAPI, removeFromCart as removeFromCartAPI, applyCoupon as applyCouponAPI, checkoutCart as checkoutCartAPI, getUserOrders as getUserOrdersAPI, getOrderById as getOrderByIdAPI } from './api';
import { Cart, AddToCartRequest, UpdateCartItemRequest, ApplyCouponRequest, Order, CreateOrderRequest } from '@/types/cart';

// Cart API calls
export const getCart = (serviceType: 'store' | 'buyme' = 'store'): Promise<{ data: Cart }> => getCartAPI(serviceType);
export const addToCart = (data: AddToCartRequest): Promise<{ data: Cart }> => {
  const requestData = {
    ...data,
    serviceType: data.serviceType || 'store'
  };
  return addToCartAPI(requestData);
};
export const updateCartItem = (productId: string, data: UpdateCartItemRequest): Promise<{ data: Cart }> => updateCartItemAPI(productId, data);
export const removeFromCart = (productId: string, options?: Record<string, any>): Promise<{ data: Cart }> => removeFromCartAPI(productId, options);

// Additional cart functions
export const applyCoupon = (data: ApplyCouponRequest): Promise<{ data: { message: string; discount: number; totalPrice: number } }> => applyCouponAPI(data);
export const checkoutCart = (data: CreateOrderRequest): Promise<{ data: { message: string; order: Order } }> => checkoutCartAPI(data);

// Order API calls
export const getUserOrders = (): Promise<{ data: Order[] }> => getUserOrdersAPI();
export const getOrderById = (id: string): Promise<{ data: Order }> => getOrderByIdAPI(id);

// Local storage helpers for guest cart
export const getGuestCart = (serviceType: 'store' | 'buyme' = 'store'): Cart => {
  if (typeof window === 'undefined') return { items: [], totalPrice: 0, discount: 0, tax: 0, serviceType };
  const cart = localStorage.getItem(`guestCart_${serviceType}`);
  return cart ? JSON.parse(cart) : { items: [], totalPrice: 0, discount: 0, tax: 0, serviceType };
};

export const saveGuestCart = (cart: Cart): void => {
  if (typeof window === 'undefined') return;
  const serviceType = cart.serviceType || 'store';
  localStorage.setItem(`guestCart_${serviceType}`, JSON.stringify(cart));
};

export const clearGuestCart = (serviceType: 'store' | 'buyme' = 'store'): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`guestCart_${serviceType}`);
};

// Cart utility functions
export const calculateSubtotal = (items: Cart['items']): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const calculateTotal = (subtotal: number, discount: number, tax: number): number => {
  return Math.max(subtotal - discount + tax, 0);
};
