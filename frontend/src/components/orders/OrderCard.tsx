'use client';

import React from 'react';
import { Order } from '@/types/order';
import StatusBadge from '@/components/ui/StatusBadge';
import { Package, Calendar, DollarSign, Eye } from 'lucide-react';
import Link from 'next/link';

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
}

export default function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalItems = () => {
    return order.products.reduce((total, product) => total + product.quantity, 0);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
            <p className="text-sm text-gray-500">{getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>${order.totalPrice.toFixed(2)}</span>
        </div>
        <div className="text-sm text-gray-600">
          Payment: {order.paymentMethod.toUpperCase()}
        </div>
      </div>

      {order.notes && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Notes:</span> {order.notes}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {order.discount > 0 && (
            <span className="mr-4">Discount: -${order.discount.toFixed(2)}</span>
          )}
          {order.tax > 0 && (
            <span>Tax: ${order.tax.toFixed(2)}</span>
          )}
        </div>
        <button
          onClick={() => onViewDetails?.(order._id)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );
}
