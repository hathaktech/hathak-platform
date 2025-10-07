'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TestAdminLoginPage() {
  const router = useRouter();

  const handleButtonClick = () => {
    console.log('Test button clicked, navigating to admin login...');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Test Admin Login Navigation
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={handleButtonClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Test Button Navigation to Admin Login
          </button>
          
          <Link
            href="/admin/login"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
          >
            Test Link Navigation to Admin Login
          </Link>
          
          <Link
            href="/admin"
            className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
          >
            Test Direct Admin Dashboard Access
          </Link>
          
          <div className="text-center">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-800 underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Test Instructions:</h3>
          <ol className="text-sm text-gray-700 space-y-1">
            <li>1. Click the blue button to test router.push()</li>
            <li>2. Click the green link to test Link component</li>
            <li>3. Check browser console for any errors</li>
            <li>4. Verify navigation works correctly</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
