'use client';

import React, { useState } from 'react';
import { 
  RotateCcw, 
  Search, 
  Filter, 
  Calendar,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Plus,
  ArrowLeft,
  RefreshCw,
  FileText,
  Truck,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';

export default function HatHakStoreReturnPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with actual API data
  const returns = [
    {
      id: 'RT-2024-001',
      orderId: 'HS-2024-001',
      date: '2024-01-22',
      status: 'approved',
      reason: 'Defective item',
      itemCount: 1,
      refundAmount: 29.99,
      trackingNumber: 'RTK123456789',
      expectedRefundDate: '2024-01-30',
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: 29.99 }
      ]
    },
    {
      id: 'RT-2024-002',
      orderId: 'HS-2024-002',
      date: '2024-01-25',
      status: 'processing',
      reason: 'Wrong size',
      itemCount: 1,
      refundAmount: 45.50,
      trackingNumber: null,
      expectedRefundDate: '2024-02-05',
      items: [
        { name: 'Cotton T-Shirt', quantity: 1, price: 45.50 }
      ]
    },
    {
      id: 'RT-2024-003',
      orderId: 'HS-2024-003',
      date: '2024-01-28',
      status: 'pending',
      reason: 'Changed mind',
      itemCount: 2,
      refundAmount: 78.25,
      trackingNumber: null,
      expectedRefundDate: '2024-02-10',
      items: [
        { name: 'Running Shoes', quantity: 1, price: 45.75 },
        { name: 'Sports Socks', quantity: 1, price: 32.50 }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReturns = returns.filter(returnItem => {
    const matchesSearch = returnItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || returnItem.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <UserControlPanel>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                href="/User/ControlPanel/HatHakStore"
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">HatHak Store Returns</h1>
                <p className="text-xs text-gray-600">Manage your return requests and track refunds</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors">
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </button>
              <button className="flex items-center px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-3 h-3 mr-1" />
                New Return
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search returns by ID or order number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Returns List */}
        <div className="space-y-3">
          {filteredReturns.length === 0 ? (
            <div className="text-center py-6">
              <RotateCcw className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">No returns found</h3>
              <p className="text-xs text-gray-600">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'You haven\'t requested any returns yet.'}
              </p>
            </div>
          ) : (
            filteredReturns.map((returnItem) => (
              <div key={returnItem.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-3">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(returnItem.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(returnItem.status)}`}>
                            {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Return #{returnItem.id}
                        </div>
                        <div className="text-xs text-gray-500">
                          Order #{returnItem.orderId}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            Return Date
                          </div>
                          <div className="font-medium text-xs">{new Date(returnItem.date).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Package className="w-3 h-3 mr-1" />
                            Items
                          </div>
                          <div className="font-medium text-xs">{returnItem.itemCount} item{returnItem.itemCount !== 1 ? 's' : ''}</div>
                        </div>
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <CreditCard className="w-3 h-3 mr-1" />
                            Expected Refund
                          </div>
                          <div className="font-medium text-xs">{new Date(returnItem.expectedRefundDate).toLocaleDateString()}</div>
                        </div>
                      </div>

                      {returnItem.trackingNumber && (
                        <div className="mb-3">
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Truck className="w-3 h-3 mr-1" />
                            Return Tracking
                          </div>
                          <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {returnItem.trackingNumber}
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">Return Reason:</div>
                        <div className="font-medium text-xs mb-2">{returnItem.reason}</div>
                        <div className="text-xs text-gray-500 mb-2">Items to Return:</div>
                        <div className="space-y-1">
                          {returnItem.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-xs">
                              <span>{item.name} (Qty: {item.quantity})</span>
                              <span className="font-medium">£{item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:ml-3 lg:text-right">
                      <div className="text-lg font-bold text-gray-900 mb-2">
                        £{returnItem.refundAmount.toFixed(2)}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </button>
                        <button className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors">
                          <FileText className="w-3 h-3 mr-1" />
                          Return Label
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Return Policy Information */}
        <div className="mt-6 bg-green-50 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Return Policy</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2 text-xs">30-Day Return Window</h3>
              <p className="text-gray-600 text-xs">
                You have 30 days from the delivery date to initiate a return for most items.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2 text-xs">Easy Return Process</h3>
              <p className="text-gray-600 text-xs">
                Simply create a return request, print the return label, and send your items back to us.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2 text-xs">Full Refund Guarantee</h3>
              <p className="text-gray-600 text-xs">
                Receive a full refund to your original payment method once we process your return.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2 text-xs">Free Return Shipping</h3>
              <p className="text-gray-600 text-xs">
                We provide free return shipping labels for all eligible returns.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 text-center">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Need Help?</h2>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-3 h-3 mr-1" />
              Start New Return
            </button>
            <button className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors">
              <FileText className="w-3 h-3 mr-1" />
              Return Policy
            </button>
          </div>
        </div>
      </div>
      </div>
    </UserControlPanel>
  );
}
