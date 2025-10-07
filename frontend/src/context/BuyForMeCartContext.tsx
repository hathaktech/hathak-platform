'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { BuyForMeCartItem, getCartItems, createCartItem, updateCartItem, deleteCartItem } from '@/services/buyForMeCartApi';
import { useAuth } from './AuthContext';
import { useModernNotification } from './ModernNotificationContext';

// State interface
interface BuyForMeCartState {
  items: BuyForMeCartItem[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: BuyForMeCartState = {
  items: [],
  isLoading: false,
  error: null,
};

// Action types
type BuyForMeCartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_ITEMS'; payload: BuyForMeCartItem[] }
  | { type: 'ADD_ITEM'; payload: BuyForMeCartItem }
  | { type: 'UPDATE_ITEM'; payload: BuyForMeCartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_ITEMS' };

// Reducer
const buyForMeCartReducer = (state: BuyForMeCartState, action: BuyForMeCartAction): BuyForMeCartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_ITEMS':
      return { ...state, items: action.payload, isLoading: false, error: null };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload], isLoading: false, error: null };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item => 
          item._id === action.payload._id ? action.payload : item
        ),
        isLoading: false,
        error: null
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
        isLoading: false,
        error: null
      };
    case 'CLEAR_ITEMS':
      return { ...state, items: [], isLoading: false, error: null };
    default:
      return state;
  }
};

// Context interface
interface BuyForMeCartContextType {
  items: BuyForMeCartItem[];
  isLoading: boolean;
  error: string | null;
  loadCartItems: () => Promise<void>;
  addCartItem: (data: any) => Promise<BuyForMeCartItem>;
  updateCartItem: (productId: string, data: any) => Promise<BuyForMeCartItem>;
  removeCartItem: (productId: string) => Promise<void>;
  clearCart: () => void;
  getCartItemCount: () => number;
  getTotalValue: () => number;
}

// Create context
const BuyForMeCartContext = createContext<BuyForMeCartContextType | undefined>(undefined);

// Provider component
export const BuyForMeCartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(buyForMeCartReducer, initialState);
  const { isAuthenticated } = useAuth();
  const { showNotification } = useModernNotification();

  // Load cart items when component mounts and when auth status changes
  useEffect(() => {
    if (isAuthenticated !== undefined) {
      if (isAuthenticated) {
        loadCartItems();
      } else {
        dispatch({ type: 'CLEAR_ITEMS' });
      }
    }
  }, [isAuthenticated]);

  // Load cart items from API
  const loadCartItems = async () => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const items = await getCartItems();
      dispatch({ type: 'SET_ITEMS', payload: items });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      console.error('Error loading cart items:', error);
    }
  };

  // Add item to cart
  const addCartItem = async (data: any): Promise<BuyForMeCartItem> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newItem = await createCartItem(data);
      dispatch({ type: 'ADD_ITEM', payload: newItem });
      showNotification('success', 'Item added to cart!');
      return newItem;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification('error', error.message);
      throw error;
    }
  };

  // Update cart item
  const updateCartItem = async (productId: string, data: any): Promise<BuyForMeCartItem> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const updatedItem = await updateCartItem(productId, data);
      dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
      showNotification('success', 'Item updated!');
      return updatedItem;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification('error', error.message);
      throw error;
    }
  };

  // Remove item from cart
  const removeCartItem = async (productId: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await deleteCartItem(productId);
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
      showNotification('success', 'Item removed from cart!');
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification('error', error.message);
      throw error;
    }
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_ITEMS' });
  };

  // Get cart item count
  const getCartItemCount = (): number => {
    return state.items.length;
  };

  // Get total value
  const getTotalValue = (): number => {
    return state.items.reduce((total, item) => total + (item.estimatedPrice * item.quantity), 0);
  };

  const value: BuyForMeCartContextType = {
    items: state.items,
    isLoading: state.isLoading,
    error: state.error,
    loadCartItems,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart,
    getCartItemCount,
    getTotalValue,
  };

  return (
    <BuyForMeCartContext.Provider value={value}>
      {children}
    </BuyForMeCartContext.Provider>
  );
};

// Hook to use the context
export const useBuyForMeCart = (): BuyForMeCartContextType => {
  const context = useContext(BuyForMeCartContext);
  if (context === undefined) {
    throw new Error('useBuyForMeCart must be used within a BuyForMeCartProvider');
  }
  return context;
};
