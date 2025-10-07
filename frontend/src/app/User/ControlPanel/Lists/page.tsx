'use client';

import React from 'react';
import { Heart, Bookmark, Plus } from 'lucide-react';
import Link from 'next/link';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';

const ListsPage: React.FC = () => {
  return (
    <UserControlPanel>
      <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Your Lists</h1>
          <p className="text-xs text-gray-600 mt-0.5">Manage your favorite items and wishlists</p>
        </div>
        <button className="flex items-center px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-3 h-3 mr-1" />
          Create New List
        </button>
      </div>

      {/* Lists Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Favorites */}
        <Link href="/User/ControlPanel/Lists/Favorites" className="group">
          <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all duration-200 group-hover:border-blue-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center mr-3">
                  <Heart className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Your Favorites</h3>
                  <p className="text-xs text-gray-600">Items you've marked as favorites</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500">items</div>
              </div>
            </div>
            <p className="text-xs text-gray-600">View and manage your favorite products</p>
          </div>
        </Link>

        {/* Wishlist */}
        <Link href="/User/ControlPanel/Lists/Wishlist" className="group">
          <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all duration-200 group-hover:border-blue-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                  <Bookmark className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Wishlist</h3>
                  <p className="text-xs text-gray-600">Items you want to buy later</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500">items</div>
              </div>
            </div>
            <p className="text-xs text-gray-600">Save items for future purchases</p>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-xl p-3">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
            <Heart className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-xs font-medium text-gray-700">Add to Favorites</span>
          </button>
          <button className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
            <Bookmark className="w-4 h-4 text-blue-500 mr-2" />
            <span className="text-xs font-medium text-gray-700">Add to Wishlist</span>
          </button>
          <button className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
            <Plus className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-xs font-medium text-gray-700">Create Custom List</span>
          </button>
        </div>
      </div>
      </div>
    </UserControlPanel>
  );
};

export default ListsPage;
