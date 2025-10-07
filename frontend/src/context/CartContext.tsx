'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Cart, CartItem, AddToCartRequest } from '@/types/cart';
import { useAuth } from './AuthContext';
import { useModernNotification } from './ModernNotificationContext';
import * as cartService from '@/services/cartService';

// Separate cart states for store and buyme
interface CartState {
  store: Cart;
  buyme: Cart;
}

// Initial state
const initialState: CartState = {
  store: {
    items: [],
    totalPrice: 0,
    discount: 0,
    tax: 0,
    serviceType: 'store',
  },
  buyme: {
    items: [],
    totalPrice: 0,
    discount: 0,
    tax: 0,
    serviceType: 'buyme',
  },
};

// Action types
type CartAction =
  | { type: 'SET_CART'; payload: { cart: Cart; serviceType: 'store' | 'buyme' } }
  | { type: 'ADD_ITEM'; payload: { item: CartItem; serviceType: 'store' | 'buyme' } }
  | { type: 'UPDATE_ITEM'; payload: { itemId: string; quantity: number; serviceType: 'store' | 'buyme' } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string; serviceType: 'store' | 'buyme' } }
  | { type: 'CLEAR_CART'; payload: 'store' | 'buyme' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        [action.payload.serviceType]: action.payload.cart,
      };
    case 'ADD_ITEM':
      const targetCart = state[action.payload.serviceType];
      const existingItem = targetCart.items.find(
        item => item.product._id === action.payload.item.product._id
      );
      
      const updatedItems = existingItem
        ? targetCart.items.map(item =>
            item.product._id === action.payload.item.product._id
              ? { ...item, quantity: item.quantity + action.payload.item.quantity }
              : item
          )
        : [...targetCart.items, action.payload.item];
      
      return {
        ...state,
        [action.payload.serviceType]: {
          ...targetCart,
          items: updatedItems,
        },
      };
    case 'UPDATE_ITEM':
      const updateCart = state[action.payload.serviceType];
      return {
        ...state,
        [action.payload.serviceType]: {
          ...updateCart,
          items: updateCart.items.map(item =>
            item._id === action.payload.itemId
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
        },
      };
    case 'REMOVE_ITEM':
      const removeCart = state[action.payload.serviceType];
      return {
        ...state,
        [action.payload.serviceType]: {
          ...removeCart,
          items: removeCart.items.filter(item => item._id !== action.payload.itemId),
        },
      };
    case 'CLEAR_CART':
      return {
        ...state,
        [action.payload]: {
          items: [],
          totalPrice: 0,
          discount: 0,
          tax: 0,
          serviceType: action.payload,
        },
      };
    default:
      return state;
  }
};

// Context interface
interface CartContextType {
  store: Cart;
  buyme: Cart;
  isLoading: boolean;
  error: string | null;
  addToCart: (data: AddToCartRequest, serviceType?: 'store' | 'buyme') => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number, serviceType?: 'store' | 'buyme') => Promise<void>;
  removeFromCart: (itemId: string, serviceType?: 'store' | 'buyme') => Promise<void>;
  clearCart: (serviceType?: 'store' | 'buyme') => Promise<void>;
  loadCart: (serviceType?: 'store' | 'buyme') => Promise<void>;
  getCartItemCount: (serviceType?: 'store' | 'buyme') => number;
  getTotalCartItemCount: () => number;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const { showNotification } = useModernNotification();

  // Load both carts on mount and when auth status changes
  useEffect(() => {
    if (isAuthenticated !== undefined) {
      const loadBothCarts = async () => {
        setIsLoading(true);
        try {
          await Promise.all([
            loadCart('store'),
            loadCart('buyme')
          ]);
        } finally {
          setIsLoading(false);
        }
      };
      loadBothCarts();
    }
  }, [isAuthenticated]);

  // Load cart from backend or local storage
  const loadCart = async (serviceType: 'store' | 'buyme' = 'store') => {
    setError(null);
    
    try {
      if (isAuthenticated) {
        // Load from backend with service type
        const response = await cartService.getCart(serviceType);
        dispatch({ type: 'SET_CART', payload: { cart: response.data, serviceType } });
      } else {
        // Load from local storage with service type
        const guestCart = cartService.getGuestCart(serviceType);
        dispatch({ type: 'SET_CART', payload: { cart: guestCart, serviceType } });
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading cart:', err);
      throw err; // Re-throw to be caught by the calling function
    }
  };

  // Add item to cart
  const addToCart = async (data: AddToCartRequest, serviceType: 'store' | 'buyme' = 'store') => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isAuthenticated) {
        // Add to backend
        const response = await cartService.addToCart({ ...data, serviceType });
        dispatch({ type: 'SET_CART', payload: { cart: response.data, serviceType } });
        showNotification('success', 'Item added to cart!');
      } else {
        // Add to local storage
        const guestCart = cartService.getGuestCart(serviceType);
        const newItem: CartItem = {
          product: { _id: data.productId, name: '', price: 0 }, // Will be populated by backend
          quantity: data.quantity || 1,
          price: 0, // Will be set by backend
          options: data.options,
        };
        
        const updatedCart = {
          ...guestCart,
          items: [...guestCart.items, newItem],
        };
        
        cartService.saveGuestCart(updatedCart);
        dispatch({ type: 'SET_CART', payload: { cart: updatedCart, serviceType } });
        showNotification('success', 'Item added to cart!');
      }
    } catch (err: any) {
      setError(err.message);
      showNotification('error', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateItemQuantity = async (itemId: string, quantity: number, serviceType: 'store' | 'buyme' = 'store') => {
    if (quantity <= 0) {
      await removeFromCart(itemId, serviceType);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const targetCart = state[serviceType];
      if (isAuthenticated) {
        // Find the item to get productId and options
        const item = targetCart.items.find(item => item._id === itemId);
        if (!item) {
          throw new Error('Item not found in cart');
        }
        
        // Update in backend
        const response = await cartService.updateCartItem(item.product._id, { quantity, options: item.options });
        dispatch({ type: 'SET_CART', payload: { cart: response.data, serviceType } });
      } else {
        // Update in local storage
        const guestCart = cartService.getGuestCart(serviceType);
        const updatedCart = {
          ...guestCart,
          items: guestCart.items.map(item =>
            item._id === itemId ? { ...item, quantity } : item
          ),
        };
        
        cartService.saveGuestCart(updatedCart);
        dispatch({ type: 'SET_CART', payload: { cart: updatedCart, serviceType } });
      }
    } catch (err: any) {
      setError(err.message);
      showNotification('error', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string, serviceType: 'store' | 'buyme' = 'store') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const targetCart = state[serviceType];
      if (isAuthenticated) {
        // Find the item to get productId and options
        const item = targetCart.items.find(item => item._id === itemId);
        if (!item) {
          throw new Error('Item not found in cart');
        }
        
        // Remove from backend using productId and options
        const response = await cartService.removeFromCart(item.product._id, item.options);
        dispatch({ type: 'SET_CART', payload: { cart: response.data, serviceType } });
        showNotification('success', 'Item removed from cart');
      } else {
        // Remove from local storage
        const guestCart = cartService.getGuestCart(serviceType);
        const updatedCart = {
          ...guestCart,
          items: guestCart.items.filter(item => item._id !== itemId),
        };
        
        cartService.saveGuestCart(updatedCart);
        dispatch({ type: 'SET_CART', payload: { cart: updatedCart, serviceType } });
        showNotification('success', 'Item removed from cart');
      }
    } catch (err: any) {
      setError(err.message);
      showNotification('error', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cart
  const clearCart = async (serviceType: 'store' | 'buyme' = 'store') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const targetCart = state[serviceType];
      if (isAuthenticated) {
        // Clear backend cart by removing all items
        for (const item of targetCart.items) {
          if (item._id) {
            await cartService.removeFromCart(item._id);
          }
        }
      } else {
        // Clear local storage
        cartService.clearGuestCart(serviceType);
      }
      
      dispatch({ type: 'CLEAR_CART', payload: serviceType });
      showNotification('success', 'Cart cleared');
    } catch (err: any) {
      setError(err.message);
      showNotification('error', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get item count for specific cart
  const getCartItemCount = (serviceType: 'store' | 'buyme' = 'store') => {
    return state[serviceType].items.reduce((count, item) => count + item.quantity, 0);
  };

  // Get total item count across both carts
  const getTotalCartItemCount = () => {
    return state.store.items.reduce((count, item) => count + item.quantity, 0) +
           state.buyme.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    store: state.store,
    buyme: state.buyme,
    isLoading,
    error,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    loadCart,
    getCartItemCount,
    getTotalCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
