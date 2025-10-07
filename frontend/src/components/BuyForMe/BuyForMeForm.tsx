'use client';

import React, { useState } from 'react';
import { CreateBuyMeRequest, BuyMeRequest } from '@/types/buyme';
import { useModernNotification } from '@/context/ModernNotificationContext';
import { 
  Package, Link, Palette, Ruler, Upload, Plus, Minus, 
  AlertCircle, CheckCircle, Trash2, Save, XCircle
} from 'lucide-react';

interface BuyMeFormProps {
  onSubmit: (data: CreateBuyMeRequest) => Promise<void>;
  isLoading?: boolean;
  initialData?: BuyMeRequest;
}

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

const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'TRY', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR',
  'BRL', 'MXN', 'KRW', 'SGD', 'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN',
  'CZK', 'HUF', 'RUB', 'ZAR', 'AED', 'SAR', 'EGP', 'ILS', 'THB', 'MYR',
  'IDR', 'PHP', 'VND'
];

// Removed predefined options - users will enter manually

export default function BuyMeForm({ onSubmit, isLoading = false, initialData }: BuyMeFormProps) {
  const [formData, setFormData] = useState<ProductRequestFormData>({
    productLink: '',
    productImage: '',
    size: '',
    color: '',
    quantity: 1,
    pricePerUnit: 0,
    currency: 'USD',
    additionalDetails: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { showNotification } = useModernNotification();

  // Initialize form with initial data if provided
  React.useEffect(() => {
    if (initialData) {
      // Extract data from the existing request
      const notes = initialData.notes || '';
      const sizeMatch = notes.match(/Size:\s*([^,]+)/);
      const colorMatch = notes.match(/Color:\s*([^,]+)/);
      const priceMatch = notes.match(/Price:\s*([A-Z]{3})\s*([0-9.]+)/);
      
      setFormData({
        productLink: initialData.productLink || '',
        productImage: initialData.images?.[0] || '',
        size: sizeMatch?.[1]?.trim() || initialData.sizes?.[0] || '',
        color: colorMatch?.[1]?.trim() || initialData.colors?.[0] || '',
        quantity: initialData.quantity || 1,
        pricePerUnit: priceMatch?.[2] ? parseFloat(priceMatch[2]) : initialData.estimatedPrice || 0,
        currency: priceMatch?.[1] || initialData.currency || 'USD',
        additionalDetails: notes.replace(/Size:\s*[^,]+,?\s*Color:\s*[^,]+,?\s*Quantity:\s*[^,]+,?\s*Price:\s*[^,]+,?\s*/, '').trim()
      });
      
      if (initialData.images?.[0]) {
        setUploadedImage(initialData.images[0]);
      }
    }
  }, [initialData]);

  const handleInputChange = (field: keyof ProductRequestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, formData.quantity + delta);
    handleInputChange('quantity', newQuantity);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          console.log('Image loaded successfully');
          setUploadedImage(event.target.result as string);
          handleInputChange('productImage', event.target.result as string);
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('Error reading the image file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    handleInputChange('productImage', '');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.productLink.trim()) {
      newErrors.productLink = 'Product link is required';
    } else {
      try {
        new URL(formData.productLink);
      } catch {
        newErrors.productLink = 'Please enter a valid URL';
      }
    }

    // Size and color are now optional - no validation required

    if (!formData.pricePerUnit || formData.pricePerUnit <= 0) {
      newErrors.pricePerUnit = 'Valid price per unit is required';
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('error', 'Please fix the errors in the form');
      return;
    }

    try {
      // Convert our form data to the expected CreateBuyMeRequest format
      const buyMeRequest: CreateBuyMeRequest = {
        productName: `Product from ${new URL(formData.productLink).hostname}`,
        productLink: formData.productLink,
        notes: formData.additionalDetails || '', // Only save additional details in notes
        quantity: formData.quantity,
        estimatedPrice: formData.pricePerUnit,
        currency: formData.currency,
        colors: [formData.color],
        sizes: [formData.size],
        images: formData.productImage ? [formData.productImage] : []
      };

      await onSubmit(buyMeRequest);
      
      // Reset form
      setFormData({
        productLink: '',
        productImage: '',
        size: '',
        color: '',
        quantity: 1,
        pricePerUnit: 0,
        currency: 'USD',
        additionalDetails: ''
      });
      setUploadedImage(null);
      setErrors({});
      // Removed the first success toast - only parent component should show success
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const formatPrice = (price: number, currency: string) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price);
    } catch (error) {
      const currencySymbols: Record<string, string> = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'TRY': '₺', 'JPY': '¥',
        'CAD': 'C$', 'AUD': 'A$', 'CHF': 'CHF', 'CNY': '¥', 'INR': '₹',
        'BRL': 'R$', 'MXN': 'MX$', 'KRW': '₩', 'SGD': 'S$', 'HKD': 'HK$',
        'NZD': 'NZ$', 'SEK': 'SEK', 'NOK': 'NOK', 'DKK': 'DKK', 'PLN': 'PLN',
        'CZK': 'CZK', 'HUF': 'HUF', 'RUB': '₽', 'ZAR': 'R', 'AED': 'AED',
        'SAR': 'SAR', 'EGP': 'EGP', 'ILS': '₪', 'THB': '฿', 'MYR': 'RM',
        'IDR': 'IDR', 'PHP': '₱', 'VND': '₫'
      };
      
      const symbol = currencySymbols[currency] || currency;
      return `${symbol}${price.toFixed(2)}`;
    }
  };

  const getColorSwatch = (color: string) => {
    const colorMap: Record<string, string> = {
      'black': '#000000', 'white': '#FFFFFF', 'red': '#EF4444', 'blue': '#3B82F6',
      'green': '#22C55E', 'yellow': '#F59E0B', 'purple': '#8B5CF6', 'pink': '#EC4899',
      'orange': '#F97316', 'brown': '#A3A3A3', 'gray': '#6B7280', 'grey': '#6B7280',
      'navy': '#1E3A8A', 'beige': '#F5F5DC', 'gold': '#FFD700', 'silver': '#C0C0C0',
      'rose gold': '#E8B4B8', 'maroon': '#800000', 'teal': '#14B8A6', 'coral': '#FF7F50',
      'lavender': '#E6E6FA', 'mint': '#98FB98', 'cream': '#FFFDD0'
    };
    
    return colorMap[color.toLowerCase()] || '#E5E7EB';
  };

  const totalCost = formData.pricePerUnit * formData.quantity;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Package className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {initialData ? 'Edit Product Request' : 'Submit Product Request'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Link */}
        <div>
          <label htmlFor="productLink" className="block text-sm font-medium text-gray-700 mb-2">
            Product Link *
          </label>
          <div className="relative">
            <input
              type="url"
              id="productLink"
              value={formData.productLink}
              onChange={(e) => handleInputChange('productLink', e.target.value)}
              className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.productLink ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://example.com/product"
              disabled={isLoading}
            />
            <Link className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
          {errors.productLink && (
            <p className="mt-1 text-sm text-red-600">{errors.productLink}</p>
          )}
        </div>

        {/* Product Image (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image (Optional)
          </label>
          {uploadedImage ? (
            <div className="relative inline-block">
              <img
                src={uploadedImage}
                alt="Product"
                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isLoading}
              />
              <label
                htmlFor="imageUpload"
                className="cursor-pointer flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
              >
                <Upload className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">Click to upload image</span>
              </label>
              <span className="text-xs text-gray-500">PNG, JPG, GIF (max 10MB)</span>
            </div>
          )}
        </div>

        {/* Size and Color Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Size */}
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
              Size (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                id="size"
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., M, Large, 10, One Size"
                disabled={isLoading}
              />
              <Ruler className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Color */}
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
              Color (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Black, Red, Blue"
                disabled={isLoading}
              />
              <Palette className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>
            {formData.color && (
              <div className="mt-2 flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: getColorSwatch(formData.color) }}
                />
                <span className="text-sm text-gray-600 capitalize">{formData.color}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quantity and Price Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                className="p-3 hover:bg-gray-100 transition-colors border-r border-gray-300"
                disabled={isLoading}
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                className="w-16 px-4 py-3 text-center border-0 focus:ring-0 focus:outline-none"
                min="1"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                className="p-3 hover:bg-gray-100 transition-colors border-l border-gray-300"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
            )}
          </div>

          {/* Price per Unit */}
          <div>
            <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700 mb-2">
              Price per Unit *
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                id="pricePerUnit"
                value={formData.pricePerUnit}
                onChange={(e) => handleInputChange('pricePerUnit', parseFloat(e.target.value) || 0)}
                className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.pricePerUnit ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={isLoading}
              />
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
            {errors.pricePerUnit && (
              <p className="mt-1 text-sm text-red-600">{errors.pricePerUnit}</p>
            )}
          </div>
        </div>

        {/* Additional Details */}
        <div>
          <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Details
          </label>
          <textarea
            id="additionalDetails"
            value={formData.additionalDetails}
            onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="Any additional information about the product, special requirements, or notes..."
            disabled={isLoading}
            maxLength={1000}
          />
          <p className="mt-1 text-xs text-gray-500">
            Optional: Add any special requirements or notes that will help us find the exact product you want
          </p>
        </div>

        {/* Total Cost Display */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Product Cost</h3>
              <p className="text-sm text-gray-600">
                {formData.quantity} × {formatPrice(formData.pricePerUnit, formData.currency)} = {formatPrice(totalCost, formData.currency)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(totalCost, formData.currency)}
              </div>
              <p className="text-xs text-gray-500">Initial price estimate</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {initialData ? 'Update Request' : 'Save'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}