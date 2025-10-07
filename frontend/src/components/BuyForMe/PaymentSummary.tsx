'use client';

import React, { useState, useEffect } from 'react';
import { BuyForMeRequest } from '@/types/unifiedBuyForMe';
import { useModernNotification } from '@/context/ModernNotificationContext';
import { 
  CreditCard, 
  Tag, 
  Calculator, 
  Truck, 
  Shield, 
  Percent,
  X,
  Check,
  AlertCircle,
  Package,
  Ruler,
  Palette,
  Calendar,
  Eye,
  ShoppingBag,
  DollarSign,
  Info,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  MapPin
} from 'lucide-react';

interface PaymentSummaryProps {
  requests: BuyForMeRequest[];
  onPayment: (paymentData: any) => void;
  isProcessing: boolean;
  onViewDetails?: (request: BuyForMeRequest) => void;
  onShowCheckout?: (show: boolean) => void;
}

interface FeeBreakdown {
  subtotal: number;
  shipping: number;
  serviceFee: number;
  tax: number;
  discount: number;
  total: number;
}

interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  valid: boolean;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ 
  requests, 
  onPayment, 
  isProcessing,
  onViewDetails,
  onShowCheckout
}) => {
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [showItemDetails, setShowItemDetails] = useState<Set<string>>(new Set());
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown>({
    subtotal: 0,
    shipping: 0,
    serviceFee: 0,
    tax: 0,
    discount: 0,
    total: 0
  });

  const { showNotification } = useModernNotification();

  // Helper functions
  const toggleItemDetails = (requestId: string) => {
    const newDetails = new Set(showItemDetails);
    if (newDetails.has(requestId)) {
      newDetails.delete(requestId);
    } else {
      newDetails.add(requestId);
    }
    setShowItemDetails(newDetails);
  };

  const getTotalItems = () => {
    return requests.reduce((total, request) => total + request.items.length, 0);
  };

  const getTotalQuantity = () => {
    return requests.reduce((total, request) => 
      total + request.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0), 0
    );
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getEstimatedDelivery = () => {
    const now = new Date();
    const deliveryDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days from now
    return deliveryDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate total amount for selected requests
  const calculateSubtotal = () => {
    return selectedRequests.size > 0 ? Array.from(selectedRequests).reduce((total, requestId) => {
      const request = requests.find(r => r._id === requestId);
      if (!request) return total;

      // For BuyForMeRequest, calculate from items array
      const requestTotal = request.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return total + requestTotal;
    }, 0) : 0;
  };

  // Calculate fees based on subtotal
  const calculateFees = (subtotal: number) => {
    const shipping = subtotal > 0 ? Math.max(15, subtotal * 0.05) : 0; // $15 minimum or 5%
    const serviceFee = subtotal * 0.03; // 3% service fee
    const tax = subtotal * 0.08; // 8% tax
    const discount = appliedPromo ? 
      (appliedPromo.type === 'percentage' ? 
        subtotal * (appliedPromo.value / 100) : 
        appliedPromo.value) : 0;
    
    const total = subtotal + shipping + serviceFee + tax - discount;

    return {
      subtotal,
      shipping,
      serviceFee,
      tax,
      discount,
      total: Math.max(0, total)
    };
  };

  // Update fee breakdown when selection or promo changes
  useEffect(() => {
    const subtotal = calculateSubtotal();
    const fees = calculateFees(subtotal);
    setFeeBreakdown(fees);
  }, [selectedRequests, appliedPromo]);

  // Auto-select all requests when component mounts and keep them selected
  useEffect(() => {
    if (requests.length > 0) {
      setSelectedRequests(new Set(requests.map(r => r._id)));
    }
  }, [requests]);

  const handleRequestToggle = (requestId: string) => {
    const newSelection = new Set(selectedRequests);
    if (newSelection.has(requestId)) {
      newSelection.delete(requestId);
    } else {
      newSelection.add(requestId);
    }
    setSelectedRequests(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedRequests.size === requests.length) {
      setSelectedRequests(new Set());
    } else {
      setSelectedRequests(new Set(requests.map(r => r._id)));
    }
  };

  const handlePromoCodeSubmit = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    // Simulate promo code validation
    const validPromoCodes: Record<string, PromoCode> = {
      'WELCOME10': {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        description: '10% off your first order',
        valid: true
      },
      'SAVE20': {
        code: 'SAVE20',
        type: 'fixed',
        value: 20,
        description: '$20 off your order',
        valid: true
      },
      'FREESHIP': {
        code: 'FREESHIP',
        type: 'fixed',
        value: 15,
        description: 'Free shipping',
        valid: true
      }
    };

    const promo = validPromoCodes[promoCode.toUpperCase()];
    if (promo) {
      setAppliedPromo(promo);
      setPromoError('');
      showNotification('success', `Promo code "${promo.code}" applied successfully!`);
    } else {
      setPromoError('Invalid promo code');
      showNotification('error', 'Invalid promo code');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const handlePayment = () => {
    if (requests.length === 0) {
      showNotification('error', 'No requests available for payment');
      return;
    }

    // Show checkout modal instead of directly processing payment
    if (onShowCheckout) {
      onShowCheckout(true);
    } else {
      // Fallback to direct payment if modal is not available
      onPayment({
        requests: requests.map(r => r._id),
        paymentMethod: 'card',
        paymentDetails: {},
        totalAmount: feeBreakdown.total,
        feeBreakdown
      });
    }
  };


  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 border-b border-orange-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Payment Summary</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{getTotalItems()} items</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{requests.length} requests</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Est. delivery: {getEstimatedDelivery()}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <>
          {/* Enhanced Request List */}
          <div className="p-6">
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request._id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* Request Header */}
                  <div className="p-4 bg-white border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={() => onViewDetails?.(request)}
                          className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center cursor-pointer hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md"
                        >
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">Request #{request.requestNumber}</span>
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              <Check className="w-3 h-3" />
                              <span>Approved</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{request.shippingAddress.city}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(request.items.reduce((sum, item) => sum + (item.price * item.quantity), 0), request.currency)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {request.items.length} item{request.items.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {request.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-orange-200 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-sm font-semibold text-gray-900 truncate">
                                {item.name}
                              </h4>
                              {item.received && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  <Check className="w-3 h-3" />
                                  <span>Received</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              {item.sizes?.[0] && (
                                <div className="flex items-center gap-1">
                                  <Ruler className="w-3 h-3 text-gray-400" />
                                  <span className="font-medium">{item.sizes[0]}</span>
                                </div>
                              )}
                              {item.colors?.[0] && (
                                <div className="flex items-center gap-1">
                                  <Palette className="w-3 h-3 text-gray-400" />
                                  <span className="font-medium">{item.colors[0]}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Package className="w-3 h-3 text-gray-400" />
                                <span className="font-medium">Qty: {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <div className="text-sm font-bold text-gray-900">
                              {formatCurrency(item.price, item.currency || request.currency)} each
                            </div>
                            <div className="text-xs text-gray-500">
                              Total: {formatCurrency(item.price * item.quantity, item.currency || request.currency)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Promo Code Section */}
          <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-purple-600" />
              <h4 className="text-lg font-semibold text-gray-900">Promo Code</h4>
            </div>
            
            {appliedPromo ? (
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-green-800">{appliedPromo.code}</span>
                    <p className="text-sm text-green-600">{appliedPromo.description}</p>
                  </div>
                </div>
                <button
                  onClick={handleRemovePromo}
                  className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-green-600" />
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code (e.g., WELCOME10)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm placeholder-gray-400"
                  />
                  {promoError && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {promoError}
                    </p>
                  )}
                </div>
                <button
                  onClick={handlePromoCodeSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm font-semibold shadow-lg"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Enhanced Fee Breakdown */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">Fee Breakdown</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Subtotal</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(feeBreakdown.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Shipping</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(feeBreakdown.shipping)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Service Fee (3%)</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(feeBreakdown.serviceFee)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Percent className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Tax (8%)</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(feeBreakdown.tax)}
                </span>
              </div>

              {appliedPromo && (
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Tag className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-green-800">Discount ({appliedPromo.code})</span>
                  </div>
                  <span className="text-sm font-bold text-green-800">
                    -{formatCurrency(feeBreakdown.discount)}
                  </span>
                </div>
              )}

              <div className="border-t-2 border-gray-200 pt-3">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold">Total Amount</span>
                  </div>
                  <span className="text-2xl font-bold">
                    {formatCurrency(feeBreakdown.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Payment Button */}
          <div className="px-6 py-6 bg-gradient-to-r from-gray-50 to-gray-100">
            <button
              onClick={handlePayment}
              disabled={isProcessing || requests.length === 0}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
            >
              {isProcessing ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-6 h-6" />
                  <span>Pay Now - {formatCurrency(feeBreakdown.total)}</span>
                </>
              )}
            </button>
            
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-600" />
                <span>Trusted Service</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentSummary;
