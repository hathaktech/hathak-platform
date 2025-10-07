'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  Filter, 
  Eye, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  DollarSign,
  BarChart3,
  TrendingUp,
  Globe,
  Phone,
  Mail,
  Download,
  RefreshCw,
  Plus,
  MoreVertical,
  ArrowRight,
  Box,
  Weight
} from 'lucide-react';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';

interface Shipment {
  id: string;
  trackingNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'in-transit' | 'delivered' | 'delayed';
  origin: string;
  destination: string;
  carrier: string;
  service: string;
  weight: string;
  dimensions: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  value: string;
  insurance?: string;
  signatureRequired: boolean;
  lastUpdate: string;
  notes?: string;
}

const YourShipmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'in-transit' | 'delivered' | 'delayed'>('all');
  const [carrierFilter, setCarrierFilter] = useState<'all' | 'ups' | 'fedex' | 'dhl' | 'usps' | 'other'>('all');
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all-shipments' | 'tracking' | 'history' | 'analytics'>('all-shipments');

  // Mock data - in a real app, this would come from an API
  const shipments: Shipment[] = [
    // Empty state for now - can be populated later
  ];

  const handleSelectShipment = (shipmentId: string) => {
    setSelectedShipments(prev => 
      prev.includes(shipmentId) 
        ? prev.filter(id => id !== shipmentId)
        : [...prev, shipmentId]
    );
  };

  const handleViewShipment = (shipmentId: string) => {
    // In a real app, this would navigate to shipment details
    console.log('View shipment:', shipmentId);
  };

  const handleTrackShipment = (trackingNumber: string) => {
    // In a real app, this would open tracking details
    console.log('Track shipment:', trackingNumber);
  };

  const handleRefreshTracking = (shipmentId: string) => {
    // In a real app, this would refresh tracking data
    console.log('Refresh tracking:', shipmentId);
  };

  const handleCreateShipment = () => {
    // In a real app, this would open a create shipment modal
    console.log('Create new shipment');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'processing': return 'text-blue-700 bg-blue-100';
      case 'shipped': return 'text-purple-700 bg-purple-100';
      case 'in-transit': return 'text-indigo-700 bg-indigo-100';
      case 'delivered': return 'text-green-700 bg-green-100';
      case 'delayed': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'in-transit': return Truck;
      case 'delivered': return CheckCircle;
      case 'delayed': return AlertCircle;
      default: return Clock;
    }
  };

  const getCarrierColor = (carrier: string) => {
    switch (carrier.toLowerCase()) {
      case 'ups': return 'text-brown-600 bg-brown-100';
      case 'fedex': return 'text-blue-600 bg-blue-100';
      case 'dhl': return 'text-red-600 bg-red-100';
      case 'usps': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.carrier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    const matchesCarrier = carrierFilter === 'all' || shipment.carrier.toLowerCase() === carrierFilter;
    return matchesSearch && matchesStatus && matchesCarrier;
  });

  return (
    <UserControlPanel>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Your Shipments</h1>
            <p className="text-xs text-gray-600 mt-0.5">
              {shipments.length} {shipments.length === 1 ? 'shipment' : 'shipments'} total
            </p>
          </div>
          <div className="flex items-center space-x-1.5">
            {selectedShipments.length > 0 && (
              <div className="flex items-center space-x-2 mr-4">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                  <Download className="w-4 h-4 inline mr-1" />
                  Export
                </button>
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
                  <RefreshCw className="w-4 h-4 inline mr-1" />
                  Refresh All
                </button>
              </div>
            )}
            <button
              onClick={handleCreateShipment}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Shipment
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-gray-200 p-1">
          <div className="flex space-x-1">
            {[
              { id: 'all-shipments', label: 'All Shipments', icon: Package },
              { id: 'tracking', label: 'Tracking', icon: Truck },
              { id: 'history', label: 'History', icon: Calendar },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* All Shipments Tab */}
        {activeTab === 'all-shipments' && (
          <>
            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search shipments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="delayed">Delayed</option>
              </select>
              <select
                value={carrierFilter}
                onChange={(e) => setCarrierFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Carriers</option>
                <option value="ups">UPS</option>
                <option value="fedex">FedEx</option>
                <option value="dhl">DHL</option>
                <option value="usps">USPS</option>
                <option value="other">Other</option>
              </select>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-5 h-5 mr-2" />
                More Filters
              </button>
            </div>

            {/* Stats Cards */}
            {shipments.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">In Transit</p>
                      <p className="text-xl font-bold text-gray-900">
                        {shipments.filter(s => s.status === 'in-transit').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delivered</p>
                      <p className="text-xl font-bold text-gray-900">
                        {shipments.filter(s => s.status === 'delivered').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-xl font-bold text-gray-900">
                        {shipments.filter(s => s.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delayed</p>
                      <p className="text-xl font-bold text-gray-900">
                        {shipments.filter(s => s.status === 'delayed').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shipments List */}
            {shipments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No shipments yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first shipment or wait for tracking numbers to appear here.
                </p>
                <button
                  onClick={handleCreateShipment}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Shipment
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedShipments(filteredShipments.map(s => s.id));
                              } else {
                                setSelectedShipments([]);
                              }
                            }}
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tracking Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Carrier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Route
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Delivery
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredShipments.map((shipment) => {
                        const StatusIcon = getStatusIcon(shipment.status);
                        return (
                          <tr key={shipment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedShipments.includes(shipment.id)}
                                onChange={() => handleSelectShipment(shipment.id)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900 font-mono">{shipment.trackingNumber}</div>
                                <div className="text-sm text-gray-500">{shipment.service}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {shipment.status.replace('-', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCarrierColor(shipment.carrier)}`}>
                                {shipment.carrier.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                <div className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1 text-green-500" />
                                  {shipment.origin}
                                </div>
                                <div className="flex items-center mt-1">
                                  <ArrowRight className="w-3 h-3 mr-1 text-gray-400" />
                                  {shipment.destination}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                <div className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                                </div>
                                {shipment.actualDelivery && (
                                  <div className="text-xs text-green-600 mt-1">
                                    Delivered: {new Date(shipment.actualDelivery).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-1.5">
                                <button
                                  onClick={() => handleViewShipment(shipment.id)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleTrackShipment(shipment.trackingNumber)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Track Package"
                                >
                                  <Truck className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRefreshTracking(shipment.id)}
                                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                  title="Refresh Tracking"
                                >
                                  <RefreshCw className="w-4 h-4" />
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
          </>
        )}

        {/* Tracking Tab */}
        {activeTab === 'tracking' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Track Your Packages</h3>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter Tracking Number</h3>
              <p className="text-gray-600 mb-6">Track your packages in real-time with detailed status updates.</p>
              <div className="max-w-md mx-auto">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter tracking number"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors">
                    Track
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping History</h3>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No history yet</h3>
              <p className="text-gray-600">Your shipping history will appear here once you have completed shipments.</p>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Analytics</h3>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-600">Detailed shipping analytics and insights will be available here.</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <Plus className="w-5 h-5 text-blue-500 mr-3" />
              <span className="text-sm font-medium text-gray-700">Create Shipment</span>
            </button>
            <button className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <Truck className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-sm font-medium text-gray-700">Track Package</span>
            </button>
            <button className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <Download className="w-5 h-5 text-purple-500 mr-3" />
              <span className="text-sm font-medium text-gray-700">Export Data</span>
            </button>
            <button className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <RefreshCw className="w-5 h-5 text-yellow-500 mr-3" />
              <span className="text-sm font-medium text-gray-700">Refresh All</span>
            </button>
          </div>
        </div>
      </div>
    </UserControlPanel>
  );
};

export default YourShipmentsPage;
