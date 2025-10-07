'use client';

import React, { useState, useEffect } from 'react';
import { Order } from '@/types/order';
import { getUserOrders } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useModernNotification } from '@/context/ModernNotificationContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import OrderCard from '@/components/orders/OrderCard';
import OrderDetails from '@/components/orders/OrderDetails';
import { Package, Filter, Search } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { isAuthenticated } = useAuth();
  const { showNotification } = useModernNotification();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserOrders();
      setOrders(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
      showNotification('error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.products.some(p => p.productId.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleViewDetails = (orderId: string) => {
    const order = orders.find(o => o._id === orderId);
    if (order) {
      setSelectedOrder(order);
    }
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <UserControlPanel>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-display-2 text-primary-1">My Orders</h1>
            </div>
            <p className="text-body text-accent-light">Track and manage your orders</p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-3xl shadow-floating p-6 border border-neutral-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-light" />
                  <input
                    type="text"
                    placeholder="Search orders by ID or product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-100 border-2 border-transparent rounded-xl text-body transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-accent-light" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-neutral-100 border-2 border-transparent rounded-xl text-body transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="purchased">Purchased</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-floating p-12 border border-neutral-200 text-center">
              <Package className="w-16 h-16 text-accent-light mx-auto mb-4" />
              <h2 className="text-heading-2 text-primary-1 mb-2">
                {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
              </h2>
              <p className="text-body text-accent-light mb-6">
                {orders.length === 0 
                  ? "You haven't placed any orders yet. Start shopping to see your orders here."
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {orders.length === 0 && (
                <a
                  href="/HatHakStore"
                  className="inline-flex items-center px-6 py-3 bg-primary-1 text-white font-semibold rounded-xl hover:bg-primary-2 transition-colors shadow-elegant"
                >
                  Start Shopping
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {/* Order Details Modal */}
          {selectedOrder && (
            <OrderDetails
              order={selectedOrder}
              onClose={handleCloseDetails}
            />
          )}
        </div>
      </UserControlPanel>
    </ProtectedRoute>
  );
}
