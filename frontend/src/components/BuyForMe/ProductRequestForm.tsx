'use client';

import React, { useState } from 'react';
import { 
  X, Package, DollarSign, Palette, Ruler, Upload, Plus, Minus, 
  AlertCircle, CheckCircle, Link, ShoppingCart, Trash2,
  Eye, Heart, Share2, Star, MapPin, Calendar, Clock, Info,
  Tag, Weight, Ruler as RulerIcon, Layers, Shield, Store,
  Save, XCircle
} from 'lucide-react';

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

interface ProductRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductRequestFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'TRY', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR',
  'BRL', 'MXN', 'KRW', 'SGD', 'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN',
  'CZK', 'HUF', 'RUB', 'ZAR', 'AED', 'SAR', 'EGP', 'ILS', 'THB', 'MYR',
  'IDR', 'PHP', 'VND'
];

// Removed predefined options - users will enter manually

export default function ProductRequestForm({
  isOpen,
  onClose,
  onSave,
  onCancel,
  isLoading = false
}: ProductRequestFormProps) {
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
  const [showImageModal, setShowImageModal] = useState<boolean>(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const handleCancel = () => {
    onCancel();
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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div 
            className="fixed inset-0 animate-in fade-in-0 duration-300 bg-white bg-opacity-80 backdrop-blur-sm" 
            onClick={onClose} 
          />
          
          <div className="relative bg-white w-full max-w-4xl max-h-[95vh] overflow-hidden transform transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95 rounded-lg shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Save Product Form</h2>
                  <p className="text-sm text-orange-100 mt-1">
                    Fill in the details for the product you want to save
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Link */}
                <div>
                  <label htmlFor="productLink" className="block text-sm font-medium text-neutral-700 mb-2">
                    Product Link *
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      id="productLink"
                      value={formData.productLink}
                      onChange={(e) => handleInputChange('productLink', e.target.value)}
                      className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.productLink ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      placeholder="https://example.com/product"
                      disabled={isLoading}
                    />
                    <Link className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
                  </div>
                  {errors.productLink && (
                    <p className="mt-1 text-sm text-red-600">{errors.productLink}</p>
                  )}
                </div>

                {/* Product Image (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Product Image (Optional)
                  </label>
                  {uploadedImage ? (
                    <div className="relative inline-block">
                      <img
                        src={uploadedImage}
                        alt="Product"
                        className="w-32 h-32 object-cover rounded-lg border border-neutral-300 cursor-pointer"
                        onClick={() => setShowImageModal(true)}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
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
                        className="cursor-pointer flex items-center gap-2 p-3 border-2 border-dashed border-neutral-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all duration-200"
                      >
                        <Upload className="w-5 h-5 text-neutral-500" />
                        <span className="text-sm text-neutral-600">Click to upload image</span>
                      </label>
                      <span className="text-xs text-neutral-500">PNG, JPG, GIF (max 10MB)</span>
                    </div>
                  )}
                </div>

                {/* Size and Color Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Size */}
                  <div>
                    <label htmlFor="size" className="block text-sm font-medium text-neutral-700 mb-2">
                      Size (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="size"
                        value={formData.size}
                        onChange={(e) => handleInputChange('size', e.target.value)}
                        className="w-full px-4 py-3 pl-12 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., M, Large, 10, One Size"
                        disabled={isLoading}
                      />
                      <Ruler className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-neutral-700 mb-2">
                      Color (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="color"
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className="w-full px-4 py-3 pl-12 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Black, Red, Blue"
                        disabled={isLoading}
                      />
                      <Palette className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
                    </div>
                    {formData.color && (
                      <div className="mt-2 flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-neutral-300"
                          style={{ backgroundColor: getColorSwatch(formData.color) }}
                        />
                        <span className="text-sm text-neutral-600 capitalize">{formData.color}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity and Price Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Quantity *
                    </label>
                    <div className="flex items-center border border-neutral-300 rounded-lg w-fit">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        className="p-3 hover:bg-neutral-100 transition-colors border-r border-neutral-300"
                        disabled={isLoading}
                      >
                        <Minus className="w-4 h-4 text-neutral-600" />
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
                        className="p-3 hover:bg-neutral-100 transition-colors border-l border-neutral-300"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4 text-neutral-600" />
                      </button>
                    </div>
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                    )}
                  </div>

                  {/* Price per Unit */}
                  <div>
                    <label htmlFor="pricePerUnit" className="block text-sm font-medium text-neutral-700 mb-2">
                      Price per Unit *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        id="pricePerUnit"
                        value={formData.pricePerUnit}
                        onChange={(e) => handleInputChange('pricePerUnit', parseFloat(e.target.value) || 0)}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.pricePerUnit ? 'border-red-500' : 'border-neutral-300'
                        }`}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        disabled={isLoading}
                      />
                      <select
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  <label htmlFor="additionalDetails" className="block text-sm font-medium text-neutral-700 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    id="additionalDetails"
                    value={formData.additionalDetails}
                    onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Any additional information about the product, special requirements, or notes..."
                    disabled={isLoading}
                    maxLength={1000}
                  />
                  <p className="mt-1 text-xs text-neutral-500">
                    Optional: Add any special requirements or notes that will help us find the exact product you want
                  </p>
                </div>

                {/* Total Cost Display */}
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">Total Product Cost</h3>
                      <p className="text-sm text-neutral-600">
                        {formData.quantity} × {formatPrice(formData.pricePerUnit, formData.currency)} = {formatPrice(totalCost, formData.currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {formatPrice(totalCost, formData.currency)}
                      </div>
                      <p className="text-xs text-neutral-500">Initial price estimate</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-neutral-600 font-medium hover:bg-neutral-100 rounded-lg transition-colors flex items-center gap-2"
                disabled={isLoading}
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                form="product-form"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && uploadedImage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <img
              src={uploadedImage}
              alt="Product"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
