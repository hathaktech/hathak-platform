'use client';

import React from 'react';
import Link from 'next/link';
import { Package, MapPin, Box, ShoppingCart, Star, DollarSign, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import { useAuth } from '@/context/AuthContext';

export default function YourBoxControlPanelPage() {
  const { user } = useAuth();

  return (
    <UserControlPanel>
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
            Your Box
          </h1>
          <p className="text-xs text-neutral-700 max-w-3xl mx-auto">
            Manage your international shipping box, track contents, and update delivery address. 
            Your personal storage and shipping solution for global shopping.
          </p>
        </div>

        {/* Box Number Display */}
        <div className="bg-gradient-to-r from-[#73C7D4] to-[#5AB3C4] rounded-2xl p-3 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <Package className="w-5 h-5 text-white" />
            <div>
              <p className="text-white text-xs font-medium">Your Box Number</p>
              <span className="text-xl font-bold text-white">
                #{user?.boxNumber || 'Loading...'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Box Contents Shortcut */}
          <Link 
            href="/User/ControlPanel/Box/BoxContents"
            className="group bg-white rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200 hover:border-blue-300"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Box className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                  Box Contents
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  View and manage items in your box
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Box Address Shortcut */}
          <Link 
            href="/User/ControlPanel/Box/BoxAddress"
            className="group bg-white rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200 hover:border-blue-300"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-green-600 transition-colors">
                  Box Address
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Update your delivery address
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>

        {/* Service Information */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-neutral-200">
          <h2 className="text-sm font-bold text-neutral-900 mb-3 flex items-center">
            <Package className="w-4 h-4 text-blue-600 mr-2" />
            Your Box Service
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-neutral-800">How It Works</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-neutral-700">
                    <strong>Shop Globally:</strong> Use your personal US address to shop from any international store
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-neutral-700">
                    <strong>Consolidate Items:</strong> All your purchases are stored in your secure box
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-neutral-700">
                    <strong>Ship Together:</strong> Combine multiple items for cost-effective shipping
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-neutral-700">
                    <strong>Track Everything:</strong> Monitor your box contents and shipping status
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-neutral-800">Benefits</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-3.5 h-3.5 text-green-500" />
                  <p className="text-xs text-neutral-700">Save on shipping costs by consolidating orders</p>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                  <p className="text-xs text-neutral-700">Access to exclusive international products</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-3.5 h-3.5 text-yellow-500" />
                  <p className="text-xs text-neutral-700">Secure storage and handling of your items</p>
                </div>
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-3.5 h-3.5 text-purple-500" />
                  <p className="text-xs text-neutral-700">Flexible shipping options and timing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-xs font-medium">Box Number</p>
                <p className="text-lg font-bold text-blue-900">#{user?.boxNumber || 'N/A'}</p>
              </div>
              <Package className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-xs font-medium">Items in Box</p>
                <p className="text-lg font-bold text-green-900">0</p>
              </div>
              <Box className="w-5 h-5 text-green-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-xs font-medium">Shipping Status</p>
                <p className="text-lg font-bold text-purple-900">Ready</p>
              </div>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
          <h3 className="text-sm font-semibold text-neutral-900 mb-2">
            Ready to start shopping internationally?
          </h3>
          <p className="text-xs text-neutral-600 mb-3">
            Use your personal US address to shop from stores worldwide and consolidate your purchases.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link 
              href="/User/ControlPanel/Box/BoxContents"
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Box className="w-3 h-3 mr-1" />
              View Box Contents
            </Link>
            <Link 
              href="/User/ControlPanel/Box/BoxAddress"
              className="inline-flex items-center px-3 py-2 bg-white text-blue-600 border border-blue-600 text-xs rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              <MapPin className="w-3 h-3 mr-1" />
              Update Address
            </Link>
          </div>
        </div>
      </div>
    </UserControlPanel>
  );
}
