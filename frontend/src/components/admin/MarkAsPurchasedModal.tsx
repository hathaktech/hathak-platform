'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ShoppingCart, Calendar, FileText, Truck, CheckCircle, AlertCircle, Loader2, Building2, Package, Clock, ExternalLink, Copy, Check, StickyNote, DollarSign, CreditCard, MapPin, ChevronDown } from 'lucide-react';
import { BuyForMeRequest } from '@/types/unifiedBuyForMe';

interface MarkAsPurchasedModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: BuyForMeRequest | null;
  onMarkAsPurchased: (id: string, data: {
    supplier: string;
    purchaseOrderNumber?: string;
    estimatedDelivery?: string;
    notes?: string;
    purchaseAmount?: string;
    paymentMethod?: string;
    trackingNumber?: string;
    currency?: string;
    shippingAddress?: string;
  }) => Promise<void>;
}

const MarkAsPurchasedModal: React.FC<MarkAsPurchasedModalProps> = ({
  isOpen,
  onClose,
  request,
  onMarkAsPurchased
}) => {
  const [formData, setFormData] = useState({
    supplier: '',
    purchaseOrderNumber: '',
    estimatedDelivery: '',
    notes: '',
    purchaseAmount: '',
    paymentMethod: '',
    trackingNumber: '',
    currency: '',
    shippingAddress: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Common suppliers for autocomplete
  const commonSuppliers = [
    'Amazon', 'eBay', 'AliExpress', 'Walmart', 'Target', 'Best Buy',
    'Home Depot', 'Lowe\'s', 'Costco', 'Sam\'s Club', 'Macy\'s',
    'Nike', 'Adidas', 'Apple Store', 'Microsoft Store', 'Google Store'
  ];

  // Payment methods
  const paymentMethods = [
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'Cash', value: 'cash' }
  ];

  // Common currencies
  const currencies = [
    'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR', 'AED', 'SAR'
  ];

  // Helper function to get payment method label
  const getPaymentMethodLabel = (value: string) => {
    const method = paymentMethods.find(m => m.value === value);
    return method ? method.label : value;
  };

  const [supplierSuggestions, setSupplierSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [copiedLinks, setCopiedLinks] = useState<Set<string>>(new Set());
  const [showDeliveryCalendar, setShowDeliveryCalendar] = useState(false);
  const deliveryCalendarRef = useRef<HTMLDivElement>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Calculate total required checks
  const getTotalRequiredChecks = () => {
    if (!request) return 0;
    let total = 0;
    request.items.forEach((item, index) => {
      // Always required: quantity, size, color
      total += 3;
      // Conditionally required: brand, notes, category (only if they exist)
      if (item.brand) total += 1;
      if (item.notes) total += 1;
      if (item.category) total += 1;
    });
    return total;
  };

  const totalRequiredChecks = getTotalRequiredChecks();
  const allCardsChecked = checkedItems.size >= totalRequiredChecks;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        supplier: '',
        purchaseOrderNumber: '',
        estimatedDelivery: '',
        notes: '',
        purchaseAmount: '',
        paymentMethod: '',
        trackingNumber: '',
        currency: request?.currency || 'USD',
        shippingAddress: ''
      });
      setErrors({});
      setShowSuccess(false);
      setCopiedLinks(new Set());
      setCheckedItems(new Set());
    }
  }, [isOpen, request?.currency]);

  // Handle click outside calendar dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deliveryCalendarRef.current && !deliveryCalendarRef.current.contains(event.target as Node)) {
        setShowDeliveryCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format date to DD/MM/YY
  const formatDateToDDMMYY = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Parse DD/MM/YY to Date
  const parseDDMMYYToDate = (dateStr: string) => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{2})$/;
    const match = dateStr.match(dateRegex);
    if (match) {
      const [, day, month, year] = match;
      const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
      return new Date(fullYear, parseInt(month) - 1, parseInt(day));
    }
    return null;
  };

  // Generate calendar days
  const generateCalendarDays = (year: number, month: number, minDate?: Date, maxDate?: Date) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const isDisabled = (minDate && currentDate < minDate) || (maxDate && currentDate > maxDate);
      days.push({
        day,
        date: currentDate,
        disabled: isDisabled
      });
    }
    
    return days;
  };

  // Handle supplier input with autocomplete
  const handleSupplierChange = (value: string) => {
    setFormData(prev => ({ ...prev, supplier: value }));
    setErrors(prev => ({ ...prev, supplier: '' }));
    
    if (value.length > 0) {
      const filtered = commonSuppliers.filter(supplier =>
        supplier.toLowerCase().includes(value.toLowerCase())
      );
      setSupplierSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSupplier = (supplier: string) => {
    setFormData(prev => ({ ...prev, supplier }));
    setShowSuggestions(false);
  };

  // Copy link to clipboard
  const copyToClipboard = async (url: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLinks(prev => new Set([...prev, itemId]));
      setTimeout(() => {
        setCopiedLinks(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier name is required';
    } else if (formData.supplier.trim().length < 2) {
      newErrors.supplier = 'Supplier name must be at least 2 characters';
    }

    if (!formData.purchaseOrderNumber.trim()) {
      newErrors.purchaseOrderNumber = 'Purchase order number is required';
    } else if (formData.purchaseOrderNumber.length > 50) {
      newErrors.purchaseOrderNumber = 'Purchase order number must be less than 50 characters';
    }

    if (formData.estimatedDelivery) {
      // Validate DD/MM/YY format
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{2})$/;
      const match = formData.estimatedDelivery.match(dateRegex);
      
      if (!match) {
        newErrors.estimatedDelivery = 'Please enter date in DD/MM/YY format';
      } else {
        const [, day, month, year] = match;
        const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
        const deliveryDate = new Date(fullYear, parseInt(month) - 1, parseInt(day));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (deliveryDate < today) {
          newErrors.estimatedDelivery = 'Estimated delivery cannot be in the past';
        }
      }
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes must be less than 500 characters';
    }

    if (formData.purchaseAmount && isNaN(Number(formData.purchaseAmount))) {
      newErrors.purchaseAmount = 'Purchase amount must be a valid number';
    }

    if (!formData.trackingNumber.trim()) {
      newErrors.trackingNumber = 'Tracking number is required';
    } else if (formData.trackingNumber.length > 100) {
      newErrors.trackingNumber = 'Tracking number must be less than 100 characters';
    }

    if (formData.shippingAddress && formData.shippingAddress.length > 500) {
      newErrors.shippingAddress = 'Shipping address must be less than 500 characters';
    }

    // Check if all specification cards are checked
    if (!allCardsChecked) {
      newErrors.specificationCards = `Please verify all item specifications (${checkedItems.size}/${totalRequiredChecks} checked)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!request) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert DD/MM/YY format to ISO format for backend
      const convertDateToISO = (dateStr: string) => {
        if (!dateStr) return undefined;
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{2})$/;
        const match = dateStr.match(dateRegex);
        if (match) {
          const [, day, month, year] = match;
          const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
          return new Date(fullYear, parseInt(month) - 1, parseInt(day)).toISOString();
        }
        return undefined;
      };

      await onMarkAsPurchased(request._id, {
        supplier: formData.supplier.trim(),
        purchaseOrderNumber: formData.purchaseOrderNumber.trim() || undefined,
        estimatedDelivery: convertDateToISO(formData.estimatedDelivery),
        notes: formData.notes.trim() || undefined,
        purchaseAmount: formData.purchaseAmount.trim() || undefined,
        paymentMethod: formData.paymentMethod.trim() || undefined,
        trackingNumber: formData.trackingNumber.trim() || undefined,
        currency: formData.currency.trim() || undefined,
        shippingAddress: formData.shippingAddress.trim() || undefined
      });
      
      setShowSuccess(true);
      
      // Reset form after a brief success display
      setTimeout(() => {
        setFormData({
          supplier: '',
          purchaseOrderNumber: '',
          estimatedDelivery: '',
          notes: '',
          purchaseAmount: '',
          paymentMethod: '',
          trackingNumber: '',
          currency: request?.currency || 'USD',
          shippingAddress: ''
        });
        setShowSuccess(false);
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error marking as purchased:', error);
      setErrors({ submit: 'Failed to mark as purchased. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    
    setFormData({
      supplier: '',
      purchaseOrderNumber: '',
      estimatedDelivery: '',
      notes: '',
      purchaseAmount: '',
      paymentMethod: '',
      trackingNumber: '',
      currency: request?.currency || 'USD',
      shippingAddress: ''
    });
    setErrors({});
    setShowSuccess(false);
    setShowSuggestions(false);
    onClose();
  };


  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 z-50 animate-in fade-in duration-200">
      <div className="bg-white/98 backdrop-blur-md rounded-xl shadow-2xl border border-white/30 w-full max-w-7xl max-h-[95vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 flex flex-col">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-4 py-3 relative overflow-hidden flex-shrink-0">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/3 rounded-full -translate-y-10 translate-x-10"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-white/15 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg">
                <ShoppingCart className="h-4 w-4 text-white drop-shadow-sm" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-white drop-shadow-sm">Mark as Purchased</h3>
                <p className="text-blue-100/80 text-xs font-medium">Record purchase details</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-white/80 hover:text-white transition-all duration-200 p-1.5 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Top Section: Request Info - Full Width */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-blue-50/40 border-b border-slate-200/60">
            <div className="space-y-3">
              {/* Request Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Package className="h-4 w-4 text-white drop-shadow-sm" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Request #{request.requestNumber}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">
                      {request.customerName} • {request.items.length} item{request.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-blue-700 bg-blue-100/60 px-2 py-1 rounded-lg border border-blue-200/50">
                    {request.totalAmount} {request.currency}
                  </p>
                </div>
              </div>

              {/* Customer & Request Details - Compact */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-green-600">U</span>
                    </div>
                    <span className="text-slate-600">
                      {request.customerName || 'Unknown User'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-500">
                      {new Date(request.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-600 font-medium">
                      {request.totalAmount} {request.currency}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-500">
                      {getPaymentMethodLabel(request.paymentMethod || '') || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Instructions - Compact */}
              {request.specialInstructions && (
                <div className="bg-white/60 rounded-lg p-2 border border-slate-200/50">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center">
                      <StickyNote className="h-3 w-3 text-orange-600" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Special Instructions</span>
                  </div>
                  <p className="text-xs text-slate-600 ml-6 leading-relaxed">
                    {request.specialInstructions}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-0">
            {/* Left Column: Product Details & Links - Fixed Width */}
            <div className="border-b lg:border-b-0 lg:border-r border-slate-200/60">
              {/* Requested Items Section */}
              <div className="px-2 py-2 bg-gradient-to-r from-indigo-50/80 to-purple-50/60 border-b border-indigo-200/60">
                <div className="flex items-center space-x-1.5 mb-1.5">
                  <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Package className="h-3 w-3 text-white drop-shadow-sm" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-800">Requested Items</h5>
                  <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                    {request.items.length}
                  </span>
                  {checkedItems.size > 0 && (
                    <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${
                      allCardsChecked 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      ✓ {checkedItems.size}/{totalRequiredChecks}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                {request.items.map((item, index) => (
                  <div key={index} className="bg-white/80 rounded-md p-1.5 border border-indigo-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h6 className="text-xs font-bold text-slate-800 truncate">
                          {item.name || `Item ${index + 1}`}
                        </h6>
                        {item.description && (
                          <p className="text-xs text-slate-600 line-clamp-1 mb-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <p className="text-xs font-bold text-slate-800">
                          {item.price ? `${item.price} ${request.currency}` : 'TBD'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Specification Cards - Toggleable */}
                    <div className="grid grid-cols-3 gap-1">
                      {/* Quantity Card */}
                      <div 
                        className={`rounded p-1 border transition-all duration-200 cursor-pointer ${
                          checkedItems.has(`${index}-quantity`) 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-blue-50 border-blue-200/50 hover:bg-blue-100'
                        }`}
                        onClick={() => {
                          const key = `${index}-quantity`;
                          setCheckedItems(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(key)) {
                              newSet.delete(key);
                            } else {
                              newSet.add(key);
                            }
                            return newSet;
                          });
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-600">Qty</span>
                          <div className="flex items-center space-x-0.5">
                            <span className="text-xs font-bold text-slate-800">{item.quantity || 1}</span>
                            {checkedItems.has(`${index}-quantity`) && (
                              <Check className="h-2.5 w-2.5 text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Size Card */}
                      <div 
                        className={`rounded p-1 border transition-all duration-200 cursor-pointer ${
                          checkedItems.has(`${index}-size`) 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-purple-50 border-purple-200/50 hover:bg-purple-100'
                        }`}
                        onClick={() => {
                          const key = `${index}-size`;
                          setCheckedItems(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(key)) {
                              newSet.delete(key);
                            } else {
                              newSet.add(key);
                            }
                            return newSet;
                          });
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-600">Size</span>
                          <div className="flex items-center space-x-0.5">
                            <span className="text-xs font-bold text-slate-800">{item.size || 'N/A'}</span>
                            {checkedItems.has(`${index}-size`) && (
                              <Check className="h-2.5 w-2.5 text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Color Card */}
                      <div 
                        className={`rounded p-1 border transition-all duration-200 cursor-pointer ${
                          checkedItems.has(`${index}-color`) 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-orange-50 border-orange-200/50 hover:bg-orange-100'
                        }`}
                        onClick={() => {
                          const key = `${index}-color`;
                          setCheckedItems(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(key)) {
                              newSet.delete(key);
                            } else {
                              newSet.add(key);
                            }
                            return newSet;
                          });
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-600">Color</span>
                          <div className="flex items-center space-x-0.5">
                            <span className="text-xs font-bold text-slate-800 truncate">{item.color || 'N/A'}</span>
                            {checkedItems.has(`${index}-color`) && (
                              <Check className="h-2.5 w-2.5 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Brand Card */}
                      {item.brand && (
                        <div 
                          className={`rounded p-1 border transition-all duration-200 cursor-pointer ${
                            checkedItems.has(`${index}-brand`) 
                              ? 'bg-green-50 border-green-300' 
                              : 'bg-pink-50 border-pink-200/50 hover:bg-pink-100'
                          }`}
                          onClick={() => {
                            const key = `${index}-brand`;
                            setCheckedItems(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(key)) {
                                newSet.delete(key);
                              } else {
                                newSet.add(key);
                              }
                              return newSet;
                            });
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-600">Brand</span>
                            <div className="flex items-center space-x-0.5">
                              <span className="text-xs font-bold text-slate-800 truncate">{item.brand}</span>
                              {checkedItems.has(`${index}-brand`) && (
                                <Check className="h-2.5 w-2.5 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Category Card */}
                      {item.category && (
                        <div 
                          className={`rounded p-1 border transition-all duration-200 cursor-pointer ${
                            checkedItems.has(`${index}-category`) 
                              ? 'bg-green-50 border-green-300' 
                              : 'bg-indigo-50 border-indigo-200/50 hover:bg-indigo-100'
                          }`}
                          onClick={() => {
                            const key = `${index}-category`;
                            setCheckedItems(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(key)) {
                                newSet.delete(key);
                              } else {
                                newSet.add(key);
                              }
                              return newSet;
                            });
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-600">Type</span>
                            <div className="flex items-center space-x-0.5">
                              <span className="text-xs font-bold text-slate-800 truncate">{item.category}</span>
                              {checkedItems.has(`${index}-category`) && (
                                <Check className="h-2.5 w-2.5 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notes Card - Full Width */}
                      {item.notes && (
                        <div 
                          className={`rounded p-1 border transition-all duration-200 cursor-pointer col-span-3 ${
                            checkedItems.has(`${index}-notes`) 
                              ? 'bg-green-50 border-green-300' 
                              : 'bg-yellow-50 border-yellow-200/50 hover:bg-yellow-100'
                          }`}
                          onClick={() => {
                            const key = `${index}-notes`;
                            setCheckedItems(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(key)) {
                                newSet.delete(key);
                              } else {
                                newSet.add(key);
                              }
                              return newSet;
                            });
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-1">
                              <StickyNote className="h-2.5 w-2.5 text-yellow-600 flex-shrink-0" />
                              <span className="text-xs font-medium text-slate-600">Notes:</span>
                              <span className="text-xs text-slate-700 line-clamp-1">{item.notes}</span>
                            </div>
                            {checkedItems.has(`${index}-notes`) && (
                              <Check className="h-2.5 w-2.5 text-green-600 flex-shrink-0 ml-1" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                </div>
                {errors.specificationCards && (
                  <div className="mt-1.5 p-1.5 bg-red-50 border border-red-200 rounded">
                    <p className="text-xs text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.specificationCards}
                    </p>
                  </div>
                )}
              </div>

              {/* Product Links Section */}
              <div className="px-2 py-2 bg-gradient-to-r from-blue-50/80 to-indigo-50/60">
                <div className="flex items-center space-x-1.5 mb-1.5">
                  <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                    <ExternalLink className="h-3 w-3 text-white drop-shadow-sm" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-800">Product Links</h5>
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    Purchase
                  </span>
                </div>
                <div className="space-y-1.5">
                  {request.items.map((item, index) => (
                    <div key={index} className="bg-white/90 backdrop-blur-sm rounded-md p-1.5 border border-blue-200/60 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h6 className="text-xs font-bold text-slate-800 truncate flex-1">
                            {item.name || `Item ${index + 1}`}
                          </h6>
                          <p className="text-xs text-slate-600 ml-2 flex-shrink-0">
                            {item.price ? `${item.price} ${request.currency}` : 'TBD'}
                          </p>
                        </div>
                        {item.url && (
                          <div className="flex space-x-1">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-2 py-1 rounded hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-center font-semibold"
                            >
                              Open Link
                            </a>
                            <button
                              onClick={() => copyToClipboard(item.url, `link-${index}`)}
                              className="bg-slate-600 text-white text-xs px-2 py-1 rounded hover:bg-slate-700 transition-all duration-200"
                            >
                              {copiedLinks.has(`link-${index}`) ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Purchase Form Fields */}
            <div className="bg-gradient-to-r from-slate-50/80 to-blue-50/60">
              {/* Enhanced Success State */}
              {showSuccess && (
                <div className="px-4 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200/50 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500 rounded-full animate-pulse">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <p className="text-green-800 font-semibold text-sm">Order marked as purchased successfully!</p>
                  </div>
                </div>
              )}

              {/* Purchase Form Fields - Two Columns */}
              <div className="px-4 py-3 space-y-3">
                {/* Form Grid Layout - 2 Columns */}
                <div className="grid grid-cols-2 gap-3">
              {/* Supplier Field */}
              <div className="group">
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center">
                  <Building2 className="h-3 w-3 mr-1 text-blue-600" />
                  Supplier Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => handleSupplierChange(e.target.value)}
                    onFocus={() => formData.supplier && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Amazon, eBay, etc."
                    className={`w-full px-2 py-1.5 border-2 rounded-lg focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-medium text-xs bg-white/80 hover:bg-white ${
                      errors.supplier 
                        ? 'border-red-300 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  
                  {/* Autocomplete Suggestions */}
                  {showSuggestions && supplierSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg shadow-xl max-h-24 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                      {supplierSuggestions.map((supplier, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectSupplier(supplier)}
                          className="w-full px-2 py-1 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 font-medium text-slate-700 hover:text-blue-700 text-xs"
                        >
                          {supplier}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.supplier && (
                  <p className="mt-1 text-xs text-red-600 flex items-center animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.supplier}
                  </p>
                )}
              </div>

              {/* Purchase Order Number */}
              <div className="group">
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center">
                  <FileText className="h-3 w-3 mr-1 text-blue-600" />
                  PO Number
                  <span className="text-red-500 text-xs ml-1 font-normal">*</span>
                </label>
                <input
                  type="text"
                  value={formData.purchaseOrderNumber}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, purchaseOrderNumber: e.target.value }));
                    setErrors(prev => ({ ...prev, purchaseOrderNumber: '' }));
                  }}
                  placeholder="Order reference"
                  className={`w-full px-2 py-1.5 border-2 rounded-lg focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-medium text-xs bg-white/80 hover:bg-white ${
                    errors.purchaseOrderNumber 
                      ? 'border-red-300 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.purchaseOrderNumber && (
                  <p className="mt-1 text-xs text-red-600 flex items-center animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.purchaseOrderNumber}
                  </p>
                )}
              </div>

              {/* Estimated Delivery */}
              <div className="group">
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-blue-600" />
                  Delivery Date
                  <span className="text-slate-500 text-xs ml-1 font-normal">(Optional)</span>
                </label>
                <div className="relative" ref={deliveryCalendarRef}>
                  <input
                    type="text"
                    value={formData.estimatedDelivery}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only digits and forward slashes
                      const cleaned = value.replace(/[^\d/]/g, '');
                      // Auto-format as DD/MM/YY
                      let formatted = cleaned;
                      if (cleaned.length >= 2 && !cleaned.includes('/')) {
                        formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
                      }
                      if (formatted.length >= 5 && formatted.split('/').length === 2) {
                        formatted = formatted.slice(0, 5) + '/' + formatted.slice(5, 7);
                      }
                      if (formatted.length > 8) {
                        formatted = formatted.slice(0, 8);
                      }
                      setFormData(prev => ({ ...prev, estimatedDelivery: formatted }));
                      setErrors(prev => ({ ...prev, estimatedDelivery: '' }));
                    }}
                    placeholder="DD/MM/YY"
                    className={`w-full px-2 py-1.5 pr-8 border-2 rounded-lg focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-medium text-xs bg-white/80 hover:bg-white ${
                      errors.estimatedDelivery 
                        ? 'border-red-300 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeliveryCalendar(!showDeliveryCalendar)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  
                  {/* Calendar Dropdown */}
                  {showDeliveryCalendar && (
                    <div className="absolute z-20 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl p-3 w-64">
                      <div className="text-center mb-2">
                        <div className="flex items-center justify-between mb-2">
                          <button
                            type="button"
                            onClick={() => {
                              const currentDate = parseDDMMYYToDate(formData.estimatedDelivery) || new Date();
                              const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                              setFormData(prev => ({ ...prev, estimatedDelivery: formatDateToDDMMYY(newDate) }));
                            }}
                            className="p-1 hover:bg-slate-100 rounded"
                          >
                            <ChevronDown className="h-3 w-3 rotate-90" />
                          </button>
                          <span className="text-xs font-semibold">
                            {(() => {
                              const currentDate = parseDDMMYYToDate(formData.estimatedDelivery) || new Date();
                              return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                            })()}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const currentDate = parseDDMMYYToDate(formData.estimatedDelivery) || new Date();
                              const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
                              setFormData(prev => ({ ...prev, estimatedDelivery: formatDateToDDMMYY(newDate) }));
                            }}
                            className="p-1 hover:bg-slate-100 rounded"
                          >
                            <ChevronDown className="h-3 w-3 -rotate-90" />
                          </button>
                        </div>
                        
                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 text-xs">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                            <div key={`day-${index}`} className="p-1 text-center font-semibold text-slate-500">
                              {day}
                            </div>
                          ))}
                          {(() => {
                            const currentDate = parseDDMMYYToDate(formData.estimatedDelivery) || new Date();
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return generateCalendarDays(currentDate.getFullYear(), currentDate.getMonth(), today);
                          })().map((dayData, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                if (dayData && !dayData.disabled) {
                                  setFormData(prev => ({ ...prev, estimatedDelivery: formatDateToDDMMYY(dayData.date) }));
                                  setShowDeliveryCalendar(false);
                                }
                              }}
                              disabled={!dayData || dayData.disabled}
                              className={`p-1 text-xs rounded hover:bg-blue-100 ${
                                dayData?.disabled 
                                  ? 'text-slate-300 cursor-not-allowed' 
                                  : 'text-slate-700 hover:text-blue-700'
                              } ${
                                dayData && formatDateToDDMMYY(dayData.date) === formData.estimatedDelivery
                                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                                  : ''
                              }`}
                            >
                              {dayData?.day || ''}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {errors.estimatedDelivery && (
                  <p className="mt-1 text-xs text-red-600 flex items-center animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.estimatedDelivery}
                  </p>
                )}
              </div>
            </div>

                {/* Additional Purchase Details */}
                <div className="grid grid-cols-2 gap-3">
              {/* Purchase Amount */}
              <div className="group">
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center">
                  <DollarSign className="h-3 w-3 mr-1 text-blue-600" />
                  Purchase Amount
                  <span className="text-slate-500 text-xs ml-1 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.purchaseAmount}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, purchaseAmount: e.target.value }));
                    setErrors(prev => ({ ...prev, purchaseAmount: '' }));
                  }}
                  placeholder="0.00"
                  className={`w-full px-2 py-1.5 border-2 rounded-lg focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-medium text-xs bg-white/80 hover:bg-white ${
                    errors.purchaseAmount 
                      ? 'border-red-300 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.purchaseAmount && (
                  <p className="mt-1 text-xs text-red-600 flex items-center animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.purchaseAmount}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="group">
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center">
                  <CreditCard className="h-3 w-3 mr-1 text-blue-600" />
                  Payment Method
                  <span className="text-slate-500 text-xs ml-1 font-normal">(Optional)</span>
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, paymentMethod: e.target.value }));
                    setErrors(prev => ({ ...prev, paymentMethod: '' }));
                  }}
                  className={`w-full px-2 py-1.5 border-2 rounded-lg focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-medium text-xs bg-white/80 hover:bg-white ${
                    errors.paymentMethod 
                      ? 'border-red-300 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select payment method</option>
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
                {errors.paymentMethod && (
                  <p className="mt-1 text-xs text-red-600 flex items-center animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.paymentMethod}
                  </p>
                )}
              </div>

              {/* Currency */}
              <div className="group">
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center">
                  <DollarSign className="h-3 w-3 mr-1 text-blue-600" />
                  Currency
                  <span className="text-slate-500 text-xs ml-1 font-normal">(Optional)</span>
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, currency: e.target.value }));
                    setErrors(prev => ({ ...prev, currency: '' }));
                  }}
                  className={`w-full px-2 py-1.5 border-2 rounded-lg focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-medium text-xs bg-white/80 hover:bg-white ${
                    errors.currency 
                      ? 'border-red-300 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select currency</option>
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
                {errors.currency && (
                  <p className="mt-1 text-xs text-red-600 flex items-center animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.currency}
                  </p>
                )}
              </div>
            </div>

                {/* Tracking Number */}
                <div className="grid grid-cols-2 gap-3">
              <div className="group">
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center">
                  <Truck className="h-3 w-3 mr-1 text-blue-600" />
                  Tracking Number
                  <span className="text-red-500 text-xs ml-1 font-normal">*</span>
                </label>
                <input
                  type="text"
                  value={formData.trackingNumber}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, trackingNumber: e.target.value }));
                    setErrors(prev => ({ ...prev, trackingNumber: '' }));
                  }}
                  placeholder="Tracking number"
                  className={`w-full px-2 py-1.5 border-2 rounded-lg focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-medium text-xs bg-white/80 hover:bg-white ${
                    errors.trackingNumber 
                      ? 'border-red-300 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.trackingNumber && (
                  <p className="mt-1 text-xs text-red-600 flex items-center animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.trackingNumber}
                  </p>
                )}
              </div>

            </div>

                {/* Shipping Address - Full Width */}
                <div className="grid grid-cols-1 gap-3">
                <div className="group col-span-2">
                  <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-blue-600" />
                    Shipping Address
                    <span className="text-slate-500 text-xs ml-1 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.shippingAddress}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, shippingAddress: e.target.value }));
                      setErrors(prev => ({ ...prev, shippingAddress: '' }));
                    }}
                    placeholder="Enter shipping address"
                    rows={2}
                    className={`w-full px-2 py-1.5 border-2 rounded-lg focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-medium resize-none text-xs bg-white/80 hover:bg-white ${
                      errors.shippingAddress 
                        ? 'border-red-300 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  <div className="mt-1 flex justify-between items-center">
                    {errors.shippingAddress && (
                      <p className="text-xs text-red-600 flex items-center animate-in slide-in-from-top-1 duration-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.shippingAddress}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 ml-auto">
                      {(formData.shippingAddress || '').length}/500
                    </p>
                  </div>
                </div>

                {/* Notes Field - Full Width */}
                <div className="group col-span-2">
                  <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center">
                    <StickyNote className="h-3 w-3 mr-1 text-blue-600" />
                    Purchase Notes
                    <span className="text-slate-500 text-xs ml-1 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, notes: e.target.value }));
                      setErrors(prev => ({ ...prev, notes: '' }));
                    }}
                    placeholder="Special instructions, tracking info, etc."
                    rows={2}
                    className={`w-full px-2 py-1.5 border-2 rounded-lg focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-medium resize-none text-xs bg-white/80 hover:bg-white ${
                      errors.notes 
                        ? 'border-red-300 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  <div className="mt-1 flex justify-between items-center">
                    {errors.notes && (
                      <p className="text-xs text-red-600 flex items-center animate-in slide-in-from-top-1 duration-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.notes}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 ml-auto">
                      {(formData.notes || '').length}/500
                    </p>
                  </div>
                </div>

                </div>

                {/* Enhanced Submit Error - Full Width */}
                {errors.submit && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-lg p-3 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-red-800 text-sm flex items-center font-medium">
                      <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                      {errors.submit}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pinned Action Buttons Footer */}
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-3 bg-white border-t-2 border-slate-200/60 flex-shrink-0 shadow-lg">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border-2 border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.supplier.trim() || !allCardsChecked}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Purchased
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkAsPurchasedModal;
