'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useModernNotification } from '@/context/ModernNotificationContext';
import CartItem from '@/components/cart/CartItem';
import CartTotals from '@/components/cart/CartTotals';
import CouponForm from '@/components/cart/CouponForm';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { store, isLoading, error, loadCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showNotification } = useModernNotification();
  
  // Get items from the store cart
  const items = store.items;

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      loadCart('store');
    }
  }, [isAuthenticated]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      showNotification('error', 'Please login to checkout');
      router.push('/auth/login');
      return;
    }
    
    if (items.length === 0) {
      showNotification('error', 'Your cart is empty');
      return;
    }

    router.push('/checkout');
  };

  // Don't show loading here - ProtectedRoute handles it
  // Only show loading for cart-specific operations
  if (isLoading && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle unauthenticated users gracefully
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign in to view your cart</h2>
            <p className="text-gray-600 mb-6">Please sign in to access your shopping cart and saved items.</p>
            <div className="space-x-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/HatHakStore" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
            
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              {items.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link
                href="/HatHakStore"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem key={item._id || `${item.product._id}-${JSON.stringify(item.options)}`} item={item} />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Coupon Form */}
                <CouponForm />
                
                {/* Cart Totals */}
                <CartTotals 
                  cart={store}
                  showCheckoutButton={true}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
}
