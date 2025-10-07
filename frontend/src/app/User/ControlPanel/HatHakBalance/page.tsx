'use client';

import React from 'react';
import { 
  Wallet, 
  CreditCard, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  ArrowRight,
  Shield,
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';
import Link from 'next/link';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';

const HatHakBalancePage: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const balanceInfo = {
    currentBalance: '$1,250.00',
    availableBalance: '$1,100.00',
    pendingTransactions: '$150.00',
    totalCards: 3,
    recentTransactions: 12
  };

  return (
    <UserControlPanel>
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
            HatHak Balance
          </h1>
          <p className="text-xs text-neutral-700 max-w-3xl mx-auto">
            Manage your HatHak balance, view transaction history, and control your balance cards. 
            Your centralized hub for all balance-related activities.
          </p>
        </div>

        {/* Balance Overview */}
        <div className="bg-gradient-to-r from-[#73C7D4] to-[#5AB3C4] rounded-2xl p-3 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wallet className="w-6 h-6 text-white" />
            <div>
              <p className="text-white text-xs font-medium">Current Balance</p>
              <span className="text-lg font-bold text-white">
                {balanceInfo.currentBalance}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-white text-xs font-medium">Available Balance</p>
              <p className="text-lg font-bold text-white">{balanceInfo.availableBalance}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-white text-xs font-medium">Pending Transactions</p>
              <p className="text-lg font-bold text-white">{balanceInfo.pendingTransactions}</p>
            </div>
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Balance Control Shortcut */}
          <Link 
            href="/User/ControlPanel/HatHakBalance/HatHakBalanceManage"
            className="group bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200 hover:border-blue-300"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                  Balance Control
                </h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Add funds, withdraw money, and manage your balance transactions
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Balance Cards Shortcut */}
          <Link 
            href="/User/ControlPanel/HatHakBalance/HatHakBalanceCards"
            className="group bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200 hover:border-blue-300"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-green-600 transition-colors">
                  HatHak Balance Cards
                </h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Manage your balance cards, view card details, and transaction history
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>

        {/* Balance Features */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-neutral-200">
          <h2 className="text-sm font-bold text-neutral-900 mb-3 flex items-center">
            <Wallet className="w-4 h-4 text-blue-600 mr-2" />
            Balance Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-neutral-800">Balance Management</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-neutral-700">
                    <strong>Add Funds:</strong> Top up your balance using various payment methods
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-neutral-700">
                    <strong>Withdraw Money:</strong> Transfer funds to your bank account or other services
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-neutral-700">
                    <strong>Transaction History:</strong> View detailed history of all balance activities
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-neutral-700">
                    <strong>Balance Alerts:</strong> Get notified about balance changes and low funds
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-neutral-800">Balance Cards</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                  <p className="text-xs text-neutral-700">Create and manage virtual balance cards</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-3.5 h-3.5 text-green-500" />
                  <p className="text-xs text-neutral-700">Secure card transactions with fraud protection</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-yellow-500" />
                  <p className="text-xs text-neutral-700">Real-time transaction monitoring</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-3.5 h-3.5 text-purple-500" />
                  <p className="text-xs text-neutral-700">Priority customer support for balance issues</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-xs font-medium">Total Balance</p>
                <p className="text-lg font-bold text-blue-900">{balanceInfo.currentBalance}</p>
              </div>
              <Wallet className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-xs font-medium">Active Cards</p>
                <p className="text-lg font-bold text-green-900">{balanceInfo.totalCards}</p>
              </div>
              <CreditCard className="w-5 h-5 text-green-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-xs font-medium">Recent Transactions</p>
                <p className="text-lg font-bold text-purple-900">{balanceInfo.recentTransactions}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
          <h3 className="text-sm font-semibold text-neutral-900 mb-2">
            Ready to manage your balance?
          </h3>
          <p className="text-xs text-neutral-600 mb-3">
            Access your balance control panel or manage your balance cards to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link 
              href="/User/ControlPanel/HatHakBalance/HatHakBalanceManage"
              className="inline-flex items-center px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Wallet className="w-3 h-3 mr-1" />
              Manage Balance
            </Link>
            <Link 
              href="/User/ControlPanel/HatHakBalance/HatHakBalanceCards"
              className="inline-flex items-center px-3 py-2 text-xs bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              <CreditCard className="w-3 h-3 mr-1" />
              Balance Cards
            </Link>
          </div>
        </div>
      </div>
    </UserControlPanel>
  );
};

export default HatHakBalancePage;
