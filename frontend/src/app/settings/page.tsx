'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import AccountSettings from '@/components/user-control-panel/AccountSettings';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <UserControlPanel>
        <AccountSettings />
      </UserControlPanel>
    </ProtectedRoute>
  );
}
