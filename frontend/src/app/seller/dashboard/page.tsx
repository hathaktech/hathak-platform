'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye, 
  Heart, 
  ShoppingCart,
  Plus,
  Edit3,
  Trash2,
  Filter,
  Search,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  MessageSquare,
  Settings,
  Bell,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalViews: number;
  conversionRate: number;
  averageRating: number;
  totalReviews: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
  };
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  status: 'active' | 'inactive' | 'draft';
  images: Array<{
    url: string;
    alt: string;
  }>;
  analytics: {
    views: number;
    clicks: number;
    conversions: number;
  };
  reviews: {
    averageRating: number;
    totalReviews: number;
  };
  createdAt: string;
}

interface Notification {
  _id: string;
  type: 'order' | 'review' | 'product' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const SellerDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalViews: 0,
    conversionRate: 0,
    averageRating: 0,
    totalReviews: 0
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'analytics'>('overview');

  useEffect(() => {
    // Simulate loading data
    const loadDashboardData = async () => {
      setLoading(true);
      
      // Mock data - in real app, this would come from API
      setTimeout(() => {
        setStats({
          totalProducts: 24,
          activeProducts: 18,
          totalOrders: 156,
          pendingOrders: 8,
          totalRevenue: 12580,
          monthlyRevenue: 2340,
          totalViews: 8940,
          conversionRate: 3.2,
          averageRating: 4.6,
          totalReviews: 89
        });

        setRecentOrders([
          {
            _id: '1',
            orderNumber: 'ORD-2024-001',
            customer: { name: 'John Smith', email: 'john@example.com' },
            products: [{ name: 'Wireless Headphones', quantity: 1, price: 89.99 }],
            total: 89.99,
            status: 'pending',
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '2',
            orderNumber: 'ORD-2024-002',
            customer: { name: 'Sarah Johnson', email: 'sarah@example.com' },
            products: [{ name: 'Smart Watch', quantity: 1, price: 199.99 }],
            total: 199.99,
            status: 'confirmed',
            createdAt: '2024-01-15T09:15:00Z'
          }
        ]);

        setProducts([
          {
            _id: '1',
            name: 'Wireless Bluetooth Headphones',
            price: 89.99,
            status: 'active',
            images: [{ url: '/api/placeholder/200/200', alt: 'Headphones' }],
            analytics: { views: 450, clicks: 23, conversions: 8 },
            reviews: { averageRating: 4.5, totalReviews: 12 },
            createdAt: '2024-01-10T00:00:00Z'
          },
          {
            _id: '2',
            name: 'Smart Fitness Watch',
            price: 199.99,
            status: 'active',
            images: [{ url: '/api/placeholder/200/200', alt: 'Smart Watch' }],
            analytics: { views: 320, clicks: 18, conversions: 5 },
            reviews: { averageRating: 4.8, totalReviews: 8 },
            createdAt: '2024-01-08T00:00:00Z'
          }
        ]);

        setNotifications([
          {
            _id: '1',
            type: 'order',
            title: 'New Order Received',
            message: 'You have a new order #ORD-2024-001 for $89.99',
            read: false,
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '2',
            type: 'review',
            title: 'New Review',
            message: 'John Smith left a 5-star review for Wireless Headphones',
            read: false,
            createdAt: '2024-01-15T09:45:00Z'
          }
        ]);

        setLoading(false);
      }, 1000);
    };

    loadDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      confirmed: 'text-blue-600 bg-blue-100',
      shipped: 'text-purple-600 bg-purple-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100',
      active: 'text-green-600 bg-green-100',
      inactive: 'text-gray-600 bg-gray-100',
      draft: 'text-orange-600 bg-orange-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      shipped: Package,
      delivered: CheckCircle,
      cancelled: XCircle,
      active: CheckCircle,
      inactive: AlertTriangle,
      draft: Edit3
    };
    const Icon = icons[status as keyof typeof icons] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Seller Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                <p className="text-sm text-green-600">+2 this month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-sm text-green-600">+12% this month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                <p className="text-sm text-blue-600">{stats.pendingOrders} pending</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                <p className="text-sm text-orange-600">{stats.totalViews} total views</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'orders', label: 'Orders', icon: ShoppingCart },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Orders */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">{order.customer.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Products */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {products.slice(0, 3).map((product) => (
                      <div key={product._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {renderStars(product.reviews.averageRating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              ({product.reviews.totalReviews} reviews)
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                          <p className="text-sm text-gray-500">{product.analytics.views} views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Draft</option>
                    </select>
                  </div>
                  
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                            {product.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(product.reviews.averageRating)}
                          <span className="text-sm text-gray-500">({product.reviews.totalReviews})</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
                        <div>
                          <p className="font-medium text-gray-900">{product.analytics.views}</p>
                          <p>Views</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.analytics.clicks}</p>
                          <p>Clicks</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.analytics.conversions}</p>
                          <p>Sales</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>All Orders</option>
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                    <input
                      type="date"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <span className="font-medium text-gray-900">{order.orderNumber}</span>
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Customer</p>
                          <p className="font-medium text-gray-900">{order.customer.name}</p>
                          <p className="text-sm text-gray-500">{order.customer.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Products</p>
                          {order.products.map((product, index) => (
                            <p key={index} className="text-sm text-gray-900">
                              {product.name} × {product.quantity}
                            </p>
                          ))}
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">This Month</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Revenue</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Conversion Rate</span>
                        <span className="font-semibold text-gray-900">{stats.conversionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Average Rating</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(stats.averageRating)}
                          <span className="font-semibold text-gray-900 ml-2">{stats.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
