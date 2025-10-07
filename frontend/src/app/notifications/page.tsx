'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import NotificationCenter from '@/components/user-control-panel/NotificationCenter';

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <UserControlPanel>
        <NotificationCenter />
      </UserControlPanel>
    </ProtectedRoute>
  );
}
