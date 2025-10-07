'use client';

import { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Camera, 
  Truck, 
  AlertTriangle,
  CreditCard,
  ShoppingCart,
  Warehouse,
  Box,
  Users,
  Calendar,
  DollarSign,
  Upload,
  Eye,
  Edit,
  Save,
  X,
  Plus,
  Minus
} from 'lucide-react';

interface BuyForMeRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: {
    id: string;
    name: string;
    url: string;
    quantity: number;
    price: number;
    description?: string;
    photos?: string[];
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'payment_pending' | 'ordered' | 'received' | 'photographed' | 'customer_confirmed' | 'packaging_options' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  notes?: string;
  trackingNumber?: string;
  photos?: string[];
  packagingChoice?: 'original' | 'grouped' | 'mixed';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  orderDetails?: {
    orderNumber: string;
    supplier: string;
    estimatedDelivery: string;
    actualDelivery?: string;
  };
}

interface BuyForMeRequestDetailProps {
  request: BuyForMeRequest;
  onUpdate: (request: BuyForMeRequest) => void;
  onClose: () => void;
}

const BuyForMeRequestDetail: React.FC<BuyForMeRequestDetailProps> = ({
  request,
  onUpdate,
  onClose
}) => {
  const [currentRequest, setCurrentRequest] = useState<BuyForMeRequest>(request);
  const [activeTab, setActiveTab] = useState<'overview' | 'workflow' | 'items' | 'packaging' | 'shipping'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [newNote, setNewNote] = useState('');

  const workflowSteps = [
    { key: 'pending', label: 'Request Submitted', icon: Clock, color: 'yellow' },
    { key: 'confirmed', label: 'Request Confirmed', icon: CheckCircle, color: 'blue' },
    { key: 'payment_pending', label: 'Payment Pending', icon: CreditCard, color: 'orange' },
    { key: 'ordered', label: 'Items Ordered', icon: ShoppingCart, color: 'purple' },
    { key: 'received', label: 'Items Received', icon: Warehouse, color: 'indigo' },
    { key: 'photographed', label: 'Items Photographed', icon: Camera, color: 'pink' },
    { key: 'customer_confirmed', label: 'Customer Confirmed', icon: CheckCircle, color: 'green' },
    { key: 'packaging_options', label: 'Packaging Options', icon: Box, color: 'teal' },
    { key: 'packed', label: 'Items Packed', icon: Package, color: 'cyan' },
    { key: 'shipped', label: 'Shipped', icon: Truck, color: 'blue' },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'green' }
  ];

  const getCurrentStepIndex = () => {
    return workflowSteps.findIndex(step => step.key === currentRequest.status);
  };

  const updateStatus = (newStatus: string) => {
    const updated = {
      ...currentRequest,
      status: newStatus as any,
      updatedAt: new Date().toISOString()
    };
    setCurrentRequest(updated);
    onUpdate(updated);
  };

  const addPhoto = (itemId: string) => {
    if (newPhoto) {
      const updated = {
        ...currentRequest,
        items: currentRequest.items.map(item => 
          item.id === itemId 
            ? { ...item, photos: [...(item.photos || []), URL.createObjectURL(newPhoto)] }
            : item
        )
      };
      setCurrentRequest(updated);
      setNewPhoto(null);
    }
  };

  const addNote = () => {
    if (newNote.trim()) {
      const updated = {
        ...currentRequest,
        notes: (currentRequest.notes || '') + '\n' + new Date().toLocaleString() + ': ' + newNote
      };
      setCurrentRequest(updated);
      setNewNote('');
    }
  };


  const updatePackagingChoice = (choice: string) => {
    const updated = {
      ...currentRequest,
      packagingChoice: choice as any,
      status: 'packed'
    };
    setCurrentRequest(updated);
    onUpdate(updated);
  };

  const getStatusColor = (status: string) => {
    const step = workflowSteps.find(s => s.key === status);
    return step ? `bg-${step.color}-100 text-${step.color}-800` : 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const step = workflowSteps.find(s => s.key === status);
    return step ? step.icon : Clock;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-gray-900">
            BuyForMe Request - {currentRequest.id}
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'workflow', label: 'Workflow' },
              { key: 'items', label: 'Items' },
              { key: 'packaging', label: 'Packaging' },
              { key: 'shipping', label: 'Shipping' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Customer Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Name:</strong> {currentRequest.customerName}</p>
                <p><strong>Email:</strong> {currentRequest.customerEmail}</p>
                <p><strong>ID:</strong> {currentRequest.customerId}</p>
              </div>
              
              <h4 className="font-medium text-gray-900">Shipping Address</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{currentRequest.shippingAddress.name}</p>
                <p>{currentRequest.shippingAddress.address}</p>
                <p>{currentRequest.shippingAddress.city}, {currentRequest.shippingAddress.country}</p>
                <p>{currentRequest.shippingAddress.postalCode}</p>
              </div>
            </div>

            {/* Request Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Request Details</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Status:</strong> 
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentRequest.status)}`}>
                    {React.createElement(getStatusIcon(currentRequest.status), { className: "w-4 h-4" })}
                    <span className="ml-1 capitalize">{currentRequest.status.replace('_', ' ')}</span>
                  </span>
                </p>
                <p><strong>Priority:</strong> {currentRequest.priority}</p>
                <p><strong>Total Amount:</strong> ${currentRequest.totalAmount.toFixed(2)}</p>
                <p><strong>Payment Status:</strong> {currentRequest.paymentStatus || 'Not set'}</p>
                <p><strong>Created:</strong> {new Date(currentRequest.createdAt).toLocaleString()}</p>
                <p><strong>Updated:</strong> {new Date(currentRequest.updatedAt).toLocaleString()}</p>
              </div>

              {currentRequest.notes && (
                <div>
                  <h4 className="font-medium text-gray-900">Notes</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">{currentRequest.notes}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="space-y-6">
            <h4 className="font-medium text-gray-900">Workflow Progress</h4>
            
            {/* Workflow Steps */}
            <div className="space-y-4">
              {workflowSteps.map((step, index) => {
                const isCompleted = index <= getCurrentStepIndex();
                const isCurrent = index === getCurrentStepIndex();
                const Icon = step.icon;
                
                return (
                  <div key={step.key} className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? `bg-${step.color}-500 text-white` : 'bg-gray-200 text-gray-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        isCurrent ? `text-${step.color}-600` : isCompleted ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </div>
                      {isCurrent && (
                        <div className="mt-2">
                          <button
                            onClick={() => updateStatus(step.key)}
                            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark as {step.label}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">Quick Actions</h5>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateStatus('confirmed')}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Confirm Request
                </button>
                <button
                  onClick={() => updateStatus('payment_pending')}
                  className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"
                >
                  Request Payment
                </button>
                <button
                  onClick={() => updateStatus('ordered')}
                  className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                >
                  Mark as Ordered
                </button>
                <button
                  onClick={() => updateStatus('received')}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                >
                  Mark as Received
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-6">
            <h4 className="font-medium text-gray-900">Items Management</h4>
            
            <div className="space-y-4">
              {currentRequest.items.map((item) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{item.name}</h5>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm text-blue-600 mt-1">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          View Product
                        </a>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  {/* Item Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Photos
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setNewPhoto(e.target.files?.[0] || null)}
                          className="text-sm"
                        />
                        <button
                          onClick={() => addPhoto(item.id)}
                          disabled={!newPhoto}
                          className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 text-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Item Photos */}
                  {item.photos && item.photos.length > 0 && (
                    <div>
                      <h6 className="text-sm font-medium text-gray-700 mb-2">Photos</h6>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {item.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={photo}
                              alt={`${item.name} photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded border"
                            />
                            <button
                              onClick={() => {
                                const updated = {
                                  ...currentRequest,
                                  items: currentRequest.items.map(i => 
                                    i.id === item.id 
                                      ? { ...i, photos: i.photos?.filter((_, idx) => idx !== index) }
                                      : i
                                  )
                                };
                                setCurrentRequest(updated);
                              }}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'packaging' && (
          <div className="space-y-6">
            <h4 className="font-medium text-gray-900">Packaging Options</h4>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-4">
                Choose how the customer wants their items packaged:
              </p>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="packaging"
                    value="original"
                    checked={currentRequest.packagingChoice === 'original'}
                    onChange={(e) => updatePackagingChoice(e.target.value)}
                    className="text-blue-600"
                  />
                  <div>
                    <div className="font-medium">Original Packaging</div>
                    <div className="text-sm text-gray-600">Keep items in their original packaging</div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="packaging"
                    value="grouped"
                    checked={currentRequest.packagingChoice === 'grouped'}
                    onChange={(e) => updatePackagingChoice(e.target.value)}
                    className="text-blue-600"
                  />
                  <div>
                    <div className="font-medium">Grouped Packaging</div>
                    <div className="text-sm text-gray-600">Remove original packaging and group all items together</div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="packaging"
                    value="mixed"
                    checked={currentRequest.packagingChoice === 'mixed'}
                    onChange={(e) => updatePackagingChoice(e.target.value)}
                    className="text-blue-600"
                  />
                  <div>
                    <div className="font-medium">Mixed Packaging</div>
                    <div className="text-sm text-gray-600">Group items by category or customer preference</div>
                  </div>
                </label>
              </div>
            </div>

            {currentRequest.packagingChoice && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800">
                    Packaging choice confirmed: {currentRequest.packagingChoice}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <h4 className="font-medium text-gray-900">Shipping Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-3">Shipping Address</h5>
                <div className="text-sm">
                  <p>{currentRequest.shippingAddress.name}</p>
                  <p>{currentRequest.shippingAddress.address}</p>
                  <p>{currentRequest.shippingAddress.city}, {currentRequest.shippingAddress.country}</p>
                  <p>{currentRequest.shippingAddress.postalCode}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-3">Tracking Information</h5>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
                    <input
                      type="text"
                      value={currentRequest.trackingNumber || ''}
                      onChange={(e) => {
                        const updated = { ...currentRequest, trackingNumber: e.target.value };
                        setCurrentRequest(updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <button
                    onClick={() => updateStatus('shipped')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Mark as Shipped
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div className="mt-6 border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-3">Add Note</h4>
          <div className="flex space-x-3">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note about this request..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addNote}
              disabled={!newNote.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onUpdate(currentRequest)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyForMeRequestDetail;
