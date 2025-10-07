'use client';

import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import TestBackendConnection from '@/components/TestBackendConnection';

function AuthTestContent() {
  const { user, isAuthenticated, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading authentication status..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Authentication Status */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Status</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                  {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Loading:</span>
                <span className="font-medium">{isLoading ? 'Yes' : 'No'}</span>
              </div>
              
              {error && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Error:</span>
                  <span className="font-medium text-red-600">{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* User Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
            
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium capitalize">{user.role}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since:</span>
                  <span className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No user information available</p>
            )}
          </div>
        </div>

        {/* Test Actions */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Actions</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/auth/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-center"
            >
              Go to Login
            </a>
            
            <a
              href="/auth/register"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-center"
            >
              Go to Register
            </a>
            
            <a
              href="/User/ControlPanel"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
            >
              Go to Control Panel
            </a>
            
            <a
              href="/"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-center"
            >
              Go to Home
            </a>
          </div>
        </div>

        {/* Backend Connection Test */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Backend Connection Test</h2>
          <TestBackendConnection />
        </div>

        {/* API Test */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Test</h2>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              This page demonstrates the authentication system. You can:
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>See your current authentication status</li>
              <li>View your user information if logged in</li>
              <li>Navigate to different authentication pages</li>
              <li>Test protected routes</li>
            </ul>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> This page is accessible to everyone for testing purposes. 
                In production, you would typically protect this page or remove it entirely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthTestPage() {
  return <AuthTestContent />;
}
