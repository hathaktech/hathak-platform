'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface BoxContent {
  _id: string;
  productName: string;
  productDescription?: string;
  productImage?: string;
  productPrice: number;
  currency: string;
  quantity: number;
  purchaseType: 'buy_me' | 'customer_purchase';
  buyMeRequest?: {
    _id: string;
    productName: string;
    productUrl: string;
    status: string;
  };
  orderId?: string;
  warehouseLocation: string;
  arrivalDate: string;
  trackingNumber?: string;
  status: 'arrived' | 'inspected' | 'ready_for_packing' | 'packed' | 'shipped' | 'delivered' | 'returned' | 'disposed';
  inspection: {
    inspectedBy?: string;
    inspectionDate?: string;
    condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
    notes?: string;
    images?: string[];
  };
  packing: {
    packedBy?: string;
    packedDate?: string;
    packageWeight?: number;
    packageDimensions?: {
      length: number;
      width: number;
      height: number;
    };
    packagingMaterials?: string[];
    notes?: string;
  };
  shipping: {
    shippingMethod?: string;
    shippingCost?: number;
    trackingNumber?: string;
    shippedDate?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
  };
  customerActions: {
    requestedPacking: boolean;
    packingRequestDate?: string;
    confirmedPacking: boolean;
    confirmationDate?: string;
    specialInstructions?: string;
  };
  fees: {
    handlingFee: number;
    storageFee: number;
    shippingFee: number;
    totalFees: number;
  };
  createdAt: string;
  updatedAt: string;
}

const BoxContentsView: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading, token } = useAuth();
  const [boxContents, setBoxContents] = useState<BoxContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<BoxContent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    purchaseType: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  const statusInfo = {
    arrived: { 
      color: 'bg-blue-100 text-blue-800', 
      icon: '📦', 
      description: 'Your item has arrived at our warehouse and is awaiting inspection.' 
    },
    inspected: { 
      color: 'bg-yellow-100 text-yellow-800', 
      icon: '🔍', 
      description: 'Your item has been inspected and is ready for the next step.' 
    },
    ready_for_packing: { 
      color: 'bg-purple-100 text-purple-800', 
      icon: '📋', 
      description: 'Your item is ready to be packed. You can request packing or confirm shipping.' 
    },
    packed: { 
      color: 'bg-green-100 text-green-800', 
      icon: '📦', 
      description: 'Your item has been packed and is ready for shipping.' 
    },
    shipped: { 
      color: 'bg-indigo-100 text-indigo-800', 
      icon: '🚚', 
      description: 'Your item is on its way to you!' 
    },
    delivered: { 
      color: 'bg-emerald-100 text-emerald-800', 
      icon: '✅', 
      description: 'Your item has been delivered successfully.' 
    },
    returned: { 
      color: 'bg-red-100 text-red-800', 
      icon: '↩️', 
      description: 'Your item was returned to the warehouse.' 
    },
    disposed: { 
      color: 'bg-gray-100 text-gray-800', 
      icon: '🗑️', 
      description: 'Your item has been disposed of.' 
    }
  };

  const fetchBoxContents = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...filters
      });

      const response = await fetch(`/api/box-contents/user/my-contents?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch box contents');
      }

      const data = await response.json();
      setBoxContents(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && isAuthenticated) {
      fetchBoxContents();
    }
  }, [filters, token, isAuthenticated]);

  const handleRequestPacking = async (id: string, specialInstructions?: string) => {
    try {
      const response = await fetch(`/api/box-contents/user/${id}/request-packing`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          specialInstructions
        })
      });

      if (!response.ok) {
        throw new Error('Failed to request packing');
      }

      // Refresh the list
      fetchBoxContents(pagination.current);
      setShowModal(false);
      setSelectedContent(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleConfirmPacking = async (id: string) => {
    try {
      const response = await fetch(`/api/box-contents/user/${id}/confirm-packing`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to confirm packing');
      }

      // Refresh the list
      fetchBoxContents(pagination.current);
      setShowModal(false);
      setSelectedContent(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to view your box contents.</p>
          <a 
            href="/auth/login" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">My Box Contents</h1>
          <p className="text-xs text-slate-600 mt-0.5">Track and manage your items at HatHak Centre</p>
        </div>

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="arrived">Arrived</option>
                <option value="inspected">Inspected</option>
                <option value="ready_for_packing">Ready for Packing</option>
                <option value="packed">Packed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="returned">Returned</option>
                <option value="disposed">Disposed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Purchase Type</label>
              <select
                value={filters.purchaseType}
                onChange={(e) => setFilters({ ...filters, purchaseType: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="buy_me">Buy Me Service</option>
                <option value="customer_purchase">Customer Purchase</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg">
            <div className="text-sm font-bold text-blue-600">{pagination.total}</div>
            <div className="text-xs text-slate-600">Total Items</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg">
            <div className="text-sm font-bold text-yellow-600">
              {boxContents.filter(item => item.status === 'arrived').length}
            </div>
            <div className="text-xs text-slate-600">Awaiting Inspection</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg">
            <div className="text-sm font-bold text-purple-600">
              {boxContents.filter(item => item.status === 'ready_for_packing').length}
            </div>
            <div className="text-xs text-slate-600">Ready for Packing</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg">
            <div className="text-sm font-bold text-green-600">
              {boxContents.filter(item => item.status === 'shipped').length}
            </div>
            <div className="text-xs text-slate-600">In Transit</div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {boxContents.map((content) => (
            <div key={content._id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg overflow-hidden hover:shadow-md transition-shadow">
              {/* Product Image */}
              {content.productImage && (
                <div className="h-32 bg-gray-200">
                  <img
                    src={content.productImage}
                    alt={content.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-3">
                {/* Product Name */}
                <h3 className="text-xs font-semibold text-gray-900 mb-2 line-clamp-2">
                  {content.productName}
                </h3>

                {/* Purchase Type */}
                <div className="mb-1.5">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                    content.purchaseType === 'buy_me' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {content.purchaseType === 'buy_me' ? 'Buy Me Service' : 'Customer Purchase'}
                  </span>
                </div>

                {/* Status */}
                <div className="mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">{statusInfo[content.status].icon}</span>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${statusInfo[content.status].color}`}>
                      {content.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {statusInfo[content.status].description}
                  </p>
                </div>

                {/* Price and Quantity */}
                <div className="mb-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Value:</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {formatCurrency(content.productPrice * content.quantity, content.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Quantity:</span>
                    <span className="text-xs text-gray-900">{content.quantity}</span>
                  </div>
                </div>

                {/* Arrival Date */}
                <div className="mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Arrived:</span>
                    <span className="text-xs text-gray-900">{formatDate(content.arrivalDate)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-1.5">
                  <button
                    onClick={() => {
                      setSelectedContent(content);
                      setShowModal(true);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1 px-1.5 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                  {(content.status === 'ready_for_packing' || content.status === 'inspected') && (
                    <button
                      onClick={() => {
                        setSelectedContent(content);
                        setShowModal(true);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1 px-1.5 rounded-lg transition-colors"
                    >
                      {content.customerActions.requestedPacking ? 'Confirm' : 'Request Packing'}
                    </button>
                  )}
                </div>
            </div>
          </div>
        ))}
      </div>

        {/* Empty State */}
        {boxContents.length === 0 && !loading && (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">📦</div>
            <h3 className="text-xs font-medium text-gray-900 mb-1.5">No items found</h3>
            <p className="text-xs text-gray-600">
              {filters.status || filters.purchaseType 
                ? 'No items match your current filters.' 
                : 'You don\'t have any items in your box yet.'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-3">
            <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
              <button
                onClick={() => fetchBoxContents(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="relative inline-flex items-center px-1.5 py-1 rounded-l-lg border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="relative inline-flex items-center px-2 py-1 border border-gray-300 bg-white text-xs font-medium text-gray-700">
                Page {pagination.current} of {pagination.pages}
              </span>
              <button
                onClick={() => fetchBoxContents(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
                className="relative inline-flex items-center px-1.5 py-1 rounded-r-lg border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Modal for viewing details and actions */}
        {showModal && selectedContent && (
          <BoxContentModal
            content={selectedContent}
            onClose={() => {
              setShowModal(false);
              setSelectedContent(null);
            }}
            onRequestPacking={handleRequestPacking}
            onConfirmPacking={handleConfirmPacking}
          />
        )}
      </div>
    </div>
  );
};

// Modal component for viewing box content details and actions
const BoxContentModal: React.FC<{
  content: BoxContent;
  onClose: () => void;
  onRequestPacking: (id: string, specialInstructions?: string) => void;
  onConfirmPacking: (id: string) => void;
}> = ({ content, onClose, onRequestPacking, onConfirmPacking }) => {
  const [specialInstructions, setSpecialInstructions] = useState(content.customerActions.specialInstructions || '');

  const statusInfo = {
    arrived: { 
      color: 'bg-blue-100 text-blue-800', 
      icon: '📦', 
      description: 'Your item has arrived at our warehouse and is awaiting inspection.' 
    },
    inspected: { 
      color: 'bg-yellow-100 text-yellow-800', 
      icon: '🔍', 
      description: 'Your item has been inspected and is ready for the next step.' 
    },
    ready_for_packing: { 
      color: 'bg-purple-100 text-purple-800', 
      icon: '📋', 
      description: 'Your item is ready to be packed. You can request packing or confirm shipping.' 
    },
    packed: { 
      color: 'bg-green-100 text-green-800', 
      icon: '📦', 
      description: 'Your item has been packed and is ready for shipping.' 
    },
    shipped: { 
      color: 'bg-indigo-100 text-indigo-800', 
      icon: '🚚', 
      description: 'Your item is on its way to you!' 
    },
    delivered: { 
      color: 'bg-emerald-100 text-emerald-800', 
      icon: '✅', 
      description: 'Your item has been delivered successfully.' 
    },
    returned: { 
      color: 'bg-red-100 text-red-800', 
      icon: '↩️', 
      description: 'Your item was returned to the warehouse.' 
    },
    disposed: { 
      color: 'bg-gray-100 text-gray-800', 
      icon: '🗑️', 
      description: 'Your item has been disposed of.' 
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-4 border w-11/12 max-w-4xl shadow-lg rounded-xl bg-white/95 backdrop-blur-sm">
        <div className="mt-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Item Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Product Information */}
            <div className="space-y-3">
              {content.productImage && (
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={content.productImage}
                    alt={content.productName}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">{content.productName}</h4>
                {content.productDescription && (
                  <p className="text-xs text-gray-600 mb-3">{content.productDescription}</p>
                )}
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Price:</span>
                    <span className="text-xs font-semibold">
                      {formatCurrency(content.productPrice * content.quantity, content.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Quantity:</span>
                    <span className="text-xs">{content.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Purchase Type:</span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      content.purchaseType === 'buy_me' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {content.purchaseType === 'buy_me' ? 'Buy Me Service' : 'Customer Purchase'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Timeline */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-medium text-gray-900 mb-2">Current Status</h4>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">{statusInfo[content.status].icon}</span>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${statusInfo[content.status].color}`}>
                    {content.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{statusInfo[content.status].description}</p>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-xs font-medium text-gray-900 mb-2">Timeline</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">Arrived at Warehouse</p>
                      <p className="text-xs text-gray-600">{formatDate(content.arrivalDate)}</p>
                    </div>
                  </div>
                  
                  {content.inspection.inspectionDate && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">Inspected</p>
                        <p className="text-xs text-gray-600">{formatDate(content.inspection.inspectionDate)}</p>
                        {content.inspection.condition && (
                          <p className="text-xs text-gray-500">Condition: {content.inspection.condition}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {content.packing.packedDate && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">Packed</p>
                        <p className="text-xs text-gray-600">{formatDate(content.packing.packedDate)}</p>
                      </div>
                    </div>
                  )}
                  
                  {content.shipping.shippedDate && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">Shipped</p>
                        <p className="text-xs text-gray-600">{formatDate(content.shipping.shippedDate)}</p>
                        {content.shipping.trackingNumber && (
                          <p className="text-xs text-blue-600">Tracking: {content.shipping.trackingNumber}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Actions */}
              {(content.status === 'ready_for_packing' || content.status === 'inspected') && (
                <div>
                  <h4 className="text-xs font-medium text-gray-900 mb-2">Actions</h4>
                  {!content.customerActions.requestedPacking ? (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Special Instructions (Optional)
                        </label>
                        <textarea
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value)}
                          rows={2}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Any special instructions for packing this item..."
                        />
                      </div>
                      <button
                        onClick={() => onRequestPacking(content._id, specialInstructions)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition-colors"
                      >
                        Request Packing
                      </button>
                    </div>
                  ) : !content.customerActions.confirmedPacking ? (
                    <div className="space-y-2">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                        <p className="text-xs text-yellow-800">
                          You have requested packing for this item. Please confirm to proceed with shipping.
                        </p>
                        {content.customerActions.specialInstructions && (
                          <p className="text-xs text-yellow-700 mt-1">
                            Your instructions: {content.customerActions.specialInstructions}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onConfirmPacking(content._id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition-colors"
                      >
                        Confirm Packing & Shipping
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                      <p className="text-xs text-green-800">
                        ✅ You have confirmed packing for this item. We will process your request shortly.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxContentsView;
