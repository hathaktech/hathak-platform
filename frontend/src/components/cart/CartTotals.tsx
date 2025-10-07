'use client';

import React from 'react';
import { Cart } from '@/types/cart';
import { calculateSubtotal, calculateTotal } from '@/services/cartService';

interface CartTotalsProps {
  cart: Cart;
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
  checkoutLoading?: boolean;
}

export default function CartTotals({ 
  cart, 
  showCheckoutButton = false, 
  onCheckout,
  checkoutLoading = false 
}: CartTotalsProps) {
  const subtotal = calculateSubtotal(cart.items);
  const total = calculateTotal(subtotal, cart.discount, cart.tax);

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({cart.items.length} items)</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        {cart.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-green-600">-${cart.discount.toFixed(2)}</span>
          </div>
        )}

        {/* Tax */}
        {cart.tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">${cart.tax.toFixed(2)}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      {showCheckoutButton && onCheckout && (
        <button
          onClick={onCheckout}
          disabled={checkoutLoading || cart.items.length === 0}
          className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {checkoutLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
          ) : (
            'Proceed to Checkout'
          )}
        </button>
      )}
    </div>
  );
}
