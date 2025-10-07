'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import { 
  Users, 
  Package, 
  BarChart3, 
  Settings, 
  TrendingUp, 
  AlertTriangle,
  DollarSign,
  Truck,
  Warehouse,
  FileText,
  Shield,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Bell,
  Globe,
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Zap
} from 'lucide-react';

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  warehouseItems: number;
  shippedItems: number;
  systemHealth: number;
  serverUptime: number;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'order' | 'system' | 'payment';
  action: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

const AdminDashboard: React.FC = () => {
  const { admin, logout, hasPermission } = useAdminAuth();
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 1247,
    activeUsers: 892,
    totalOrders: 3456,
    pendingOrders: 23,
    totalRevenue: 125678,
    monthlyRevenue: 23456,
    warehouseItems: 567,
    shippedItems: 1234,
    systemHealth: 98.5,
    serverUptime: 99.9
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'user',
      action: 'New User Registration',
      description: 'John Smith registered with email john@example.com',
      timestamp: '2 minutes ago',
      status: 'success'
    },
    {
      id: '2',
      type: 'order',
      action: 'High Value Order',
      description: 'Order #ORD-2024-001 worth $2,499 (MacBook Pro)',
      timestamp: '5 minutes ago',
      status: 'warning'
    },
    {
      id: '3',
      type: 'system',
      action: 'System Backup',
      description: 'Daily backup completed successfully',
      timestamp: '1 hour ago',
      status: 'success'
    },
    {
      id: '4',
      type: 'payment',
      action: 'Payment Processed',
      description: 'Payment of $1,299 processed for Samsung Galaxy S24',
      timestamp: '2 hours ago',
      status: 'success'
    },
    {
      id: '5',
      type: 'system',
      action: 'Server Alert',
      description: 'High CPU usage detected on server-02',
      timestamp: '3 hours ago',
      status: 'error'
    }
  ]);

  const handleLogout = () => {
    logout();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'info': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 w-full">
        {/* Admin Header */}
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 via-red-900 to-red-600 bg-clip-text text-transparent">
                    Admin Control Panel
                  </h1>
                  <p className="text-slate-600 text-lg">
                    System Administrator: <span className="font-semibold text-slate-900">{admin?.name}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
              <button
                onClick={handleLogout}
                className="group relative inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

         {/* System Overview Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <div className="relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+12% from last month</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600">Active Users</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.activeUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+8% from last month</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+15% from last month</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600">System Health</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.systemHealth}%</p>
                  <p className="text-xs text-green-600">Excellent</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

         {/* Management Sections */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* User Management */}
          <div className="relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <div className="relative p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">User Management</h2>
                </div>
                <Link
                  href="/admin/users"
                  className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Manage
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">New Registrations</p>
                      <p className="text-xs text-slate-600">12 users today</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold text-sm">+12</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-3 h-3 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Pending Verification</p>
                      <p className="text-xs text-slate-600">3 users need approval</p>
                    </div>
                  </div>
                  <span className="text-yellow-600 font-semibold text-sm">3</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="w-3 h-3 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Suspended Accounts</p>
                      <p className="text-xs text-slate-600">1 account suspended</p>
                    </div>
                  </div>
                  <span className="text-red-600 font-semibold text-sm">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Management */}
          <div className="relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <div className="relative p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Order Management</h2>
                </div>
                <Link
                  href="/admin/orders"
                  className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Pending Orders</p>
                      <p className="text-xs text-slate-600">23 orders awaiting processing</p>
                    </div>
                  </div>
                  <span className="text-blue-600 font-semibold text-sm">{stats.pendingOrders}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Truck className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Shipped Today</p>
                      <p className="text-xs text-slate-600">45 packages shipped</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold text-sm">45</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <Warehouse className="w-3 h-3 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Warehouse Items</p>
                      <p className="text-xs text-slate-600">{stats.warehouseItems} items in stock</p>
                    </div>
                  </div>
                  <span className="text-purple-600 font-semibold text-sm">{stats.warehouseItems}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

         {/* System Administration Tools */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Removed Box Contents shortcut per request */}

          <Link
            href="/admin/analytics"
            className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Analytics</h3>
                <p className="text-xs text-slate-600">System reports & insights</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/financial"
            className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Financial</h3>
                <p className="text-xs text-slate-600">Revenue & payments</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/logistics"
            className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Logistics</h3>
                <p className="text-xs text-slate-600">Fulfillment & inventory</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/platform"
            className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Platform</h3>
                <p className="text-xs text-slate-600">Promotions & moderation</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/system"
            className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">System</h3>
                <p className="text-xs text-slate-600">Server & configuration</p>
              </div>
            </div>
          </Link>

          {hasPermission('canCreateAdmins') && (
            <Link
              href="/admin/admins"
              className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-4"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">Admin Management</h3>
                  <p className="text-xs text-slate-600">Manage admin accounts</p>
                </div>
              </div>
            </Link>
          )}
        </div>

         {/* Recent Activity & System Status */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                </div>
                <Link
                  href="/admin/activity"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}>
                      {getStatusIcon(activity.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                      <p className="text-sm text-slate-600">{activity.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <div className="relative p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">System Status</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Server className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Server Status</p>
                      <p className="text-sm text-slate-600">All systems operational</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold">Online</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Database className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Database</p>
                      <p className="text-sm text-slate-600">MongoDB connection stable</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold">Healthy</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">CPU Usage</p>
                      <p className="text-sm text-slate-600">45% average load</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold">Normal</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <HardDrive className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Storage</p>
                      <p className="text-sm text-slate-600">2.3TB used of 5TB</p>
                    </div>
                  </div>
                  <span className="text-yellow-600 font-semibold">46%</span>
                </div>
              </div>
            </div>
          </div>
         </div>
       </div>
   );
 };

export default AdminDashboard;
