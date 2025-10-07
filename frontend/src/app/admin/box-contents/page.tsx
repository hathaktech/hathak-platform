import BoxContentsManagement from '@/components/admin/BoxContentsManagement';

export const metadata = {
  title: 'Box Contents Management - HatHak Admin',
  description: 'Manage box contents and warehouse operations',
};

export default function BoxContentsPage() {
  // Admin route layout already protects admin pages; no additional wrapper needed
  return <BoxContentsManagement />;
}
