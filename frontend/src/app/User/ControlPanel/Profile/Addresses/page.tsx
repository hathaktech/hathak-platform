'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useModernNotification } from '@/context/ModernNotificationContext';
import { useAddresses } from '@/context/AddressContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import { 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  X,
  Check,
  Home,
  Building,
  Mail
} from 'lucide-react';

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

export default function AddressesPage() {
  const { user } = useAuth();
  const { showNotification } = useModernNotification();
  
  // Add client-side check to prevent SSR issues
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const { addresses, loading, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddresses();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'home' as 'home' | 'work' | 'other',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAddress) {
        // Update existing address
        await updateAddress(editingAddress._id, formData);
        showNotification('success', 'Address updated successfully!');
      } else {
        // Add new address
        await addAddress({
          ...formData,
          isDefault: addresses.length === 0
        });
        showNotification('success', 'Address added successfully!');
      }
      
      setShowForm(false);
      setEditingAddress(null);
      setFormData({
        name: '',
        type: 'home',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: ''
      });
    } catch (error) {
      showNotification('error', 'Failed to save address');
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone
    });
    setShowForm(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }
    
    try {
      await deleteAddress(addressId);
      showNotification('success', 'Address deleted successfully!');
    } catch (error) {
      showNotification('error', 'Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId);
      showNotification('success', 'Default address updated!');
    } catch (error) {
      showNotification('error', 'Failed to update default address');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
    setFormData({
      name: '',
      type: 'home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: ''
    });
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="w-4 h-4" />;
      case 'work': return <Building className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  // Show loading state during SSR or when addresses are loading
  if (!isClient || loading) {
    return (
      <ProtectedRoute>
        <UserControlPanel>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-lg p-6">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </UserControlPanel>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <UserControlPanel>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-blue-900 bg-clip-text text-transparent">
                    Your Addresses
                  </h1>
                  <p className="text-slate-600">Manage your saved addresses for shipping</p>
                </div>
              </div>
            </div>

            {/* Add Address Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </button>
            </div>

            {/* Addresses Grid */}
            {addresses.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h3>
                <p className="text-gray-600 mb-6">Add your first address to get started</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`bg-white rounded-lg border-2 p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
                      address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${
                          address.isDefault ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {getAddressIcon(address.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{address.name}</h3>
                          {address.isDefault && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              <Check className="w-3 h-3" />
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(address)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit address"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(address._id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.zipCode}</p>
                      <p>{address.country}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Mail className="w-3 h-3" />
                        <span>{address.phone}</span>
                      </div>
                    </div>

                    {!address.isDefault && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleSetDefault(address._id)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Set as Default
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add/Edit Address Form Modal */}
            {showForm && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center p-4">
                  <div 
                    className="fixed inset-0 animate-in fade-in-0 duration-300 backdrop-blur-xs pointer-events-none" 
                  />
                  
                  <div className="relative bg-white/95 backdrop-blur-sm w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-500 ease-out animate-in fade-in-0 zoom-in-95 rounded-2xl shadow-2xl border border-white/20">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100/20 rounded-lg">
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold">
                              {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h2>
                            <p className="text-blue-100 text-sm">
                              {editingAddress ? 'Update your address information' : 'Add a new address to your account'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleCancel}
                          className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                      <div className="space-y-6">
                        {/* Address Name and Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., Home, Work, etc."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address Type *
                            </label>
                            <select
                              name="type"
                              value={formData.type}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="home">Home</option>
                              <option value="work">Work</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

                        {/* Street Address */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="123 Main Street"
                          />
                        </div>

                        {/* City, State, ZIP */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="New York"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State *
                            </label>
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="NY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ZIP Code *
                            </label>
                            <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="10001"
                            />
                          </div>
                        </div>

                        {/* Country and Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country *
                            </label>
                            <input
                              type="text"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="United States"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          {editingAddress ? 'Update Address' : 'Add Address'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </UserControlPanel>
    </ProtectedRoute>
  );
}
