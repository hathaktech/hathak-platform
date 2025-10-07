"use client";
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Banknote, 
  PieChart,
  BarChart3,
  Calendar,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

interface Payment {
  _id: string;
  order: {
    orderNumber: string;
    customerName: string;
  };
  amount: number;
  currency: string;
  method: string;
  provider: string;
  status: string;
  fees: {
    totalFees: number;
    platformFee: number;
    processingFee: number;
  };
  createdAt: string;
}

interface Settlement {
  _id: string;
  seller: {
    businessName: string;
    email: string;
  };
  period: {
    month: number;
    year: number;
  };
  grossSales: number;
  netPayout: number;
  totalFees: number;
  status: string;
  payment: {
    status: string;
    scheduledDate: string;
    processedDate: string;
  };
}

interface FinancialStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalFees: number;
  netRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  failedPayments: number;
  totalSettlements: number;
  pendingSettlements: number;
  paidSettlements: number;
}

const FinancialDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'settlements' | 'analytics'>('overview');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [stats, setStats] = useState<FinancialStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalFees: 0,
    netRevenue: 0,
    pendingPayments: 0,
    completedPayments: 0,
    failedPayments: 0,
    totalSettlements: 0,
    pendingSettlements: 0,
    paidSettlements: 0
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    method: '',
    dateRange: '30d'
  });

  useEffect(() => {
    loadFinancialData();
  }, [filters]);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      const [paymentsRes, settlementsRes, analyticsRes] = await Promise.all([
        fetch(`/api/payments?status=${filters.status}&method=${filters.method}`),
        fetch('/api/payments/settlements'),
        fetch('/api/payments/analytics')
      ]);

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData.data || []);
      }

      if (settlementsRes.ok) {
        const settlementsData = await settlementsRes.json();
        setSettlements(settlementsData.data || []);
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        calculateStats(analyticsData.data || []);
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (analytics: any[]) => {
    const totalRevenue = analytics.reduce((sum, item) => sum + item.totalAmount, 0);
    const totalFees = analytics.reduce((sum, item) => sum + item.totalFees, 0);
    const completed = analytics.reduce((sum, item) => sum + item.completed, 0);
    const failed = analytics.reduce((sum, item) => sum + item.failed, 0);

    setStats({
      totalRevenue,
      monthlyRevenue: totalRevenue, // Simplified for demo
      totalFees,
      netRevenue: totalRevenue - totalFees,
      pendingPayments: payments.filter(p => p.status === 'pending').length,
      completedPayments: completed,
      failedPayments: failed,
      totalSettlements: settlements.length,
      pendingSettlements: settlements.filter(s => s.status === 'pending').length,
      paidSettlements: settlements.filter(s => s.status === 'paid').length
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'refunded':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'refunded':
        return <Banknote className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
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
          <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-gray-600">Manage payments, settlements, and financial analytics</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.netRevenue)}</p>
              <p className="text-sm text-gray-600">After fees & charges</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Payments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedPayments}</p>
              <p className="text-sm text-gray-600">{stats.pendingPayments} pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Banknote className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Settlements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSettlements}</p>
              <p className="text-sm text-gray-600">{stats.pendingSettlements} pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: PieChart },
            { id: 'payments', name: 'Payments', icon: CreditCard },
            { id: 'settlements', name: 'Settlements', icon: Banknote },
            { id: 'analytics', name: 'Analytics', icon: BarChart3 }
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
          {/* Recent Payments */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Payments</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {payments.slice(0, 5).map((payment) => (
                  <div key={payment._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{payment.order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{payment.order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(payment.amount, payment.currency)}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Settlements */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Pending Settlements</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {settlements.filter(s => s.status === 'pending').slice(0, 5).map((settlement) => (
                  <div key={settlement._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{settlement.seller.businessName}</p>
                      <p className="text-sm text-gray-600">{settlement.period.month}/{settlement.period.year}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(settlement.netPayout)}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(settlement.status)}`}>
                        {getStatusIcon(settlement.status)}
                        <span className="ml-1 capitalize">{settlement.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Payment Transactions</h3>
              <div className="flex space-x-3">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.method}
                  onChange={(e) => setFilters({ ...filters, method: e.target.value })}
                >
                  <option value="">All Methods</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="wallet">Wallet</option>
                  <option value="cash_on_delivery">Cash on Delivery</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.order.orderNumber}</div>
                        <div className="text-sm text-gray-500">{payment.order.customerName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {payment.method.replace('_', ' ')}
                      </span>
                      <div className="text-xs text-gray-500">{payment.provider}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(payment.fees.totalFees, payment.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settlements' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Seller Settlements</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Sales</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Payout</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {settlements.map((settlement) => (
                  <tr key={settlement._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{settlement.seller.businessName}</div>
                        <div className="text-sm text-gray-500">{settlement.seller.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {settlement.period.month}/{settlement.period.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(settlement.grossSales)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(settlement.totalFees)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(settlement.netPayout)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(settlement.status)}`}>
                        {getStatusIcon(settlement.status)}
                        <span className="ml-1 capitalize">{settlement.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Eye className="w-4 h-4" />
                      </button>
                      {settlement.status === 'pending' && (
                        <button className="text-green-600 hover:text-green-900">
                          Schedule Payment
                        </button>
                      )}
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trends</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <BarChart3 className="w-12 h-12" />
              <span className="ml-2">Chart will be implemented</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <PieChart className="w-12 h-12" />
              <span className="ml-2">Chart will be implemented</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialDashboard;
