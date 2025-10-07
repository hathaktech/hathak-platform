'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Activity, 
  Calendar, 
  Filter, 
  Search,
  ShoppingCart,
  Package,
  CreditCard,
  User,
  Settings,
  Bell,
  Heart,
  MessageSquare,
  Eye,
  Download,
  Upload,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'order' | 'profile' | 'security' | 'payment' | 'product' | 'system' | 'social';
  action: string;
  description: string;
  timestamp: Date;
  metadata?: {
    orderId?: string;
    amount?: number;
    productName?: string;
    ipAddress?: string;
    device?: string;
  };
  status: 'success' | 'pending' | 'failed' | 'info';
}

const ActivityFeed: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock activity data
  useEffect(() => {
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'order',
        action: 'Order Placed',
        description: 'You placed an order for iPhone 15 Pro',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        metadata: { orderId: '12345', amount: 999.99, productName: 'iPhone 15 Pro' },
        status: 'success'
      },
      {
        id: '2',
        type: 'security',
        action: 'Login',
        description: 'You logged in from a new device',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        metadata: { ipAddress: '192.168.1.100', device: 'Chrome on Windows' },
        status: 'info'
      },
      {
        id: '3',
        type: 'profile',
        action: 'Profile Updated',
        description: 'You updated your profile information',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'success'
      },
      {
        id: '4',
        type: 'payment',
        action: 'Payment Method Added',
        description: 'You added a new credit card ending in 1234',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        status: 'success'
      },
      {
        id: '5',
        type: 'product',
        action: 'Product Viewed',
        description: 'You viewed MacBook Pro 16-inch',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        metadata: { productName: 'MacBook Pro 16-inch' },
        status: 'info'
      },
      {
        id: '6',
        type: 'order',
        action: 'Order Cancelled',
        description: 'You cancelled order #12344',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        metadata: { orderId: '12344' },
        status: 'failed'
      },
      {
        id: '7',
        type: 'system',
        action: 'Password Changed',
        description: 'You changed your account password',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'success'
      },
      {
        id: '8',
        type: 'social',
        action: 'Review Posted',
        description: 'You posted a review for AirPods Pro',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        metadata: { productName: 'AirPods Pro' },
        status: 'success'
      },
      {
        id: '9',
        type: 'product',
        action: 'Wishlist Added',
        description: 'You added Samsung Galaxy S24 to your wishlist',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        metadata: { productName: 'Samsung Galaxy S24' },
        status: 'info'
      },
      {
        id: '10',
        type: 'security',
        action: 'Two-Factor Enabled',
        description: 'You enabled two-factor authentication',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'success'
      }
    ];

    setActivities(mockActivities);
    setLoading(false);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5" />;
      case 'profile':
        return <User className="w-5 h-5" />;
      case 'security':
        return <Shield className="w-5 h-5" />;
      case 'payment':
        return <CreditCard className="w-5 h-5" />;
      case 'product':
        return <ShoppingCart className="w-5 h-5" />;
      case 'system':
        return <Settings className="w-5 h-5" />;
      case 'social':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Eye className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'text-blue-600 bg-blue-100';
      case 'profile':
        return 'text-purple-600 bg-purple-100';
      case 'security':
        return 'text-orange-600 bg-orange-100';
      case 'payment':
        return 'text-green-600 bg-green-100';
      case 'product':
        return 'text-indigo-600 bg-indigo-100';
      case 'system':
        return 'text-gray-600 bg-gray-100';
      case 'social':
        return 'text-pink-600 bg-pink-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || 
      (filter === 'today' && activity.timestamp.toDateString() === new Date().toDateString()) ||
      (filter === 'week' && activity.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (filter === 'month' && activity.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    
    const matchesSearch = searchTerm === '' || 
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesType && matchesSearch;
  });

  const getActivityStats = () => {
    const today = activities.filter(a => a.timestamp.toDateString() === new Date().toDateString());
    const thisWeek = activities.filter(a => a.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const thisMonth = activities.filter(a => a.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    return {
      today: today.length,
      thisWeek: thisWeek.length,
      thisMonth: thisMonth.length,
      total: activities.length
    };
  };

  const stats = getActivityStats();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl text-primary-1">Activity Feed</h1>
        <p className="text-xs text-accent-light mt-1.5">
          Track your account activity and recent actions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl shadow-floating p-4 border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-accent-light">Today</p>
              <p className="text-lg font-bold text-primary-1">{stats.today}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-floating p-4 border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-accent-light">This Week</p>
              <p className="text-lg font-bold text-primary-1">{stats.thisWeek}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-floating p-4 border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-accent-light">This Month</p>
              <p className="text-lg font-bold text-primary-1">{stats.thisMonth}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-floating p-4 border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-accent-light">Total</p>
              <p className="text-lg font-bold text-primary-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl shadow-floating p-6 border border-neutral-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-light" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-100 border-2 border-transparent rounded-xl text-body transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
              />
            </div>
          </div>

          {/* Time Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent-light" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-3 bg-neutral-100 border-2 border-transparent rounded-xl text-body transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-accent-light" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-neutral-100 border-2 border-transparent rounded-xl text-body transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
            >
              <option value="all">All Types</option>
              <option value="order">Orders</option>
              <option value="profile">Profile</option>
              <option value="security">Security</option>
              <option value="payment">Payments</option>
              <option value="product">Products</option>
              <option value="system">System</option>
              <option value="social">Social</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-floating p-12 border border-neutral-200 text-center">
            <Activity className="w-16 h-16 text-accent-light mx-auto mb-4" />
            <h2 className="text-heading-2 text-primary-1 mb-2">No activities found</h2>
            <p className="text-body text-accent-light">
              {activities.length === 0 
                ? "You don't have any activities yet."
                : "No activities match your current filters."
              }
            </p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-3xl shadow-floating p-6 border border-neutral-200 hover:shadow-panel transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-heading-3 font-semibold text-primary-1">
                          {activity.action}
                        </h3>
                        {getStatusIcon(activity.status)}
                      </div>
                      
                      <p className="text-body text-accent-light mb-3">
                        {activity.description}
                      </p>

                      {/* Metadata */}
                      {activity.metadata && (
                        <div className="flex flex-wrap gap-4 text-sm text-accent-light">
                          {activity.metadata.orderId && (
                            <span>Order: #{activity.metadata.orderId}</span>
                          )}
                          {activity.metadata.amount && (
                            <span>Amount: ${activity.metadata.amount}</span>
                          )}
                          {activity.metadata.productName && (
                            <span>Product: {activity.metadata.productName}</span>
                          )}
                          {activity.metadata.ipAddress && (
                            <span>IP: {activity.metadata.ipAddress}</span>
                          )}
                          {activity.metadata.device && (
                            <span>Device: {activity.metadata.device}</span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-sm text-accent-light">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                        <span className={`text-sm font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
