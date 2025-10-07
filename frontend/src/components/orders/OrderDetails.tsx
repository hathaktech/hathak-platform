'use client';

import React from 'react';
import { Order } from '@/types/order';
import StatusBadge from '@/components/ui/StatusBadge';
import { Package, Calendar, DollarSign, X } from 'lucide-react';

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetails({ order, onClose }: OrderDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Order Header */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                  <p className="text-sm text-gray-500">Created on {formatDate(order.createdAt)}</p>
                </div>
              </div>
              <StatusBadge status={order.status} size="lg" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Order Date: {formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>Payment: {order.paymentMethod.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.products.map((product, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Product ID: {product.productId}</h4>
                      <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                      {product.options && Object.keys(product.options).length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Options:</p>
                          <div className="text-sm text-gray-600">
                            {Object.entries(product.options).map(([key, value]) => (
                              <span key={key} className="mr-2">
                                {key}: {String(value)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">each</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${(order.totalPrice + order.discount - order.tax).toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">${order.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-lg text-gray-900">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
