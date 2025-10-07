'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { BuyForMeRequest } from '@/types/unifiedBuyForMe';
import { useAuth } from '@/context/AuthContext';
import { useModernNotification } from '@/context/ModernNotificationContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import BuyForMeCheckoutModal from '@/components/BuyForMe/BuyForMeCheckoutModal';
import PaymentSummary from '@/components/BuyForMe/PaymentSummary';
import { 
  Package, 
  Search, 
  Plus, 
  X, 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye,
  Edit3,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bell,
  Settings,
  ShoppingCart,
  Filter,
  Download,
  RefreshCw,
  Warehouse,
  Info,
  MapPin,
  FileText
} from 'lucide-react';
import Link from 'next/link';

// Enhanced Status Configuration
const STATUS_CONFIG = {
  pending: { 
    label: 'Pending Review', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    description: 'Your request is being reviewed by our team'
  },
  approved: { 
    label: 'Ready to Pay', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CreditCard,
    description: 'Your request has been approved. Please complete payment.'
  },
  in_progress: { 
    label: 'In Progress', 
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Package,
    description: 'We are processing your order'
  },
  inspection: { 
    label: 'Under Inspection', 
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: Eye,
    description: 'Items have arrived and are being inspected'
  },
  ready_to_ship: { 
    label: 'Ready to Ship', 
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    icon: CheckCircle,
    description: 'Items are ready for packaging and shipping'
  },
  packaging: { 
    label: 'Packaging', 
    color: 'bg-teal-100 text-teal-800 border-teal-200',
    icon: Package,
    description: 'Select your packaging preferences'
  },
  shipped: { 
    label: 'Shipped', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: Truck,
    description: 'Your order is on its way'
  },
  delivered: { 
    label: 'Delivered', 
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle2,
    description: 'Order delivered successfully'
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    description: 'This request has been cancelled'
  },
  changes_requested: { 
    label: 'Changes Requested', 
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: Edit3,
    description: 'Please make the requested changes'
  }
};

// Enhanced Tab Configuration for User
const USER_TAB_CONFIG = {
  'requests': {
    label: 'Requests',
    icon: Package,
    count: 0
  },
  'pay': {
    label: 'Pay',
    icon: CreditCard,
    count: 0
  },
  'in_progress': {
    label: 'In Progress',
    icon: Package,
    count: 0
  },
  'rejected': {
    label: 'Rejected',
    icon: XCircle,
    count: 0
  }
};

// Helper functions
const getStatusInfo = (request: BuyForMeRequest) => {
  // Handle special case for needs_modification
  if (request.reviewStatus === 'needs_modification') {
    return STATUS_CONFIG.changes_requested;
  }
  
  return STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
    month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

// Request Card Component for Modify Tab
const ModifyRequestCard: React.FC<{
  request: BuyForMeRequest;
  onViewDetails: (request: BuyForMeRequest) => void;
  onDelete: (requestId: string) => void;
}> = ({ request, onViewDetails, onDelete }) => {
  const statusInfo = getStatusInfo(request);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white border border-orange-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-orange-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Edit3 className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Request #{request.requestNumber}
            </h3>
            <p className="text-sm text-orange-600 font-medium">Changes Required</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Change Requirements */}
      {(request as any).changeRequirements && (request as any).changeRequirements.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Required Changes:</h4>
          <div className="space-y-2">
            {(request as any).changeRequirements.map((requirement: any, index: number) => (
              <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{requirement.description}</p>
                    <p className="text-xs text-gray-600 mt-1">{requirement.reason}</p>
                    {requirement.deadline && (
                      <p className="text-xs text-orange-600 mt-1">
                        Deadline: {formatDate(requirement.deadline)}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    requirement.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    requirement.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    requirement.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {requirement.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Modification Note */}
      {request.adminModificationNote && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Admin Note:</h4>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-700">{request.adminModificationNote}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Items</p>
            <p className="font-medium">{request.items.length} item(s)</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="font-medium">{request.totalAmount} {request.currency}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Created</p>
            <p className="font-medium">{formatDate(request.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {request.items.slice(0, 3).map((item, index) => (
            <span key={index} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
              {item.name}
            </span>
          ))}
          {request.items.length > 3 && (
            <span className="text-xs text-gray-500">
              +{request.items.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewDetails(request)}
            className="px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
          >
            Make Changes
          </button>
          <button
            onClick={() => onViewDetails(request)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(request._id)}
            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-lg transition-colors"
            title="Delete Request"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Request Card Component
const RequestCard: React.FC<{
  request: BuyForMeRequest;
  onViewDetails: (request: BuyForMeRequest) => void;
  onDelete: (requestId: string) => void;
  onUserConfirmation?: (request: BuyForMeRequest) => void;
  onMakePayment?: (request: BuyForMeRequest) => void;
}> = ({ request, onViewDetails, onDelete, onUserConfirmation, onMakePayment }) => {
  const statusInfo = getStatusInfo(request);
  const StatusIcon = statusInfo.icon;

  // Get sub-status badge info
  const getSubStatusBadge = (subStatus: string) => {
    const subStatusMap: Record<string, { label: string; color: string; icon: any }> = {
      'purchased': { label: 'Purchased', color: 'bg-green-100 text-green-800', icon: ShoppingCart },
      'arrived_at_warehouse': { label: 'Arrived', color: 'bg-blue-100 text-blue-800', icon: Warehouse },
      'inspection_in_progress': { label: 'QA', color: 'bg-purple-100 text-purple-800', icon: Eye },
      'customer_review': { label: 'User Confirmation', color: 'bg-orange-100 text-orange-800', icon: CheckCircle },
      'payment_pending': { label: 'Payment Pending', color: 'bg-yellow-100 text-yellow-800', icon: CreditCard },
      'payment_completed': { label: 'Payment Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };
    return subStatusMap[subStatus] || { label: subStatus, color: 'bg-gray-100 text-gray-800', icon: Package };
  };

  const subStatusBadge = getSubStatusBadge(request.subStatus || '');

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${statusInfo.color.replace('text-', 'bg-').replace('-800', '-100')}`}>
            <StatusIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Request #{request.requestNumber}
            </h3>
            <p className="text-sm text-gray-500">{statusInfo.description}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          {request.subStatus && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${subStatusBadge.color}`}>
              {subStatusBadge.label}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Items</p>
            <p className="font-medium">{request.items.length} item(s)</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="font-medium">{request.totalAmount} {request.currency}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Created</p>
            <p className="font-medium">{formatDate(request.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {request.items.slice(0, 3).map((item, index) => (
            <span key={index} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
              {item.name}
            </span>
          ))}
          {request.items.length > 3 && (
            <span className="text-xs text-gray-500">
              +{request.items.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {request.status === 'approved' && onMakePayment && (
            <button
              onClick={() => onMakePayment(request)}
              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Make Payment
            </button>
          )}
          {request.subStatus === 'customer_review' && onUserConfirmation && (
            <button
              onClick={() => onUserConfirmation(request)}
              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Confirm Items
            </button>
          )}
          <button
            onClick={() => onViewDetails(request)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {request.status === 'pending' && (
            <button
              onClick={() => onDelete(request._id)}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-lg transition-colors"
              title="Delete Request"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// User Confirmation Modal Component
const UserConfirmationModal: React.FC<{
  request: BuyForMeRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (request: BuyForMeRequest) => void;
  onReject: (request: BuyForMeRequest) => void;
}> = ({ request, isOpen, onClose, onApprove, onReject }) => {
  if (!isOpen || !request) return null;

  const handleApprove = () => {
    onApprove(request);
    onClose();
  };

  const handleReject = () => {
    onReject(request);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Item Confirmation Required</h2>
                <p className="text-sm text-gray-600">Request #{request.requestNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Items to confirm */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Received</h3>
              <div className="space-y-4">
                {request.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Price: {item.price} {item.currency}</p>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                        )}
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleApprove}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Approve Items
              </button>
              <button
                onClick={handleReject}
                className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle className="h-5 w-5 mr-2" />
                Reject Items
              </button>
            </div>

            {/* Info text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">What happens next?</p>
                  <p><strong>Approve:</strong> Items will be sent to your Box Contents to wait for other purchased items. You can request packaging and shipping when ready.</p>
                  <p className="mt-2"><strong>Reject:</strong> You can request replacement or return based on supplier policy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Request Details Modal Component
const RequestDetailsModal: React.FC<{
  request: BuyForMeRequest | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ request, isOpen, onClose }) => {
  if (!isOpen || !request) return null;

  const statusInfo = getStatusInfo(request);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 px-8 py-6 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-pink-600/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <statusInfo.icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Request Details</h2>
                <p className="text-orange-100 text-sm font-medium">Request #{request.requestNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 group"
            >
              <X className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)] bg-gradient-to-br from-gray-50 to-orange-50/30">
          <div className="space-y-8">
            {/* Status */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Status</h3>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-sm font-semibold text-gray-700">Current Status</span>
                <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${statusInfo.color} shadow-sm`}>
                  {statusInfo.label}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Items ({request.items.length})</h3>
              </div>
              <div className="space-y-4">
                {request.items.map((item, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg mb-3">{item.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantity</span>
                            <span className="font-bold text-gray-900">{item.quantity}</span>
                          </div>
                          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</span>
                            <span className="font-bold text-green-600">{item.price} {item.currency}</span>
                          </div>
                        </div>
                        {item.description && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Description</span>
                            <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
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
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                        title="View Product"
                      >
                        <ExternalLink className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Shipping Address</h3>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                  <div className="text-sm text-gray-700 space-y-1">
                    <div className="font-bold text-gray-900 text-base">{request.shippingAddress.name}</div>
                    <div className="font-medium">{request.shippingAddress.street}</div>
                    <div className="font-medium">
                      {request.shippingAddress.city}, {request.shippingAddress.country} {request.shippingAddress.postalCode}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {request.notes && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Notes</h3>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                  <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">Your Notes</span>
                  <p className="text-sm text-gray-700 mt-2">{request.notes}</p>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Timeline</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">Created</h4>
                  <p className="text-sm text-gray-600">{formatDate(request.createdAt)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">Last Updated</h4>
                  <p className="text-sm text-gray-600">{formatDate(request.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-orange-50 px-8 py-6 border-t border-gray-200">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-semibold border border-gray-300 hover:border-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function BuyForMeRequestsPage() {
  const [requests, setRequests] = useState<BuyForMeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<BuyForMeRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<BuyForMeRequest | null>(null);
  const [activeTab, setActiveTab] = useState<string>('requests');
  const [refreshing, setRefreshing] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const { showNotification } = useModernNotification();

  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/user/buyforme-requests?limit=1000', {
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
        setRequests(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch requests');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch BuyForMe requests');
      showNotification('error', 'Failed to load BuyForMe requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
    showNotification('success', 'Requests updated successfully');
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this product request? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/user/buyforme-requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setRequests(prev => prev.filter(req => req._id !== requestId));
      showNotification('success', 'Product request deleted successfully!');
    } catch (err: any) {
      console.error('Delete request error:', err);
      showNotification('error', err.message || 'Failed to delete request');
    }
  };

  const handleViewDetails = (request: BuyForMeRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleUserConfirmation = (request: BuyForMeRequest) => {
    setSelectedRequest(request);
    setIsConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setSelectedRequest(null);
  };

  const handleApproveItems = async (request: BuyForMeRequest) => {
    try {
      // Update request status to approved and move to box contents
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/user/buyforme-requests/${request._id}/customer-review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approved: true,
          comment: 'Items approved by customer'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh requests
      await fetchRequests();
      showNotification('success', 'Items approved! They will be moved to your Box Contents.');
      
      // Redirect to Box Contents
      window.location.href = '/User/ControlPanel/Box/BoxContents';
    } catch (err: any) {
      console.error('Approve items error:', err);
      showNotification('error', err.message || 'Failed to approve items');
    }
  };

  const handleRejectItems = async (request: BuyForMeRequest) => {
    try {
      // Update request status to rejected and move to returns
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/user/buyforme-requests/${request._id}/customer-review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approved: false,
          comment: 'Items rejected by customer'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh requests
      await fetchRequests();
      showNotification('success', 'Items rejected. You can now request replacement or return.');
      
      // Redirect to Returns page
      window.location.href = '/User/ControlPanel/BuyForMe/BuyForMeReturn';
    } catch (err: any) {
      console.error('Reject items error:', err);
      showNotification('error', err.message || 'Failed to reject items');
    }
  };

  const handleMakePayment = (request: BuyForMeRequest) => {
    setPaymentRequest(request);
    setIsCheckoutModalOpen(true);
  };

  const handleCloseCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
    setPaymentRequest(null);
  };

  const handlePaymentComplete = async (paymentData: any) => {
    setIsProcessingPayment(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Payment completed:', paymentData);
      
      // Handle both single request and bulk payment
      const requestIds = Array.isArray(paymentData.requests) ? paymentData.requests : [paymentData.requests];
      const requestCount = requestIds.length;
      
      // Close modal after successful payment
      setIsCheckoutModalOpen(false);
      setPaymentRequest(null);
      
      // Show success notification with appropriate message
      if (requestCount > 1) {
        showNotification('success', `Payment completed successfully for ${requestCount} requests!`);
      } else {
        showNotification('success', 'Payment completed successfully!');
      }
      
      // Refresh requests to update status
      await fetchRequests();
      
    } catch (error) {
      console.error('Payment failed:', error);
      showNotification('error', 'Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };


  // Calculate tab counts for new structure
  const tabCounts = useMemo(() => {
    const counts: Record<string, any> = {};
    
    // Requests tab (shows both pending and modify requests)
    counts.requests = requests.filter(req => 
      (req.status === 'pending' && req.reviewStatus === 'pending') || 
      req.reviewStatus === 'needs_modification'
    ).length;
    
    // Pay tab
    counts.pay = requests.filter(req => req.status === 'approved').length;
    
    // In Progress tab (no sub-tabs, just count)
    counts.in_progress = requests.filter(req => req.status === 'in_progress').length;
    
    // Rejected tab
    counts.rejected = requests.filter(req => req.status === 'cancelled').length;
    
    counts['all'] = requests.length;
    return counts;
  }, [requests]);

  // Filter requests based on active tab and search term
  const filteredRequests = useMemo(() => {
    let filtered = requests;

    // Filter by tab
    if (activeTab === 'requests') {
      filtered = filtered.filter(req => 
        (req.status === 'pending' && req.reviewStatus === 'pending') || 
        req.reviewStatus === 'needs_modification'
      );
    } else if (activeTab === 'pay') {
      filtered = filtered.filter(req => req.status === 'approved');
    } else if (activeTab === 'in_progress') {
      filtered = filtered.filter(req => req.status === 'in_progress');
    } else if (activeTab === 'rejected') {
      filtered = filtered.filter(req => req.status === 'cancelled');
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(request =>
    request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
    }

    return filtered;
  }, [requests, activeTab, searchTerm]);

  return (
    <ProtectedRoute>
      <UserControlPanel>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">BuyForMe Requests</h1>
              <p className="text-gray-600">Manage your product requests</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            <Link
              href="/User/ControlPanel/BuyForMe/cart"
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Request
            </Link>
          </div>
          </div>

          {/* Main Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {Object.entries(USER_TAB_CONFIG).map(([key, config]) => {
                const Icon = config.icon;
                const count = typeof tabCounts[key] === 'object' ? 
                  Object.values(tabCounts[key]).reduce((sum: number, val: any) => sum + val, 0) : 
                  tabCounts[key] || 0;
                
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                      activeTab === key
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {config.label}
                    {count > 0 && (
                      <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>


          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="h-4 w-4" />
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No requests match your search.' : 
                 `No requests in ${USER_TAB_CONFIG[activeTab as keyof typeof USER_TAB_CONFIG]?.label || 'this category'}.`}
              </p>
              {!searchTerm && activeTab === 'requests' && (
                <Link
                  href="/User/ControlPanel/BuyForMe/cart"
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Request
                </Link>
              )}
            </div>
          )}

          {/* Requests Grid / Payment Summary */}
          {!loading && filteredRequests.length > 0 && (
            <>
              {activeTab === 'pay' ? (
                // Use PaymentSummary for pay tab
                <PaymentSummary
                  requests={filteredRequests}
                  onPayment={handlePaymentComplete}
                  isProcessing={isProcessingPayment}
                  onViewDetails={handleViewDetails}
                  onShowCheckout={() => setIsCheckoutModalOpen(true)}
                />
              ) : (
                // Use individual cards for other tabs
                <div className="grid gap-6">
                  {filteredRequests.map((request) => (
                    request.reviewStatus === 'needs_modification' ? (
                      <ModifyRequestCard
                        key={request._id}
                        request={request}
                        onViewDetails={handleViewDetails}
                        onDelete={handleDeleteRequest}
                      />
                    ) : (
                      <RequestCard
                        key={request._id}
                        request={request}
                        onViewDetails={handleViewDetails}
                        onDelete={handleDeleteRequest}
                        onUserConfirmation={handleUserConfirmation}
                        onMakePayment={handleMakePayment}
                      />
                    )
                  ))}
                </div>
              )}
            </>
          )}

          {/* Request Details Modal */}
          <RequestDetailsModal
            request={selectedRequest}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />

          {/* User Confirmation Modal */}
          <UserConfirmationModal
            request={selectedRequest}
            isOpen={isConfirmationModalOpen}
            onClose={handleCloseConfirmationModal}
            onApprove={handleApproveItems}
            onReject={handleRejectItems}
          />

          {/* BuyForMe Checkout Modal */}
          {isCheckoutModalOpen && (
            <BuyForMeCheckoutModal
              isOpen={isCheckoutModalOpen}
              onClose={handleCloseCheckoutModal}
              requests={paymentRequest ? [paymentRequest] : filteredRequests.filter(req => req.status === 'approved')}
              feeBreakdown={paymentRequest ? {
                subtotal: paymentRequest.totalAmount || 0,
                shipping: 25.00,
                serviceFee: (paymentRequest.totalAmount || 0) * 0.03,
                tax: (paymentRequest.totalAmount || 0) * 0.08,
                discount: 0.00,
                total: (paymentRequest.totalAmount || 0) + 25.00 + ((paymentRequest.totalAmount || 0) * 0.03) + ((paymentRequest.totalAmount || 0) * 0.08)
              } : {
                // Calculate fee breakdown for multiple requests
                subtotal: filteredRequests.filter(req => req.status === 'approved').reduce((sum, req) => sum + (req.totalAmount || 0), 0),
                shipping: 25.00,
                serviceFee: filteredRequests.filter(req => req.status === 'approved').reduce((sum, req) => sum + (req.totalAmount || 0), 0) * 0.03,
                tax: filteredRequests.filter(req => req.status === 'approved').reduce((sum, req) => sum + (req.totalAmount || 0), 0) * 0.08,
                discount: 0.00,
                total: filteredRequests.filter(req => req.status === 'approved').reduce((sum, req) => sum + (req.totalAmount || 0), 0) + 25.00 + (filteredRequests.filter(req => req.status === 'approved').reduce((sum, req) => sum + (req.totalAmount || 0), 0) * 0.03) + (filteredRequests.filter(req => req.status === 'approved').reduce((sum, req) => sum + (req.totalAmount || 0), 0) * 0.08)
              }}
              onPaymentComplete={handlePaymentComplete}
              isProcessing={isProcessingPayment}
            />
          )}

        </div>
      </UserControlPanel>
    </ProtectedRoute>
  );
}