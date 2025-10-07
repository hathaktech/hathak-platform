'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import ActivityFeed from '@/components/user-control-panel/ActivityFeed';

export default function ActivityPage() {
  return (
    <ProtectedRoute>
      <UserControlPanel>
        <ActivityFeed />
      </UserControlPanel>
    </ProtectedRoute>
  );
}
