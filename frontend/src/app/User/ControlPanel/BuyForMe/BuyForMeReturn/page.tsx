'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function BuyForMeReturnPage() {
  return (
    <ProtectedRoute>
      <UserControlPanel>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/User/ControlPanel/BuyForMe/BuyForMeRequests"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Requests"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Returns & Replacements</h1>
                <p className="text-gray-600">Manage your return and replacement requests</p>
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="text-center py-12">
            <RotateCcw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Returns & Replacements</h3>
            <p className="text-gray-600 mb-4">
              This feature is coming soon. You'll be able to manage your return and replacement requests here.
            </p>
          </div>
        </div>
      </UserControlPanel>
    </ProtectedRoute>
  );
}