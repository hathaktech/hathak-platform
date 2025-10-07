'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface BoxContent {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    boxNumber: string;
  };
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

const BoxContentsManagement: React.FC = () => {
  const { user } = useAuth();
  const [boxContents, setBoxContents] = useState<BoxContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<BoxContent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    user: '',
    boxNumber: '',
    purchaseType: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  const statusColors = {
    arrived: 'bg-blue-100 text-blue-800',
    inspected: 'bg-yellow-100 text-yellow-800',
    ready_for_packing: 'bg-purple-100 text-purple-800',
    packed: 'bg-green-100 text-green-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    returned: 'bg-red-100 text-red-800',
    disposed: 'bg-gray-100 text-gray-800'
  };

  const fetchBoxContents = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...filters
      });

      const response = await fetch(`/api/box-contents/admin/all?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
    fetchBoxContents();
  }, [filters]);

  const handleStatusUpdate = async (id: string, newStatus: string, additionalData?: any) => {
    try {
      const response = await fetch(`/api/box-contents/admin/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status: newStatus,
          ...additionalData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Box Contents Management</h1>
          <p className="text-gray-600 mt-1">Manage warehouse operations and customer shipments</p>
        </div>
        <button
          onClick={() => {
            setSelectedContent(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Type</label>
            <select
              value={filters.purchaseType}
              onChange={(e) => setFilters({ ...filters, purchaseType: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="buy_me">Buy Me Service</option>
              <option value="customer_purchase">Customer Purchase</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Box Number</label>
            <input
              type="text"
              value={filters.boxNumber}
              onChange={(e) => setFilters({ ...filters, boxNumber: e.target.value })}
              placeholder="Enter box number"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
            <input
              type="text"
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              placeholder="Enter user email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{pagination.total}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">
            {boxContents.filter(item => item.status === 'arrived').length}
          </div>
          <div className="text-sm text-gray-600">Awaiting Inspection</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">
            {boxContents.filter(item => item.status === 'ready_for_packing').length}
          </div>
          <div className="text-sm text-gray-600">Ready for Packing</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">
            {boxContents.filter(item => item.status === 'shipped').length}
          </div>
          <div className="text-sm text-gray-600">In Transit</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Arrival Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {boxContents.map((content) => (
                <tr key={content._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {content.productImage && (
                        <img
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                          src={content.productImage}
                          alt={content.productName}
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {content.productName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Qty: {content.quantity}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {content.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Box #{content.user.boxNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      content.purchaseType === 'buy_me' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {content.purchaseType === 'buy_me' ? 'Buy Me' : 'Customer Purchase'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[content.status]}`}>
                      {content.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(content.arrivalDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(content.productPrice * content.quantity, content.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedContent(content);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedContent(content);
                        setShowModal(true);
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => fetchBoxContents(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchBoxContents(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{pagination.current}</span> of{' '}
                  <span className="font-medium">{pagination.pages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => fetchBoxContents(pagination.current - 1)}
                    disabled={pagination.current === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchBoxContents(pagination.current + 1)}
                    disabled={pagination.current === pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for viewing/editing box content */}
      {showModal && (
        <BoxContentModal
          content={selectedContent}
          onClose={() => {
            setShowModal(false);
            setSelectedContent(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

// Modal component for viewing/editing box content details
const BoxContentModal: React.FC<{
  content: BoxContent | null;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string, additionalData?: any) => void;
}> = ({ content, onClose, onStatusUpdate }) => {
  const [status, setStatus] = useState(content?.status || 'arrived');
  const [notes, setNotes] = useState('');
  const [condition, setCondition] = useState<'excellent' | 'good' | 'fair' | 'poor' | 'damaged'>('excellent');

  const handleSubmit = () => {
    if (content) {
      const additionalData: any = {};
      if (status === 'inspected') {
        additionalData.notes = notes;
        additionalData.condition = condition;
      }
      onStatusUpdate(content._id, status, additionalData);
    }
  };

  if (!content) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Box Content Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Product Information</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Product Name</label>
                  <p className="text-sm text-gray-900">{content.productName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Price</label>
                  <p className="text-sm text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: content.currency
                    }).format(content.productPrice * content.quantity)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Quantity</label>
                  <p className="text-sm text-gray-900">{content.quantity}</p>
                </div>
                {content.productDescription && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <p className="text-sm text-gray-900">{content.productDescription}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Customer Information</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Customer Name</label>
                  <p className="text-sm text-gray-900">{content.user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{content.user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Box Number</label>
                  <p className="text-sm text-gray-900">{content.user.boxNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Purchase Type</label>
                  <p className="text-sm text-gray-900">
                    {content.purchaseType === 'buy_me' ? 'Buy Me Service' : 'Customer Purchase'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Update Section */}
          <div className="mt-6 space-y-4">
            <h4 className="font-medium text-gray-900">Update Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
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
              {status === 'inspected' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="damaged">Damaged</option>
                  </select>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any notes about this item..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxContentsManagement;
