"use client";

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  BarChart3, 
  Shield, 
  Users, 
  Package, 
  CreditCard, 
  Truck,
  Megaphone,
  Flag,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface Promotion {
  _id: string;
  name: string;
  code: string;
  type: string;
  value: number;
  status: string;
  startDate: string;
  endDate: string;
  usage: {
    totalUses: number;
    totalDiscount: number;
  };
  analytics: {
    views: number;
    clicks: number;
    conversions: number;
    conversionRate: number;
  };
}

interface ModerationCase {
  _id: string;
  contentType: string;
  contentId: string;
  content: {
    title: string;
    description: string;
  };
  reportReason: string;
  status: string;
  priority: string;
  reportedBy: {
    name: string;
    email: string;
  };
  moderator: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  pendingProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activePromotions: number;
  pendingModerations: number;
  resolvedModerations: number;
  systemHealth: number;
}

const PlatformAdminConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'promotions' | 'moderation' | 'analytics'>('overview');
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [moderationCases, setModerationCases] = useState<ModerationCase[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    activePromotions: 0,
    pendingModerations: 0,
    resolvedModerations: 0,
    systemHealth: 100
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: ''
  });

  useEffect(() => {
    loadAdminData();
  }, [filters]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [promotionsRes, moderationRes, statsRes] = await Promise.all([
        fetch(`/api/promotions?status=${filters.status}&type=${filters.type}`),
        fetch(`/api/moderation?status=${filters.status}`),
        fetch('/api/admin/stats')
      ]);

      if (promotionsRes.ok) {
        const promotionsData = await promotionsRes.json();
        setPromotions(promotionsData.data || []);
      }

      if (moderationRes.ok) {
        const moderationData = await moderationRes.json();
        setModerationCases(moderationData.data || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data || stats);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'resolved':
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'draft':
        return 'text-yellow-600 bg-yellow-100';
      case 'inactive':
      case 'rejected':
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'under_review':
        return 'text-blue-600 bg-blue-100';
      case 'escalated':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'resolved':
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'draft':
        return <Clock className="w-4 h-4" />;
      case 'inactive':
      case 'rejected':
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'under_review':
        return <Eye className="w-4 h-4" />;
      case 'escalated':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Admin Console</h1>
          <p className="text-gray-600">Manage promotions, moderation, and platform operations</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            New Promotion
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600">{stats.activeUsers} active</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts.toLocaleString()}</p>
              <p className="text-sm text-yellow-600">{stats.pendingProducts} pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Megaphone className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Promotions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activePromotions}</p>
              <p className="text-sm text-gray-600">Running campaigns</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flag className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Moderation Queue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingModerations}</p>
              <p className="text-sm text-gray-600">{stats.resolvedModerations} resolved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'promotions', name: 'Promotions', icon: Megaphone },
            { id: 'moderation', name: 'Moderation', icon: Flag },
            { id: 'analytics', name: 'Analytics', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Promotions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Promotions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {promotions.slice(0, 5).map((promotion) => (
                  <div key={promotion._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{promotion.name}</p>
                      <p className="text-sm text-gray-600">{promotion.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {promotion.usage.totalUses} uses
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(promotion.status)}`}>
                        {getStatusIcon(promotion.status)}
                        <span className="ml-1 capitalize">{promotion.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Moderation Cases */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Pending Moderation</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {moderationCases.filter(c => c.status === 'pending').slice(0, 5).map((case_) => (
                  <div key={case_._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{case_.content.title}</p>
                      <p className="text-sm text-gray-600">{case_.reportReason}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(case_.priority)}`}>
                        {case_.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'promotions' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Promotion Management</h3>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search promotions..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="paused">Paused</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promotion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promotions.map((promotion) => (
                  <tr key={promotion._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{promotion.name}</div>
                        <div className="text-sm text-gray-500">{promotion.code}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {promotion.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {promotion.type === 'percentage' ? `${promotion.value}%` : formatCurrency(promotion.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {promotion.usage.totalUses} uses
                      <div className="text-xs text-gray-500">
                        {formatCurrency(promotion.usage.totalDiscount)} saved
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        {promotion.analytics.conversionRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {promotion.analytics.conversions} conversions
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(promotion.status)}`}>
                        {getStatusIcon(promotion.status)}
                        <span className="ml-1 capitalize">{promotion.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'moderation' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Moderation Queue</h3>
              <div className="flex space-x-3">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {moderationCases.map((case_) => (
                  <tr key={case_._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{case_.content.title}</div>
                        <div className="text-sm text-gray-500 capitalize">{case_.contentType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {case_.reportReason.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{case_.reportedBy.name}</div>
                      <div className="text-sm text-gray-500">{case_.reportedBy.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(case_.priority)}`}>
                        {case_.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                        {getStatusIcon(case_.status)}
                        <span className="ml-1 capitalize">{case_.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(case_.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Performance</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <BarChart3 className="w-12 h-12" />
              <span className="ml-2">Analytics charts will be implemented</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Moderation Trends</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <TrendingUp className="w-12 h-12" />
              <span className="ml-2">Trend charts will be implemented</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformAdminConsole;
