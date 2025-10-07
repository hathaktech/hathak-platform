'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Package, 
  DollarSign, 
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  ShoppingCart,
  Truck,
  Warehouse,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: number;
    daily: number;
    growth: number;
  };
  users: {
    total: number;
    active: number;
    new: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    growth: number;
  };
  traffic: {
    total: number;
    unique: number;
    bounceRate: number;
    avgSession: number;
  };
}

const AdminAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    revenue: {
      total: 125678,
      monthly: 23456,
      daily: 1234,
      growth: 15.2
    },
    users: {
      total: 1247,
      active: 892,
      new: 45,
      growth: 12.5
    },
    orders: {
      total: 3456,
      pending: 23,
      completed: 3433,
      growth: 8.7
    },
    traffic: {
      total: 45678,
      unique: 12345,
      bounceRate: 32.5,
      avgSession: 4.2
    }
  });

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full px-2 sm:px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Analytics & Reports
              </h1>
              <p className="text-slate-600 mt-2">Comprehensive insights into platform performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Back to Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                <p className="text-3xl font-bold text-slate-900">{formatCurrency(analytics.revenue.total)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">{formatPercentage(analytics.revenue.growth)}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-3xl font-bold text-slate-900">{formatNumber(analytics.users.total)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">{formatPercentage(analytics.users.growth)}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Orders</p>
                <p className="text-3xl font-bold text-slate-900">{formatNumber(analytics.orders.total)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">{formatPercentage(analytics.orders.growth)}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Website Traffic</p>
                <p className="text-3xl font-bold text-slate-900">{formatNumber(analytics.traffic.total)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+23.4%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Revenue Trend</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="h-64 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <p className="text-slate-600">Revenue chart would be displayed here</p>
                <p className="text-sm text-slate-500">Integration with charting library needed</p>
              </div>
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">User Growth</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="h-64 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <p className="text-slate-600">User growth chart would be displayed here</p>
                <p className="text-sm text-slate-500">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Order Analytics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Order Analytics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">Completed</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{analytics.orders.completed}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">Pending</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{analytics.orders.pending}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">Shipped</span>
                </div>
                <span className="text-lg font-bold text-slate-900">1,234</span>
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Traffic Sources</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">Direct</span>
                </div>
                <span className="text-sm text-slate-600">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Search className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">Search</span>
                </div>
                <span className="text-sm text-slate-600">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">Social</span>
                </div>
                <span className="text-sm text-slate-600">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <Mail className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">Email</span>
                </div>
                <span className="text-sm text-slate-600">10%</span>
              </div>
            </div>
          </div>

          {/* Device Analytics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Device Analytics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Monitor className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">Desktop</span>
                </div>
                <span className="text-sm text-slate-600">55%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Smartphone className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">Mobile</span>
                </div>
                <span className="text-sm text-slate-600">35%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <Tablet className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">Tablet</span>
                </div>
                <span className="text-sm text-slate-600">10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-medium text-slate-600">Avg. Response Time</p>
              <p className="text-2xl font-bold text-slate-900">245ms</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-medium text-slate-600">Uptime</p>
              <p className="text-2xl font-bold text-slate-900">99.9%</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-medium text-slate-600">Active Sessions</p>
              <p className="text-2xl font-bold text-slate-900">892</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-medium text-slate-600">Error Rate</p>
              <p className="text-2xl font-bold text-slate-900">0.1%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
