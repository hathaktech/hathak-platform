'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Address {
  _id: string;
  name: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddressContextType {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  addAddress: (address: Omit<Address, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  getDefaultAddress: () => Address | null;
  refreshAddresses: () => Promise<void>;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const useAddresses = () => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    // Return a default context to prevent SSR errors
    console.warn('useAddresses called outside of AddressProvider, returning default values');
    return {
      addresses: [],
      loading: false,
      error: null,
      addAddress: async () => {},
      updateAddress: async () => {},
      deleteAddress: async () => {},
      setDefaultAddress: async () => {},
      getDefaultAddress: () => null,
      refreshAddresses: async () => {}
    };
  }
  return context;
};

interface AddressProviderProps {
  children: ReactNode;
}

export const AddressProvider: React.FC<AddressProviderProps> = ({ children }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Mock data for now - will be replaced with API calls
  const mockAddresses: Address[] = [
    {
      _id: '1',
      name: 'Home Address',
      type: 'home',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Work Address',
      type: 'work',
      street: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      phone: '+1 (555) 987-6543',
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const loadAddresses = async () => {
    if (!isAuthenticated || !isClient) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load addresses');
      }
      
      const data = await response.json();
      setAddresses(data.addresses);
    } catch (err) {
      setError('Failed to load addresses');
      console.error('Error loading addresses:', err);
      // Fallback to mock data for development
      setAddresses(mockAddresses);
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (addressData: Omit<Address, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!isClient) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add address');
      }
      
      const { address } = await response.json();
      setAddresses(prev => [...prev, address]);
    } catch (err) {
      setError('Failed to add address');
      throw err;
    }
  };

  const updateAddress = async (id: string, addressData: Partial<Address>) => {
    if (!isClient) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update address');
      }
      
      const { address } = await response.json();
      setAddresses(prev => prev.map(addr => 
        addr._id === id ? address : addr
      ));
    } catch (err) {
      setError('Failed to update address');
      throw err;
    }
  };

  const deleteAddress = async (id: string) => {
    if (!isClient) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete address');
      }
      
      setAddresses(prev => prev.filter(addr => addr._id !== id));
    } catch (err) {
      setError('Failed to delete address');
      throw err;
    }
  };

  const setDefaultAddress = async (id: string) => {
    if (!isClient) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/addresses/${id}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to set default address');
      }
      
      const { address } = await response.json();
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr._id === id
      })));
    } catch (err) {
      setError('Failed to set default address');
      throw err;
    }
  };

  const getDefaultAddress = (): Address | null => {
    return addresses.find(addr => addr.isDefault) || null;
  };

  const refreshAddresses = async () => {
    await loadAddresses();
  };

  // Set client state on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated && isClient) {
      loadAddresses();
    }
  }, [isAuthenticated, isClient]);

  const value: AddressContextType = {
    addresses: isClient ? addresses : [],
    loading: isClient ? loading : false,
    error: isClient ? error : null,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
    refreshAddresses
  };

  return (
    <AddressContext.Provider value={value}>
      {children}
    </AddressContext.Provider>
  );
};
