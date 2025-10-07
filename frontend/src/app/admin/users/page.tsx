'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Shield, 
  ShieldCheck, 
  ShieldX,
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Box,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  boxNumber: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  totalOrders: number;
  totalSpent: number;
  phone?: string;
  address?: {
    street: string;
    city: string;
    country: string;
  };
}

const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'unverified'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockUsers: User[] = [
      {
        _id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        role: 'user',
        boxNumber: 385681,
        isActive: true,
        isVerified: true,
        createdAt: '2024-01-15T10:30:00Z',
        lastLogin: '2024-01-20T14:22:00Z',
        totalOrders: 12,
        totalSpent: 2456.78,
        phone: '+1-555-0123',
        address: {
          street: '123 Main St',
          city: 'New York',
          country: 'USA'
        }
      },
      {
        _id: '2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'user',
        boxNumber: 385682,
        isActive: true,
        isVerified: false,
        createdAt: '2024-01-18T09:15:00Z',
        lastLogin: '2024-01-19T16:45:00Z',
        totalOrders: 3,
        totalSpent: 567.89,
        phone: '+1-555-0456'
      },
      {
        _id: '3',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        boxNumber: 385681,
        isActive: true,
        isVerified: true,
        createdAt: '2024-01-10T08:00:00Z',
        lastLogin: '2024-01-20T12:30:00Z',
        totalOrders: 8,
        totalSpent: 7243.00
      },
      {
        _id: '4',
        name: 'Admin User',
        email: 'admin@hathak.com',
        role: 'admin',
        boxNumber: 0,
        isActive: true,
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: '2024-01-20T15:00:00Z',
        totalOrders: 0,
        totalSpent: 0
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.boxNumber.toString().includes(searchTerm);
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive) ||
                         (filterStatus === 'unverified' && !user.isVerified);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user._id)
    );
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user._id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    ));
  };

  const handleToggleVerification = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user._id === userId 
        ? { ...user, isVerified: !user.isVerified }
        : user
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full px-2 sm:px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-slate-600 mt-2">Manage user accounts, permissions, and activity</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Back to Dashboard
              </Link>
              <button className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-3xl font-bold text-slate-900">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Users</p>
                <p className="text-3xl font-bold text-slate-900">{users.filter(u => u.isActive).length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Verified Users</p>
                <p className="text-3xl font-bold text-slate-900">{users.filter(u => u.isVerified).length}</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Admins</p>
                <p className="text-3xl font-bold text-slate-900">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="unverified">Unverified</option>
            </select>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                <Filter className="w-4 h-4 mr-2 inline" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Users ({filteredUsers.length})
              </h2>
              {selectedUsers.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">{selectedUsers.length} selected</span>
                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                    <Trash2 className="w-4 h-4 mr-1 inline" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Role & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Box Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{user.name}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            <Shield className="w-3 h-3 mr-1" />
                            {user.role}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {!user.isVerified && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Unverified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {user.boxNumber > 0 ? (
                        <div className="flex items-center">
                          <Box className="w-4 h-4 mr-1 text-slate-400" />
                          #{user.boxNumber}
                        </div>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">
                        <div>{user.totalOrders} orders</div>
                        <div className="text-slate-500">{formatCurrency(user.totalSpent)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleUserStatus(user._id)}
                          className={`p-1 rounded ${
                            user.isActive 
                              ? 'text-red-600 hover:bg-red-100' 
                              : 'text-green-600 hover:bg-green-100'
                          }`}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleToggleVerification(user._id)}
                          className={`p-1 rounded ${
                            user.isVerified 
                              ? 'text-yellow-600 hover:bg-yellow-100' 
                              : 'text-green-600 hover:bg-green-100'
                          }`}
                          title={user.isVerified ? 'Unverify' : 'Verify'}
                        >
                          {user.isVerified ? <ShieldX className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                        </button>
                        <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-600 hover:bg-slate-100 rounded" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
