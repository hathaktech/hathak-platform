'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useModernNotification } from '@/context/ModernNotificationContext';
import { applyCoupon } from '@/services/cartService';
import { Tag } from 'lucide-react';

export default function CouponForm() {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { loadCart } = useCart();
  const { showNotification } = useModernNotification();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      showNotification('error', 'Please enter a coupon code');
      return;
    }

    setIsApplying(true);
    
    try {
      await applyCoupon({ code: couponCode.trim() });
      await loadCart(); // Reload cart to get updated totals
      showNotification('success', 'Coupon applied successfully!');
      setCouponCode('');
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to apply coupon');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Tag className="w-5 h-5" />
        Apply Coupon
      </h3>
      
      <form onSubmit={handleApplyCoupon} className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isApplying}
        />
        <button
          type="submit"
          disabled={isApplying || !couponCode.trim()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </button>
      </form>
    </div>
  );
}
