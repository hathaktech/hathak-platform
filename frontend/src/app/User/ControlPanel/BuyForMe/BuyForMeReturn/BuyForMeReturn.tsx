'use client';

import React, { useState } from 'react';
import { 
  RotateCcw, 
  Search, 
  Filter, 
  Calendar, 
  Package, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  MessageSquare,
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';

interface ReturnRequest {
  id: string;
  orderId: string;
  productName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  requestDate: string;
  refundAmount?: string;
  trackingNumber?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
}

const BuyForMeReturnPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'processing' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

  // Mock data - in a real app, this would come from an API
  const returnRequests: ReturnRequest[] = [
    // Empty state for now - can be populated later
  ];

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleCreateReturnRequest = () => {
    // In a real app, this would open a modal or navigate to a form
    console.log('Create new return request');
  };

  const handleViewRequest = (requestId: string) => {
    // In a real app, this would navigate to the request details
    console.log('View request:', requestId);
  };

  const handleEditRequest = (requestId: string) => {
    // In a real app, this would open edit modal
    console.log('Edit request:', requestId);
  };

  const handleDeleteRequest = (requestId: string) => {
    // In a real app, this would make an API call
    console.log('Delete request:', requestId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'approved': return CheckCircle;
      case 'rejected': return AlertCircle;
      case 'processing': return Package;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  const filteredRequests = returnRequests.filter(request => {
    const matchesSearch = request.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <UserControlPanel>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">BuyForMe Return Requests</h1>
            <p className="text-xs text-gray-600 mt-0.5">
              {returnRequests.length} {returnRequests.length === 1 ? 'request' : 'requests'} total
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {selectedRequests.length > 0 && (
              <div className="flex items-center space-x-2 mr-3">
                <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs">
                  <MessageSquare className="w-3 h-3 inline mr-1" />
                  Bulk Action
                </button>
                <button className="px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs">
                  <Trash2 className="w-3 h-3 inline mr-1" />
                  Delete Selected
                </button>
              </div>
            )}
            <button
              onClick={handleCreateReturnRequest}
              className="flex items-center px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3 h-3 mr-1" />
              New Return Request
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search return requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <button className="flex items-center px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-1" />
            More Filters
          </button>
        </div>

        {/* Stats Cards */}
        {returnRequests.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Pending</p>
                  <p className="text-lg font-bold text-gray-900">
                    {returnRequests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Processing</p>
                  <p className="text-lg font-bold text-gray-900">
                    {returnRequests.filter(r => r.status === 'processing').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Completed</p>
                  <p className="text-lg font-bold text-gray-900">
                    {returnRequests.filter(r => r.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Rejected</p>
                  <p className="text-lg font-bold text-gray-900">
                    {returnRequests.filter(r => r.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {returnRequests.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">No return requests yet</h3>
            <p className="text-xs text-gray-600 mb-3">
              When you need to return items from your BuyForMe orders, you can create return requests here.
            </p>
            <button
              onClick={handleCreateReturnRequest}
              className="px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Return Request
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 w-3 h-3"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRequests(filteredRequests.map(r => r.id));
                          } else {
                            setSelectedRequests([]);
                          }
                        }}
                      />
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Details
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Date
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Refund Amount
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => {
                    const StatusIcon = getStatusIcon(request.status);
                    return (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selectedRequests.includes(request.id)}
                            onChange={() => handleSelectRequest(request.id)}
                            className="rounded border-gray-300 w-3 h-3"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <div>
                            <div className="text-xs font-medium text-gray-900">{request.productName}</div>
                            <div className="text-xs text-gray-500">Order: {request.orderId}</div>
                            <div className="text-xs text-gray-500">{request.reason}</div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {request.status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-900">
                          {new Date(request.requestDate).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-3">
                          {request.refundAmount ? (
                            <div className="flex items-center text-xs text-gray-900">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {request.refundAmount}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">Pending</span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleViewRequest(request.id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleEditRequest(request.id)}
                              className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Edit Request"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRequest(request.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Request"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gray-50 rounded-xl p-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <Plus className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-xs font-medium text-gray-700">Create Return Request</span>
            </button>
            <button className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <FileText className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-xs font-medium text-gray-700">View Return Policy</span>
            </button>
            <button className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <MessageSquare className="w-4 h-4 text-purple-500 mr-2" />
              <span className="text-xs font-medium text-gray-700">Contact Support</span>
            </button>
          </div>
        </div>
      </div>
    </UserControlPanel>
  );
};

export default BuyForMeReturnPage;
