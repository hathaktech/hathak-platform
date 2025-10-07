"use client";
import { useState, useEffect } from "react";
import { useModernNotification } from '@/context/ModernNotificationContext';
import { useAuth } from '@/context/AuthContext';
import ProductRequestForm from '@/components/BuyForMe/ProductRequestForm';
import { createCartItem } from '@/services/buyForMeCartApi';
import { 
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface ProductRequestFormData {
  productLink: string;
  productImage?: string;
  size: string;
  color: string;
  quantity: number;
  pricePerUnit: number;
  currency: string;
  additionalDetails: string;
}

// BuyForMeCartItem interface is now imported from buyForMeCartApi

export default function HeroSection() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { showNotification } = useModernNotification();
  const { isAuthenticated, user } = useAuth();


  const handleShopNowClick = () => {
    setShowRequestForm(true);
  };

  const handleSaveRequest = async (data: ProductRequestFormData) => {
    try {
      setSubmitting(true);
      
      // Check if user is authenticated before saving
      if (!isAuthenticated) {
        showNotification('error', 'Please login to save products to your list');
        setShowRequestForm(false);
        return;
      }
      
      // Create a product object for the saved products list
      const productData = {
        productName: data.productLink.split('/').pop()?.split('?')[0] || 'Product', // Extract product name from URL
        productLink: data.productLink,
        images: data.productImage ? [data.productImage] : [],
        quantity: data.quantity,
        estimatedPrice: data.pricePerUnit,
        currency: data.currency,
        sizes: data.size ? [data.size] : [],
        colors: data.color ? [data.color] : [],
        notes: data.additionalDetails || '' // Only save additional details in notes
      };
      
      // Save to database using API
      const newProduct = await createCartItem(productData);
      
      // Trigger custom event to update other components
      window.dispatchEvent(new CustomEvent('cartItemsUpdated'));
      
      showNotification('success', 'Product saved to your BuyForMe cart successfully! You can view it in your Control Panel > BuyForMe > BuyForMe Cart.');
      setShowRequestForm(false);
    } catch (err: any) {
      console.error('Error saving product:', err);
      showNotification('error', err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = () => {
    setShowRequestForm(false);
  };



  return (
    <section className="bg-gradient-to-br from-neutral-100 to-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-display-1 text-neutral-900 mb-6">
            LET'S SHOP FOR YOU
          </h1>
          <p className="text-base sm:text-body-large text-neutral-600 max-w-3xl mx-auto mb-8 px-4">
            Simple 4-step process to get your products delivered
          </p>
        </div>

        {/* Shop Now Button */}
        <div className="text-center mb-12">
          <button
            onClick={handleShopNowClick}
            className="bg-orange-500 text-white px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-elegant font-medium text-lg"
          >
            Shop Now
          </button>
        </div>


      </div>

      {/* Product Request Form Modal */}
      <ProductRequestForm
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        onSave={handleSaveRequest}
        onCancel={handleCancelRequest}
        isLoading={submitting}
      />
    </section>
  );
}