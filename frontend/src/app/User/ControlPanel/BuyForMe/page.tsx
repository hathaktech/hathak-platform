'use client';

import React from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import { 
  MessageSquare, 
  Package, 
  ShoppingCart, 
  Clock, 
  Shield, 
  Globe, 
  Users, 
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react';

export default function BuyForMePage() {
  const serviceFeatures = [
    {
      icon: Globe,
      title: 'Global Shopping',
      description: 'Shop from any store worldwide - Amazon, eBay, AliExpress, and more'
    },
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Bank-level security for all transactions and personal data protection'
    },
    {
      icon: Clock,
      title: 'Fast Processing',
      description: 'Quick review and approval process, typically within 24 hours'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Dedicated customer service team to assist with your requests'
    }
  ];

  const quickActions = [
    {
      title: 'BuyForMe Requests',
      description: 'View and manage your product requests',
      href: '/User/ControlPanel/BuyForMe/BuyForMeRequests',
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      stats: '12 Active'
    },
    {
      title: 'BuyForMe Orders',
      description: 'Track your order history and status',
      href: '/buyme-orders',
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      stats: '8 Completed'
    }
  ];

  const recentActivity = [
    {
      type: 'request',
      title: 'iPhone 15 Pro Max Request',
      status: 'Approved',
      date: '2 hours ago',
      statusColor: 'text-green-600 bg-green-100'
    },
    {
      type: 'order',
      title: 'Nike Air Max Order',
      status: 'Shipped',
      date: '1 day ago',
      statusColor: 'text-blue-600 bg-blue-100'
    },
    {
      type: 'request',
      title: 'MacBook Pro Request',
      status: 'Under Review',
      date: '3 days ago',
      statusColor: 'text-yellow-600 bg-yellow-100'
    }
  ];

  return (
    <ProtectedRoute>
      <UserControlPanel>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
                BuyForMe In Your Control
              </h1>
              <p className="text-xs text-slate-600 max-w-3xl mx-auto">
                Manage your personal shopping service with complete control over your requests, orders, and preferences.
              </p>
            </div>

            {/* Service Overview */}
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10"></div>
          <div className="relative p-4">
                <div className="text-center mb-4">
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Your Personal Shopping Service</h2>
                  <p className="text-xs text-slate-600">
                    We shop for you from stores worldwide and deliver directly to your door
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {serviceFeatures.map((feature, index) => (
                    <div key={index} className="text-center p-3 rounded-xl hover:shadow-lg transition-shadow">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-xs text-slate-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Quick Actions</h3>
            <p className="text-xs text-slate-600">Access your BuyForMe tools and information</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 p-3"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                          {action.title}
                        </h3>
                        <p className="text-xs text-slate-600 mb-2">{action.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-blue-600">{action.stats}</span>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5"></div>
          <div className="relative p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
                  <Link 
                    href="/User/ControlPanel/BuyForMe/BuyForMeRequests"
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                  >
                    <span className="text-xs">View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-white/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          {activity.type === 'request' ? (
                            <MessageSquare className="w-4 h-4 text-white" />
                          ) : (
                            <Package className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">{activity.title}</h4>
                          <p className="text-xs text-slate-500">{activity.date}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.statusColor}`}>
                        {activity.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Service Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-white/20 shadow-xl text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">24</h3>
                <p className="text-xs text-slate-600">Completed Orders</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-white/20 shadow-xl text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">4.9</h3>
                <p className="text-xs text-slate-600">Service Rating</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-white/20 shadow-xl text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">$2,450</h3>
                <p className="text-xs text-slate-600">Total Saved</p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <Link
                href="/BuyForMe"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                <span className="text-sm">Start New Request</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </UserControlPanel>
    </ProtectedRoute>
  );
}
