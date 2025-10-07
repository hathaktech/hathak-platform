'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getOrderById } from '@/services/cartService';
import { Order } from '@/types/cart';
import { CheckCircle, Package, Home, User } from 'lucide-react';
import Link from 'next/link';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await getOrderById(orderId!);
      setOrder(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Package className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load order details'}</p>
          <Link
            href="/User/ControlPanel"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Control Panel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Thank you for your order. We'll process it right away.</p>
        </div>

        {/* Order Details */}
        <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Details
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{order._id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium capitalize">
                {order.paymentMethod.replace('_', ' ')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold text-lg">${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
          
          <div className="space-y-3">
            {order.products.map((product, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <span className="font-medium">Product #{index + 1}</span>
                  <span className="text-gray-600 ml-2">× {product.quantity}</span>
                </div>
                <span className="font-medium">${(product.price * product.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• We'll review your order and confirm it within 24 hours</li>
            <li>• You'll receive an email confirmation with order details</li>
            <li>• We'll notify you when your order ships</li>
            <li>• Track your order status in your control panel</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/User/ControlPanel"
            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <User className="w-4 h-4 mr-2" />
            View My Orders
          </Link>
          
          <Link
            href="/HatHakStore"
            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
