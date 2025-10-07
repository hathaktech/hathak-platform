// components/admin/BuyForMeManagementOptimized.tsx - Enhanced Tab-Based Admin Management
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useBuyForMeRequests } from '@/hooks/useBuyForMeRequests';
import { BuyForMeRequest } from '@/types/unifiedBuyForMe';
import ColumnManager, { ColumnConfig } from './ColumnManager';
import MarkAsPurchasedModal from './MarkAsPurchasedModal';
import BuyForMeBatchReview from './BuyForMeBatchReview';
import BuyForMeRequestReview from './BuyForMeRequestReview';
import CreateRequestForCustomer from './CreateRequestForCustomer';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Camera, 
  Truck, 
  AlertTriangle,
  Eye,
  Trash2,
  Plus,
  Search,
  RefreshCw,
  Filter,
  Download,
  Upload,
  CreditCard,
  ShoppingCart,
  Warehouse,
  Box,
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  User,
  X,
  Mail,
  MapPin,
  ExternalLink,
  Info,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Edit3,
  AlertCircle,
  Settings,
  List,
  BarChart3,
  FileText,
  Bell,
  Shield,
  Zap,
  Phone
} from 'lucide-react';

// Enhanced Status Configuration
const STATUS_CONFIG = {
  pending: { 
    label: 'Pending Review', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    description: 'Awaiting admin review'
  },
  approved: { 
    label: 'Approved', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    description: 'Approved, awaiting payment'
  },
  in_progress: { 
    label: 'In Progress', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Package,
    description: 'Payment completed, processing'
  },
  inspection: { 
    label: 'Under Inspection', 
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: Eye,
    description: 'Items arrived, under inspection'
  },
  ready_to_ship: { 
    label: 'Ready to Ship', 
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    icon: CheckCircle,
    description: 'Inspection passed, ready for packaging'
  },
  packaging: { 
    label: 'Packaging', 
    color: 'bg-teal-100 text-teal-800 border-teal-200',
    icon: Package,
    description: 'User selecting packaging options'
  },
  shipped: { 
    label: 'Shipped', 
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Truck,
    description: 'Shipped to customer'
  },
  delivered: { 
    label: 'Delivered', 
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle2,
    description: 'Customer confirmed receipt'
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    description: 'Request cancelled'
  },
  changes_requested: { 
    label: 'Changes Requested', 
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: Edit3,
    description: 'Admin requested changes'
  }
};

// Priority Configuration
const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  high: { label: 'High', color: 'bg-red-100 text-red-800 border-red-200' }
};

// Tab Configuration for Admin Dashboard
const ADMIN_TAB_CONFIG = {
  'review_queue': {
    label: 'Review Queue',
    icon: Clock,
    count: 0,
    subTabs: {
      'all_requests': { label: 'All Requests', icon: List, count: 0 },
      'customers': { label: 'Customers', icon: Users, count: 0 },
      'modify': { label: 'Modify', icon: Edit3, count: 0 }
    }
  },
  'payment_queue': {
    label: 'Payment Queue',
    icon: CreditCard,
    count: 0
  },
  'work_in_progress': {
    label: 'Work in Progress',
    icon: Package,
    subTabs: {
      'purchasing': { label: 'Purchasing', icon: ShoppingCart, count: 0 },
      'purchased': { label: 'Purchased', icon: CheckCircle, count: 0 },
      'shipping_to_warehouse': { label: 'Shipping to Warehouse', icon: Truck, count: 0 },
      'arrived_at_warehouse': { label: 'Arrived at Warehouse', icon: Warehouse, count: 0 }
    }
  },
  'inspection': {
    label: 'Inspection',
    icon: Eye,
    subTabs: {
      'pending_inspection': { label: 'Pending Inspection', icon: Clock, count: 0 },
      'in_progress': { label: 'In Progress', icon: Eye, count: 0 },
      'failed_inspection': { label: 'Failed Inspection', icon: XCircle, count: 0 }
    }
  },
  'packaging_shipping': {
    label: 'Packaging & Shipping',
    icon: Box,
    subTabs: {
      'ready_to_ship': { label: 'Ready to Ship', icon: CheckCircle, count: 0 },
      'packaging': { label: 'Packaging', icon: Package, count: 0 },
      'shipped': { label: 'Shipped', icon: Truck, count: 0 }
    }
  },
  'delivered': {
    label: 'Delivered',
    icon: CheckCircle2,
    count: 0
  },
  'cancelled': {
    label: 'Cancelled',
    icon: XCircle,
    count: 0
  },
  'statistics': {
    label: 'Statistics',
    icon: BarChart3,
    count: 0
  }
};

// Helper functions
const getStatusInfo = (request: BuyForMeRequest) => {
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

// Request Card Component
const RequestCard: React.FC<{
  request: BuyForMeRequest;
  onReview: (request: BuyForMeRequest) => void;
  onViewDetails: (request: BuyForMeRequest) => void;
  onDelete: (requestId: string) => void;
  showActions?: boolean;
}> = ({ request, onReview, onViewDetails, onDelete, showActions = true }) => {
  const statusInfo = getStatusInfo(request);
  const priorityInfo = PRIORITY_CONFIG[request.priority as keyof typeof PRIORITY_CONFIG];
  const StatusIcon = statusInfo.icon;

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
            <p className="text-sm text-gray-500">{request.customerName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityInfo.color}`}>
            {priorityInfo.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Items</p>
            <p className="font-medium">{request.items.length}</p>
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
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Customer</p>
            <p className="font-medium">{request.customerEmail}</p>
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

        {showActions && (
          <div className="flex items-center space-x-2">
            {(request.status === 'pending' || request.reviewStatus === 'needs_modification') && (
              <button
                onClick={() => onReview(request)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Review
              </button>
            )}
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
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Customer Grouped Table Component for bulk review
const CustomerGroupedTable: React.FC<{
  requests: BuyForMeRequest[];
  onReview: (request: BuyForMeRequest) => void;
  onBulkReview: (customerEmail: string, requests: BuyForMeRequest[]) => void;
  onViewDetails: (request: BuyForMeRequest) => void;
  onDelete: (requestId: string) => void;
}> = ({ requests, onReview, onBulkReview, onViewDetails, onDelete }) => {
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set());

  // Group requests by customer
  const groupedByCustomer = useMemo(() => {
    return requests.reduce((acc, req) => {
      const key = req.customerEmail || req.customerId;
      if (!acc[key]) {
        acc[key] = {
          customer: {
            email: req.customerEmail,
            name: req.customerName,
            id: req.customerId
          },
          requests: []
        };
      }
      acc[key].requests.push(req);
      return acc;
    }, {} as Record<string, { customer: { email: string; name: string; id: string }; requests: BuyForMeRequest[] }>);
  }, [requests]);

  const toggleCustomer = (customerEmail: string) => {
    setExpandedCustomers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(customerEmail)) {
        newSet.delete(customerEmail);
      } else {
        newSet.add(customerEmail);
      }
      return newSet;
    });
  };

  // Expand all customers by default
  useEffect(() => {
    const allCustomerEmails = new Set(Object.values(groupedByCustomer).map(group => group.customer.email));
    setExpandedCustomers(allCustomerEmails);
  }, [groupedByCustomer]);

  return (
    <div className="space-y-4">
      {Object.values(groupedByCustomer).map((customerGroup) => (
        <div key={customerGroup.customer.email} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Customer Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => toggleCustomer(customerGroup.customer.email)}
                className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors flex-1 text-left"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{customerGroup.customer.name}</h3>
                  <p className="text-sm text-gray-500">{customerGroup.customer.email}</p>
                </div>
                <div className="ml-auto">
                  {expandedCustomers.has(customerGroup.customer.email) ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>
              <div className="flex items-center space-x-3 ml-4">
                <span className="text-sm text-gray-500">
                  {customerGroup.requests.length} request{customerGroup.requests.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={() => onBulkReview(customerGroup.customer.email, customerGroup.requests)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
                >
                  Review All
                </button>
              </div>
            </div>
          </div>
          
          {/* Requests Table - Only show when expanded */}
          {expandedCustomers.has(customerGroup.customer.email) && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customerGroup.requests.map((request) => {
                  const statusInfo = getStatusInfo(request);
                  const priorityInfo = PRIORITY_CONFIG[request.priority];
                  
                  return (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{request.requestNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium">{request.items.length} item{request.items.length !== 1 ? 's' : ''}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {request.items.slice(0, 2).map((item, idx) => item.name).join(', ')}
                          {request.items.length > 2 && ` +${request.items.length - 2} more`}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.totalAmount} {request.currency}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityInfo.color}`}>
                          {priorityInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.reviewStatus === 'needs_modification' ? 'bg-yellow-100 text-yellow-800' : 
                          request.reviewStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.reviewStatus || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{new Date(request.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(request.createdAt).toLocaleTimeString([], { 
                            hour12: false,
                            hour: '2-digit', 
                            minute: '2-digit', 
                            second: '2-digit' 
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onReview(request)}
                            className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors whitespace-nowrap"
                            title="Review Request"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => onViewDetails(request)}
                            className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 transition-colors whitespace-nowrap"
                            title="View Details"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Unified Request Table Component - Adapts to different tabs
const RequestTable: React.FC<{
  requests: BuyForMeRequest[];
  onReview: (request: BuyForMeRequest) => void;
  onViewDetails: (request: BuyForMeRequest) => void;
  onDelete: (requestId: string) => void;
  activeTab: string;
  activeSubTab?: string;
  columns: Record<string, ColumnConfig>;
  onUpdateStatus?: (requestId: string, updates: { status?: string; subStatus?: string; notes?: string; adminNotes?: string; trackingNumber?: string; packagingChoice?: string; }) => Promise<any>;
  onOpenMarkAsPurchased?: (request: BuyForMeRequest) => void;
}> = ({ requests, onReview, onViewDetails, onDelete, activeTab, activeSubTab, columns, onUpdateStatus, onOpenMarkAsPurchased }) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter visible columns
  const visibleColumns = useMemo(() => {
    return Object.entries(columns).filter(([_, config]) => config.visible);
  }, [columns]);

  const sortedRequests = useMemo(() => {
    if (!sortConfig) return requests;

    return [...requests].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortConfig.key) {
        case 'requestNumber':
          aValue = a.requestNumber;
          bValue = b.requestNumber;
          break;
        case 'customerName':
          aValue = a.customerName.toLowerCase();
          bValue = b.customerName.toLowerCase();
          break;
        case 'customerEmail':
          aValue = a.customerEmail.toLowerCase();
          bValue = b.customerEmail.toLowerCase();
          break;
        case 'totalAmount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'itemsCount':
          aValue = a.items.length;
          bValue = b.items.length;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'priority':
          const priorityOrder = { low: 1, medium: 2, high: 3 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        // Tab-specific sorting
        case 'purchasedDate':
          aValue = a.orderDetails?.purchaseDate ? new Date(a.orderDetails.purchaseDate).getTime() : 0;
          bValue = b.orderDetails?.purchaseDate ? new Date(b.orderDetails.purchaseDate).getTime() : 0;
          break;
        case 'deliveryDate':
          aValue = a.actualDelivery ? new Date(a.actualDelivery).getTime() : 0;
          bValue = b.actualDelivery ? new Date(b.actualDelivery).getTime() : 0;
          break;
        case 'cancellationDate':
          aValue = a.cancelledAt ? new Date(a.cancelledAt).getTime() : 0;
          bValue = b.cancelledAt ? new Date(b.cancelledAt).getTime() : 0;
          break;
        case 'inspector':
          aValue = (a.controlDetails?.controlledBy || '').toLowerCase();
          bValue = (b.controlDetails?.controlledBy || '').toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [requests, sortConfig]);

  const SortIcon: React.FC<{ columnKey: string }> = ({ columnKey }) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4 text-gray-600" /> : 
      <ArrowDown className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table View */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              {visibleColumns.map(([key, column]) => (
                <th key={key} className={`${column.width} ${column.responsive} px-2 sm:px-4 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider`}>
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(key)}
                      className="flex items-center space-x-1 hover:text-gray-700 w-full"
                    >
                      <span className="whitespace-nowrap truncate">{column.label}</span>
                      <SortIcon columnKey={key} />
                    </button>
                  ) : (
                    <span className="whitespace-nowrap truncate">{column.label}</span>
                  )}
                </th>
              ))}
              <th className="w-24 px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="whitespace-nowrap">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRequests.map((request, index) => {
              const statusInfo = getStatusInfo(request);
              const priorityInfo = PRIORITY_CONFIG[request.priority as keyof typeof PRIORITY_CONFIG];
              const StatusIcon = statusInfo.icon;

              // Render cell content based on column key
              const renderCellContent = (key: string) => {
                switch (key) {
                  case 'requestNumber':
                    return (
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${statusInfo.color.replace('text-', 'bg-').replace('-800', '-100')}`}>
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{request.requestNumber}
                          </div>
                        </div>
                      </div>
                    );
                  
                  case 'customerName':
                    return (
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {request.customerName}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {request.customerEmail}
                        </div>
                      </div>
                    );
                  
                  case 'items':
                    return (
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">
                          {request.items.length} item{request.items.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-1">
                          {request.items.slice(0, 2).map((item, idx) => item.name).join(', ')}
                          {request.items.length > 2 && ` +${request.items.length - 2} more`}
                        </div>
                      </div>
                    );
                  
                  case 'totalAmount':
                    return (
                      <div className="text-sm font-medium text-gray-900">
                        {request.totalAmount} {request.currency}
                      </div>
                    );
                  
                  case 'priority':
                    return (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityInfo.color}`}>
                        {priorityInfo.label}
                      </span>
                    );
                  
                  case 'status':
                    return (
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    );
                  
                  case 'createdAt':
                    return (
                      <div className="text-sm text-gray-500">
                        <div>{new Date(request.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(request.createdAt).toLocaleTimeString([], { 
                            hour12: false,
                            hour: '2-digit', 
                            minute: '2-digit', 
                            second: '2-digit' 
                          })}
                        </div>
                      </div>
                    );
                  
                  // Tab-specific columns
                  case 'reviewStatus':
                    return (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        request.reviewStatus === 'needs_modification' ? 'bg-yellow-100 text-yellow-800' : 
                        request.reviewStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.reviewStatus || 'N/A'}
                      </span>
                    );
                  
                  case 'paymentStatus':
                    return (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {request.paymentStatus || 'Pending'}
                      </span>
                    );
                  
                  case 'paymentMethod':
                    return (
                      <span className="text-sm text-gray-900">
                        {request.paymentMethod || 'N/A'}
                      </span>
                    );
                  
                  case 'subStatus':
                    return (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {request.subStatus || 'N/A'}
                      </span>
                    );
                  
                  case 'purchasedDate':
                    return (
                      <div className="text-sm text-gray-500">
                        {request.orderDetails?.purchaseDate ? (
                          <div>
                            <div>{new Date(request.orderDetails.purchaseDate).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(request.orderDetails.purchaseDate).toLocaleTimeString([], { 
                                hour12: false,
                                hour: '2-digit', 
                                minute: '2-digit', 
                                second: '2-digit' 
                              })}
                            </div>
                          </div>
                        ) : 'N/A'}
                      </div>
                    );
                  
                  case 'inspector':
                    return (
                      <div className="text-sm text-gray-900">
                        {request.controlDetails?.controlledBy || 'Unassigned'}
                      </div>
                    );
                  
                  // New columns for Review Queue sub-tabs
                  case 'customerEmail':
                    return (
                      <div className="text-sm text-gray-900 truncate">
                        {request.customerEmail}
                      </div>
                    );
                  
                  case 'modificationNotes':
                    return (
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={request.adminModificationNote}>
                        {request.adminModificationNote || 'No notes'}
                      </div>
                    );
                  
                  case 'shippingMethod':
                    return (
                      <div className="text-sm text-gray-900">
                        {request.trackingNumber ? 'Tracked Shipping' : 'Standard Shipping'}
                      </div>
                    );
                  
                  case 'trackingNumber':
                    return (
                      <div className="text-sm text-blue-600 font-mono">
                        {request.trackingNumber || request.orderDetails?.trackingNumber || 'N/A'}
                      </div>
                    );
                  
                  case 'deliveryDate':
                    return (
                      <div className="text-sm text-gray-500">
                        {request.actualDelivery ? new Date(request.actualDelivery).toLocaleDateString() : 'N/A'}
                      </div>
                    );
                  
                  case 'deliveryMethod':
                    return (
                      <div className="text-sm text-gray-900">
                        {request.trackingNumber ? 'Tracked Delivery' : 'Standard Delivery'}
                      </div>
                    );
                  
                  case 'cancellationDate':
                    return (
                      <div className="text-sm text-gray-500">
                        {request.cancelledAt ? new Date(request.cancelledAt).toLocaleDateString() : 'N/A'}
                      </div>
                    );
                  
                  case 'cancellationReason':
                    return (
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {request.cancellationReason || 'N/A'}
                      </div>
                    );
                  
                  default:
                    return <div className="text-sm text-gray-500">N/A</div>;
                }
              };

              return (
                <tr key={request._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {visibleColumns.map(([columnKey, columnConfig]) => (
                    <td key={columnKey} className={`${columnConfig.width} ${columnConfig.responsive} px-2 sm:px-4 py-4`}>
                      <div className="overflow-hidden">
                        {renderCellContent(columnKey)}
                      </div>
                    </td>
                  ))}
                  <td className="w-24 px-1 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {/* Tab-specific actions */}
                      {activeTab === 'review_queue' && (request.status === 'pending' || request.reviewStatus === 'needs_modification') && (
                        <button
                          onClick={() => onReview(request)}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors whitespace-nowrap"
                          title="Review Request"
                        >
                          Review
                        </button>
                      )}
                      
                      {activeTab === 'payment_queue' && request.status === 'approved' && (
                        <button
                          onClick={() => onUpdateStatus && onUpdateStatus(request._id, { status: 'in_progress', subStatus: 'payment_completed' })}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors whitespace-nowrap"
                          title="Mark as Paid"
                        >
                          Paid
                        </button>
                      )}
                      
                      {activeTab === 'work_in_progress' && (
                        (activeSubTab === 'purchasing' && request.subStatus === 'payment_completed') ||
                        (activeSubTab === 'purchased' && request.subStatus === 'purchased') ||
                        (activeSubTab === 'shipping_to_warehouse' && request.subStatus === 'to_be_shipped_to_box') ||
                        (activeSubTab === 'arrived_at_warehouse' && request.subStatus === 'arrived_to_box')
                      ) && (
                        <button
                          onClick={() => {
                            if (activeSubTab === 'purchasing') {
                              // Open mark as purchased modal
                              onOpenMarkAsPurchased && onOpenMarkAsPurchased(request);
                            } else {
                              // For other steps, just update status
                              const nextSubStatus = 
                                activeSubTab === 'purchased' ? 'to_be_shipped_to_box' :
                                activeSubTab === 'shipping_to_warehouse' ? 'arrived_to_box' :
                                'admin_control';
                              onUpdateStatus && onUpdateStatus(request._id, { subStatus: nextSubStatus });
                            }
                          }}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors whitespace-nowrap"
                          title={activeSubTab === 'purchasing' ? 'Mark as Purchased' : 'Move to Next Step'}
                        >
                          {activeSubTab === 'purchasing' ? 'Purchase' : 'Next'}
                        </button>
                      )}
                      
                      {activeTab === 'packaging_shipping' && (
                        (activeSubTab === 'ready_to_ship' && request.subStatus === 'customer_approved') ||
                        (activeSubTab === 'packaging' && request.subStatus === 'packing_choice') ||
                        (activeSubTab === 'shipped' && request.status === 'shipped')
                      ) && (
                        <button
                          onClick={() => {
                            if (activeSubTab === 'ready_to_ship') {
                              onUpdateStatus && onUpdateStatus(request._id, { subStatus: 'packing_choice' });
                            } else if (activeSubTab === 'packaging') {
                              onUpdateStatus && onUpdateStatus(request._id, { status: 'shipped' });
                            } else {
                              onUpdateStatus && onUpdateStatus(request._id, { status: 'delivered' });
                            }
                          }}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors whitespace-nowrap"
                          title={activeSubTab === 'ready_to_ship' ? 'Package Items' :
                               activeSubTab === 'packaging' ? 'Mark as Shipped' : 'Mark as Delivered'}
                        >
                          {activeSubTab === 'ready_to_ship' ? 'Pack' :
                           activeSubTab === 'packaging' ? 'Ship' : 'Deliver'}
                        </button>
                      )}
                      
                      {/* Common actions */}
                      <button
                        onClick={() => onViewDetails(request)}
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-1 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onDelete(request._id)}
                        className="text-red-600 hover:text-red-900 hover:bg-red-100 p-1 rounded transition-colors"
                        title="Delete Request"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {sortedRequests.map((request, index) => {
          const statusInfo = getStatusInfo(request);
          const priorityInfo = PRIORITY_CONFIG[request.priority as keyof typeof PRIORITY_CONFIG];
          const StatusIcon = statusInfo.icon;

          return (
            <div key={request._id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${statusInfo.color.replace('text-', 'bg-').replace('-800', '-100')}`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      #{request.requestNumber}
                    </div>
                        <div className="text-xs text-gray-500">{request.customerName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityInfo.color}`}>
                    {priorityInfo.label}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Customer:</span>
                  <span className="text-gray-900">{request.customerEmail}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="text-gray-900">{request.items.length} item{request.items.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total:</span>
                  <span className="text-gray-900">{request.totalAmount} {request.currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">{new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 max-w-xs">
                  {request.items.slice(0, 2).map((item, idx) => item.name).join(', ')}
                  {request.items.length > 2 && ` +${request.items.length - 2} more`}
                </div>
                <div className="flex items-center space-x-2">
                  {(request.status === 'pending' || request.reviewStatus === 'needs_modification') && (
                    <button
                      onClick={() => onReview(request)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-xs"
                    >
                      Review
                    </button>
                  )}
                  <button
                    onClick={() => onViewDetails(request)}
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(request._id)}
                    className="text-red-600 hover:text-red-900 hover:bg-red-100 p-2 rounded-lg transition-colors"
                    title="Delete Request"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {sortedRequests.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No requests to review</h3>
          <p className="text-gray-600 max-w-sm mx-auto">All pending requests have been reviewed or there are no requests in this category.</p>
        </div>
      )}
    </div>
  );
};

// Statistics Component
const StatisticsTab: React.FC<{
  statistics: any;
  statusCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
}> = ({ statistics, statusCounts, priorityCounts }) => {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Requests</p>
              <p className="text-2xl font-bold text-blue-900">{statistics?.totalRequests || 0}</p>
              <p className="text-xs text-blue-600 mt-1">All time</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg shadow-md">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Value</p>
              <p className="text-2xl font-bold text-green-900">${statistics?.totalValue || 0}</p>
              <p className="text-xs text-green-600 mt-1">USD amount</p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg shadow-md">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-900">{statusCounts?.pending || 0}</p>
              <p className="text-xs text-yellow-600 mt-1">Needs action</p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg shadow-md">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">In Progress</p>
              <p className="text-2xl font-bold text-purple-900">{statusCounts?.in_progress || 0}</p>
              <p className="text-xs text-purple-600 mt-1">Active requests</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg shadow-md">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          Status Distribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => {
            const statusInfo = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
            if (!statusInfo) return null;
            
            return (
              <div key={status} className="text-center bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className={`p-3 rounded-lg ${statusInfo.color.replace('text-', 'bg-').replace('-800', '-100')} mx-auto w-fit mb-2 shadow-sm`}>
                  <statusInfo.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">{statusInfo.label}</p>
                <p className="text-xl font-bold text-gray-900">{count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(priorityCounts).map(([priority, count]) => {
            const priorityInfo = PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG];
            
            return (
              <div key={priority} className="text-center">
                <div className={`p-3 rounded-lg ${priorityInfo.color.replace('text-', 'bg-').replace('-800', '-100')} mx-auto w-fit mb-2`}>
                  <Shield className="h-6 w-6" />
                </div>
                <p className="text-sm text-gray-600">{priorityInfo.label}</p>
                <p className="text-xl font-bold text-gray-900">{count}</p>
              </div>
            );
          })}
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
  const priorityInfo = PRIORITY_CONFIG[request.priority as keyof typeof PRIORITY_CONFIG];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-8 py-6 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <statusInfo.icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Request Details</h2>
                <p className="text-blue-100 text-sm font-medium">Request #{request.requestNumber}</p>
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
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)] bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Status & Priority */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Status & Priority</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">Status</span>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${statusInfo.color} shadow-sm`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">Priority</span>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${priorityInfo.color} shadow-sm`}>
                      {priorityInfo.label}
                    </span>
                  </div>
                  {request.subStatus && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-semibold text-gray-700">Sub Status</span>
                      <span className="px-4 py-2 rounded-full text-sm font-bold border-2 bg-blue-100 text-blue-800 border-blue-200 shadow-sm">
                        {request.subStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Customer Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">{request.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">{request.customerEmail}</span>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Financial Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">Total Amount</span>
                    <span className="text-lg font-bold text-gray-900 bg-green-100 px-3 py-1 rounded-lg">
                      {formatCurrency(request.totalAmount, request.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">Currency</span>
                    <span className="text-sm font-semibold text-gray-700 bg-blue-100 px-3 py-1 rounded-lg">{request.currency}</span>
                  </div>
                  {request.paymentMethod && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-semibold text-gray-700">Payment Method</span>
                      <span className="text-sm font-semibold text-gray-700 bg-purple-100 px-3 py-1 rounded-lg">
                        {request.paymentMethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  )}
                  {request.transactionId && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-semibold text-gray-700">Transaction ID</span>
                      <span className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">{request.transactionId}</span>
                    </div>
                  )}
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
                        {request.shippingAddress.city}
                        {request.shippingAddress.state && `, ${request.shippingAddress.state}`}
                        {request.shippingAddress.postalCode && ` ${request.shippingAddress.postalCode}`}
                      </div>
                      <div className="font-medium">{request.shippingAddress.country}</div>
                      {request.shippingAddress.phone && (
                        <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-200">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{request.shippingAddress.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Items & Additional Info */}
            <div className="space-y-6">
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
                    <div key={index} className="border-2 border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-300">
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
                              <span className="font-bold text-green-600">{formatCurrency(item.price, item.currency)}</span>
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

              {/* Tracking Information */}
              {(request.trackingNumber || request.orderDetails?.trackingNumber) && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Truck className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Tracking Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-semibold text-gray-700">Tracking Number</span>
                      <span className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                        {request.trackingNumber || request.orderDetails?.trackingNumber}
                      </span>
                    </div>
                    {request.orderDetails?.supplier && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-semibold text-gray-700">Supplier</span>
                        <span className="text-sm font-semibold text-gray-700 bg-blue-100 px-3 py-1 rounded-lg">{request.orderDetails.supplier}</span>
                      </div>
                    )}
                    {request.orderDetails?.estimatedDelivery && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-semibold text-gray-700">Estimated Delivery</span>
                        <span className="text-sm font-semibold text-gray-700 bg-yellow-100 px-3 py-1 rounded-lg">{formatDate(request.orderDetails.estimatedDelivery)}</span>
                      </div>
                    )}
                    {request.orderDetails?.actualDelivery && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-semibold text-gray-700">Actual Delivery</span>
                        <span className="text-sm font-semibold text-gray-700 bg-green-100 px-3 py-1 rounded-lg">{formatDate(request.orderDetails.actualDelivery)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {(request.notes || request.adminNotes) && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FileText className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Notes</h3>
                  </div>
                  <div className="space-y-4">
                    {request.notes && (
                      <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                        <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">Customer Notes</span>
                        <p className="text-sm text-gray-700 mt-2">{request.notes}</p>
                      </div>
                    )}
                    {request.adminNotes && (
                      <div className="p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-400">
                        <span className="text-sm font-bold text-yellow-700 uppercase tracking-wide">Admin Notes</span>
                        <p className="text-sm text-gray-700 mt-2">{request.adminNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Review Comments */}
              {request.reviewComments && request.reviewComments.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-pink-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Review Comments</h3>
                  </div>
                  <div className="space-y-4">
                    {request.reviewComments.map((comment, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-xl border-l-4 border-blue-400">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-gray-700">{comment.adminName}</span>
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.comment}</p>
                        {comment.isInternal && (
                          <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-semibold">
                            Internal Note
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Timestamps */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Clock className="h-5 w-5 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Process Timestamps</h3>
                </div>
                <div className="space-y-3">
                  {/* Created */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">Created</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-700">{formatDate(request.createdAt)}</div>
                      <div className="text-xs text-gray-500">by {request.customerName}</div>
                    </div>
                  </div>

                  {/* Extract key process timestamps */}
                  {request.processHistory && request.processHistory.length > 0 && (() => {
                    const processMap = new Map();
                    
                    // Group processes by type and get the latest of each
                    request.processHistory.forEach(process => {
                      const key = process.processType;
                      if (!processMap.has(key) || new Date(process.processAt) > new Date(processMap.get(key).processAt)) {
                        processMap.set(key, process);
                      }
                    });

                    const keyProcesses = [
                      { type: 'review_approval', label: 'Approved', icon: '✅' },
                      { type: 'payment_received', label: 'Paid', icon: '💳' },
                      { type: 'payment_processed', label: 'Payment Processed', icon: '💳' },
                      { type: 'marked_purchased', label: 'Purchased', icon: '🛒' },
                      { type: 'arrived_to_warehouse', label: 'Arrived to Warehouse', icon: '🏭' },
                      { type: 'inspection_completed', label: 'Inspection Completed', icon: '🔍' },
                      { type: 'ready_to_ship', label: 'Ready to Ship', icon: '📦' },
                      { type: 'tracking_added', label: 'Shipped', icon: '🚚' },
                      { type: 'out_for_delivery', label: 'Out for Delivery', icon: '🚛' },
                      { type: 'customer_confirmed', label: 'Delivered', icon: '✅' },
                      { type: 'review_rejection', label: 'Rejected', icon: '❌' },
                      { type: 'request_modified', label: 'Needs Modification', icon: '⚠️' },
                      { type: 'cancelled', label: 'Cancelled', icon: '❌' }
                    ];

                    return keyProcesses.map(({ type, label, icon }) => {
                      const process = processMap.get(type);
                      if (!process) return null;

                      return (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 flex items-center">
                            <span className="mr-2">{icon}</span>
                            {label}
                          </span>
                          <div className="text-right">
                            <div className="text-sm text-gray-700">{formatDate(process.processAt)}</div>
                            <div className="text-xs text-gray-500">by {process.processedByName}</div>
                          </div>
                        </div>
                      );
                    }).filter(Boolean);
                  })()}

                  {/* Last Updated */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Last Updated</span>
                    <div className="text-right">
                      <div className="text-sm text-gray-700">{formatDate(request.updatedAt)}</div>
                      <div className="text-xs text-gray-500">by {request.lastModifiedByAdmin || 'System'}</div>
                    </div>
                  </div>

                  {request.cancelledAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Cancelled</span>
                      <div className="text-right">
                        <div className="text-sm text-gray-700">{formatDate(request.cancelledAt)}</div>
                        <div className="text-xs text-gray-500">by System</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-t border-gray-200">
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
const BuyForMeManagementOptimized: React.FC = () => {
  const { admin, checkAuthStatus } = useAdminAuth();
  const {
    requests: rawRequests,
    loading,
    error,
    pagination,
    statusCounts,
    priorityCounts,
    statistics,
    fetchRequests,
    reviewRequest,
    deleteRequest,
    updateRequestStatus
  } = useBuyForMeRequests();

  // Type-safe conversion of requests
  const requests = rawRequests as BuyForMeRequest[];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<BuyForMeRequest | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('review_queue');
  const [activeSubTab, setActiveSubTab] = useState<string>('all_requests');
  const [refreshing, setRefreshing] = useState(false);
  
  // Batch review modal state
  const [batchPackage, setBatchPackage] = useState<any>(null);
  const [isBatchReviewModalOpen, setIsBatchReviewModalOpen] = useState(false);

  // Mark as purchased modal state
  const [isMarkAsPurchasedModalOpen, setIsMarkAsPurchasedModalOpen] = useState(false);
  const [selectedRequestForPurchase, setSelectedRequestForPurchase] = useState<BuyForMeRequest | null>(null);

  // Column management state
  const [columns, setColumns] = useState<Record<string, ColumnConfig>>({});

  // Generate default column configuration
  const getDefaultColumns = (): Record<string, ColumnConfig> => {
    const baseColumns = {
      'requestNumber': { 
        label: 'Request #', 
        sortable: true, 
        width: 'w-24 min-w-24 max-w-28', 
        responsive: '', 
        visible: true, 
        required: true 
      },
      'customerName': { 
        label: 'Customer', 
        sortable: true, 
        width: 'w-32 min-w-28', 
        responsive: 'hidden lg:table-cell', 
        visible: true 
      },
      'items': { 
        label: 'Items', 
        sortable: false, 
        width: 'w-40 min-w-32', 
        responsive: '', 
        visible: true, 
        required: true 
      },
      'totalAmount': { 
        label: 'Total', 
        sortable: true, 
        width: 'w-20 min-w-20', 
        responsive: 'hidden md:table-cell', 
        visible: true 
      },
      'priority': { 
        label: 'Priority', 
        sortable: true, 
        width: 'w-24 min-w-24', 
        responsive: 'hidden lg:table-cell', 
        visible: true 
      },
      'status': { 
        label: 'Status', 
        sortable: false, 
        width: 'w-32 min-w-28', 
        responsive: '', 
        visible: true, 
        required: true 
      },
      'createdAt': { 
        label: 'Created', 
        sortable: true, 
        width: 'w-28 min-w-28', 
        responsive: 'hidden md:table-cell', 
        visible: true 
      }
    };

    switch (activeTab) {
      case 'review_queue':
        if (activeSubTab === 'customers') {
          return {
            ...baseColumns,
            'customerEmail': { 
              label: 'Customer Email', 
              sortable: true, 
              width: 'w-48 min-w-40', 
              responsive: 'hidden lg:table-cell', 
              visible: true 
            }
          };
        } else if (activeSubTab === 'modify') {
          return {
            ...baseColumns,
            'reviewStatus': { 
              label: 'Review Status', 
              sortable: false, 
              width: 'w-32 min-w-28', 
              responsive: '', 
              visible: true 
            },
            'modificationNotes': { 
              label: 'Modification Notes', 
              sortable: false, 
              width: 'w-48 min-w-40', 
              responsive: 'hidden lg:table-cell', 
              visible: true 
            }
          };
        } else {
          return { 
            ...baseColumns, 
            'reviewStatus': { 
              label: 'Review Status', 
              sortable: false, 
              width: 'w-32 min-w-28', 
              responsive: 'hidden lg:table-cell', 
              visible: true 
            }
          };
        }
      
      case 'payment_queue':
        return { 
          ...baseColumns, 
          'paymentStatus': { 
            label: 'Payment Status', 
            sortable: false, 
            width: 'w-28 min-w-24', 
            responsive: 'hidden md:table-cell', 
            visible: true 
          },
          'paymentMethod': { 
            label: 'Payment Method', 
            sortable: false, 
            width: 'w-32 min-w-28', 
            responsive: 'hidden lg:table-cell', 
            visible: true 
          }
        };
      
      case 'work_in_progress':
        if (activeSubTab === 'purchasing') {
          return {
            ...baseColumns,
            'subStatus': { 
              label: 'Sub Status', 
              sortable: false, 
              width: 'w-36 min-w-32', 
              responsive: 'hidden lg:table-cell', 
              visible: true 
            }
            // No purchasedDate column for purchasing subtab since items haven't been purchased yet
          };
        } else {
          return {
            ...baseColumns,
            'subStatus': { 
              label: 'Sub Status', 
              sortable: false, 
              width: 'w-36 min-w-32', 
              responsive: 'hidden lg:table-cell', 
              visible: true 
            },
            'purchasedDate': { 
              label: 'Purchased Date', 
              sortable: true, 
              width: 'w-28 min-w-28', 
              responsive: 'hidden md:table-cell', 
              visible: true 
            }
          };
        }
      
      case 'inspection':
        return {
          ...baseColumns,
          'subStatus': { 
            label: 'Inspection Status', 
            sortable: false, 
            width: 'w-36 min-w-32', 
            responsive: 'hidden md:table-cell', 
            visible: true 
          },
          'inspector': { 
            label: 'Inspector', 
            sortable: true, 
            width: 'w-32 min-w-28', 
            responsive: 'hidden lg:table-cell', 
            visible: true 
          }
        };
      
      case 'packaging_shipping':
        return {
          ...baseColumns,
          'subStatus': { 
            label: 'Shipping Status', 
            sortable: false, 
            width: 'w-36 min-w-32', 
            responsive: 'hidden md:table-cell', 
            visible: true 
          },
          'shippingMethod': { 
            label: 'Shipping Method', 
            sortable: false, 
            width: 'w-36 min-w-32', 
            responsive: 'hidden lg:table-cell', 
            visible: true 
          },
          'trackingNumber': { 
            label: 'Tracking Number', 
            sortable: false, 
            width: 'w-40 min-w-32', 
            responsive: 'hidden lg:table-cell', 
            visible: true 
          }
        };
      
      case 'delivered':
        return {
          ...baseColumns,
          'deliveryDate': { 
            label: 'Delivery Date', 
            sortable: true, 
            width: 'w-28 min-w-28', 
            responsive: 'hidden md:table-cell', 
            visible: true 
          },
          'deliveryMethod': { 
            label: 'Delivery Method', 
            sortable: false, 
            width: 'w-32 min-w-28', 
            responsive: 'hidden lg:table-cell', 
            visible: true 
          }
        };
      
      case 'cancelled':
        return {
          ...baseColumns,
          'cancellationDate': { 
            label: 'Cancelled Date', 
            sortable: true, 
            width: 'w-28 min-w-28', 
            responsive: 'hidden md:table-cell', 
            visible: true 
          },
          'cancellationReason': { 
            label: 'Cancellation Reason', 
            sortable: false, 
            width: 'w-48 min-w-40', 
            responsive: 'hidden lg:table-cell', 
            visible: true 
          }
        };
      
      default:
        return baseColumns;
    }
  };

  // Update columns when tab changes
  useEffect(() => {
    setColumns(getDefaultColumns());
  }, [activeTab, activeSubTab]);

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle tab changes and reset sub-tab
  useEffect(() => {
    if (activeTab === 'review_queue' && ADMIN_TAB_CONFIG.review_queue.subTabs && !(activeSubTab in ADMIN_TAB_CONFIG.review_queue.subTabs)) {
      setActiveSubTab('all_requests');
    } else if (activeTab === 'work_in_progress' && ADMIN_TAB_CONFIG.work_in_progress.subTabs && !(activeSubTab in ADMIN_TAB_CONFIG.work_in_progress.subTabs)) {
      setActiveSubTab('purchasing');
    } else if (activeTab === 'inspection' && ADMIN_TAB_CONFIG.inspection.subTabs && !(activeSubTab in ADMIN_TAB_CONFIG.inspection.subTabs)) {
      setActiveSubTab('pending_inspection');
    } else if (activeTab === 'packaging_shipping' && ADMIN_TAB_CONFIG.packaging_shipping.subTabs && !(activeSubTab in ADMIN_TAB_CONFIG.packaging_shipping.subTabs)) {
      setActiveSubTab('ready_to_ship');
    }
  }, [activeTab, activeSubTab]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  const handleReview = (request: BuyForMeRequest) => {
    setSelectedRequest(request);
    setIsReviewModalOpen(true);
  };

  // Helper function to transform multiple requests into batch format
  const createBatchPackageFromRequests = (requests: BuyForMeRequest[]) => {
    if (!requests || requests.length === 0) return null;

    // Determine batch priority (highest priority among all requests)
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const sortedRequests = requests.sort((a, b) => 
      priorityWeight[b.priority] - priorityWeight[a.priority]
    );
    const batchPriority = sortedRequests[0].priority;

    // Generate batch name
    const customerName = requests[0].customerName;
    const requestCount = requests.length;
    const submitDate = requests[0].createdAt;
    const batchName = `Bulk Review - ${customerName} - ${requestCount} request${requestCount !== 1 ? 's' : ''} - ${new Date(submitDate).toLocaleDateString()}`;

    return {
      batchName,
      customerInfo: {
        customerId: requests[0].customerId,
        customerName: requests[0].customerName,
        customerEmail: requests[0].customerEmail,
      },
      individualRequests: requests.map(request => ({
        _id: request._id,
        id: request._id,
        requestNumber: request.requestNumber,
        customerId: request.customerId,
        customerName: request.customerName,
        customerEmail: request.customerEmail,
        itemName: request.items[0]?.name || 'Unknown Item',
        itemUrl: request.items[0]?.url || '',
        quantity: request.items[0]?.quantity || 1,
        price: request.items[0]?.price || 0,
        currency: request.items[0]?.currency || 'USD',
        description: request.items[0]?.description || '',
        sizes: request.items[0]?.sizes || [],
        colors: request.items[0]?.colors || [],
        images: request.items[0]?.images || [],
        totalAmount: request.totalAmount,
        status: request.status,
        priority: request.priority,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        reviewStatus: request.reviewStatus,
        reviewComments: request.reviewComments,
        rejectionReason: request.rejectionReason,
        shippingAddress: request.shippingAddress,
        modifiedByUser: request.modifiedByUser,
        modifiedByAdmin: request.modifiedByAdmin,
        adminModificationDate: request.adminModificationDate,
        adminModificationNote: request.adminModificationNote,
        lastModifiedByAdmin: request.lastModifiedByAdmin,
        originalValues: request.originalValues,
        modificationHistory: request.modificationHistory,
       })),
      submittedAt: requests[0].createdAt,
      batchPriority,
      shippingAddress: requests[0].shippingAddress,
    };
  };

  const handleBatchReviewComplete = async (reviewData: any) => {
    try {
      // Process batch review data
      // Extract individual request reviews from batch data
      console.log('🔄 Processing batch review:', reviewData);
      
      // Submit each individual request review
      for (const individualReview of reviewData.individualReviews || []) {
        try {
          const reviewPayload = {
            reviewStatus: individualReview.reviewStatus,
            comment: individualReview.comment || '',
            rejectionReason: individualReview.reviewStatus === 'rejected' ? individualReview.comment : undefined,
            isInternal: reviewData.isInternal || false,
            modifiedItems: [] // Not used in this context
          };
          
          console.log(`🔄 Reviewing request ${individualReview.requestNumber}:`, {
            requestId: individualReview.requestId,
            reviewPayload
          });
          
          await reviewRequest(individualReview.requestId, reviewPayload);
          
          console.log(`✅ Successfully reviewed request ${individualReview.requestNumber}`);
        } catch (error) {
          console.error(`❌ Failed to review request ${individualReview.requestNumber}:`, error);
        }
      }
      
      // Close modal and refresh
      setIsBatchReviewModalOpen(false);
      setBatchPackage(null);
      
      // Force refresh to ensure UI updates
      setTimeout(async () => {
        await fetchRequests();
      }, 300);
    } catch (error) {
      console.error('Batch review processing failed:', error);
    }
  };

  const handleReviewComplete = async (reviewData: any) => {
    if (!selectedRequest) return;
    
    try {
      console.log('🔄 Starting review completion...', {
        requestId: selectedRequest._id,
        requestNumber: selectedRequest.requestNumber,
        reviewData
      });
      
      await reviewRequest(selectedRequest._id, reviewData);
      
      console.log('✅ Review completed successfully');
      setIsReviewModalOpen(false);
      setSelectedRequest(null);
      
      console.log('🔄 Forcing refresh...');
      // Force immediate refresh
      await fetchRequests();
      
      // Force another refresh after a short delay to ensure data consistency
      setTimeout(async () => {
        console.log('🔄 Second refresh...');
        await fetchRequests();
      }, 500);
      
    } catch (error) {
      console.error('❌ Review failed:', error);
    }
  };

  const handleBulkReview = (customerEmail: string, requests: BuyForMeRequest[]) => {
    console.log(`Bulk reviewing ${requests.length} requests for customer: ${customerEmail}`);
    
    if (requests.length > 0) {
      // Transform requests into batch format for BuyForMeBatchReview
      const batchPackage = createBatchPackageFromRequests(requests);
      
      if (batchPackage) {
        // Open batch review modal instead of single request modal
        setBatchPackage(batchPackage);
        setIsBatchReviewModalOpen(true);
      } else {
        console.error('Failed to create batch package from requests');
      }
    }
  };

  const handleDelete = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteRequest(requestId);
      await fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleViewDetails = (request: BuyForMeRequest) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  // Handle opening mark as purchased modal
  const handleOpenMarkAsPurchased = (request: BuyForMeRequest) => {
    setSelectedRequestForPurchase(request);
    setIsMarkAsPurchasedModalOpen(true);
  };

  // Handle mark as purchased with auto-retry on auth failure
  const handleMarkAsPurchased = async (id: string, data: {
    supplier: string;
    purchaseOrderNumber?: string;
    estimatedDelivery?: string;
    notes?: string;
    purchaseAmount?: string;
    paymentMethod?: string;
    trackingNumber?: string;
    currency?: string;
    shippingAddress?: string;
  }) => {
    try {
      // Get token from localStorage to ensure we have the latest token
      const currentToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      console.log('📦 Marking as purchased:', { 
        id, 
        data, 
        admin: { 
          id: admin?._id, 
          token: currentToken ? '✓' : '✗',
          contextToken: 'N/A',
          localStorageToken: typeof window !== 'undefined' ? localStorage.getItem('adminToken')?.substring(0, 20) + '...' : 'N/A'
        } 
      });
      
      // Call the API to mark as purchased
      const response = await fetch(`/api/admin/buyforme-requests/${id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          ...data,
          adminId: admin?._id
        })
      });

      console.log('📦 Response status:', response.status, response.statusText);
      console.log('📦 Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('📦 Response ok?', response.ok);
      console.log('📦 Response URL:', response.url);

      // Clone response to read it twice if needed
      const responseClone = response.clone();
      
      // Try to parse response as JSON
      let responseData;
      const contentType = response.headers.get('content-type');
      console.log('📦 Content-Type:', contentType);
      
      try {
        // First, try to get as text to see what we're dealing with
        const textResponse = await responseClone.text();
        console.log('📦 Raw response body length:', textResponse.length);
        console.log('📦 Raw response body:', textResponse);
        
        // Now try to parse as JSON if it looks like JSON
        if (textResponse && textResponse.trim().startsWith('{')) {
          try {
            responseData = JSON.parse(textResponse);
            console.log('📦 Parsed response data:', responseData);
          } catch (parseError) {
            console.error('❌ JSON parse error:', parseError);
            responseData = { error: textResponse };
          }
        } else if (textResponse && textResponse.trim().length > 0) {
          console.log('📦 Response is not JSON, using as text');
          responseData = { error: textResponse };
        } else {
          console.log('📦 Empty response body');
          responseData = { error: 'Empty response from server' };
        }
      } catch (readError) {
        console.error('❌ Failed to read response:', readError);
        responseData = { error: 'Failed to read server response' };
      }

      if (!response.ok) {
        // Check if it's an authentication error
        if (response.status === 401) {
          console.log('🔄 Authentication failed, attempting auto-login...');
          
          try {
            // Try to auto-login using the Next.js API route
            const loginResponse = await fetch('/api/admin/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'admin@hathak.com', password: 'admin123' })
            });
            
            if (loginResponse.ok) {
              const loginData = await loginResponse.json();
              localStorage.setItem('adminToken', loginData.token);
              console.log('✅ Auto-login successful, updating context...');
              
              // Update admin context with new token
              await checkAuthStatus();
              
              // Retry the original request
              const retryResponse = await fetch(`/api/admin/buyforme-requests/${id}/purchase`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${loginData.token}`
                },
                body: JSON.stringify({
                  ...data,
                  adminId: loginData.admin._id
                })
              });
              
              if (retryResponse.ok) {
                console.log('✅ Retry successful!');
                await fetchRequests();
                return;
              }
            }
          } catch (autoLoginError) {
            console.error('❌ Auto-login failed:', autoLoginError);
          }
        }
        
        const errorMessage = responseData?.message || 
                            responseData?.error?.message || 
                            responseData?.error || 
                            `Server error: ${response.status} ${response.statusText}`;
        console.error('❌ Error response:', { 
          status: response.status, 
          statusText: response.statusText,
          data: responseData,
          contentType,
          url: response.url
        });
        throw new Error(errorMessage);
      }

      console.log('✅ Successfully marked as purchased');
      
      // Refresh the requests list
      await fetchRequests();
    } catch (error) {
      console.error('❌ Error marking as purchased:', error);
      throw error;
    }
  };

  // Calculate tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, any> = {};
    
    // Review Queue counts - SIMPLIFIED
    const allReviewRequests = requests.filter(req => 
      req.status === 'pending' || 
      req.reviewStatus === 'needs_modification'
    );
    
    // Payment Queue count - SIMPLIFIED
    const paymentQueueRequests = requests.filter(req => req.status === 'approved');
    
    console.log('🔍 SIMPLIFIED DEBUG:', {
      totalRequests: requests.length,
      reviewQueueCount: allReviewRequests.length,
      paymentQueueCount: paymentQueueRequests.length,
      approvedRequests: paymentQueueRequests.map(req => ({
        requestNumber: req.requestNumber,
        status: req.status,
        reviewStatus: req.reviewStatus
      })),
      allRequestStatuses: requests.map(req => ({
        requestNumber: req.requestNumber,
        status: req.status,
        reviewStatus: req.reviewStatus,
        subStatus: req.subStatus
      }))
    });
    
    counts.review_queue = {
      count: allReviewRequests.length,
      all_requests: allReviewRequests.length,
      customers: allReviewRequests.length, // Simplified
      modify: requests.filter(req => req.reviewStatus === 'needs_modification').length
    };
    
    // Payment Queue count (all approved requests)
    counts.payment_queue = requests.filter(req => req.status === 'approved').length;
    
    // Work in Progress counts
    counts.work_in_progress = {
      purchasing: requests.filter(req => req.status === 'in_progress' && req.subStatus === 'payment_completed').length,
      purchased: requests.filter(req => req.status === 'in_progress' && req.subStatus === 'purchased').length,
      shipping_to_warehouse: requests.filter(req => req.status === 'in_progress' && req.subStatus === 'to_be_shipped_to_box').length,
      arrived_at_warehouse: requests.filter(req => req.status === 'in_progress' && req.subStatus === 'arrived_to_box').length
    };
    
    // Inspection counts
    counts.inspection = {
      pending_inspection: requests.filter(req => req.subStatus === 'admin_control').length,
      in_progress: requests.filter(req => req.subStatus === 'customer_review').length,
      failed_inspection: requests.filter(req => req.subStatus === 'customer_rejected').length
    };
    
    // Packaging & Shipping counts
    counts.packaging_shipping = {
      ready_to_ship: requests.filter(req => req.subStatus === 'customer_approved').length,
      packaging: requests.filter(req => req.subStatus === 'packing_choice').length,
      shipped: requests.filter(req => req.status === 'shipped').length
    };
    
    // Other counts
    counts.delivered = requests.filter(req => req.status === 'delivered').length;
    counts.cancelled = requests.filter(req => req.status === 'cancelled').length;
    
    return counts;
  }, [requests]);

  // Filter requests based on active tab and search term
  const filteredRequests = useMemo(() => {
    let filtered = requests;

    // Filter by tab - SIMPLIFIED LOGIC
    if (activeTab === 'review_queue') {
      // Show requests that need review
      filtered = filtered.filter(req => 
        req.status === 'pending' || 
        req.reviewStatus === 'needs_modification'
      );
    } else if (activeTab === 'payment_queue') {
      // Show ALL approved requests - no additional conditions
      console.log('🔍 PAYMENT QUEUE DEBUG:', {
        activeTab,
        totalRequests: requests.length,
        beforeFilter: requests.map(req => ({ requestNumber: req.requestNumber, status: req.status, reviewStatus: req.reviewStatus })),
        approvedRequests: requests.filter(req => req.status === 'approved').map(req => ({ requestNumber: req.requestNumber, status: req.status, reviewStatus: req.reviewStatus }))
      });
      filtered = filtered.filter(req => req.status === 'approved');
      console.log('🔍 PAYMENT QUEUE FILTERED:', {
        filteredCount: filtered.length,
        filteredRequests: filtered.map(req => ({ requestNumber: req.requestNumber, status: req.status, reviewStatus: req.reviewStatus }))
      });
    } else if (activeTab === 'work_in_progress') {
      if (activeSubTab === 'purchasing') {
        filtered = filtered.filter(req => req.status === 'in_progress' && req.subStatus === 'payment_completed');
      } else if (activeSubTab === 'purchased') {
        filtered = filtered.filter(req => req.status === 'in_progress' && req.subStatus === 'purchased');
      } else if (activeSubTab === 'shipping_to_warehouse') {
        filtered = filtered.filter(req => req.status === 'in_progress' && req.subStatus === 'to_be_shipped_to_box');
      } else if (activeSubTab === 'arrived_at_warehouse') {
        filtered = filtered.filter(req => req.status === 'in_progress' && req.subStatus === 'arrived_to_box');
      }
    } else if (activeTab === 'inspection') {
      if (activeSubTab === 'pending_inspection') {
        filtered = filtered.filter(req => req.subStatus === 'admin_control');
      } else if (activeSubTab === 'in_progress') {
        filtered = filtered.filter(req => req.subStatus === 'customer_review');
      } else if (activeSubTab === 'failed_inspection') {
        filtered = filtered.filter(req => req.subStatus === 'customer_rejected');
      }
    } else if (activeTab === 'packaging_shipping') {
      if (activeSubTab === 'ready_to_ship') {
        filtered = filtered.filter(req => req.subStatus === 'customer_approved');
      } else if (activeSubTab === 'packaging') {
        filtered = filtered.filter(req => req.subStatus === 'packing_choice');
      } else if (activeSubTab === 'shipped') {
        filtered = filtered.filter(req => req.status === 'shipped');
      }
    } else if (activeTab === 'delivered') {
      filtered = filtered.filter(req => req.status === 'delivered');
    } else if (activeTab === 'cancelled') {
      filtered = filtered.filter(req => req.status === 'cancelled');
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }, [requests, activeTab, activeSubTab, searchTerm]);


  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">BuyForMe Management</h1>
                <p className="text-sm sm:text-base text-gray-600">Manage customer requests and fulfillment process</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Create Request</span>
                <span className="sm:hidden">Create</span>
              </button>
            </div>
          </div>

          {/* Main Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <nav className="flex space-x-1 overflow-x-auto">
              {Object.entries(ADMIN_TAB_CONFIG).map(([key, config]) => {
                const Icon = config.icon;
                const count = tabCounts[key]?.count || 
                  (typeof tabCounts[key] === 'object' ? 
                    Object.values(tabCounts[key]).reduce((sum: number, val: any) => sum + val, 0) : 
                    tabCounts[key] || 0);
                
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveTab(key);
                      // Reset sub-tab when switching main tabs
                      if ('subTabs' in config && config.subTabs) {
                        setActiveSubTab(Object.keys(config.subTabs)[0]);
                      }
                    }}
                    className={`py-3 px-4 font-medium text-sm whitespace-nowrap flex items-center rounded-lg transition-all duration-200 ${
                      activeTab === key
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="hidden sm:inline">{config.label}</span>
                    <span className="sm:hidden">{config.label.split(' ')[0]}</span>
                    {count > 0 && (
                      <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                        activeTab === key 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                      {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sub Tabs */}
          {ADMIN_TAB_CONFIG[activeTab as keyof typeof ADMIN_TAB_CONFIG] && 
           'subTabs' in ADMIN_TAB_CONFIG[activeTab as keyof typeof ADMIN_TAB_CONFIG] && 
           (ADMIN_TAB_CONFIG[activeTab as keyof typeof ADMIN_TAB_CONFIG] as any).subTabs && (
            <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
              <nav className="flex space-x-2 overflow-x-auto">
                {Object.entries((ADMIN_TAB_CONFIG[activeTab as keyof typeof ADMIN_TAB_CONFIG] as any).subTabs!).map(([key, config]: [string, any]) => {
                  const Icon = config.icon;
                  const count = tabCounts[activeTab]?.[key] || 0;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveSubTab(key)}
                      className={`py-2 px-3 font-medium text-sm whitespace-nowrap flex items-center rounded-md transition-all duration-200 ${
                        activeSubTab === key
                          ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white'
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
          )}

          {/* Statistics Tab Content */}
          {activeTab === 'statistics' && (
            <StatisticsTab
              statistics={statistics}
              statusCounts={statusCounts}
              priorityCounts={priorityCounts}
            />
          )}

          {/* Other Tab Content */}
          {activeTab !== 'statistics' && (
            <>
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
                <ColumnManager
                  columns={columns}
                  onColumnsChange={setColumns}
                  activeTab={activeTab}
                  activeSubTab={activeSubTab}
                />
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

              {/* Payment Queue Refresh Button */}
              {activeTab === 'payment_queue' && (
                <div className="mb-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Showing {filteredRequests.length} approved request{filteredRequests.length !== 1 ? 's' : ''}
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredRequests.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? 'No requests match your search.' : 
                     `No requests in ${ADMIN_TAB_CONFIG[activeTab as keyof typeof ADMIN_TAB_CONFIG]?.label || 'this category'}.`}
                  </p>
                </div>
              )}

              {/* Requests Display */}
              {!loading && filteredRequests.length > 0 && (
                <>
                  {/* Use CustomerGroupedTable for customers sub-tab */}
                  {activeTab === 'review_queue' && activeSubTab === 'customers' ? (
                    <CustomerGroupedTable
                      requests={filteredRequests}
                      onReview={handleReview}
                      onBulkReview={handleBulkReview}
                      onViewDetails={handleViewDetails}
                      onDelete={handleDelete}
                    />
                  ) : (
                    <RequestTable
                      requests={filteredRequests}
                      onReview={handleReview}
                      onViewDetails={handleViewDetails}
                      onDelete={handleDelete}
                      activeTab={activeTab}
                      activeSubTab={activeSubTab}
                      columns={columns}
                      onUpdateStatus={updateRequestStatus}
                      onOpenMarkAsPurchased={handleOpenMarkAsPurchased}
                    />
                  )}
                </>
              )}

            </>
          )}

      {/* Single Request Review Modal */}
      {isReviewModalOpen && selectedRequest && (
        <BuyForMeRequestReview
          request={{
            ...selectedRequest, 
            id: selectedRequest._id,
            items: selectedRequest.items.map(item => ({
              id: item._id || item.name + '_' + item.quantity,
              name: item.name,
              url: item.url,
              quantity: item.quantity,
              price: item.price,
              description: item.description,
              sizes: item.sizes,
              colors: item.colors
            })),
            shippingAddress: {
              name: selectedRequest.shippingAddress.name,
              address: selectedRequest.shippingAddress.street,
              city: selectedRequest.shippingAddress.city,
              country: selectedRequest.shippingAddress.country,
              postalCode: selectedRequest.shippingAddress.postalCode
            }
          } as any}
          onReview={handleReviewComplete}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedRequest(null);
          }}
          onSave={fetchRequests}
          onRequestUpdate={(updatedRequest) => {
            setSelectedRequest(updatedRequest);
          }}
        />
      )}

      {/* Bulk Review Modal - For multiple requests from same customer */}
      {isBatchReviewModalOpen && batchPackage && (
        <BuyForMeBatchReview
          batchPackage={batchPackage}
          onReview={handleBatchReviewComplete}
          onClose={() => {
            setIsBatchReviewModalOpen(false);
            setBatchPackage(null);
          }}
        />
      )}

          {/* Create Request Modal */}
          {isCreateModalOpen && (
            <CreateRequestForCustomer
              onClose={() => setIsCreateModalOpen(false)}
              onSuccess={() => {
                setIsCreateModalOpen(false);
                fetchRequests();
              }}
            />
          )}

          {/* Mark as Purchased Modal */}
          <MarkAsPurchasedModal
            isOpen={isMarkAsPurchasedModalOpen}
            onClose={() => {
              setIsMarkAsPurchasedModalOpen(false);
              setSelectedRequestForPurchase(null);
            }}
            request={selectedRequestForPurchase}
            onMarkAsPurchased={handleMarkAsPurchased}
          />

          {/* Request Details Modal */}
          <RequestDetailsModal
            request={selectedRequest}
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedRequest(null);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BuyForMeManagementOptimized;