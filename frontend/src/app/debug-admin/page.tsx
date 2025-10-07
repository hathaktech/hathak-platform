'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function DebugAdminPage() {
  const adminAuth = useAdminAuth();
  const regularAuth = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin System Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin Auth Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Auth Status</h2>
            <div className="space-y-2">
              <p><strong>Is Authenticated:</strong> {adminAuth.isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>Is Loading:</strong> {adminAuth.isLoading ? 'Yes' : 'No'}</p>
              <p><strong>Error:</strong> {adminAuth.error || 'None'}</p>
              <p><strong>Admin Name:</strong> {adminAuth.admin?.name || 'None'}</p>
              <p><strong>Admin Role:</strong> {adminAuth.admin?.role || 'None'}</p>
              <p><strong>Admin Email:</strong> {adminAuth.admin?.email || 'None'}</p>
              <p><strong>Token:</strong> {adminAuth.token ? 'Present' : 'None'}</p>
            </div>
          </div>

          {/* Regular Auth Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Regular Auth Status</h2>
            <div className="space-y-2">
              <p><strong>Is Authenticated:</strong> {regularAuth.isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>Is Loading:</strong> {regularAuth.isLoading ? 'Yes' : 'No'}</p>
              <p><strong>Error:</strong> {regularAuth.error || 'None'}</p>
              <p><strong>User Name:</strong> {regularAuth.user?.name || 'None'}</p>
              <p><strong>User Role:</strong> {regularAuth.user?.role || 'None'}</p>
              <p><strong>User Email:</strong> {regularAuth.user?.email || 'None'}</p>
            </div>
          </div>
        </div>

        {/* Local Storage Info */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Local Storage</h2>
          <div className="space-y-2">
            <p><strong>Admin Token:</strong> {typeof window !== 'undefined' && localStorage.getItem('adminToken') ? 'Present' : 'None'}</p>
            <p><strong>User Token:</strong> {typeof window !== 'undefined' && localStorage.getItem('token') ? 'Present' : 'None'}</p>
          </div>
        </div>

        {/* Test Links */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Navigation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
            >
              Admin Login
            </Link>
            <Link
              href="/admin"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
            >
              Admin Dashboard
            </Link>
            <Link
              href="/auth/login"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
            >
              User Login
            </Link>
            <Link
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
            >
              Home
            </Link>
          </div>
        </div>

        {/* Admin Permissions */}
        {adminAuth.admin && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Permissions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(adminAuth.admin.permissions).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-sm">{key}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
