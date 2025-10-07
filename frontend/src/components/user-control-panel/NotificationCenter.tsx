'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useModernNotification } from '@/context/ModernNotificationContext';
import { 
  Bell, 
  Check, 
  X, 
  Trash2, 
  Filter, 
  Search,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  Mail,
  MessageSquare,
  Package,
  CreditCard,
  Shield,
  Star
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'order' | 'security' | 'marketing';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high';
}

const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useModernNotification();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'order',
        title: 'Order #12345 Shipped',
        message: 'Your order has been shipped and is on its way. Expected delivery: 2-3 business days.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        actionUrl: '/orders/12345',
        actionText: 'Track Order',
        priority: 'high'
      },
      {
        id: '2',
        type: 'security',
        title: 'New Login Detected',
        message: 'We detected a new login to your account from a new device. If this wasn\'t you, please secure your account.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: false,
        actionUrl: '/security',
        actionText: 'Review Security',
        priority: 'high'
      },
      {
        id: '3',
        type: 'marketing',
        title: 'Special Offer: 20% Off',
        message: 'Don\'t miss out on our limited-time offer! Get 20% off on all electronics.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: true,
        actionUrl: '/HatHakStore?discount=20',
        actionText: 'Shop Now',
        priority: 'medium'
      },
      {
        id: '4',
        type: 'success',
        title: 'Payment Successful',
        message: 'Your payment of $99.99 has been processed successfully.',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        read: true,
        actionUrl: '/orders',
        actionText: 'View Orders',
        priority: 'medium'
      },
      {
        id: '5',
        type: 'info',
        title: 'Profile Update Available',
        message: 'Complete your profile to get personalized recommendations.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        actionUrl: '/User/ControlPanel/Profile',
        actionText: 'Update Profile',
        priority: 'low'
      },
      {
        id: '6',
        type: 'warning',
        title: 'Payment Method Expiring',
        message: 'Your credit card ending in 1234 will expire next month. Please update your payment method.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: false,
        actionUrl: '/payment-methods',
        actionText: 'Update Payment',
        priority: 'medium'
      }
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5" />;
      case 'security':
        return <Shield className="w-5 h-5" />;
      case 'marketing':
        return <Star className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') {
      return 'border-l-red-500 bg-red-50';
    }
    
    switch (type) {
      case 'order':
        return 'border-l-blue-500 bg-blue-50';
      case 'security':
        return 'border-l-orange-500 bg-orange-50';
      case 'marketing':
        return 'border-l-purple-500 bg-purple-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'text-blue-600';
      case 'security':
        return 'text-orange-600';
      case 'marketing':
        return 'text-purple-600';
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    showNotification('success', 'All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    showNotification('success', 'Notification deleted');
  };

  const clearAllRead = () => {
    setNotifications(prev => prev.filter(notification => !notification.read));
    showNotification('success', 'All read notifications cleared');
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) || 
      (filter === 'read' && notification.read);
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesType && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl text-primary-1">Notification Center</h1>
          <p className="text-xs text-accent-light mt-1.5">
            Stay updated with your account activity and important alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {unreadCount} unread
            </span>
          )}
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary-1 text-white font-medium rounded-xl hover:bg-primary-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            Mark All Read
          </button>
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
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-100 border-2 border-transparent rounded-xl text-body transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-accent-light" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-3 bg-neutral-100 border-2 border-transparent rounded-xl text-body transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 bg-neutral-100 border-2 border-transparent rounded-xl text-body transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
          >
            <option value="all">All Types</option>
            <option value="order">Orders</option>
            <option value="security">Security</option>
            <option value="marketing">Marketing</option>
            <option value="success">Success</option>
            <option value="warning">Warnings</option>
            <option value="error">Errors</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-floating p-12 border border-neutral-200 text-center">
            <Bell className="w-16 h-16 text-accent-light mx-auto mb-4" />
            <h2 className="text-heading-2 text-primary-1 mb-2">No notifications found</h2>
            <p className="text-body text-accent-light">
              {notifications.length === 0 
                ? "You don't have any notifications yet."
                : "No notifications match your current filters."
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-3xl shadow-floating p-6 border-l-4 border border-neutral-200 transition-all duration-200 hover:shadow-panel ${
                notification.read ? 'opacity-75' : ''
              } ${getNotificationColor(notification.type, notification.priority)}`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  notification.read ? 'bg-neutral-200' : 'bg-white shadow-elegant'
                }`}>
                  <div className={getTypeColor(notification.type)}>
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-heading-3 font-semibold ${
                        notification.read ? 'text-neutral-600' : 'text-primary-1'
                      }`}>
                        {notification.title}
                      </h3>
                      <p className="text-body text-accent-light mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-sm text-accent-light">
                          {notification.timestamp.toLocaleString()}
                        </span>
                        {notification.priority === 'high' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            High Priority
                          </span>
                        )}
                        {!notification.read && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-1/10 text-primary-1">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {notification.actionUrl && (
                        <a
                          href={notification.actionUrl}
                          className="px-4 py-2 bg-primary-1 text-white text-sm font-medium rounded-lg hover:bg-primary-2 transition-colors"
                        >
                          {notification.actionText || 'View'}
                        </a>
                      )}
                      
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-accent-light hover:text-primary-1 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-accent-light hover:text-red-600 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Clear Read Notifications */}
      {notifications.some(n => n.read) && (
        <div className="flex justify-center">
          <button
            onClick={clearAllRead}
            className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 font-medium rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Read Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
