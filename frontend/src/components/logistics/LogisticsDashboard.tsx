"use client";
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  BarChart3,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  MoreVertical
} from 'lucide-react';

interface FulfillmentCenter {
  _id: string;
  name: string;
  code: string;
  type: 'platform' | 'seller' | '3pl' | 'dropship';
  status: 'active' | 'inactive' | 'maintenance' | 'suspended';
  address: {
    city: string;
    state: string;
    country: string;
  };
  capacity: {
    maxOrdersPerDay: number;
    currentUtilization: number;
  };
  metadata: {
    totalOrdersProcessed: number;
    lastOrderProcessed: Date;
  };
}

interface InventoryItem {
  _id: string;
  product: {
    name: string;
    sku: string;
  };
  fulfillmentCenter: {
    name: string;
    code: string;
  };
  quantity: number;
  reserved: number;
  available: number;
  status: 'active' | 'inactive' | 'discontinued' | 'recalled';
  alerts: Array<{
    type: string;
    message: string;
    severity: string;
    isActive: boolean;
  }>;
}

interface OrderFulfillment {
  _id: string;
  order: {
    orderNumber: string;
    customerName: string;
  };
  status: 'pending' | 'confirmed' | 'picking' | 'picked' | 'packing' | 'packed' | 'shipped' | 'delivered';
  fulfillmentType: 'seller_fulfilled' | 'platform_fulfilled' | 'dropship';
  fulfillmentCenter: {
    name: string;
    code: string;
  };
  shipping: {
    carrier: string;
    trackingNumber: string;
    trackingUrl: string;
  };
  createdAt: string;
}

const LogisticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'fulfillment' | 'centers'>('overview');
  const [fulfillmentCenters, setFulfillmentCenters] = useState<FulfillmentCenter[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [fulfillments, setFulfillments] = useState<OrderFulfillment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // In a real app, these would be separate API calls
      const [centersRes, inventoryRes, fulfillmentsRes] = await Promise.all([
        fetch('/api/logistics/fulfillment-centers'),
        fetch('/api/logistics/inventory'),
        fetch('/api/logistics/fulfillments')
      ]);

      if (centersRes.ok) {
        const centersData = await centersRes.json();
        setFulfillmentCenters(centersData.data || []);
      }

      if (inventoryRes.ok) {
        const inventoryData = await inventoryRes.json();
        setInventory(inventoryData.data || []);
      }

      if (fulfillmentsRes.ok) {
        const fulfillmentsData = await fulfillmentsRes.json();
        setFulfillments(fulfillmentsData.data || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'delivered':
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'picking':
      case 'packing':
        return 'text-yellow-600 bg-yellow-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'inactive':
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      case 'maintenance':
      case 'suspended':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'picking':
      case 'packing':
        return <Clock className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'maintenance':
      case 'suspended':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesStatus = !filters.status || item.status === filters.status;
    const matchesSearch = !filters.search || 
      item.product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.product.sku.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredFulfillments = fulfillments.filter(fulfillment => {
    const matchesStatus = !filters.status || fulfillment.status === filters.status;
    const matchesType = !filters.type || fulfillment.fulfillmentType === filters.type;
    const matchesSearch = !filters.search || 
      fulfillment.order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
      fulfillment.order.customerName.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const stats = {
    totalCenters: fulfillmentCenters.length,
    activeCenters: fulfillmentCenters.filter(c => c.status === 'active').length,
    totalInventory: inventory.reduce((sum, item) => sum + item.quantity, 0),
    lowStockItems: inventory.filter(item => item.available <= item.reserved).length,
    pendingFulfillments: fulfillments.filter(f => f.status === 'pending').length,
    shippedToday: fulfillments.filter(f => 
      f.status === 'shipped' && 
      new Date(f.createdAt).toDateString() === new Date().toDateString()
    ).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logistics Dashboard</h1>
          <p className="text-gray-600">Manage fulfillment centers, inventory, and orders</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Center
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fulfillment Centers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCenters}</p>
              <p className="text-sm text-green-600">{stats.activeCenters} active</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Inventory</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInventory.toLocaleString()}</p>
              <p className="text-sm text-red-600">{stats.lowStockItems} low stock</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingFulfillments}</p>
              <p className="text-sm text-gray-600">Awaiting fulfillment</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Shipped Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.shippedToday}</p>
              <p className="text-sm text-gray-600">Orders delivered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'inventory', name: 'Inventory', icon: Package },
            { id: 'fulfillment', name: 'Fulfillment', icon: Truck },
            { id: 'centers', name: 'Centers', icon: MapPin }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Fulfillments */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Fulfillments</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {fulfillments.slice(0, 5).map((fulfillment) => (
                    <div key={fulfillment._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{fulfillment.order.orderNumber}</p>
                        <p className="text-sm text-gray-600">{fulfillment.order.customerName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fulfillment.status)}`}>
                          {getStatusIcon(fulfillment.status)}
                          <span className="ml-1 capitalize">{fulfillment.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Low Stock Alerts</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {inventory.filter(item => item.alerts.some(alert => alert.isActive && alert.type === 'low_stock')).slice(0, 5).map((item) => (
                    <div key={item._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-600">{item.product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">{item.available} left</p>
                        <p className="text-xs text-gray-500">{item.fulfillmentCenter.code}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Inventory Management</h3>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="discontinued">Discontinued</option>
                  <option value="recalled">Recalled</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                        <div className="text-sm text-gray-500">{item.product.sku}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.fulfillmentCenter.name}</div>
                      <div className="text-sm text-gray-500">{item.fulfillmentCenter.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.available}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{item.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'fulfillment' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Order Fulfillment</h3>
              <div className="flex space-x-3">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="picking">Picking</option>
                  <option value="picked">Picked</option>
                  <option value="packing">Packing</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="">All Types</option>
                  <option value="seller_fulfilled">Seller Fulfilled</option>
                  <option value="platform_fulfilled">Platform Fulfilled</option>
                  <option value="dropship">Dropship</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFulfillments.map((fulfillment) => (
                  <tr key={fulfillment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{fulfillment.order.orderNumber}</div>
                        <div className="text-sm text-gray-500">{fulfillment.order.customerName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {fulfillment.fulfillmentType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{fulfillment.fulfillmentCenter.name}</div>
                      <div className="text-sm text-gray-500">{fulfillment.fulfillmentCenter.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fulfillment.status)}`}>
                        {getStatusIcon(fulfillment.status)}
                        <span className="ml-1 capitalize">{fulfillment.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {fulfillment.shipping.trackingNumber ? (
                        <a
                          href={fulfillment.shipping.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          {fulfillment.shipping.trackingNumber}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">Not shipped</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'centers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fulfillmentCenters.map((center) => (
            <div key={center._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{center.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(center.status)}`}>
                  {getStatusIcon(center.status)}
                  <span className="ml-1 capitalize">{center.status}</span>
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Code:</strong> {center.code}</p>
                <p><strong>Type:</strong> {center.type.toUpperCase()}</p>
                <p><strong>Location:</strong> {center.address.city}, {center.address.state}</p>
                <p><strong>Capacity:</strong> {center.capacity.currentUtilization}/{center.capacity.maxOrdersPerDay} orders/day</p>
                <p><strong>Total Orders:</strong> {center.metadata.totalOrdersProcessed}</p>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  View Details
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogisticsDashboard;
