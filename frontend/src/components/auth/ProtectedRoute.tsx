'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useModernNotification } from '@/context/ModernNotificationContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  message?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/login',
  message = 'Please login to access this page'
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { showNotification } = useModernNotification();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      showNotification('error', message);
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo, message, showNotification]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
