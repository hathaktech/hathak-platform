'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useModernNotification } from '@/context/ModernNotificationContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import { Package, Search, Plus, X, Calendar, DollarSign, Clock, CheckCircle2, AlertCircle, Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Updated interface for the new unified system
interface BuyForMeRequest {
  _id: string;
  requestNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: {
    _id: string;
    name: string;
    url: string;
    quantity: number;
    price: number;
    currency: string;
    description?: string;
    sizes?: string[];
    colors?: string[];
    images?: string[];
  }[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'approved' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled';
  subStatus?: string;
  priority: 'low' | 'medium' | 'high';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  trackingNumber?: string;
  notes?: string;
  reviewStatus: 'pending' | 'approved' | 'rejected' | 'needs_modification';
  createdAt: string;
  updatedAt: string;
}

// Simplified status mapping for customer view
const getCustomerStatusText = (request: BuyForMeRequest) => {
  // Check if request needs modification
  if (request.reviewStatus === 'needs_modification') {
    return 'Need to Modify';
  }

  // If user modified the request, show "In Review Again"
  if (request.modifiedByUser) {
    return 'In Review Again';
  }

  const statusMap = {
    'pending': 'Under Review',
    'approved': 'Ready to Pay',
    'in_progress': 'Processing',
    'shipped': 'On the Way',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  
  return statusMap[request.status] || 'Under Review';
};

const getStatusColor = (request: BuyForMeRequest) => {
  const statusText = getCustomerStatusText(request);
  const colors = {
    'Under Review': 'bg-blue-100 text-blue-800',
    'In Review Again': 'bg-purple-100 text-purple-800',
    'Need to Modify': 'bg-orange-100 text-orange-800',
    'Ready to Pay': 'bg-green-100 text-green-800',
    'Processing': 'bg-yellow-100 text-yellow-800',
    'On the Way': 'bg-indigo-100 text-indigo-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
  };
  return colors[statusText as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

// Request Details Modal Component
const RequestDetailsModal = ({ request, isOpen, onClose }: { request: BuyForMeRequest | null; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen || !request) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
                <p className="text-sm text-gray-600">Request #{request.requestNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Request Info */}
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Status</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request)}`}>
                    {getCustomerStatusText(request)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Items ({request.items.length})</h3>
                <div className="space-y-3">
                  {request.items.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Price: ${item.price} {item.currency}</p>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                        </div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Total Amount</h3>
                <div className="text-2xl font-bold text-gray-900">
                  ${request.totalAmount.toFixed(2)} {request.currency}
                </div>
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-6">
              {/* Dates */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Important Dates</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm font-medium">{formatDate(request.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Updated:</span>
                    <span className="text-sm font-medium">{formatDate(request.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                <div className="text-sm text-gray-600">
                  <p>{request.shippingAddress.name}</p>
                  <p>{request.shippingAddress.street}</p>
                  <p>{request.shippingAddress.city}, {request.shippingAddress.country}</p>
                  <p>{request.shippingAddress.postalCode}</p>
                </div>
              </div>

              {/* Tracking */}
              {request.trackingNumber && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Tracking</h3>
                  <div className="text-sm font-medium text-gray-900">
                    {request.trackingNumber}
                  </div>
                </div>
              )}

              {/* Notes */}
              {request.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                  <p className="text-sm text-gray-600">{request.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const BuyForMeRequestsPage = () => {
  const { user } = useAuth();
  const { showNotification } = useModernNotification();
  const [requests, setRequests] = useState<BuyForMeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<BuyForMeRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch user's BuyForMe requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/user/buyforme-requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setRequests(data.data);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch requests');
      }
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      showNotification('error', error.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  // Filter requests based on search term
  const filteredRequests = requests.filter(request =>
    request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewDetails = (request: BuyForMeRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  return (
    <ProtectedRoute>
      <UserControlPanel>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My BuyForMe Requests</h1>
                  <p className="text-gray-600 mt-2">Track your personal shopping requests</p>
                </div>
                <Link
                  href="/User/ControlPanel/BuyForMe/cart"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Request
                </Link>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Requests List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading requests...</span>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'No requests match your search.' : "You haven't made any BuyForMe requests yet."}
                </p>
                {!searchTerm && (
                  <Link
                    href="/User/ControlPanel/BuyForMe/cart"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Your First Request
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((request) => (
                  <div
                    key={request._id}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleViewDetails(request)}
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Package className="w-5 h-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            #{request.requestNumber}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request)}`}>
                          {getCustomerStatusText(request)}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-900 mb-2">
                          {request.items.length} item{request.items.length !== 1 ? 's' : ''}
                        </h3>
                        <div className="space-y-1">
                          {request.items.slice(0, 2).map((item, index) => (
                            <p key={index} className="text-sm text-gray-600 truncate">
                              {item.name} (x{item.quantity})
                            </p>
                          ))}
                          {request.items.length > 2 && (
                            <p className="text-sm text-gray-500">
                              +{request.items.length - 2} more items
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Total Amount */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">Total Amount</span>
                        <span className="font-semibold text-gray-900">
                          ${request.totalAmount.toFixed(2)} {request.currency}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Created {new Date(request.createdAt).toLocaleDateString()}</span>
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Modal */}
          <RequestDetailsModal
            request={selectedRequest}
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedRequest(null);
            }}
          />
        </div>
      </UserControlPanel>
    </ProtectedRoute>
  );
};

export default BuyForMeRequestsPage;
