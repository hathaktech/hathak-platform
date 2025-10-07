'use client';

import { useState, useEffect, useMemo } from 'react';
import { useModernNotification } from '@/context/ModernNotificationContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { 
  CheckCircle, XCircle, Edit, MessageSquare, AlertTriangle,
  Eye, Package, DollarSign, Calendar, User, Mail, MapPin, ExternalLink,
  Clock, AlertCircle, Info, ShoppingCart, Truck, Warehouse, X
} from 'lucide-react';

interface BuyForMeRequest {
  id: string;
  requestNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: {
    id: string;
    name: string;
    url: string;
    quantity: number;
    price: number;
    description?: string;
    sizes?: string[];
    colors?: string[];
  }[];
  totalAmount: number;
  status: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  reviewStatus?: 'pending' | 'approved' | 'rejected' | 'needs_modification';
  reviewComments?: {
    comment: string;
    adminName: string;
    createdAt: string;
    isInternal: boolean;
  }[];
  rejectionReason?: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  confirmationPreferences?: {
    proceedWithRemaining: boolean;
    cancelEntireOrder: boolean;
    confirmRestrictions: boolean;
  };
  modifiedByUser?: boolean;
  lastModifiedByUser?: string;
  modifiedButNeedsModification?: boolean;
  modifiedByAdmin?: boolean;
  adminModificationDate?: string;
  adminModificationNote?: string;
  lastModifiedByAdmin?: string;
  originalValues?: {
    productName?: string;
    productLink?: string;
    notes?: string;
    quantity?: number;
    estimatedPrice?: number;
    currency?: string;
    size?: string;
    color?: string;
  };
  modificationHistory?: {
    modificationNumber: number;
    modifiedAt: string;
    previousValues: any;
    newValues: any;
  }[];
}

interface BuyForMeRequestReviewProps {
  request: BuyForMeRequest;
  onReview: (reviewData: any) => void;
  onClose: () => void;
  onSave?: () => void;
  onRequestUpdate?: (updatedRequest: BuyMeRequest) => void;
}

const BuyForMeRequestReview: React.FC<BuyForMeRequestReviewProps> = ({
  request,
  onReview,
  onClose,
  onSave,
  onRequestUpdate
}) => {
  const { showNotification } = useModernNotification();
  const { admin } = useAdminAuth();
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'rejected' | 'needs_modification'>('approved');
  const [comment, setComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  // Multi-item management
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [itemReviewStatuses, setItemReviewStatuses] = useState<Record<number, 'approved' | 'rejected' | 'needs_modification'>>({});
  const [itemComments, setItemComments] = useState<Record<number, string>>({});
  const [editedValues, setEditedValues] = useState({
    productName: '',
    productLink: '',
    quantity: 1,
    price: 0,
    size: '',
    color: '',
    notes: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [currentRequest, setCurrentRequest] = useState<BuyMeRequest>(request);
  const [updateKey, setUpdateKey] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [originalRequest, setOriginalRequest] = useState<BuyMeRequest>(request);

  // Get current values (latest from items array) - memoized to prevent infinite loops
  const currentValues = useMemo(() => {
    console.log('currentValues recalculating, currentRequest.items:', currentRequest.items);
    if (currentRequest.items.length > 0) {
      const item = currentRequest.items[0];
      const values = {
        productName: item.name,
        productLink: item.url,
        notes: item.description || '',
        quantity: item.quantity,
        estimatedPrice: item.price,
        currency: 'USD',
        size: item.sizes && item.sizes.length > 0 ? item.sizes.join(', ') : '',
        color: item.colors && item.colors.length > 0 ? item.colors.join(', ') : ''
      };
      console.log('currentValues result:', values);
      return values;
    }
    return null;
  }, [currentRequest.items, refreshTrigger]);

  // Get original values from the original request (user's submission)
  const originalValues = useMemo(() => {
    if (originalRequest.items.length > 0) {
      const item = originalRequest.items[0];
      return {
        productName: item.name,
        productLink: item.url,
        notes: item.description || '',
        quantity: item.quantity,
        estimatedPrice: item.price,
        currency: 'USD',
        size: item.sizes && item.sizes.length > 0 ? item.sizes.join(', ') : '',
        color: item.colors && item.colors.length > 0 ? item.colors.join(', ') : ''
      };
    }
    return null;
  }, [originalRequest.items]);

  // Initialize edited values when component mounts or request changes
  useEffect(() => {
    if (currentValues) {
      setEditedValues({
        productName: currentValues.productName,
        productLink: currentValues.productLink,
        quantity: currentValues.quantity,
        price: currentValues.estimatedPrice,
        size: currentValues.size,
        color: currentValues.color,
        notes: currentValues.notes,
        priority: currentRequest.priority || 'medium'
      });
    }
  }, [currentRequest, currentValues]);

  // Initialize item review statuses to 'approved'
  useEffect(() => {
    const initialStatuses: Record<number, 'approved' | 'rejected' | 'needs_modification'> = {};
    currentRequest.items.forEach((_, index) => {
      initialStatuses[index] = 'approved';
    });
    setItemReviewStatuses(initialStatuses);
    setItemComments({});
  }, [currentRequest.items]);

  // Update originalRequest when request prop changes (only once, never update after that)
  useEffect(() => {
    // Only set originalRequest if it hasn't been set yet (first time)
    if (!originalRequest.requestNumber || originalRequest.requestNumber !== request.requestNumber) {
      console.log('Setting originalRequest for the first time:', request);
      setOriginalRequest(request);
    } else {
      console.log('Keeping originalRequest unchanged, current request:', request);
    }
  }, [request, originalRequest.requestNumber]);

  // Update currentRequest when request prop changes
  useEffect(() => {
    setCurrentRequest(request);
  }, [request]);

  const handleEditField = (field: string, value: any) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Multi-item helpers
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
      priority: currentRequest.priority || 'medium'
    });
  };

  const handleSaveItemChanges = () => {
    if (editingItemIndex === null) return;
    
    const adminName = admin?.name || 'Admin';
    console.log(`Saving edits for item ${editingItemIndex} by ${adminName}:`, editedValues);
    
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
          currency: editedValues.currency,
          colors: editedValues.color ? [editedValues.color] : [],
          sizes: editedValues.size ? [editedValues.size] : []
        } : item
      )
    };
    
    setCurrentRequest(updatedRequest);
    setUpdateKey(prev => prev + 1);
    setRefreshTrigger(prev => prev + 1);
    
    showNotification('info', `Changes saved for item ${editingItemIndex + 1}. Will be applied when you approve/reject the request.`);
    setIsEditing(false);
    setEditingItemIndex(null);
  };

  const handleCancelItemEdit = () => {
    setIsEditing(false);
    setEditingItemIndex(null);
    showNotification('info', 'Item edit canceled');
  };

  // Bulk actions
  const handleBulkAction = (action: 'approved' | 'rejected' | 'needs_modification') => {
    const updatedStatuses: Record<number, 'approved' | 'rejected' | 'needs_modification'> = {};
    const updatedComments: Record<number, string> = {};
    
    currentRequest.items.forEach((_, index) => {
      updatedStatuses[index] = action;
      if (action === 'rejected' || action === 'needs_modification') {
        updatedComments[index] = action === 'rejected' 
          ? 'Item rejected by admin review' 
          : 'Item requires modification';
      }
    });
    
    setItemReviewStatuses(updatedStatuses);
    setItemComments(updatedComments);
    
    showNotification('success', `All items set to ${action}`);
  };

  const handleSaveChanges = () => {
    // Save changes locally in the modal only, don't persist to backend yet
    const adminName = admin?.name || 'Admin';
    console.log(`Saving edits locally by ${adminName} (not to backend):`, editedValues);
    
    // Update the local request state with the new data
    const updatedRequest = {
      ...currentRequest,
      // Update top-level fields
      productName: editedValues.productName,
      productLink: editedValues.productLink,
      notes: editedValues.notes,
      quantity: editedValues.quantity,
      estimatedPrice: editedValues.price,
      currency: editedValues.currency,
      colors: editedValues.color ? [editedValues.color] : [],
      sizes: editedValues.size ? [editedValues.size] : [],
      // Update the items array with the new values
      items: currentRequest.items.map((item, index) => 
        index === 0 ? {
          ...item,
          name: editedValues.productName,
          url: editedValues.productLink,
          description: editedValues.notes,
          quantity: editedValues.quantity,
          price: editedValues.price,
          currency: editedValues.currency,
          colors: editedValues.color ? [editedValues.color] : [],
          sizes: editedValues.size ? [editedValues.size] : []
        } : item
      )
    };
    
    // Update the current request state immediately (local only)
    setCurrentRequest(updatedRequest);
    setUpdateKey(prev => prev + 1); // Force re-render
    setRefreshTrigger(prev => prev + 1); // Force currentValues recalculation
    console.log('Updated currentRequest locally:', updatedRequest);
    console.log('Updated items locally:', updatedRequest.items);
    
    // Update the current values to reflect the changes
    setEditedValues(editedValues);
    
    showNotification('info', 'Changes saved locally. Will be applied when you approve/reject the request.');
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset to original values from the user's submission (not the current edited values)
    console.log('Canceling edit, restoring original values:', originalValues);
    console.log('Current edited values being discarded:', editedValues);
    console.log('Original request:', originalRequest);
    console.log('Current request:', currentRequest);
    
    // Restore the original request completely
    setCurrentRequest(originalRequest);
    setUpdateKey(prev => prev + 1); // Force re-render
    setRefreshTrigger(prev => prev + 1); // Force currentValues recalculation
    
    if (originalValues) {
      setEditedValues({
        productName: originalValues.productName,
        productLink: originalValues.productLink,
        quantity: originalValues.quantity,
        price: originalValues.estimatedPrice,
        size: originalValues.size,
        color: originalValues.color,
        notes: originalValues.notes,
        priority: originalRequest.priority || 'medium'
      });
    }
    setIsEditing(false);
    showNotification('info', 'Edit canceled - restored to original user submission');
  };

  const handleReview = async () => {
    // Validate overall review decision
    if ((reviewStatus === 'needs_modification' || reviewStatus === 'rejected') && !comment.trim()) {
      showNotification('error', 'Please add a comment explaining your decision.');
      return;
    }

    if (reviewStatus === 'rejected' && !rejectionReason.trim()) {
      showNotification('error', 'Please provide a rejection reason.');
      return;
    }

    // Validate individual item reviews
    const hasRejectedItems = Object.values(itemReviewStatuses).some(status => status === 'rejected');
    const hasModifiedItems = Object.values(itemReviewStatuses).some(status => status === 'needs_modification');
    
    if (hasRejectedItems || hasModifiedItems) {
      for (const [index, status] of Object.entries(itemReviewStatuses)) {
        const itemIndex = parseInt(index);
        if ((status === 'rejected' || status === 'needs_modification') && !itemComments[itemIndex]?.trim()) {
          showNotification('error', `Please add a comment for ${itemIndex === 0 ? 'the' : `item ${itemIndex + 1}`} ${status === 'rejected' ? 'rejection' : 'modification request'}.`);
          return;
        }
      }
    }

    // Check if admin has made any edits
    const hasAdminEdits = JSON.stringify(currentRequest) !== JSON.stringify(originalRequest);
    
    // Prepare review data with admin edits if any
    const reviewData = {
      reviewStatus,
      comment: comment.trim(),
      rejectionReason: rejectionReason.trim(),
      isInternal,
      itemReviews: currentRequest.items.map((item, index) => ({
        itemIndex: index,
        itemId: item.id || item._id,
        reviewStatus: itemReviewStatuses[index] || 'approved',
        comment: itemComments[index] || '',
      }))
    };

    // If admin made edits, include them in the review data
    if (hasAdminEdits) {
      console.log('Admin has made edits, including them in the review');
      
      const adminName = admin?.name || 'Admin';
      
      // Create modification notes for each item
      const itemModifications = currentRequest.items.map((item, index) => {
        const originalItem = originalRequest.items[index];
        const changes = [];
        
        if (originalItem?.name !== item?.name) changes.push('Product Name');
        if (originalItem?.url !== item?.url) changes.push('Product Link');
        if (originalItem?.description !== item?.description) changes.push('Description');
        if (originalItem?.quantity !== item?.quantity) changes.push('Quantity');
        if (originalItem?.price !== item?.price) changes.push('Price');
        if (JSON.stringify(originalItem?.colors) !== JSON.stringify(item?.colors)) changes.push('Colors');
        if (JSON.stringify(originalItem?.sizes) !== JSON.stringify(item?.sizes)) changes.push('Sizes');
        
        return {
          itemIndex: index,
          changes,
          originalItem,
          modifiedItem: item
        };
      });
      
      // Create a detailed modification note
      const modificationNote = `Request modified by admin "${adminName}" during ${reviewStatus} review on ${new Date().toLocaleString()}. Items modified: ${itemModifications.filter(mod => mod.changes.length > 0).length}`;
      
      // Include modified items in review data
      // @ts-ignore
      reviewData.modifiedItems = currentRequest.items.map((item, index) => ({
        ...item,
        originalItem: originalRequest.items[index]
      }));
      // @ts-ignore
      reviewData.adminModificationNote = modificationNote;
      // @ts-ignore
      reviewData.modifiedByAdmin = true;
      // @ts-ignore
      reviewData.adminModificationDate = new Date().toISOString();
      // @ts-ignore
      reviewData.lastModifiedByAdmin = adminName;
      
      console.log('Including admin edits in review data:', reviewData);
    }

    onReview(reviewData);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Calculate total amount based on approved items
  const calculateTotalAmount = () => {
    return currentRequest.items.reduce((total, item, index) => {
      const itemStatus = itemReviewStatuses[index] || 'approved';
      if (itemStatus !== 'rejected') {
        return total + (item.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const getApprovedItemsCount = () => {
    return currentRequest.items.filter((_, index) => {
      const status = itemReviewStatuses[index] || 'approved';
      return status !== 'rejected';
    }).length;
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div key={updateKey} className="relative top-2 mx-auto p-4 border w-11/12 max-w-5xl shadow-2xl rounded-lg bg-white max-h-[98vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Review BuyForMe Request
              </h3>
              <p className="text-sm text-gray-600">
                {currentRequest.requestNumber} • {currentRequest.customerName} • {currentRequest.items.length} item{currentRequest.items.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              // Restore original request if there were unsaved edits
              if (JSON.stringify(currentRequest) !== JSON.stringify(originalRequest)) {
                console.log('Closing modal with unsaved edits, restoring original request');
                setCurrentRequest(originalRequest);
              }
              onClose();
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Customer Information - Compact Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 sticky top-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Customer Info
              </h4>
              <div className="space-y-2">
                {/* Admin Modified Indicator */}
                {currentRequest.modifiedByAdmin && (
                  <div className="bg-orange-50 border border-orange-200 rounded p-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-3 h-3 text-orange-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-orange-800">Admin Modified</p>
                        <p className="text-xs text-orange-600">
                          by {currentRequest.lastModifiedByAdmin || 'Admin'}
                        </p>
                        <p className="text-xs text-orange-500">
                          {currentRequest.adminModificationDate ? new Date(currentRequest.adminModificationDate).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-white p-2 rounded border">
                  <p className="text-xs text-gray-500 mb-1">Name</p>
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
                  {isEditing ? (
                    <select
                      value={editedValues.priority}
                      onChange={(e) => handleEditField('priority', e.target.value as 'low' | 'medium' | 'high')}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(currentRequest.priority || 'medium')}`}>
                      {currentRequest.priority || 'medium'}
                    </span>
                  )}
                </div>
                
                {/* Dates Section */}
                <div className="bg-white p-2 rounded border">
                  <p className="text-xs text-gray-500 mb-1">Timeline</p>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-700">
                      <span className="font-medium">Created:</span> {new Date(currentRequest.createdAt).toLocaleString()}
                    </div>
                    {currentRequest.modificationHistory && currentRequest.modificationHistory.length > 0 && (
                      <div className="space-y-0.5">
                        {currentRequest.modificationHistory.map((mod, index) => (
                          <div key={index} className="text-xs text-gray-700">
                            <span className="font-medium">{index + 1}. Modified:</span> {new Date(mod.modifiedAt).toLocaleString()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Shipping Address */}
                <div className="bg-white p-2 rounded border">
                  <p className="text-xs text-gray-500 mb-1 flex items=center">
                    <MapPin className="w-3 h-3 mr-1 text-blue-600" />
                    Shipping Address
                  </p>
                  <div className="text-xs text-gray-700">
                    <p className="font-medium truncate">{currentRequest.shippingAddress.name}</p>
                    <p className="truncate">{currentRequest.shippingAddress.address}</p>
                    <p className="truncate">{currentRequest.shippingAddress.city}, {currentRequest.shippingAddress.country}</p>
                    <p>{currentRequest.shippingAddress.postalCode}</p>
                  </div>
                </div>

                {/* Previous Comments */}
                {currentRequest.reviewComments && currentRequest.reviewComments.length > 0 && (
                  <div className="bg-white p-2 rounded border">
                    <p className="text-xs text-gray-500 mb-2 flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1 text-blue-600" />
                      Previous Comments ({currentRequest.reviewComments.length})
                    </p>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {currentRequest.reviewComments.slice(-2).map((comment, index) => (
                        <div key={index} className="bg-gray-50 p-1.5 rounded border">
                          <div className="flex justify-between items-start mb-0.5">
                            <span className="font-medium text-xs text-gray-900">{comment.adminName}</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                              {comment.isInternal && (
                                <span className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Internal
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-700 line-clamp-2">{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">

            {/* Admin Modification Notice */}
            {currentRequest.modifiedByAdmin && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-3 h-3 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-orange-800">Admin Modified</h4>
                    <p className="text-xs text-orange-700">
                      This request has been modified by admin "{currentRequest.lastModifiedByAdmin || 'Admin'}" on {currentRequest.adminModificationDate ? new Date(currentRequest.adminModificationDate).toLocaleString() : 'recently'}
                    </p>
                    {currentRequest.adminModificationNote && (
                      <p className="text-xs text-orange-600 mt-1 italic">
                        "{currentRequest.adminModificationNote}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Actions */}
            {currentRequest.items.length > 1 && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-semibold text-gray-900 flex items-center">
                    <Package className="w-4 h-4 mr-2 text-blue-600" />
                    Bulk Actions
                  </h4>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction('approved')}
                    className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve All
                  </button>
                  <button
                    onClick={() => handleBulkAction('needs_modification')}
                    className="inline-flex items-center px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modify All
                  </button>
                  <button
                    onClick={() => handleBulkAction('rejected')}
                    className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject All
                  </button>
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="space-y-4">
              {currentRequest.items.map((item, itemIndex) => (
                <div key={item._id || itemIndex} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items=center justify-between mb-3">
                    <h4 className="text-base font-semibold text-gray-900 flex items-center">
                      <Package className="w-4 h-4 mr-2 text-blue-600" />
                      Item {itemIndex + 1}: {item.name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {!(isEditing && editingItemIndex === itemIndex) && (
                        <button
                          onClick={() => handleEditItem(itemIndex)}
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
                          name={`itemReviewStatus-${itemIndex}`}
                          value="approved"
                          checked={(itemReviewStatuses[itemIndex] || 'approved') === 'approved'}
                          onChange={(e) => handleItemReviewStatusChange(itemIndex, 'approved')}
                          className="text-green-600"
                        />
                        <div className="flex items=center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                          <span className="font-medium text-green-800 text-sm">Approve</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`itemReviewStatus-${itemIndex}`}
                          value="needs_modification"
                          checked={(itemReviewStatuses[itemIndex] || 'approved') === 'needs_modification'}
                          onChange={(e) => handleItemReviewStatusChange(itemIndex, 'needs_modification')}
                          className="text-yellow-600"
                        />
                        <div className="flex items=center">
                          <Edit className="w-4 h-4 text-yellow-600 mr-1" />
                          <span className="font-medium text-yellow-800 text-sm">Modify</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`itemReviewStatus-${itemIndex}`}
                          value="rejected"
                          checked={(itemReviewStatuses[itemIndex] || 'approved') === 'rejected'}
                          onChange={(e) => handleItemReviewStatusChange(itemIndex, 'rejected')}
                          className="text-red-600"
                        />
                        <div className="flex items=center">
                          <XCircle className="w-4 h-4 text-red-600 mr-1" />
                          <span className="font-medium text-red-800 text-sm">Reject</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Item-specific Comment */}
                  {(itemReviewStatuses[itemIndex] === 'rejected' || itemReviewStatuses[itemIndex] === 'needs_modification') && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comment for this item *
                      </label>
                      <textarea
                        value={itemComments[itemIndex] || ''}
                        onChange={(e) => handleItemCommentChange(itemIndex, e.target.value)}
                        placeholder={
                          itemReviewStatuses[itemIndex] === 'needs_modification' 
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
                      {isEditing && editingItemIndex === itemIndex ? (
                        <input
                          type="text"
                          value={editedValues.productName}
                          onChange={(e) => handleEditField('productName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Enter product name"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{item.name}</p>
                      )}
                    </div>
                    
                    {/* Product Link */}
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-xs font-medium text-gray-600 mb-2">Product Link</p>
                      {isEditing && editingItemIndex === itemIndex ? (
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
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center break-all"
                        >
                          <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{item.url}</span>
                        </a>
                      )}
                    </div>
                    
                    {/* Quantity */}
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-xs font-medium text-gray-600 mb-2">Quantity</p>
                      {isEditing && editingItemIndex === itemIndex ? (
                        <input
                          type="number"
                          min={1}
                          value={editedValues.quantity}
                          onChange={(e) => handleEditField('quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{item.quantity}</p>
                      )}
                    </div>
                    
                    {/* Price */}
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-xs font-medium text-gray-600 mb-2">Price per Unit</p>
                      {isEditing && editingItemIndex === itemIndex ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            value={editedValues.price}
                            onChange={(e) => handleEditField('price', parseFloat(e.target.value) || 0)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-gray-900">${item.price}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Confirmation Preferences */}
            {request.confirmationPreferences && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items=center">
                  <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                  Customer Preferences
                </h4>
                <div className="bg-white p-3 rounded-lg border space-y-2">
                  <div className="flex items=center justify-between">
                    <span className="text-xs text-gray-700">Unavailable Items Policy:</span>
                    <span className={`text-xs font-medium ${request.confirmationPreferences.proceedWithRemaining ? 'text-green-600' : request.confirmationPreferences.cancelEntireOrder ? 'text-red-600' : 'text-gray-500'}`}>
                      {request.confirmationPreferences.proceedWithRemaining 
                        ? 'Proceed with remaining items' 
                        : request.confirmationPreferences.cancelEntireOrder 
                          ? 'Cancel entire order' 
                          : 'Not specified'
                      }
                    </span>
                  </div>
                  <div className="flex items=center justify-between">
                    <span className="text-xs text-gray-700">Restrictions Confirmed:</span>
                    <span className={`text-xs font-medium ${request.confirmationPreferences.confirmRestrictions ? 'text-green-600' : 'text-red-600'}`}>
                      {request.confirmationPreferences.confirmRestrictions ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Review Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 sticky top-4 space-y-3">
            {/* Review Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="font-medium text-gray-900 mb-2 text-sm">Review Decision</h4>
              
              <div className="space-y-2">
                <label className="flex items=center space-x-2">
                  <input
                    type="radio"
                    name="reviewStatus"
                    value="approved"
                    checked={reviewStatus === 'approved'}
                    onChange={(e) => setReviewStatus(e.target.value as any)}
                    className="form-radio text-blue-600"
                  />
                  <span className="text-sm">Approve Request</span>
                </label>
                
                <label className="flex items=center space-x-2">
                  <input
                    type="radio"
                    name="reviewStatus"
                    value="needs_modification"
                    checked={reviewStatus === 'needs_modification'}
                    onChange={(e) => setReviewStatus(e.target.value as any)}
                    className="form-radio text-yellow-600"
                  />
                  <span className="text-sm">Needs Modification</span>
                </label>
                
                <label className="flex items=center space-x-2">
                  <input
                    type="radio"
                    name="reviewStatus"
                    value="rejected"
                    checked={reviewStatus === 'rejected'}
                    onChange={(e) => setReviewStatus(e.target.value as any)}
                    className="form-radio text-red-600"
                  />
                  <span className="text-sm">Reject Request</span>
                </label>
              </div>
            </div>

            {/* Rejection Reason */}
            {reviewStatus === 'rejected' && (
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  rows={3}
                  placeholder="Please provide a reason for rejection..."
                  required
                />
              </div>
            )}

            {/* Comment */}
            {(reviewStatus === 'needs_modification' || reviewStatus === 'rejected') && (
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Comment {reviewStatus === 'rejected' || reviewStatus === 'needs_modification' ? '*' : ''}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  rows={4}
                  placeholder={reviewStatus === 'rejected' || reviewStatus === 'needs_modification' ? "Add a comment explaining your decision..." : "Add an optional comment..."}
                  required={reviewStatus === 'rejected' || reviewStatus === 'needs_modification'}
                />
                
                <div className="mt-2">
                  <label className="flex items=center space-x-2">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="form-checkbox text-blue-600"
                    />
                    <span className="text-xs text-gray-600">Internal comment (not visible to customer)</span>
                  </label>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleReview}
                disabled={
                  (reviewStatus === 'needs_modification' || reviewStatus === 'rejected') && !comment.trim() ||
                  (reviewStatus === 'rejected' && !rejectionReason.trim())
                }
                className={`w-full px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                  (reviewStatus === 'needs_modification' || reviewStatus === 'rejected') && !comment.trim() ||
                  (reviewStatus === 'rejected' && !rejectionReason.trim())
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : reviewStatus === 'approved' 
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : reviewStatus === 'needs_modification'
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {reviewStatus === 'approved' && 'Approve'}
                {reviewStatus === 'needs_modification' && 'Request Changes'}
                {reviewStatus === 'rejected' && 'Reject'}
              </button>
              
              <button
                onClick={() => {
                  // Restore original request if there were unsaved edits
                  if (JSON.stringify(currentRequest) !== JSON.stringify(originalRequest)) {
                    console.log('Closing modal with unsaved edits, restoring original request');
                    setCurrentRequest(originalRequest);
                  }
                  onClose();
                }}
                className="w-full px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyForMeRequestReview;


