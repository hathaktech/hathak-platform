'use client';

import React, { useState, useEffect } from 'react';
import { useUnifiedBuyForMe } from '@/hooks/useUnifiedBuyForMe';
import { BuyForMeRequest } from '@/services/unifiedBuyForMeApi';
import { useAuth } from '@/context/AuthContext';
import { useModernNotification } from '@/context/ModernNotificationContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import { Package, Search, Plus, X, Calendar, DollarSign, Palette, Ruler, ExternalLink, Clock, CheckCircle2, MessageSquare, AlertCircle, User, Filter, MapPin } from 'lucide-react';
import Link from 'next/link';

// Helper functions for status handling
const getStatusText = (request: BuyForMeRequest) => {
  const statusMap = {
    pending: 'In Review',
    approved: 'Ready to Pay',
    in_progress: 'In Progress',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return statusMap[request.status] || 'In Review';
};

const getStatusColor = (request: BuyForMeRequest) => {
  const colorMap = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    shipped: 'bg-green-100 text-green-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colorMap[request.status] || 'bg-gray-100 text-gray-800';
};

const getPriorityColor = (priority: string) => {
  const colorMap = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };
  return colorMap[priority as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
};

// Request Card Component
const RequestCard: React.FC<{
  request: BuyForMeRequest;
  onViewDetails: (request: BuyForMeRequest) => void;
  onDelete: (id: string) => void;
}> = ({ request, onViewDetails, onDelete }) => {
  const totalItems = request.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{request.requestNumber}</h3>
            <p className="text-sm text-gray-500">
              {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request)}`}>
            {getStatusText(request)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
            {request.priority}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Package className="h-4 w-4 mr-2" />
          <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="h-4 w-4 mr-2" />
          <span>{request.totalAmount} {request.currency}</span>
        </div>
        {request.subStatus && (
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span className="capitalize">{request.subStatus.replace('_', ' ')}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => onViewDetails(request)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details
        </button>
        {request.status === 'cancelled' && (
          <button
            onClick={() => onDelete(request._id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

// Request Details Modal
const RequestDetailsModal: React.FC<{
  request: BuyForMeRequest | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}> = ({ request, onClose, onDelete }) => {
  if (!request) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Package className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{request.requestNumber}</h2>
                <p className="text-sm text-gray-600">Request Details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
            >
              <X className="h-6 w-6 text-gray-500 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Request Information</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(request)}`}>
                      {getStatusText(request)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">Priority</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">Created</span>
                    <span className="text-sm font-semibold text-gray-700">{new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">Total Amount</span>
                    <span className="text-sm font-bold text-green-600">{request.totalAmount} {request.currency}</span>
                  </div>
                </div>
              </div>

              {request.shippingAddress && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Shipping Address</h3>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-700 space-y-1">
                      <div className="font-bold text-gray-900">{request.shippingAddress.name}</div>
                      <div className="font-medium">{request.shippingAddress.street}</div>
                      <div className="font-medium">{request.shippingAddress.city}, {request.shippingAddress.country}</div>
                      <div className="font-medium">{request.shippingAddress.postalCode}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Items ({request.items.length})</h3>
              </div>
              <div className="space-y-4">
                {request.items.map((item, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                      <span className="text-sm font-bold text-green-600">{item.price} {item.currency}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantity</span>
                        <span className="font-bold text-gray-900">{item.quantity}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.sizes && item.sizes.length > 0 && (
                          <div className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-full">
                            <span className="text-xs font-semibold text-gray-600">Sizes:</span>
                            <span className="text-sm font-medium text-gray-800">{item.sizes.join(', ')}</span>
                          </div>
                        )}
                        {item.colors && item.colors.length > 0 && (
                          <div className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-full">
                            <span className="text-xs font-semibold text-gray-600">Colors:</span>
                            <span className="text-sm font-medium text-gray-800">{item.colors.join(', ')}</span>
                          </div>
                        )}
                      </div>
                      {item.description && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Description</span>
                          <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                        </div>
                      )}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="text-sm font-medium">View Product</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {request.notes && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Notes</h3>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">Your Notes</span>
                <p className="text-sm text-gray-700 mt-2">{request.notes}</p>
              </div>
            </div>
          )}

          {request.rejectionReason && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Rejection Reason</h3>
              </div>
              <div className="p-4 bg-red-50 rounded-xl border-l-4 border-red-400">
                <span className="text-sm font-bold text-red-700 uppercase tracking-wide">Reason</span>
                <p className="text-sm text-gray-700 mt-2">{request.rejectionReason}</p>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-t border-gray-200 rounded-b-3xl">
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-semibold border border-gray-300 hover:border-gray-400"
              >
                Close
              </button>
              {request.status === 'cancelled' && (
                <button
                  onClick={() => onDelete(request._id)}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold"
                >
                  Delete Request
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function UnifiedBuyForMeRequestsPage() {
  const { isAuthenticated } = useAuth();
  const { showNotification } = useModernNotification();
  
  const {
    requests,
    loading,
    error,
    pagination,
    statusCounts,
    fetchRequests,
    deleteRequestById,
    clearError
  } = useUnifiedBuyForMe();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<BuyForMeRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter requests based on search and status
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (request: BuyForMeRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await deleteRequestById(id);
        setIsModalOpen(false);
        setSelectedRequest(null);
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleRefresh = () => {
    fetchRequests();
  };

  if (!isAuthenticated) {
    return <ProtectedRoute />;
  }

  return (
    <UserControlPanel>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BuyForMe Requests</h1>
            <p className="text-gray-600">Manage your product purchase requests</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Package className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <Link
              href="/User/ControlPanel/BuyForMe/cart"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Link>
          </div>
        </div>

        {/* Statistics */}
        {statusCounts && Object.keys(statusCounts).length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="in_progress">In Progress</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
              <button
                onClick={clearError}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Requests Grid */}
        {!loading && (
          <>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter ? 'Try adjusting your search criteria.' : 'You haven\'t made any requests yet.'}
                </p>
                {!searchTerm && !statusFilter && (
                  <Link
                    href="/User/ControlPanel/BuyForMe/cart"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Request
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((request) => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    onViewDetails={handleViewDetails}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </div>

      {/* Request Details Modal */}
      <RequestDetailsModal
        request={selectedRequest}
        onClose={handleCloseModal}
        onDelete={handleDelete}
      />
    </UserControlPanel>
  );
}
