import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import BoxContentsView from '@/components/user-control-panel/BoxContentsView';

export const metadata = {
  title: 'My Box Contents - HatHak',
  description: 'View and manage your box contents',
};

export default function BoxContentsPage() {
  return (
    <ProtectedRoute>
      <UserControlPanel>
        <BoxContentsView />
      </UserControlPanel>
    </ProtectedRoute>
  );
}
