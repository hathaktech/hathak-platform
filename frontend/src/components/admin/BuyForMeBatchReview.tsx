'use client';

import { useState, useEffect } from 'react';
import { useModernNotification } from '@/context/ModernNotificationContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { 
  CheckCircle, XCircle, Edit, MessageSquare, AlertTriangle,
  Package, DollarSign, Calendar, User, Mail, MapPin, ExternalLink,
  Clock, AlertCircle, Info, ShoppingCart, Truck, Warehouse, X, ArrowLeft, ArrowRight,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// Each item is treated as an independent request
interface IndividualBuyForMeRequest {
  _id: string;
  id: string;
  requestNumber: string; // Each item gets its own request number (e.g., REQ-001, REQ-002)
  customerId: string;
  customerName: string;
  customerEmail: string;
  
  // Single item data (no longer an array)
  itemName: string;
  itemUrl: string;
  quantity: number;
  price: number;
  currency: string;
  description?: string;
  sizes?: string[];
  colors?: string[];
  images?: string[];
  
  // Request metadata
  totalAmount: number;
  status: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  
  // Review data
  reviewStatus?: 'pending' | 'approved' | 'rejected' | 'needs_modification';
  reviewComments?: {
    comment: string;
    adminName: string;
    createdAt: string;
    isInternal: boolean;
  }[];
  rejectionReason?: string;
  
  // Shipping details
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
    phone?: string;
  };
  
  // Modifications
  modifiedByUser?: boolean;
  modifiedByAdmin?: boolean;
  adminModificationDate?: string;
  adminModificationNote?: string;
  lastModifiedByAdmin?: string;
  originalValues?: any;
  modificationHistory?: any[];
  
}

// Bulk request interface for the modal - just groups individual requests
interface BulkBuyForMePackage {
  batchName: string; // e.g., "John Doe - 3 items - Jan 15"
  customerInfo: {
    customerId: string;
    customerName: string;
    customerEmail: string;
  };
  individualRequests: IndividualBuyForMeRequest[];
  submittedAt: string;
  batchPriority: 'low' | 'medium' | 'high';
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
    phone?: string;
  };
}

interface BuyForMeBatchReviewProps {
  batchPackage: BulkBuyForMePackage;
  onReview: (reviewData: any) => void;
  onClose: () => void;
  onRequestUpdate?: (updatedRequests: IndividualBuyForMeRequest[]) => void;
}

const BuyForMeBatchReview: React.FC<BuyForMeBatchReviewProps> = ({
  batchPackage,
  onReview,
  onClose,
  onRequestUpdate
}) => {
  const { showNotification } = useModernNotification();
  const { admin } = useAdminAuth();
  const [activeRequestIndex, setActiveRequestIndex] = useState(0);
  const [batchComment, setBatchComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  
  // Individual requests management
  const [individualRequests, setIndividualRequests] = useState<IndividualBuyForMeRequest[]>(batchPackage.individualRequests);
  const [batchReviewStatuses, setBatchReviewStatuses] = useState<Record<number, 'approved' | 'rejected' | 'needs_modification'>>({});
  const [batchComments, setBatchComments] = useState<Record<number, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [, setEditingRequestIndex] = useState<number | null>(null);
  const [, setEditedValues] = useState({
    productName: '',
    productLink: '',
    quantity: 1,
    price: 0,
    size: '',
    color: '',
    notes: '',
  });

  // Navigation
  const totalRequests = individualRequests.length;
  const canGoNext = activeRequestIndex < totalRequests - 1;
  const canGoPrev = activeRequestIndex > 0;

  // Initialize individual request review statuses (no pre-selection)
  useEffect(() => {
    setBatchReviewStatuses({});
    setBatchComments({});
  }, [individualRequests]);

  const handleRequestReviewStatusChange = (requestIndex: number, status: 'approved' | 'rejected' | 'needs_modification') => {
    setBatchReviewStatuses(prev => ({
      ...prev,
      [requestIndex]: status
    }));
  };

  const handleRequestCommentChange = (requestIndex: number, comment: string) => {
    setBatchComments(prev => ({
      ...prev,
      [requestIndex]: comment
    }));
  };

  // Calculate total amount based on approved requests (excluding unreviewed requests)
  const calculateBatchTotalAmount = () => {
    return individualRequests.reduce((total, request, index) => {
      const requestStatus = batchReviewStatuses[index];
      if (requestStatus === 'approved' || requestStatus === 'needs_modification') {
        return total + request.totalAmount;
      }
      return total;
    }, 0);
  };

  const getApprovedRequestsCount = () => {
    return individualRequests.filter((_, index) => {
      const status = batchReviewStatuses[index];
      return status === 'approved' || status === 'needs_modification';
    }).length;
  };

  const formatPrice = (price: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(price);
  };

  const getColorSwatch = (color: string) => {
    const colorMap: Record<string, string> = {
      'black': '#000000', 'white': '#FFFFFF', 'red': '#EF4444', 'blue': '#3B82F6',
      'green': '#22C55E', 'yellow': '#F59E0B', 'purple': '#8B5CF6', 'pink': '#EC4899',
      'orange': '#F97316', 'brown': '#A3A3A3', 'gray': '#6B7280', 'grey': '#6B7280',
      'navy': '#1E3A8A', 'beige': '#F5F5DC', 'gold': '#FFD700', 'silver': '#C0C0C0',
      'rose gold': '#E8B4B8', 'maroon': '#800000', 'teal': '#14B8A6', 'coral': '#FF7F50',
      'lavender': '#E6E6FA', 'mint': '#98FB98', 'cream': '#FFFDD0'
    };
    
    return colorMap[color.toLowerCase()] || '#E5E7EB';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';

    }
  };

  // Check if batch review can be submitted
  const canSubmitBatchReview = () => {
    // Check if all individual requests have been reviewed
    const unreviewedRequests = individualRequests.filter((_, index) => !batchReviewStatuses[index]);
    if (unreviewedRequests.length > 0) {
      return false;
    }

    // Check if all rejected/needs_modification requests have comments
    const hasRejectedRequests = Object.values(batchReviewStatuses).some(status => status === 'rejected');
    const hasModifiedRequests = Object.values(batchReviewStatuses).some(status => status === 'needs_modification');
    
    if (hasRejectedRequests || hasModifiedRequests) {
      for (const [index, status] of Object.entries(batchReviewStatuses)) {
        const requestIndex = parseInt(index);
        if ((status === 'rejected' || status === 'needs_modification') && !batchComments[requestIndex]?.trim()) {
          return false;
        }
      }
    }

    return true;
  };

  // Get validation message for current state
  const getValidationMessage = () => {
    // Check if all individual requests have been reviewed
    const unreviewedRequests = individualRequests.filter((_, index) => !batchReviewStatuses[index]);
    if (unreviewedRequests.length > 0) {
      const unreviewedCount = unreviewedRequests.length;
      return `${unreviewedCount} request${unreviewedCount > 1 ? 's' : ''} need to be reviewed`;
    }

    // Check if all rejected/needs_modification requests have comments
    const hasRejectedRequests = Object.values(batchReviewStatuses).some(status => status === 'rejected');
    const hasModifiedRequests = Object.values(batchReviewStatuses).some(status => status === 'needs_modification');
    
    if (hasRejectedRequests || hasModifiedRequests) {
      for (const [index, status] of Object.entries(batchReviewStatuses)) {
        const requestIndex = parseInt(index);
        if ((status === 'rejected' || status === 'needs_modification') && !batchComments[requestIndex]?.trim()) {
          return `Comment required for request ${requestIndex + 1}`;
        }
      }
    }

    return '';
  };

  const handleBatchReview = async () => {
    if (!canSubmitBatchReview()) {
      showNotification('error', `Cannot submit: ${getValidationMessage()}`);
      return;
    }

    // Prepare comprehensive batch review data
    const reviewData = {
      // Batch info
      batchName: batchPackage.batchName,
      
      // Individual request reviews
      individualReviews: individualRequests.map((request, index) => ({
        requestId: request._id,
        requestNumber: request.requestNumber,
        reviewStatus: batchReviewStatuses[index] || 'approved',
        comment: batchComments[index] || '',
        requestData: request
      })),

      // Batch information
      batchComment: batchComment.trim() || '',
      isInternal,
      adminId: admin?.id || admin?.adminId,
      adminName: admin?.name || 'Admin',
      
      // Summary information
      summary: {
        totalRequests: individualRequests.length,
        approvedCount: Object.values(batchReviewStatuses).filter(status => status === 'approved').length,
        needsModificationCount: Object.values(batchReviewStatuses).filter(status => status === 'needs_modification').length,
        rejectedCount: Object.values(batchReviewStatuses).filter(status => status === 'rejected').length,
        requestNumbers: individualRequests.map(request => request.requestNumber)
      }
    };

    onReview(reviewData);
  };

  const getRequestsSummary = () => {
    const approved = individualRequests.filter((_, index) => 
      batchReviewStatuses[index] === 'approved'
    ).length;
    const rejected = individualRequests.filter((_, index) => 
      batchReviewStatuses[index] === 'rejected'
    ).length;
    const needsModification = individualRequests.filter((_, index) => 
      batchReviewStatuses[index] === 'needs_modification'
    ).length;
    const unreviewed = individualRequests.filter((_, index) => 
      !batchReviewStatuses[index]
    ).length;
    
    return { approved, rejected, needsModification, unreviewed };
  };

  const currentRequest = individualRequests[activeRequestIndex];
  const requestsSummary = getRequestsSummary();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-2 mx-auto p-4 border w-11/12 max-w-7xl shadow-2xl rounded-lg bg-white max-h-[98vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Review BuyForMe Batch - Independent Requests
              </h3>
              <p className="text-sm text-gray-600">
                {batchPackage.batchName} • {batchPackage.customerInfo.customerName} • {totalRequests} request{totalRequests !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Customer Information */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 sticky top-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Batch Info
              </h4>
              <div className="space-y-2">
                <div className="bg-white p-2 rounded border">
                  <p className="text-xs text-gray-500 mb-1">Customer</p>
                  <p className="text-xs font-semibold text-gray-900 truncate">{batchPackage.customerInfo.customerName}</p>
                </div>
                <div className="bg-white p-2 rounded border">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-xs font-semibold text-gray-900 truncate flex items-center">
                    <Mail className="w-3 h-3 mr-1 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{batchPackage.customerInfo.customerEmail}</span>
                  </p>
                </div>
                <div className="bg-white p-2 rounded border">
                  <p className="text-xs text-gray-500 mb-1">Batch Priority</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(batchPackage.batchPriority)}`}>
                    {batchPackage.batchPriority}
                  </span>
                </div>
                <div className="bg-white p-2 rounded border">
                  <p className="text-xs text-gray-500 mb-1">Submitted</p>
                  <p className="text-xs font-semibold text-gray-900">
                    {new Date(batchPackage.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                
                {/* Requests Summary */}
                <div className="bg-white p-2 rounded border">
                  <p className="text-xs text-gray-500 mb-2">Requests Summary</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-green-600">Approved:</span>
                      <span className="text-xs font-semibold">{requestsSummary.approved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-yellow-600">Needs Mod:</span>
                      <span className="text-xs font-semibold">{requestsSummary.needsModification}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-red-600">Rejected:</span>
                      <span className="text-xs font-semibold">{requestsSummary.rejected}</span>
                    </div>
                    <div className={`flex justify-between ${requestsSummary.unreviewed > 0 ? 'bg-yellow-50 px-2 py-1 rounded border border-yellow-200' : ''}`}>
                      <span className={`text-xs ${requestsSummary.unreviewed > 0 ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>Unreviewed:</span>
                      <span className={`text-xs font-semibold ${requestsSummary.unreviewed > 0 ? 'text-orange-700' : ''}`}>{requestsSummary.unreviewed}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">

            {/* Request Navigation */}
            {totalRequests > 1 && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveRequestIndex(Math.max(0, activeRequestIndex - 1))}
                    disabled={!canGoPrev}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      canGoPrev ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      Request {activeRequestIndex + 1} of {totalRequests}
                    </span>
                    <div className="flex space-x-1">
                      {individualRequests.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveRequestIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === activeRequestIndex 
                              ? 'bg-blue-600' 
                              : batchReviewStatuses[index] === 'approved' 
                                ? 'bg-green-400' 
                                : batchReviewStatuses[index] === 'rejected' 
                                  ? 'bg-red-400' 
                                  : batchReviewStatuses[index] === 'needs_modification'
                                    ? 'bg-yellow-400'
                                    : 'bg-gray-300' // unreviewed requests
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setActiveRequestIndex(Math.min(totalRequests - 1, activeRequestIndex + 1))}
                    disabled={!canGoNext}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      canGoNext ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Current Individual Request Details */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900 flex items-center">
                    <Package className="w-4 h-4 mr-2 text-blue-600" />
                    Item from {currentRequest.requestNumber}: {currentRequest.itemName}
                  </h4>
                  <div className="mt-1">
                    <span className="text-xs text-gray-500">Individual Request</span>
                    <span className="text-xs font-medium text-green-700 ml-1 bg-green-50 px-2 py-0.5 rounded">
                      Independent processing
                    </span>
                  </div>
                </div>
              </div>

              {/* Request Review Status */}
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm font-medium text-gray-700">Review Status:</span>
                <div className="flex space-x-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`requestReviewStatus-${activeRequestIndex}`}
                      value="approved"
                      checked={batchReviewStatuses[activeRequestIndex] === 'approved'}
                      onChange={(e) => handleRequestReviewStatusChange(activeRequestIndex, 'approved')}
                      className="text-green-600"
                    />
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                      <span className="font-medium text-green-800 text-sm">Approve</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`requestReviewStatus-${activeRequestIndex}`}
                      value="needs_modification"
                      checked={batchReviewStatuses[activeRequestIndex] === 'needs_modification'}
                      onChange={(e) => handleRequestReviewStatusChange(activeRequestIndex, 'needs_modification')}
                      className="text-yellow-600"
                    />
                    <div className="flex items-center">
                      <Edit className="w-4 h-4 text-yellow-600 mr-1" />
                      <span className="font-medium text-yellow-800 text-sm">Modify</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`requestReviewStatus-${activeRequestIndex}`}
                      value="rejected"
                      checked={batchReviewStatuses[activeRequestIndex] === 'rejected'}
                      onChange={(e) => handleRequestReviewStatusChange(activeRequestIndex, 'rejected')}
                      className="text-red-600"
                    />
                    <div className="flex items-center">
                      <XCircle className="w-4 h-4 text-red-600 mr-1" />
                      <span className="font-medium text-red-800 text-sm">Reject</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Request-specific Comment */}
              {(batchReviewStatuses[activeRequestIndex] === 'rejected' || batchReviewStatuses[activeRequestIndex] === 'needs_modification') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment for this request *
                  </label>
                  <textarea
                    value={batchComments[activeRequestIndex] || ''}
                    onChange={(e) => handleRequestCommentChange(activeRequestIndex, e.target.value)}
                    placeholder={
                      batchReviewStatuses[activeRequestIndex] === 'needs_modification' 
                        ? "What modifications are needed for this request?" 
                      : "Why is this request being rejected?"
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows={2}
                  />
                </div>
              )}

              {/* Request Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Product Name */}
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs font-medium text-gray-600 mb-2">Product Name</p>
                  <p className="text-sm text-gray-900">{currentRequest.itemName}</p>
                </div>
                
                {/* Product Link */}
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs font-medium text-gray-600 mb-2">Product Link</p>
                  <a 
                    href={currentRequest.itemUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center break-all"
                  >
                    <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{currentRequest.itemUrl}</span>
                  </a>
                </div>
                
                {/* Quantity */}
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs font-medium text-gray-600 mb-2">Quantity</p>
                  <p className="text-sm text-gray-900">{currentRequest.quantity}</p>
                </div>
                
                {/* Price */}
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs font-medium text-gray-600 mb-2">Total Price</p>
                  <p className="text-sm text-gray-900">{formatPrice(currentRequest.totalAmount, currentRequest.currency)}</p>
                </div>
                
                {/* Size */}
                {currentRequest.sizes && currentRequest.sizes.length > 0 && (
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-xs font-medium text-gray-600 mb-2">Size</p>
                    <p className="text-sm text-gray-900">{currentRequest.sizes.join(', ')}</p>
                  </div>
                )}
                
                {/* Color */}
                {currentRequest.colors && currentRequest.colors.length > 0 && (
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-xs font-medium text-gray-600 mb-2">Color</p>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: getColorSwatch(currentRequest.colors[0]) }}
                      />
                      <span className="text-sm text-gray-900">{currentRequest.colors.join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Description */}
              {currentRequest.description && (
                <div className="bg-white p-3 rounded-lg border md:col-span-2 mb-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">Additional Notes</p>
                  <p className="text-sm text-gray-900">{currentRequest.description}</p>
                </div>
              )}

              {/* Request Total */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Request Total:</span>
                  <span className="font-bold text-lg text-blue-900">
                    {formatPrice(currentRequest.totalAmount, currentRequest.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Batch Total */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-medium text-gray-900">Batch Total:</span>
                  <p className="text-sm text-gray-600">
                    {getApprovedRequestsCount()} of {totalRequests} requests approved
                  </p>
                </div>
                <span className="font-bold text-2xl text-green-900">
                  {formatPrice(calculateBatchTotalAmount())}
                </span>
              </div>
            </div>

          </div>

          {/* Review Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 sticky top-4 space-y-3">
            {/* Batch Comment */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="font-medium text-gray-900 mb-2 text-sm">
                Add Batch Comment
              </h4>
              <textarea
                value={batchComment}
                onChange={(e) => setBatchComment(e.target.value)}
                placeholder="Add a comment about this batch..."
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                rows={3}
              />
              
              <div className="mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-xs text-gray-600">Internal comment</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
            <button
                onClick={handleBatchReview}
                disabled={!canSubmitBatchReview()}
                className={`w-full px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                  canSubmitBatchReview() 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
                title={!canSubmitBatchReview() ? getValidationMessage() : ''}
            >
                Submit Batch Review
            </button>

            {/* Validation Message */}
            {!canSubmitBatchReview() && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                <p className="text-xs text-red-700 font-medium">
                  ⚠️ {getValidationMessage()}
                </p>
              </div>
            )}
            
            <button
                onClick={onClose}
                className="w-full px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyForMeBatchReview;
