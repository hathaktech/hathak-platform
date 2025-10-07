'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import DashboardContent from '@/components/user-control-panel/DashboardContent';

export default function UserControlPanelPage() {
  return (
    <ProtectedRoute>
      <UserControlPanel>
        <DashboardContent />
      </UserControlPanel>
    </ProtectedRoute>
  );
}