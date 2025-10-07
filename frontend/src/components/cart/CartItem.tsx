'use client';

import React from 'react';
import { CartItem as CartItemType } from '@/types/cart';
import { useCart } from '@/context/CartContext';
import { Trash2, Minus, Plus } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateItemQuantity, removeFromCart, isLoading } = useCart();

  const handleQuantityChange = async (newQuantity: number) => {
    if (item._id) {
      await updateItemQuantity(item._id, newQuantity);
    }
  };

  const handleRemove = async () => {
    if (item._id) {
      await removeFromCart(item._id);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-sm">
      {/* Product Image */}
      <div className="flex-shrink-0">
        {item.product.image ? (
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-16 h-16 object-cover rounded-md"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {item.product.name}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          ${item.price.toFixed(2)} each
        </p>
        {item.options && Object.keys(item.options).length > 0 && (
          <div className="mt-1">
            {Object.entries(item.options).map(([key, value]) => (
              <span
                key={key}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1"
              >
                {key}: {value}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isLoading || item.quantity <= 1}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isLoading}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        disabled={isLoading}
        className="p-2 text-red-500 hover:bg-red-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        title="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
