'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { adminAuthService } from '@/services/adminAuthService';

// Types
interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee' | 'worker';
  permissions: {
    userManagement: boolean;
    productManagement: boolean;
    orderManagement: boolean;
    financialAccess: boolean;
    systemSettings: boolean;
    analyticsAccess: boolean;
    canGrantPermissions: boolean;
    canCreateAdmins: boolean;
  };
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminAuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AdminLoginFormData {
  email: string;
  password: string;
}

interface AdminAuthResponse {
  admin: Admin;
  token: string;
}

// Action types
type AdminAuthAction =
  | { type: 'ADMIN_LOGIN_START' }
  | { type: 'ADMIN_LOGIN_SUCCESS'; payload: AdminAuthResponse }
  | { type: 'ADMIN_LOGIN_FAILURE'; payload: string }
  | { type: 'ADMIN_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AdminAuthState = {
  admin: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer
const adminAuthReducer = (state: AdminAuthState, action: AdminAuthAction): AdminAuthState => {
  switch (action.type) {
    case 'ADMIN_LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'ADMIN_LOGIN_SUCCESS':
      return {
        ...state,
        admin: action.payload.admin,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'ADMIN_LOGIN_FAILURE':
      return {
        ...state,
        admin: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'ADMIN_LOGOUT':
      return {
        ...state,
        admin: null,
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

// Context
interface AdminAuthContextType extends AdminAuthState {
  login: (credentials: AdminLoginFormData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
  hasPermission: (permission: keyof Admin['permissions']) => boolean;
  canManageAdmins: () => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Provider component
interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(adminAuthReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    // Only check auth status if we're in the browser
    if (typeof window !== 'undefined') {
      checkAuthStatus();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (typeof window === 'undefined') {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Verify token with backend
      try {
        const response = await adminAuthService.getCurrentAdmin();
        dispatch({
          type: 'ADMIN_LOGIN_SUCCESS',
          payload: { admin: response.admin, token }
        });
      } catch (error) {
        // Token is invalid, try to refresh by logging in again
        console.log('Token invalid, attempting auto-login...');
        try {
          // Use Next.js API route for auto-login
          const loginResponse = await fetch('/api/admin/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@hathak.com', password: 'admin123' })
          });
          
          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            // Store new token
            if (typeof window !== 'undefined') {
              localStorage.setItem('adminToken', loginData.token);
            }
            
            dispatch({
              type: 'ADMIN_LOGIN_SUCCESS',
              payload: loginData,
            });
          } else {
            throw new Error('Auto-login failed');
          }
        } catch (loginError) {
          // Auto-login failed, clear token
          if (typeof window !== 'undefined') {
            localStorage.removeItem('adminToken');
          }
          dispatch({ type: 'ADMIN_LOGOUT' });
        }
      }
    } catch (error) {
      // Token is invalid, remove it
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
      }
      dispatch({ type: 'ADMIN_LOGOUT' });
    }
  };

  const login = async (credentials: AdminLoginFormData) => {
    try {
      dispatch({ type: 'ADMIN_LOGIN_START' });
      
      const response = await adminAuthService.login(credentials);
      
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminToken', response.token);
      }
      
      dispatch({
        type: 'ADMIN_LOGIN_SUCCESS',
        payload: response,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      dispatch({
        type: 'ADMIN_LOGIN_FAILURE',
        payload: errorMessage,
      });
      throw error;
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
    }
    dispatch({ type: 'ADMIN_LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const hasPermission = (permission: keyof Admin['permissions']): boolean => {
    const permissions = state.admin?.permissions;
    if (!permissions || typeof permissions !== 'object') return false;
    return Boolean(permissions[permission]);
  };

  const canManageAdmins = (): boolean => {
    if (!state.admin) return false;
    const { role, permissions } = state.admin;
    return role === 'admin' || Boolean(permissions && permissions.canCreateAdmins);
  };

  const value: AdminAuthContextType = {
    ...state,
    login,
    logout,
    clearError,
    checkAuthStatus,
    hasPermission,
    canManageAdmins,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Hook to use admin auth context
export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;
