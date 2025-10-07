'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginFormData, RegisterFormData, AuthResponse } from '@/types/auth';
import { authService } from '@/services/authService';
import { useModernNotification } from './ModernNotificationContext';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Context interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginFormData) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { showNotification } = useModernNotification();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is already authenticated
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const user = await authService.getCurrentUser(token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error: any) {
      console.log('Token validation failed, clearing auth state:', error);
      localStorage.removeItem('token');
      
      // Check if it's a token expiry error
      const errorMessage = error?.response?.data?.code === 'TOKEN_EXPIRED' 
        ? 'Your session has expired. Please login again.' 
        : 'Session expired';
        
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
    }
  };

  // Login function
  const login = async (credentials: LoginFormData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response: AuthResponse = await authService.login(credentials);
      
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.user, token: response.token },
      });
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.message || 'Login failed',
      });
      showNotification('error', error.message || 'Login failed');
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterFormData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response: AuthResponse = await authService.register(userData);
      
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.user, token: response.token },
      });

      showNotification('success', `Welcome to HatHak, ${response.user.name}!`);
      return response; // Return the response for the registration flow
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.message || 'Registration failed',
      });
      showNotification('error', error.message || 'Registration failed');
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear the local state
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
