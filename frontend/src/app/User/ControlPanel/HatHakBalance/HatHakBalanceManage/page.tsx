'use client';

import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign,
  Calendar,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Banknote,
  Receipt
} from 'lucide-react';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

const HatHakBalanceManagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'add-funds' | 'withdraw'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'transfer' | 'payment'>('all');

  // Mock data - in a real app, this would come from an API
  const balanceData = {
    currentBalance: '$1,250.00',
    availableBalance: '$1,100.00',
    pendingAmount: '$150.00',
    thisMonthDeposits: '$2,500.00',
    thisMonthWithdrawals: '$1,250.00'
  };

  const transactions: Transaction[] = [
    // Empty state for now - can be populated later
  ];

  const handleAddFunds = (amount: string) => {
    // In a real app, this would make an API call
    console.log('Add funds:', amount);
  };

  const handleWithdrawFunds = (amount: string) => {
    // In a real app, this would make an API call
    console.log('Withdraw funds:', amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return TrendingUp;
      case 'withdrawal': return TrendingDown;
      case 'transfer': return ArrowUpRight;
      case 'payment': return CreditCard;
      default: return DollarSign;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-green-600 bg-green-100';
      case 'withdrawal': return 'text-red-600 bg-red-100';
      case 'transfer': return 'text-blue-600 bg-blue-100';
      case 'payment': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100';
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'failed': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <UserControlPanel>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Balance Control</h1>
            <p className="text-xs text-gray-600 mt-0.5">Manage your HatHak balance and transactions</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('add-funds')}
              className="flex items-center px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Funds
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className="flex items-center px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Minus className="w-3 h-3 mr-1" />
              Withdraw
            </button>
          </div>
        </div>

        {/* Balance Overview Cards */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs font-medium">Current Balance</p>
                    <p className="text-lg font-bold">{balanceData.currentBalance}</p>
                  </div>
                  <Wallet className="w-5 h-5 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-xs font-medium">Available Balance</p>
                    <p className="text-lg font-bold">{balanceData.availableBalance}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-3 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-xs font-medium">Pending Amount</p>
                    <p className="text-lg font-bold">{balanceData.pendingAmount}</p>
                  </div>
                  <Clock className="w-5 h-5 text-yellow-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs font-medium">This Month</p>
                    <p className="text-sm font-bold">+{balanceData.thisMonthDeposits}</p>
                    <p className="text-xs text-purple-200">-{balanceData.thisMonthWithdrawals}</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-purple-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => setActiveTab('add-funds')}
                  className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200 hover:border-green-300 hover:shadow-md transition-all"
                >
                  <Plus className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-xs font-medium text-gray-700">Add Funds</span>
                </button>
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <Minus className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-xs font-medium text-gray-700">Withdraw Funds</span>
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <Receipt className="w-4 h-4 text-purple-500 mr-2" />
                  <span className="text-xs font-medium text-gray-700">View Transactions</span>
                </button>
                <button className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:border-yellow-300 hover:shadow-md transition-all">
                  <Banknote className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="text-xs font-medium text-gray-700">Transfer Funds</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Add Funds Tab */}
        {activeTab === 'add-funds' && (
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Add Funds to Your Balance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Payment Method</label>
                  <select className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Credit Card</option>
                    <option>Bank Transfer</option>
                    <option>PayPal</option>
                    <option>Other</option>
                  </select>
                </div>
                <button
                  onClick={() => handleAddFunds('100')}
                  className="w-full px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Funds
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2 text-xs">Quick Amounts</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['$50', '$100', '$250', '$500'].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAddFunds(amount)}
                      className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Tab */}
        {activeTab === 'withdraw' && (
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Withdraw Funds</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Withdrawal Method</label>
                  <select className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Bank Transfer</option>
                    <option>PayPal</option>
                    <option>Check</option>
                  </select>
                </div>
                <button
                  onClick={() => handleWithdrawFunds('100')}
                  className="w-full px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Request Withdrawal
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2 text-xs">Available Balance</h4>
                <p className="text-lg font-bold text-green-600 mb-3">{balanceData.availableBalance}</p>
                <p className="text-xs text-gray-600">
                  You can withdraw up to your available balance. Processing time: 1-3 business days.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <>
            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="transfer">Transfers</option>
                <option value="payment">Payments</option>
              </select>
            </div>

            {/* Transactions List */}
            {transactions.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Receipt className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-xs text-gray-600 mb-3">Your transaction history will appear here once you start using your balance.</p>
                <button
                  onClick={() => setActiveTab('add-funds')}
                  className="px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Your First Funds
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((transaction) => {
                        const TransactionIcon = getTransactionIcon(transaction.type);
                        return (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-3 py-3">
                              <div className="flex items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${getTransactionColor(transaction.type)}`}>
                                  <TransactionIcon className="w-3 h-3" />
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-gray-900">{transaction.description}</div>
                                  <div className="text-xs text-gray-500">{transaction.reference}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-xs text-gray-900 capitalize">{transaction.type}</td>
                            <td className="px-3 py-3 text-xs font-medium text-gray-900">{transaction.amount}</td>
                            <td className="px-3 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                {transaction.status}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-xs text-gray-900">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-gray-200 p-1">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: Wallet },
              { id: 'transactions', label: 'Transactions', icon: Receipt },
              { id: 'add-funds', label: 'Add Funds', icon: Plus },
              { id: 'withdraw', label: 'Withdraw', icon: Minus }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-xs ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </UserControlPanel>
  );
};

export default HatHakBalanceManagePage;
