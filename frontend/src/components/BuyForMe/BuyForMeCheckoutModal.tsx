'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BuyForMeRequest } from '@/types/unifiedBuyForMe';
import { useModernNotification } from '@/context/ModernNotificationContext';
import { 
  CreditCard, 
  X, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  User,
  Mail,
  MapPin,
  Phone,
  Shield,
  Truck,
  Percent,
  Package,
  Ruler,
  Palette
} from 'lucide-react';

interface BuyForMeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: BuyForMeRequest[];
  feeBreakdown: {
    subtotal: number;
    shipping: number;
    serviceFee: number;
    tax: number;
    discount: number;
    total: number;
  };
  onPaymentComplete: (paymentData: any) => void;
  isProcessing?: boolean;
}

interface PaymentFormData {
  paymentMethod: 'card' | 'paypal' | 'bank_transfer';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactInfo: {
    email: string;
    phone: string;
  };
  notes: string;
}

const BuyForMeCheckoutModal: React.FC<BuyForMeCheckoutModalProps> = ({
  isOpen,
  onClose,
  requests,
  feeBreakdown,
  onPaymentComplete,
  isProcessing = false
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    contactInfo: {
      email: '',
      phone: ''
    },
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { showNotification } = useModernNotification();

  // Auto-resize textarea when notes change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [formData.notes]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Card number must be at least 16 digits';
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV must be at least 3 digits';
    }

    if (!formData.billingAddress.street.trim()) {
      newErrors['billingAddress.street'] = 'Street address is required';
    }

    if (!formData.billingAddress.city.trim()) {
      newErrors['billingAddress.city'] = 'City is required';
    }

    if (!formData.billingAddress.state.trim()) {
      newErrors['billingAddress.state'] = 'State is required';
    }

    if (!formData.billingAddress.zipCode.trim()) {
      newErrors['billingAddress.zipCode'] = 'ZIP code is required';
    }

    if (!formData.contactInfo.email.trim()) {
      newErrors['contactInfo.email'] = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)) {
      newErrors['contactInfo.email'] = 'Please enter a valid email address';
    }

    if (!formData.contactInfo.phone.trim()) {
      newErrors['contactInfo.phone'] = 'Phone number is required';
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

    setIsSubmitting(true);

    try {
      const paymentData = {
        requests: requests.map(r => r._id),
        paymentMethod: formData.paymentMethod,
        paymentDetails: {
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          cardholderName: formData.cardholderName,
          billingAddress: formData.billingAddress,
          contactInfo: formData.contactInfo,
          notes: formData.notes
        },
        totalAmount: feeBreakdown.total,
        feeBreakdown
      };

      await onPaymentComplete(paymentData);
      
      showNotification('success', 'Payment completed successfully!');
      onClose();
    } catch (error: any) {
      console.error('Payment error:', error);
      showNotification('error', error.message || 'Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-2 animate-in fade-in-0">
      <div className="bg-white/90 backdrop-blur-2xl rounded-2xl max-w-5xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-white/30 animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Complete Payment</h2>
              <p className="text-xs text-gray-500">
                Secure checkout for {requests.length} item{requests.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
          {/* Left Column - Payment Form */}
          <div className="lg:w-1/2 p-4 border-r border-gray-200/50 overflow-y-auto custom-scrollbar flex flex-col">
            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {/* Payment Method Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Payment Method</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                { value: 'paypal', label: 'PayPal', icon: CreditCard },
                { value: 'bank_transfer', label: 'Bank Transfer', icon: CreditCard }
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <label
                    key={method.value}
                    className={`relative flex items-center p-2 border rounded-lg cursor-pointer transition-colors ${
                      formData.paymentMethod === method.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <Icon className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-xs font-medium text-gray-900">{method.label}</span>
                    {formData.paymentMethod === method.value && (
                      <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Card Details */}
          {formData.paymentMethod === 'card' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Card Details</h3>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`w-full px-2.5 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.cardholderName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.cardholderName && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.cardholderName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      e.target.value = formatted;
                      handleInputChange(e);
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full px-2.5 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.cardNumber && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) => {
                        const formatted = formatExpiryDate(e.target.value);
                        e.target.value = formatted;
                        handleInputChange(e);
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full px-2.5 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.expiryDate && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full px-2.5 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.cvv ? 'border-red-300' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.cvv && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing Address */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Billing Address</h3>
            
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="billingAddress.street"
                  value={formData.billingAddress.street}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  className={`w-full px-2.5 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors['billingAddress.street'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors['billingAddress.street'] && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors['billingAddress.street']}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="billingAddress.city"
                    value={formData.billingAddress.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    className={`w-full px-2.5 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors['billingAddress.city'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors['billingAddress.city'] && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors['billingAddress.city']}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="billingAddress.state"
                    value={formData.billingAddress.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                    className={`w-full px-2.5 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors['billingAddress.state'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors['billingAddress.state'] && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors['billingAddress.state']}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="billingAddress.zipCode"
                    value={formData.billingAddress.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    className={`w-full px-2.5 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors['billingAddress.zipCode'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors['billingAddress.zipCode'] && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors['billingAddress.zipCode']}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    name="billingAddress.country"
                    value={formData.billingAddress.country}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Contact Information</h3>
            
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={`w-full px-2.5 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors['contactInfo.email'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors['contactInfo.email'] && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors['contactInfo.email']}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className={`w-full px-2.5 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors['contactInfo.phone'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors['contactInfo.phone'] && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors['contactInfo.phone']}
                  </p>
                )}
              </div>
            </div>
          </div>

           {/* Additional Notes */}
           <div className="space-y-2">
             <h3 className="text-sm font-semibold text-gray-900">Additional Notes</h3>
             <textarea
               ref={textareaRef}
               name="notes"
               value={formData.notes}
               onChange={(e) => {
                 handleInputChange(e);
                 // Auto-resize textarea
                 const textarea = e.target;
                 textarea.style.height = 'auto';
                 textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'; // Max height of 120px
               }}
               placeholder="Any special instructions or notes for your order..."
               rows={2}
               className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none overflow-hidden transition-all duration-200 ease-in-out"
               disabled={isSubmitting}
               style={{ minHeight: '2.5rem', maxHeight: '120px' }}
             />
           </div>

            </form>
          </div>

          {/* Right Column - Products and Order Summary */}
          <div className="lg:w-1/2 p-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {/* Products List */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Your Items</h3>
                <div className="space-y-2">
                  {requests.map((request) => (
                    <div key={request._id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-gray-900 truncate">
                            Request #{request.requestNumber}
                          </h4>
                          <div className="text-xs text-gray-600 mt-1">
                            {request.items.length} item{request.items.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-gray-900">
                            {request.currency || 'USD'} {(request.totalAmount || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Items in this request */}
                      <div className="space-y-2 ml-10">
                        {request.items.map((item, index) => (
                          <div key={index} className="bg-white rounded-md p-2 border border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-medium text-gray-900 truncate">
                                  {item.name}
                                </h5>
                                <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                  {item.sizes?.[0] && (
                                    <div className="flex items-center gap-1">
                                      <Ruler className="w-3 h-3 text-gray-400" />
                                      <span>{item.sizes[0]}</span>
                                    </div>
                                  )}
                                  {item.colors?.[0] && (
                                    <div className="flex items-center gap-1">
                                      <Palette className="w-3 h-3 text-gray-400" />
                                      <span>{item.colors[0]}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Package className="w-3 h-3 text-gray-400" />
                                    <span>×{item.quantity}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0 ml-2">
                                <div className="text-xs font-medium text-gray-900">
                                  {item.currency || request.currency || 'USD'} {(item.price * item.quantity).toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.currency || request.currency || 'USD'} {item.price.toFixed(2)} each
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Order Summary</h3>
                
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">USD {feeBreakdown.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Truck className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">Shipping</span>
                    </div>
                    <span className="font-medium">USD {feeBreakdown.shipping.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">Service Fee (3%)</span>
                    </div>
                    <span className="font-medium">USD {feeBreakdown.serviceFee.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Percent className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">Tax (8%)</span>
                    </div>
                    <span className="font-medium">USD {feeBreakdown.tax.toFixed(2)}</span>
                  </div>
                  
                  {feeBreakdown.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-USD {feeBreakdown.discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        USD {feeBreakdown.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-green-900 mb-1">Secure Payment</h4>
                    <p className="text-xs text-green-700">
                      Your payment information is encrypted and processed securely. We use industry-standard 
                      SSL encryption to protect your data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || isProcessing}
            className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            {isSubmitting || isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Complete Payment - USD {feeBreakdown.total.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyForMeCheckoutModal;
