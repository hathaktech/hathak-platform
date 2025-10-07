'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useModernNotification } from '@/context/ModernNotificationContext';
import { checkoutCart } from '@/services/cartService';
import CartTotals from '@/components/cart/CartTotals';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { CreditCard, User, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, isLoading, loadCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useModernNotification();

  const [formData, setFormData] = useState({
    notes: '',
    paymentMethod: 'cod',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      showNotification('error', 'Please login to checkout');
      router.push('/auth/login');
      return;
    }

    if (items.length === 0) {
      showNotification('error', 'Your cart is empty');
      router.push('/cart');
      return;
    }

    loadCart();
  }, [isAuthenticated, items.length, loadCart, router, showNotification]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      showNotification('error', 'Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await checkoutCart(formData);
      showNotification('success', 'Order placed successfully!');
      
      // Redirect to order confirmation
      router.push(`/order-success?orderId=${response.data.order._id}`);
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute message="Please login to checkout">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/cart" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              ← Back to Cart
            </Link>
            
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span>Bank Transfer</span>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Notes</h2>
                
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions or notes for your order..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <CartTotals 
                cart={{ items, totalPrice: 0, discount: 0, tax: 0 }}
                showCheckoutButton={true}
                onCheckout={handleCheckout}
                checkoutLoading={isProcessing}
              />

              {/* Order Summary Details */}
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item._id || `${item.product._id}-${JSON.stringify(item.options)}`} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
