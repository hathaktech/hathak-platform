'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface RequireAdminAuthProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string | string[];
  message?: string;
}

export default function RequireAdminAuth({ 
  children, 
  requiredPermission,
  requiredRole,
  message = 'Admin access required' 
}: RequireAdminAuthProps) {
  const { isAuthenticated, isLoading, admin, hasPermission } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !admin) {
        router.push('/admin/login');
        return;
      }

      // Check if admin is active
      if (!admin.isActive) {
        router.push('/admin/login');
        return;
      }

      // Check required permission
      if (requiredPermission && !hasPermission(requiredPermission as any)) {
        router.push('/admin/unauthorized');
        return;
      }

      // Check required role
      if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!roles.includes(admin.role)) {
          router.push('/admin/unauthorized');
          return;
        }
      }
    }
  }, [isAuthenticated, isLoading, admin, requiredPermission, requiredRole, router, hasPermission]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-2xl mb-4 shadow-2xl animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-white text-lg">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message if not authenticated
  if (!isAuthenticated || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-4 shadow-2xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-slate-300 mb-4">{message}</p>
          <div className="space-y-3">
            <button
              onClick={() => {
                console.log('Button clicked, navigating to admin login...');
                router.push('/admin/login');
              }}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200"
            >
              Go to Admin Login
            </button>
            <div className="text-center">
              <Link
                href="/admin/login"
                className="text-cyan-400 hover:text-cyan-300 text-sm underline"
              >
                Or click here to go to admin login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show unauthorized message if admin is inactive
  if (!admin.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-600 rounded-2xl mb-4 shadow-2xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Account Deactivated</h1>
          <p className="text-slate-300 mb-4">Your admin account has been deactivated. Please contact a system administrator.</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Check permission
  if (requiredPermission && !hasPermission(requiredPermission as any)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-4 shadow-2xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Insufficient Permissions</h1>
          <p className="text-slate-300 mb-4">You don't have the required permission: {requiredPermission}</p>
          <button
            onClick={() => router.push('/admin')}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Check role
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(admin.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-4 shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            <h1 className="text-white text-2xl font-bold mb-2">Insufficient Role</h1>
            <p className="text-slate-300 mb-4">You need {roles.join(' or ')} role to access this page. Your current role: {admin.role}</p>
            <button
              onClick={() => router.push('/admin')}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }
  }

  // All checks passed, render children
  return <>{children}</>;
}
