'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import ProfileManagement from '@/components/user-control-panel/ProfileManagement';

export default function UserProfilePage() {
  return (
    <ProtectedRoute>
      <UserControlPanel>
        <ProfileManagement />
      </UserControlPanel>
    </ProtectedRoute>
  );
}
