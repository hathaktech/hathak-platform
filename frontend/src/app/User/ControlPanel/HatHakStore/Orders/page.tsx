'use client';

import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Calendar,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';

export default function HatHakStoreOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with actual API data
  const orders = [
    {
      id: 'HS-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 89.99,
      items: 3,
      trackingNumber: 'TRK123456789',
      deliveryDate: '2024-01-20',
      address: '123 Main St, London, UK'
    },
    {
      id: 'HS-2024-002',
      date: '2024-01-18',
      status: 'shipped',
      total: 156.50,
      items: 2,
      trackingNumber: 'TRK987654321',
      deliveryDate: '2024-01-25',
      address: '456 Oak Ave, Manchester, UK'
    },
    {
      id: 'HS-2024-003',
      date: '2024-01-20',
      status: 'processing',
      total: 45.75,
      items: 1,
      trackingNumber: null,
      deliveryDate: '2024-01-28',
      address: '789 Pine Rd, Birmingham, UK'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
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
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">HatHak Store Orders</h1>
                <p className="text-xs text-gray-600">Manage and track your HatHak store orders</p>
              </div>
            </div>
            <button className="flex items-center px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </button>
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
                  placeholder="Search orders by ID or address..."
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
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-6">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-xs text-gray-600">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'You haven\'t placed any orders yet.'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-3">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Order #{order.id}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            Order Date
                          </div>
                          <div className="font-medium text-xs">{new Date(order.date).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Package className="w-3 h-3 mr-1" />
                            Items
                          </div>
                          <div className="font-medium text-xs">{order.items} item{order.items !== 1 ? 's' : ''}</div>
                        </div>
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            Delivery Address
                          </div>
                          <div className="font-medium text-xs">{order.address}</div>
                        </div>
                      </div>

                      {order.trackingNumber && (
                        <div className="mb-3">
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Truck className="w-3 h-3 mr-1" />
                            Tracking Number
                          </div>
                          <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {order.trackingNumber}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="lg:ml-3 lg:text-right">
                      <div className="text-lg font-bold text-gray-900 mb-2">
                        £{order.total.toFixed(2)}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </button>
                        <button className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors">
                          <Download className="w-3 h-3 mr-1" />
                          Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Service Information */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">About HatHak Store Orders</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2 text-xs">Order Management</h3>
              <p className="text-gray-600 text-xs">
                Track your orders from placement to delivery with real-time updates and detailed tracking information.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2 text-xs">Customer Support</h3>
              <p className="text-gray-600 text-xs">
                Need help with your order? Our customer support team is available 24/7 to assist you.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </UserControlPanel>
  );
}
