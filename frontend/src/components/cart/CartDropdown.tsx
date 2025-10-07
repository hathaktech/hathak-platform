'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useBuyForMeCart } from '@/context/BuyForMeCartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  ShoppingCart, 
  X, 
  ArrowRight, 
  Package,
  ShoppingBag,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';
import Image from 'next/image';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const { store, buyme, updateItemQuantity, removeFromCart } = useCart();
  const { items: buyForMeCartItems, removeCartItem } = useBuyForMeCart();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);



  // Determine which carts to show based on current page
  const showStoreCart = pathname === '/' || pathname.startsWith('/HatHakStore') || pathname.startsWith('/cart');
  const showBuymeCart = pathname === '/' || pathname.startsWith('/BuyForMe') || pathname.startsWith('/buyme');

  // Derive activeCartItems and productsToConfirm from buyForMeCartItems
  const activeCartItems = buyForMeCartItems.filter(item => item.status === 'active' && item.isActive);
  const productsToConfirm = buyForMeCartItems.filter(item => item.status === 'submitted');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Don't close if clicking on the cart icon or its children
      const cartIcon = document.querySelector('[aria-label="Shopping Cart"]');
      if (cartIcon && (cartIcon.contains(target) || cartIcon === target)) {
        return;
      }
      
      // Don't close if clicking inside the cart dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        onClose();
      }
    };

    if (isOpen) {
      // Add a small delay to prevent immediate closing when cart opens
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  const handleQuantityChange = async (itemId: string, newQuantity: number, serviceType: 'store' | 'buyme') => {
    try {
      await updateItemQuantity(itemId, newQuantity, serviceType);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: string, serviceType: 'store' | 'buyme') => {
    try {
      await removeFromCart(itemId, serviceType);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const CartSection = ({ 
    cart, 
    serviceType, 
    title, 
    icon: Icon, 
    href 
  }: { 
    cart: typeof store; 
    serviceType: 'store' | 'buyme'; 
    title: string; 
    icon: React.ComponentType<any>; 
    href: string;
  }) => {
    // For buyme cart, use saved products instead of cart items
    const isBuymeCart = serviceType === 'buyme';
    const displayItems = isBuymeCart ? buyForMeCartItems : cart.items;
    const itemCount = displayItems.length;

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary-1" />
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <span className="bg-primary-1 text-white text-xs px-2 py-1 rounded-full">
              {itemCount}
            </span>
          </div>
          <Link
            href={href}
            className="flex items-center gap-1 text-sm text-primary-1 hover:text-primary-2 transition-colors"
            onClick={onClose}
          >
            Go to Cart
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {false && isBuymeCart ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin w-8 h-8 border-2 border-primary-1 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm">Loading items...</p>
          </div>
        ) : itemCount === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No items in {title.toLowerCase()}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayItems.map((item: any, index: number) => {
              // Handle both cart items and saved products
              const isCartItem = isBuymeCart && '_id' in item;
              
              if (isCartItem) {
                const cartItem = item as any;
                return (
                  <div key={cartItem._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      {cartItem.images?.[0] ? (
                        <Image
                          src={cartItem.images[0]}
                          alt={cartItem.productName}
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {cartItem.productName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        ${(cartItem.estimatedPrice || 0).toFixed(2)} × {cartItem.quantity || 1}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        ${((cartItem.estimatedPrice || 0) * (cartItem.quantity || 1)).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Active
                      </span>
                    </div>
                  </div>
                );
              } else {
                // Regular cart item
                const cartItem = item as any;
                return (
                  <div key={cartItem._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      {cartItem.product.image ? (
                        <Image
                          src={cartItem.product.image}
                          alt={cartItem.product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {cartItem.product.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        ${cartItem.price.toFixed(2)} × {cartItem.quantity}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        ${(cartItem.price * cartItem.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleQuantityChange(cartItem._id!, cartItem.quantity - 1, serviceType)}
                          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          disabled={cartItem.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{cartItem.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(cartItem._id!, cartItem.quantity + 1, serviceType)}
                          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(cartItem._id!, serviceType)}
                        className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Cart Panel - slides in from right */}
      <div
        ref={dropdownRef}
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 10000 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {showStoreCart && showBuymeCart ? (
              // Home page - show both carts
              <>
                <CartSection
                  cart={store}
                  serviceType="store"
                  title="HatHak Store"
                  icon={ShoppingBag}
                  href="/cart"
                />
                <CartSection
                  cart={buyme}
                  serviceType="buyme"
                  title="Buy for Me"
                  icon={ShoppingCart}
                  href="/User/ControlPanel/BuyForMe/cart"
                />
              </>
            ) : showStoreCart ? (
              // Store pages - show only store cart
              <CartSection
                cart={store}
                serviceType="store"
                title="HatHak Store"
                icon={ShoppingBag}
                href="/cart"
              />
            ) : showBuymeCart ? (
              // BuyForMe pages - show only buyme cart
              <CartSection
                cart={buyme}
                serviceType="buyme"
                title="Buy for Me"
                icon={ShoppingCart}
                href="/User/ControlPanel/BuyForMe/cart"
              />
            ) : null}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            {!isAuthenticated && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Link href="/auth/login" className="font-medium hover:underline">
                    Sign in
                  </Link>{' '}
                  to save your cart and checkout
                </p>
              </div>
            )}
            
            <div className="flex gap-2">
              {showStoreCart && store.items.length > 0 && (
                <Link
                  href="/cart"
                  className="flex-1 bg-primary-1 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-primary-2 transition-colors"
                  onClick={onClose}
                >
                  Store Cart ({store.items.length})
                </Link>
              )}
              {showBuymeCart && buyForMeCartItems.length > 0 && (
                <Link
                  href="/User/ControlPanel/BuyForMe/cart"
                  className="flex-1 bg-primary-1 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-primary-2 transition-colors"
                  onClick={onClose}
                >
                  BuyForMe Cart ({buyForMeCartItems.length})
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
