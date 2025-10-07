'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import RequireAdminAuth from '@/components/admin/RequireAdminAuth';
import { 
  Layout, 
  Package, 
  Settings, 
  Users, 
  BarChart3, 
  Palette,
  Menu,
  X,
  LogOut,
  Shield,
  Globe,
  ShoppingCart,
  Store,
  Truck,
  Warehouse,
  Wrench
} from 'lucide-react';

const adminNavItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: BarChart3,
    description: 'Overview and analytics',
    permission: 'analyticsAccess'
  },
  {
    name: 'Platform Management',
    href: '/admin/platform',
    icon: Globe,
    description: 'Platform configuration',
    permission: 'systemSettings'
  },
  {
    name: 'BuyForMe Management',
    href: '/admin/buyme',
    icon: ShoppingCart,
    description: 'Manage user requests',
    permission: 'orderManagement'
  },
  {
    name: 'Store Management',
    href: '/admin/store',
    icon: Store,
    description: 'Store operations',
    permission: 'orderManagement'
  },
  {
    name: 'Traveler Shipping Management',
    href: '/admin/shipping',
    icon: Truck,
    description: 'Shipping and logistics',
    permission: 'orderManagement'
  },
  {
    name: 'Warehouse Management',
    href: '/admin/warehouse',
    icon: Warehouse,
    description: 'Inventory and storage',
    permission: 'orderManagement'
  },
  {
    name: 'Users Management',
    href: '/admin/users',
    icon: Users,
    description: 'User management',
    permission: 'userManagement'
  },
  {
    name: 'Admins Management',
    href: '/admin/admins',
    icon: Shield,
    description: 'Admin management',
    permission: 'canCreateAdmins'
  },
  {
    name: 'Website Builder',
    href: '/admin/website-builder',
    icon: Palette,
    description: 'Drag & drop design editor',
    permission: 'systemSettings'
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'Platform configuration',
    permission: 'systemSettings'
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { admin, logout, hasPermission } = useAdminAuth();

  const handleLogout = () => {
    logout();
  };

  // Don't require admin auth for login and unauthorized pages
  if (pathname === '/admin/login' || pathname === '/admin/unauthorized') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Admin Header with Logo */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-20">
              <img src="/logo.png" alt="HatHak" className="h-16 w-auto" />
            </div>
          </div>
        </header>
        {children}
      </div>
    );
  }

  return (
    <RequireAdminAuth>
      <div className="min-h-screen bg-gray-100">
        {/* Admin Header with Logo */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-20">
              <img src="/logo.png" alt="HatHak" className="h-16 w-auto" />
            </div>
          </div>
        </header>
        
        {/* Main Content Area - Expanded for better table display */}
        <div className="w-full px-2 sm:px-4 lg:px-8 py-8">
          <div className="flex gap-6">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
              </div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } ${
              sidebarCollapsed ? 'w-16 sm:w-20' : 'w-56 sm:w-64'
            } lg:max-h-[calc(100vh-8rem)] flex-shrink-0`}>
          <div className="flex items-center justify-between h-16 px-3 sm:px-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Layout className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Admin Panel</h1>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 sm:px-3 py-6">
            <div className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const hasAccess = !item.permission || hasPermission(item.permission as any);
                
                if (!hasAccess) return null;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 sm:px-3 py-2 sm:py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                      isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                    } ${sidebarCollapsed ? 'mx-auto' : 'mr-2 sm:mr-3'}`} />
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.name}</div>
                        <div className="text-xs text-gray-500 truncate hidden sm:block">{item.description}</div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User info and logout */}
          <div className="flex-shrink-0 p-3 sm:p-4 border-t border-gray-200">
            {!sidebarCollapsed ? (
              <>
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-white">
                      {admin?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {admin?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate hidden sm:block">
                      {admin?.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="mr-2 sm:mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {admin?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0 max-w-none">
              {/* Top bar */}
              <div className="bg-white shadow-sm border-b border-gray-200 rounded-lg mb-6">
                <div className="flex items-center justify-between h-16 px-3 sm:px-4">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {adminNavItems.find(item => item.href === pathname)?.name || 'Admin'}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Page content */}
              <main className="bg-white rounded-lg shadow-sm p-4 sm:p-6 overflow-x-auto">
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </RequireAdminAuth>
  );
}

