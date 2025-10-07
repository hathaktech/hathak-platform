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

interface BuyForMeRequestReviewProps {
  batchPackage: BulkBuyForMePackage;
  onReview: (reviewData: any) => void;
  onClose: () => void;
  onSave?: () => void;
  onRequestUpdate?: (updatedRequests: IndividualBuyForMeRequest[]) => void;
}

const BuyForMeRequestReviewEnhanced: React.FC<BuyForMeRequestReviewProps> = ({
  batchPackage,
  onReview,
  onClose,
  onRequestUpdate
}) => {
  const { showNotification } = useModernNotification();
  const { admin } = useAdminAuth();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [batchComment, setBatchComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  
  // Individual requests management
  const [individualRequests, setIndividualRequests] = useState<IndividualBuyForMeRequest[]>(batchPackage.individualRequests);
  const [batchReviewStatuses, setBatchReviewStatuses] = useState<Record<number, 'approved' | 'rejected' | 'needs_modification'>>({});
  const [batchComments, setBatchComments] = useState<Record<number, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editedValues, setEditedValues] = useState({
    productName: '',
    productLink: '',
    quantity: 1,
    price: 0,
    size: '',
    color: '',
    notes: '',
  });

  // Navigation
  const totalItems = individualRequests.length;
  const canGoNext = activeItemIndex < totalItems - 1;
  const canGoPrev = activeItemIndex > 0;

  // Initialize item review statuses (no pre-selection)
  useEffect(() => {
    setItemReviewStatuses({});
    setItemComments({});
  }, [currentRequest.items]);

  const handleEditField = (field: string, value: any) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemReviewStatusChange = (itemIndex: number, status: 'approved' | 'rejected' | 'needs_modification') => {
    setItemReviewStatuses(prev => ({
      ...prev,
      [itemIndex]: status
    }));
  };

  const handleItemCommentChange = (itemIndex: number, comment: string) => {
    setItemComments(prev => ({
      ...prev,
      [itemIndex]: comment
    }));
  };

  const handleEditItem = (itemIndex: number) => {
    const item = currentRequest.items[itemIndex];
    setEditingItemIndex(itemIndex);
    setIsEditing(true);
    setEditedValues({
      productName: item.name,
      productLink: item.url,
      quantity: item.quantity,
      price: item.price,
      size: item.sizes && item.sizes.length > 0 ? item.sizes.join(', ') : '',
      color: item.colors && item.colors.length > 0 ? item.colors.join(', ') : '',
      notes: item.description || '',
    });
  };

  const handleSaveItemChanges = () => {
    if (editingItemIndex === null) return;
    
    const updatedRequest = {
      ...currentRequest,
      items: currentRequest.items.map((item, index) => 
        index === editingItemIndex ? {
          ...item,
          name: editedValues.productName,
          url: editedValues.productLink,
          description: editedValues.notes,
          quantity: editedValues.quantity,
          price: editedValues.price,
          colors: editedValues.color ? [editedValues.color] : [],
          sizes: editedValues.size ? [editedValues.size] : []
        } : item
      )
    };
    
    setCurrentRequest(updatedRequest);
    showNotification('success', `Changes saved for item ${editingItemIndex + 1}.`);
    setIsEditing(false);
    setEditingItemIndex(null);
  };

  const handleCancelItemEdit = () => {
    setIsEditing(false);
    setEditingItemIndex(null);
    showNotification('info', 'Item edit canceled');
  };


  // Calculate total amount based on approved items (excluding unreviewed items)
  const calculateTotalAmount = () => {
    return currentRequest.items.reduce((total, item, index) => {
      const itemStatus = itemReviewStatuses[index];
      if (itemStatus === 'approved' || itemStatus === 'needs_modification') {
        return total + (item.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const getApprovedItemsCount = () => {
    return currentRequest.items.filter((_, index) => {
      const status = itemReviewStatuses[index];
      return status === 'approved' || status === 'needs_modification';
    }).length;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentRequest.currency || 'USD',
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

  // Generate item references (no longer using sub-request numbers)
  const generateItemReferences = (items: BuyForMeItem[]) => {
    return items.map((item, index) => ({
      ...item,
      itemIndex: index + 1
    }));
  };

  // Group items by status for separate processing
  const groupItemsByStatus = (reviewedItems: any[]) => {
    const groups = {
      approved: [] as any[],
      needs_modification: [] as any[],
      rejected: [] as any[]
    };

    reviewedItems.forEach((item, index) => {
      const status = itemReviewStatuses[index] || 'approved';
      groups[status].push(item);
    });

    return groups;
  };

  const handleReview = async () => {
    if (!canSubmitReview()) {
      showNotification('error', `Cannot submit: ${getValidationMessage()}`);
      return;
    }

    // Generate items with item references
    const itemsWithReferences = generateItemReferences(currentRequest.items);
    
    // Group items by status for separate processing
    const itemsByStatus = groupItemsByStatus(itemsWithReferences);

    // Prepare comprehensive review data
    const reviewData = {
      // Original request info
      mainRequestId: currentRequest._id,
      mainRequestNumber: currentRequest.requestNumber,
      
      // Individual item reviews
      itemReviews: itemsWithReferences.map((item, index) => ({
        itemIndex: index,
        itemId: item.id || item._id,
        reviewStatus: itemReviewStatuses[index] || 'approved',
        comment: itemComments[index] || '',
        itemData: item
      })),

      // Items grouped by status for workflow routing
      itemsByStatus: {
        approved: itemsByStatus.approved.map(item => ({
          ...item,
          status: 'approved',
          nextStage: 'purchasing' // Can be routed to purchasing department
        })),
        needs_modification: itemsByStatus.needs_modification.map(item => ({
          ...item,
          status: 'needs_modification',
          nextStage: 'customer_notification' // Customer needs to be notified
        })),
        rejected: itemsByStatus.rejected.map(item => ({
          ...item,
          status: 'rejected',
          nextStage: 'customer_notification' // Customer needs to be notified
        }))
      },

      // Overall request status
      reviewStatus: getAllItemsApproved() ? 'approved' : 
                   getAnyItemsRejected() ? 'rejected' : 'needs_modification',
      
      // Admin information
      comment: comment.trim() || '',
      rejectionReason: rejectionReason.trim() || '',
      isInternal,
      adminId: admin?.id || admin?.adminId,
      adminName: admin?.name || 'Admin',
      
      // Summary information
      summary: {
        totalItems: currentRequest.items.length,
        approvedCount: itemsByStatus.approved.length,
        needsModificationCount: itemsByStatus.needs_modification.length,
        rejectedCount: itemsByStatus.rejected.length,
        itemCount: itemsWithReferences.length
      }
    };

    onReview(reviewData);
  };

  const getAllItemsApproved = () => {
    return currentRequest.items.every((_, index) => 
      (itemReviewStatuses[index] || 'approved') === 'approved'
    );
  };

  const getAnyItemsRejected = () => {
    return currentRequest.items.some((_, index) => 
      (itemReviewStatuses[index] || 'approved') === 'rejected'
    );
  };

  const getItemsSummary = () => {
    const approved = currentRequest.items.filter((_, index) => 
      itemReviewStatuses[index] === 'approved'
    ).length;
    const rejected = currentRequest.items.filter((_, index) => 
      itemReviewStatuses[index] === 'rejected'
    ).length;
    const needsModification = currentRequest.items.filter((_, index) => 
      itemReviewStatuses[index] === 'needs_modification'
    ).length;
    const unreviewed = currentRequest.items.filter((_, index) => 
      !itemReviewStatuses[index]
    ).length;
    
    return { approved, rejected, needsModification, unreviewed };
  };

  // Check if review can be submitted
  const canSubmitReview = () => {
    // Check if all items have been reviewed
    const unreviewedItems = currentRequest.items.filter((_, index) => !itemReviewStatuses[index]);
    if (unreviewedItems.length > 0) {
      return false;
    }

    // Check if all rejected/needs_modification items have comments
    const hasRejectedItems = Object.values(itemReviewStatuses).some(status => status === 'rejected');
    const hasModifiedItems = Object.values(itemReviewStatuses).some(status => status === 'needs_modification');
    
    if (hasRejectedItems || hasModifiedItems) {
      for (const [index, status] of Object.entries(itemReviewStatuses)) {
        const itemIndex = parseInt(index);
        if ((status === 'rejected' || status === 'needs_modification') && !itemComments[itemIndex]?.trim()) {
          return false;
        }
      }
    }

    return true;
  };

  // Get validation message for current state
  const getValidationMessage = () => {
    // Check if all items have been reviewed
    const unreviewedItems = currentRequest.items.filter((_, index) => !itemReviewStatuses[index]);
    if (unreviewedItems.length > 0) {
      const unreviewedCount = unreviewedItems.length;
      return `${unreviewedCount} item${unreviewedCount > 1 ? 's' : ''} need to be reviewed`;
    }

    // Check if all rejected/needs_modification items have comments
    const hasRejectedItems = Object.values(itemReviewStatuses).some(status => status === 'rejected');
    const hasModifiedItems = Object.values(itemReviewStatuses).some(status => status === 'needs_modification');
    
    if (hasRejectedItems || hasModifiedItems) {
      for (const [index, status] of Object.entries(itemReviewStatuses)) {
        const itemIndex = parseInt(index);
        if ((status === 'rejected' || status === 'needs_modification') && !itemComments[itemIndex]?.trim()) {
          return `Comment required for item ${itemIndex + 1}`;
        }
      }
    }

    return '';
  };

  const currentItem = currentRequest.items[activeItemIndex];
  const itemSummary = getItemsSummary();

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
                Review BuyForMe Request - Multi-Item Enhanced
              </h3>
              <p className="text-sm text-gray-600">
                {currentRequest.requestNumber} • {currentRequest.customerName} • {totalItems} item{totalItems !== 1 ? 's' : ''}
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
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex itemsCenter">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Customer Info
              </h4>
              <div className="space-y">
                <div className="bg-white p-2 rounded border">
                  <p className="text-xs text-gray-500 mb-1">customername</p>
                  <p className="text-xs font-semibold text-gray-900 truncate">{currentRequest.customerName}</p>
                </div>
                <div className="bg-white p-2 rounded border">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-xs font-semibold text-gray-900 truncate flex items-center">
                    <Mail className="w-3 h-3 mr-1 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{currentRequest.customerEmail}</span>
                  </p>
                </div>
                <div className="bg-white p-2 rounded border">
                  <p className="text-xs text-gray-500 mb-1">Priority</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(currentRequest.priority)}`}>
                    {currentRequest.priority}
                  </span>
                </div>
                
                {/* Items Summary */}
                <div className="bg-white p-2 rounded border">
                  <p className="text-xs text-gray-500 mb-2">Items Summary</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-green-600">Approved:</span>
                      <span className="text-xs font-semibold">{itemSummary.approved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-yellow-600">Needs Mod:</span>
                      <span className="text-xs font-semibold">{itemSummary.needsModification}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-red-600">Rejected:</span>
                      <span className="text-xs font-semibold">{itemSummary.rejected}</span>
                    </div>
                    <div className={`flex justify-between ${itemSummary.unreviewed > 0 ? 'bg-yellow-50 px-2 py-1 rounded border border-yellow-200' : ''}`}>
                      <span className={`text-xs ${itemSummary.unreviewed > 0 ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>Unreviewed:</span>
                      <span className={`text-xs font-semibold ${itemSummary.unreviewed > 0 ? 'text-orange-700' : ''}`}>{itemSummary.unreviewed}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">


            {/* Item Navigation */}
            {totalItems > 1 && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveItemIndex(Math.max(0, activeItemIndex - 1))}
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
                      Item {activeItemIndex + 1} of {totalItems}
                    </span>
                    <div className="flex space-x-1">
                      {currentRequest.items.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveItemIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === activeItemIndex 
                              ? 'bg-blue-600' 
                              : itemReviewStatuses[index] === 'approved' 
                                ? 'bg-green-400' 
                                : itemReviewStatuses[index] === 'rejected' 
                                  ? 'bg-red-400' 
                                  : itemReviewStatuses[index] === 'needs_modification'
                                    ? 'bg-yellow-400'
                                    : 'bg-gray-300' // unreviewed items
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setActiveItemIndex(Math.min(totalItems - 1, activeItemIndex + 1))}
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

            {/* Current Item Details */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900 flex items-center">
                    <Package className="w-4 h-4 mr-2 text-blue-600" />
                    Item {activeItemIndex + 1}: {currentItem.name}
                  </h4>
                  <div className="mt-1">
                    <span className="text-xs text-gray-500">Request Number:</span>
                    <span className="text-xs font-medium text-blue-700 ml-1 bg-blue-50 px-2 py-0.5 rounded">
                      {currentRequest.requestNumber}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!(isEditing && editingItemIndex === activeItemIndex) && (
                    <button
                      onClick={() => handleEditItem(activeItemIndex)}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit Item
                    </button>
                  )}
                </div>
              </div>

              {/* Item Review Status */}
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm font-medium text-gray-700">Review Status:</span>
                <div className="flex space-x-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`itemReviewStatus-${activeItemIndex}`}
                      value="approved"
                      checked={itemReviewStatuses[activeItemIndex] === 'approved'}
                      onChange={(e) => handleItemReviewStatusChange(activeItemIndex, 'approved')}
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
                      name={`itemReviewStatus-${activeItemIndex}`}
                      value="needs_modification"
                      checked={itemReviewStatuses[activeItemIndex] === 'needs_modification'}
                      onChange={(e) => handleItemReviewStatusChange(activeItemIndex, 'needs_modification')}
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
                      name={`itemReviewStatus-${activeItemIndex}`}
                      value="rejected"
                      checked={itemReviewStatuses[activeItemIndex] === 'rejected'}
                      onChange={(e) => handleItemReviewStatusChange(activeItemIndex, 'rejected')}
                      className="text-red-600"
                    />
                    <div className="flex items-center">
                      <XCircle className="w-4 h-4 text-red-600 mr-1" />
                      <span className="font-medium text-red-800 text-sm">Reject</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Item-specific Comment */}
              {(itemReviewStatuses[activeItemIndex] === 'rejected' || itemReviewStatuses[activeItemIndex] === 'needs_modification') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment for this item *
                  </label>
                  <textarea
                    value={itemComments[activeItemIndex] || ''}
                    onChange={(e) => handleItemCommentChange(activeItemIndex, e.target.value)}
                    placeholder={
                      itemReviewStatuses[activeItemIndex] === 'needs_modification' 
                        ? "What modifications are needed for this item?" 
                      : "Why is this item being rejected?"
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows={2}
                  />
                </div>
              )}

              {/* Item Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Product Name */}
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs font-medium text-gray-600 mb-2">Product Name</p>
                  {isEditing && editingItemIndex === activeItemIndex ? (
                    <input
                      type="text"
                      value={editedValues.productName}
                      onChange={(e) => handleEditField('productName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Enter product name"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{currentItem.name}</p>
                  )}
                </div>
                
                {/* Product Link */}
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs font-medium text-gray-600 mb-2">Product Link</p>
                  {isEditing && editingItemIndex === activeItemIndex ? (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={editedValues.productLink}
                        onChange={(e) => handleEditField('productLink', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Enter product URL"
                      />
                      {editedValues.productLink && (
                        <a 
                          href={editedValues.productLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Preview Link
                        </a>
                      )}
                    </div>
                  ) : (
                    <a 
                      href={currentItem.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center break-all"
                    >
                      <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{currentItem.url}</span>
                    </a>
                  )}
                </div>
                
                {/* Quantity */}
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs font-medium text-gray-600 mb-2">Quantity</p>
                  {isEditing && editingItemIndex === activeItemIndex ? (
                    <input
                      type="number"
                      min="1"
                      value={editedValues.quantity}
                      onChange={(e) => handleEditField('quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{currentItem.quantity}</p>
                  )}
                </div>
                
                {/* Price */}
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs font-medium text-gray-600 mb-2">Price per Unit</p>
                  {isEditing && editingItemIndex === activeItemIndex ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{currentItem.currency || '$'}</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editedValues.price}
                        onChange={(e) => handleEditField('price', parseFloat(e.target.value) || 0)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-900">{formatPrice(currentItem.price)}</p>
                  )}
                </div>
                
                {/* Size */}
                {currentItem.sizes && currentItem.sizes.length > 0 && (
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-xs font-medium text-gray-600 mb-2">Size</p>
                    {isEditing && editingItemIndex === activeItemIndex ? (
                      <input
                        type="text"
                        value={editedValues.size}
                        onChange={(e) => handleEditField('size', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="e.g., M, Large, 10"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{currentItem.sizes.join(', ')}</p>
                    )}
                  </div>
                )}
                
                {/* Color */}
                {currentItem.colors && currentItem.colors.length > 0 && (
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-xs font-medium text-gray-600 mb-2">Color</p>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: getColorSwatch(currentItem.colors[0]) }}
                      />
                      <span className="text-sm text-gray-900">{currentItem.colors.join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Notes/Description */}
              {currentItem.description && (
                <div className="bg-white p-3 rounded-lg border md:col-span-2 mb-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">Additional Notes</p>
                  {isEditing && editingItemIndex === activeItemIndex ? (
                    <textarea
                      value={editedValues.notes}
                      onChange={(e) => handleEditField('notes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      rows={3}
                      placeholder="Enter additional notes or requirements"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{currentItem.description}</p>
                  )}
                </div>
              )}

              {/* Item Total */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Item Total:</span>
                  <span className="font-bold text-lg text-blue-900">
                    {formatPrice(currentItem.price * currentItem.quantity)}
                  </span>
                </div>
                {isEditing && editingItemIndex === activeItemIndex && (
                  <p className="text-xs text-gray-600 mt-1">
                    New total: {formatPrice(editedValues.price * editedValues.quantity)}
                  </p>
                )}
              </div>

              {/* Edit Actions for Current Item */}
              {isEditing && editingItemIndex === activeItemIndex && (
                <div className="mt-4 flex justify-center space-x-3">
                  <button
                    onClick={handleSaveItemChanges}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelItemEdit}
                    className="inline-flex items-center px-4 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

             {/* Request Total */}
             <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
               <div className="flex justify-between items-center">
                 <div>
                   <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                   <p className="text-sm text-gray-600">
                     {getApprovedItemsCount()} of {totalItems} items approved
                   </p>
                 </div>
                 <span className="font-bold text-2xl text-green-900">
                   {formatPrice(calculateTotalAmount())}
                 </span>
               </div>
             </div>

             {/* Sub-Request Numbers Summary */}
             <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
               <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                 <Package className="w-4 h-4 mr-2" />
                 Items Review Summary
               </h4>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {currentRequest.items.map((item, index) => {
                      const status = itemReviewStatuses[index];
                      return (
                        <div key={index} className="bg-white p-2 rounded border text-xs">
                          <div className="font-medium text-gray-900">Item {index + 1}</div>
                       <div className="text-gray-600 truncate">{item.name}</div>
                       <div className={`text-xs font-medium mt-1 ${
                         status === 'approved' ? 'text-green-600' :
                         status === 'rejected' ? 'text-red-600' :
                         status === 'needs_modification' ? 'text-yellow-600' :
                         'text-gray-400'
                       }`}>
                         {status || 'Not reviewed'}
                       </div>
                     </div>
                   );
                 })}
               </div>
             </div>

          </div>

          {/* Review Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 sticky top-4 space-y-3">
            {/* Admin Comment */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="font-medium text-gray-900 mb-2 text-sm">
                Add Admin Comment
              </h4>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment about this request..."
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
                  onClick={handleReview}
                  disabled={!canSubmitReview()}
                  className={`w-full px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                    canSubmitReview() 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                  title={!canSubmitReview() ? getValidationMessage() : ''}
              >
                  Submit Review
              </button>

              {/* Validation Message */}
              {!canSubmitReview() && (
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

export default BuyForMeRequestReviewEnhanced;
