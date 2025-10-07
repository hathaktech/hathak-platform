'use client';

import React, { useState, useEffect } from 'react';
import RequireAdminAuth from '@/components/admin/RequireAdminAuth';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { adminAuthService, Admin } from '@/services/adminAuthService';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldCheck, 
  ShieldX,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AdminManagementPage() {
  const { admin, hasPermission } = useAdminAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    if (hasPermission('canCreateAdmins')) {
      fetchAdmins();
    }
  }, [hasPermission]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await adminAuthService.getAllAdmins();
      setAdmins(response.admins);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    if (!confirm(`Are you sure you want to delete ${adminName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminAuthService.deleteAdmin(adminId);
      setAdmins(admins.filter(a => a._id !== adminId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleActive = async (adminId: string, currentStatus: boolean) => {
    try {
      await adminAuthService.updateAdminPermissions(adminId, {
        isActive: !currentStatus
      });
      setAdmins(admins.map(a => 
        a._id === adminId ? { ...a, isActive: !currentStatus } : a
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'employee': return 'bg-green-100 text-green-800';
      case 'worker': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPermissionIcon = (permission: boolean) => {
    return permission ? (
      <ShieldCheck className="w-4 h-4 text-green-600" />
    ) : (
      <ShieldX className="w-4 h-4 text-red-600" />
    );
  };

  if (!hasPermission('canCreateAdmins')) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ShieldX className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800">You don't have permission to manage admin accounts.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RequireAdminAuth requiredPermission="canCreateAdmins">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Admin Management
              </h1>
              <p className="text-gray-600 mt-1">Manage admin accounts and permissions</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permissions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.map((adminUser) => (
                    <tr key={adminUser._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-white">
                              {adminUser.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {adminUser.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {adminUser.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(adminUser.role)}`}>
                          {adminUser.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          adminUser.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {adminUser.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          {getPermissionIcon(adminUser.permissions.userManagement)}
                          {getPermissionIcon(adminUser.permissions.productManagement)}
                          {getPermissionIcon(adminUser.permissions.orderManagement)}
                          {getPermissionIcon(adminUser.permissions.financialAccess)}
                          {getPermissionIcon(adminUser.permissions.systemSettings)}
                          {getPermissionIcon(adminUser.permissions.analyticsAccess)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {adminUser.lastLogin 
                          ? new Date(adminUser.lastLogin).toLocaleDateString()
                          : 'Never'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingAdmin(adminUser)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit permissions"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(adminUser._id, adminUser.isActive)}
                            className={adminUser.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                            title={adminUser.isActive ? "Deactivate" : "Activate"}
                          >
                            {adminUser.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          {adminUser._id !== admin?._id && (
                            <button
                              onClick={() => handleDeleteAdmin(adminUser._id, adminUser.name)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete admin"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {admins.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No admins found</h3>
            <p className="text-gray-500">Get started by creating your first admin account.</p>
          </div>
        )}
      </div>
    </RequireAdminAuth>
  );
}
