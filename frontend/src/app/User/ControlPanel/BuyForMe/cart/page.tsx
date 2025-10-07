'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useModernNotification } from '@/context/ModernNotificationContext';
import { useBuyForMeCart } from '@/context/BuyForMeCartContext';
import { useAddresses } from '@/context/AddressContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import BuyMeForm from '@/components/BuyForMe/BuyForMeForm';
import { 
  submitCartForPurchase,
  BuyForMeCartItem,
  CreateCartItemData,
  UpdateCartItemData
} from '@/services/buyForMeCartApi';
import { userBuyForMeApi } from '@/services/unifiedBuyForMeApi';
import { 
  Package, 
  Plus, 
  ArrowLeft,
  ShoppingCart,
  Edit3,
  ExternalLink,
  Eye,
  Trash2,
  X,
  GripVertical,
  CheckCircle,
  DollarSign,
  CreditCard,
  Truck,
  Shield,
  MapPin,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function BuyForMeCartPage() {
  const { items: cartItems, isLoading: loading, addCartItem, updateCartItem, removeCartItem, loadCartItems } = useBuyForMeCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BuyForMeCartItem | null>(null);
  const [showAddProductsModal, setShowAddProductsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    proceedWithRemaining: false,
    cancelEntireOrder: false,
    confirmRestrictions: false
  });
  const [showRequestPreview, setShowRequestPreview] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [shippingDetails, setShippingDetails] = useState({
    warehouse: 'HatHak Main Warehouse',
    address: '123 Commerce Street, Business District, City 12345',
    shipmentType: 'Standard Shipping'
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [manualAddress, setManualAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  const { isAuthenticated, user } = useAuth();
  const { showNotification } = useModernNotification();
  const { addresses, getDefaultAddress, addAddress } = useAddresses();

  // Derive activeCartItems and productsToConfirm from cartItems
  const activeCartItems = cartItems.filter(item => item.status === 'active' && item.isActive);
  const productsToConfirm = cartItems.filter(item => item.status === 'submitted');


  const handleAddProduct = () => {
    setShowForm(true);
  };

  const handleEditProduct = (product: BuyForMeCartItem) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await removeCartItem(productId);
      showNotification('success', 'Product deleted successfully!');
    } catch (err: any) {
      console.error('Delete product error:', err);
      let errorMessage = 'Failed to delete product';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      showNotification('error', errorMessage);
    }
  };

  const handleViewDetails = (product: BuyForMeCartItem) => {
    console.log('Viewing details for product:', product.productName);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      
      if (editingProduct) {
        // Update existing product
        await updateCartItem(editingProduct._id, data);
        showNotification('success', 'Product updated successfully!');
      } else {
        // Create new product
        await addCartItem(data);
        showNotification('success', 'Product added to your cart successfully!');
      }
      
      // Close the form
      setShowForm(false);
      setEditingProduct(null);
    } catch (err: any) {
      console.error('Form submission error:', err);
      showNotification('error', 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };


  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showNotification('error', 'Please add products to your cart first');
      return;
    }
    setShowRequestPreview(true);
  };

  const handleCloseRequestPreview = () => {
    setShowRequestPreview(false);
    // Clear any applied promo code when exiting
    setAppliedPromoCode(null);
    setPromoDiscount(0);
    setPromoCode('');
    // Clear all confirmation data when closing
    setConfirmationData({
      proceedWithRemaining: false,
      cancelEntireOrder: false,
      confirmRestrictions: false
    });
  };

  const handleConfirmationChange = (field: keyof typeof confirmationData) => {
    if (field === 'proceedWithRemaining') {
      setConfirmationData(prev => ({
        ...prev,
        proceedWithRemaining: true,
        cancelEntireOrder: false
      }));
    } else if (field === 'cancelEntireOrder') {
      setConfirmationData(prev => ({
        ...prev,
        proceedWithRemaining: false,
        cancelEntireOrder: true
      }));
    } else if (field === 'confirmRestrictions') {
      setConfirmationData(prev => ({
        ...prev,
        confirmRestrictions: !prev.confirmRestrictions
      }));
    }
  };


  const handleSubmitOrder = async () => {
    if (!user || !selectedAddressId) {
      showNotification('error', 'Please select a shipping address');
      return;
    }

    // Get the selected address object
    const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);
    if (!selectedAddress) {
      showNotification('error', 'Selected address not found');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Convert cart items to unified request format
      const items = cartItems.map((product) => ({
        name: product.productName,
        url: product.productLink,
        quantity: product.quantity,
        price: product.estimatedPrice,
        currency: product.currency,
        description: product.notes || '',
        sizes: product.sizes || [],
        colors: product.colors || [],
        images: product.images || []
      }));

      // Create unified request with all items
      const requestData = {
        customerId: user._id,
        customerName: user.name,
        customerEmail: user.email,
        items: items,
        shippingAddress: {
          name: selectedAddress.name,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          country: selectedAddress.country,
          postalCode: selectedAddress.zipCode,
          phone: selectedAddress.phone
        },
        notes: `Order confirmation preferences: Proceed with remaining: ${confirmationData.proceedWithRemaining}, Cancel entire order: ${confirmationData.cancelEntireOrder}, Confirm restrictions: ${confirmationData.confirmRestrictions}`,
        priority: 'medium' as const
      };

      // Submit the unified request
      const response = await userBuyForMeApi.createRequest(requestData);
      
      // Submit cart for purchase using the database API
      const allProductIds = cartItems.map(p => p._id);
      await submitCartForPurchase(allProductIds);
      
      showNotification('success', `Request submitted successfully! Your order is being processed.`);
      setShowRequestPreview(false);
      
      // Immediately reload cart items to reflect the updated status
      await loadCartItems();
      
    } catch (error: any) {
      console.error('Error submitting order:', error);
      showNotification('error', 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Utility functions
  const formatPrice = (price: number, currency: string) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price);
    } catch (error) {
      return `${currency} ${price.toFixed(2)}`;
    }
  };

  const getProductPrice = (product: BuyForMeCartItem) => {
    return { 
      price: product.estimatedPrice || 0, 
      currency: product.currency || 'USD' 
    };
  };

  const calculateTotalCost = (products: BuyForMeCartItem[]) => {
    return products.reduce((total, product) => {
      const quantity = product.quantity || 1;
      return total + (product.estimatedPrice * quantity);
    }, 0);
  };

  const getMostCommonCurrency = (products: BuyForMeCartItem[]) => {
    const currencies = products.map(p => p.currency);
    return currencies.length > 0 
      ? currencies.sort((a, b) =>
          currencies.filter(c => c === b).length - currencies.filter(c => c === a).length
        )[0]
      : 'USD';
  };

  const calculateServiceFee = (subtotal: number): number => {
    return subtotal * 0.10; // 10% service fee
  };

  const calculateEstimatedFees = (): number => {
    const subtotal = calculateTotalCost(cartItems);
    return subtotal * 0.05; // 5% estimated additional fees
  };

  const calculateEstimatedCustomFee = (): number => {
    const subtotal = calculateTotalCost(cartItems);
    return subtotal * 0.08; // 8% estimated custom fee
  };

  const calculateFinalTotal = (): number => {
    const subtotal = calculateTotalCost(cartItems);
    const serviceFee = calculateServiceFee(subtotal);
    const estimatedFees = calculateEstimatedFees();
    const customFee = calculateEstimatedCustomFee();
    const totalBeforePromo = subtotal + serviceFee + estimatedFees + customFee;
    
    return totalBeforePromo - promoDiscount;
  };

  const calculateDiscountedAmount = (originalAmount: number): number => {
    if (!appliedPromoCode || promoDiscount === 0) return originalAmount;
    
    const subtotal = calculateTotalCost(cartItems);
    const serviceFee = calculateServiceFee(subtotal);
    const estimatedFees = calculateEstimatedFees();
    const customFee = calculateEstimatedCustomFee();
    const totalBeforePromo = subtotal + serviceFee + estimatedFees + customFee;
    
    // Calculate the discount ratio
    const discountRatio = promoDiscount / totalBeforePromo;
    
    // Apply the same discount ratio to this specific amount
    return originalAmount - (originalAmount * discountRatio);
  };

  const validatePromoCode = (code: string): { valid: boolean; discount: number; message: string } => {
    // Mock promo codes for demonstration
    const validPromoCodes: { [key: string]: { discount: number; message: string } } = {
      'WELCOME10': { discount: 10, message: '10% discount applied!' },
      'SAVE20': { discount: 20, message: '20% discount applied!' },
      'FIRST5': { discount: 5, message: '5% discount applied!' },
      'HATHAK15': { discount: 15, message: '15% discount applied!' }
    };

    const upperCode = code.toUpperCase();
    if (validPromoCodes[upperCode]) {
      return {
        valid: true,
        discount: validPromoCodes[upperCode].discount,
        message: validPromoCodes[upperCode].message
      };
    }

    return {
      valid: false,
      discount: 0,
      message: 'Invalid promo code'
    };
  };

  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      showNotification('error', 'Please enter a promo code');
      return;
    }

    const validation = validatePromoCode(promoCode);
    
    if (validation.valid) {
      const subtotal = calculateTotalCost(cartItems);
      const serviceFee = calculateServiceFee(subtotal);
      const estimatedFees = calculateEstimatedFees();
      const customFee = calculateEstimatedCustomFee();
      const totalBeforePromo = subtotal + serviceFee + estimatedFees + customFee;
      
      const discountAmount = (totalBeforePromo * validation.discount) / 100;
      
      setAppliedPromoCode(promoCode.toUpperCase());
      setPromoDiscount(discountAmount);
      showNotification('success', validation.message);
    } else {
      showNotification('error', validation.message);
    }
  };

  const handleRemovePromoCode = () => {
    setAppliedPromoCode(null);
    setPromoDiscount(0);
    setPromoCode('');
    showNotification('info', 'Promo code removed');
  };

  // Address management functions
  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find(addr => addr._id === addressId);
    if (selectedAddress) {
      setShippingDetails(prev => ({
        ...prev,
        address: `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zipCode}, ${selectedAddress.country}`
      }));
    }
  };

  const handleManualAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManualAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveManualAddress = async () => {
    if (!manualAddress.name || !manualAddress.street || !manualAddress.city || !manualAddress.state || !manualAddress.zipCode || !manualAddress.country || !manualAddress.phone) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      await addAddress({
        name: manualAddress.name,
        type: 'other',
        street: manualAddress.street,
        city: manualAddress.city,
        state: manualAddress.state,
        zipCode: manualAddress.zipCode,
        country: manualAddress.country,
        phone: manualAddress.phone,
        isDefault: false
      });

      setShippingDetails(prev => ({
        ...prev,
        address: `${manualAddress.street}, ${manualAddress.city}, ${manualAddress.state} ${manualAddress.zipCode}, ${manualAddress.country}`
      }));

      setShowAddressForm(false);
      setManualAddress({
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: ''
      });
      showNotification('success', 'Address saved and selected!');
    } catch (error) {
      showNotification('error', 'Failed to save address');
    }
  };

  const handleCancelManualAddress = () => {
    setShowAddressForm(false);
    setManualAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: ''
    });
  };

  // Set default address on component mount
  useEffect(() => {
    const defaultAddress = getDefaultAddress();
    if (defaultAddress && !selectedAddressId) {
      setSelectedAddressId(defaultAddress._id);
      setShippingDetails(prev => ({
        ...prev,
        address: `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.zipCode}, ${defaultAddress.country}`
      }));
    }
  }, [addresses, getDefaultAddress, selectedAddressId]);

  if (loading) {
    return (
      <ProtectedRoute>
        <UserControlPanel>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 p-4">
                      <div className="h-5 bg-slate-200 rounded w-1/2 mb-3"></div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                            <div className="flex-1">
                              <div className="h-3 bg-slate-200 rounded w-3/4 mb-2"></div>
                              <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </UserControlPanel>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <UserControlPanel>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Link
                    href="/User/ControlPanel/BuyForMe"
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Back to BuyForMe Control Panel"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                  <div className="p-1.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-slate-900 via-orange-900 to-orange-900 bg-clip-text text-transparent">
                      Buy for Me Cart
                    </h1>
                    <p className="text-xs text-slate-600">Manage your product requests and prepare for submit</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-3 p-2 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-red-100 rounded">
                    <Package className="w-3 h-3 text-red-600" />
                  </div>
                  <p className="text-xs text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Single Column Layout - Unified Cart */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-3 py-2 border-b border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Your Cart ({cartItems.length} items)
                      </h3>
                      <p className="text-xs text-slate-600">
                        Add products and submit for the review
                      </p>
                    </div>
                    <button
                      onClick={handleAddProduct}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Product
                    </button>
                  </div>
                </div>
                

                <div className="p-3">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="p-2 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-gray-400" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-1">Your cart is empty</h4>
                      <p className="text-gray-600 mb-4 text-sm">Start by adding your first product request</p>
                      <button
                        onClick={handleAddProduct}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Product
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* All Products - Ready for Submission */}
                      {cartItems.map((product) => {
                        const { price, currency } = getProductPrice(product);
                        return (
                          <div
                            key={product._id}
                            className="flex items-center gap-3 p-3 bg-green-50/80 backdrop-blur-sm rounded-lg border border-green-200 hover:shadow-md transition-all duration-300 hover:border-green-400 group"
                          >
                            {/* Status Indicator */}
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-green-500 rounded-full" title="Ready for checkout"></div>
                            </div>
                            
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.productName}
                                  className="w-12 h-12 object-cover rounded-lg border border-green-200 shadow-sm"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg border border-green-200 flex items-center justify-center shadow-sm">
                                  <Package className="w-6 h-6 text-green-600" />
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h4 
                                className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-orange-600 transition-colors mb-0.5"
                                onClick={() => handleEditProduct(product)}
                                title="Click to edit this product"
                              >
                                {product.productName}
                              </h4>
                              <div className="flex items-center gap-4 text-xs text-gray-600">
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">Qty:</span>
                                  <span>{product.quantity || 1}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">Price:</span>
                                  <span className="font-semibold text-gray-900">{formatPrice(price, currency)}</span>
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => window.open(product.productLink, '_blank', 'noopener,noreferrer')}
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Open product link"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleViewDetails(product)}
                                className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="View details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Cart Summary and Checkout Button */}
                {cartItems.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 border-t border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">Ready for Submission</h4>
                        <p className="text-xs text-gray-600">
                          {cartItems.length} items • Total: {formatPrice(calculateTotalCost(cartItems), getMostCommonCurrency(cartItems))}
                        </p>
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Submit for Review
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>


            {/* Unified Request Preview & Confirmation Modal */}
            {showRequestPreview && cartItems.length > 0 && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center p-4">
                  <div 
                    className="fixed inset-0 animate-in fade-in-0 duration-300 backdrop-blur-xs pointer-events-none" 
                  />
                  
                  <div className="relative bg-white/95 backdrop-blur-sm w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-500 ease-out animate-in fade-in-0 zoom-in-95 rounded-2xl shadow-2xl border border-white/20">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-green-100/20 rounded-lg">
                            <Package className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h2 className="text-base font-semibold">Submit for Review</h2>
                            <p className="text-green-100 text-xs">Review your order details and confirm your preferences</p>
                          </div>
                        </div>
                        <button
                          onClick={handleCloseRequestPreview}
                          className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 overflow-y-auto max-h-[75vh]">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Left Column */}
                        <div className="space-y-4">
                          {/* Items Details */}
                          <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Items Details</h3>
                            <div className="space-y-2">
                              {cartItems.map((product) => {
                                const { price, currency } = getProductPrice(product);
                                const quantity = product.quantity || 1;
                                
                                return (
                                  <div key={product._id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                      {product.images?.[0] ? (
                                        <img
                                          src={product.images[0]}
                                          alt={product.productName}
                                          className="w-10 h-10 object-cover rounded border border-gray-200"
                                        />
                                      ) : (
                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded border border-gray-200 flex items-center justify-center">
                                          <Package className="w-5 h-5 text-orange-600" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-xs font-semibold text-gray-900 truncate">{product.productName}</h4>
                                      <div className="flex items-center gap-3 text-xs text-gray-600">
                                        <span>Qty: {quantity}</span>
                                        <span>Unit Price: <span className="font-semibold text-gray-900">{formatPrice(price, currency)}</span></span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            {/* Subtotal */}
                            <div className="mt-3 pt-2 border-t border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-gray-700">Subtotal</span>
                                <span className="text-xs font-semibold text-gray-900">
                                  {formatPrice(calculateTotalCost(cartItems), getMostCommonCurrency(cartItems))}
                                </span>
                              </div>
                            </div>

                            {/* Promo Code */}
                            <div className="mt-3">
                              <label className="block text-xs font-medium text-gray-700 mb-1">Promo Code</label>
                              {appliedPromoCode ? (
                                <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    <span className="text-xs font-medium text-green-800">{appliedPromoCode}</span>
                                    <span className="text-xs text-green-600">Applied</span>
                                  </div>
                                  <button
                                    onClick={handleRemovePromoCode}
                                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ) : (
                                <div className="flex gap-1.5">
                                  <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    placeholder="Enter a promo code"
                                    className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    onKeyPress={(e) => e.key === 'Enter' && handleApplyPromoCode()}
                                  />
                                  <button
                                    onClick={handleApplyPromoCode}
                                    className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                  >
                                    Apply
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Fee Details */}
                          <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Fee Details</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Subtotal ({cartItems.length} pcs)</span>
                                <div className="text-right">
                                  {appliedPromoCode && promoDiscount > 0 ? (
                                    <div>
                                      <div className="text-xs font-medium text-gray-400 line-through">
                                        {formatPrice(calculateTotalCost(cartItems), getMostCommonCurrency(cartItems))}
                                      </div>
                                      <div className="text-xs font-medium text-gray-900">
                                        {formatPrice(calculateDiscountedAmount(calculateTotalCost(cartItems)), getMostCommonCurrency(cartItems))}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-xs font-medium text-gray-900">
                                      {formatPrice(calculateTotalCost(cartItems), getMostCommonCurrency(cartItems))}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Service Fee (10%)</span>
                                <div className="text-right">
                                  {appliedPromoCode && promoDiscount > 0 ? (
                                    <div>
                                      <div className="text-xs font-medium text-gray-400 line-through">
                                        {formatPrice(calculateServiceFee(calculateTotalCost(cartItems)), getMostCommonCurrency(cartItems))}
                                      </div>
                                      <div className="text-xs font-medium text-gray-900">
                                        {formatPrice(calculateDiscountedAmount(calculateServiceFee(calculateTotalCost(cartItems))), getMostCommonCurrency(cartItems))}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-xs font-medium text-gray-900">
                                      {formatPrice(calculateServiceFee(calculateTotalCost(cartItems)), getMostCommonCurrency(cartItems))}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Estimated Fee</span>
                                <div className="text-right">
                                  {appliedPromoCode && promoDiscount > 0 ? (
                                    <div>
                                      <div className="text-xs font-medium text-gray-400 line-through">
                                        {formatPrice(calculateEstimatedFees(), getMostCommonCurrency(cartItems))}
                                      </div>
                                      <div className="text-xs font-medium text-gray-900">
                                        {formatPrice(calculateDiscountedAmount(calculateEstimatedFees()), getMostCommonCurrency(cartItems))}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-xs font-medium text-gray-900">
                                      {formatPrice(calculateEstimatedFees(), getMostCommonCurrency(cartItems))}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Estimated Custom Fee</span>
                                <div className="text-right">
                                  {appliedPromoCode && promoDiscount > 0 ? (
                                    <div>
                                      <div className="text-xs font-medium text-gray-400 line-through">
                                        {formatPrice(calculateEstimatedCustomFee(), getMostCommonCurrency(cartItems))}
                                      </div>
                                      <div className="text-xs font-medium text-gray-900">
                                        {formatPrice(calculateDiscountedAmount(calculateEstimatedCustomFee()), getMostCommonCurrency(cartItems))}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-xs font-medium text-gray-900">
                                      {formatPrice(calculateEstimatedCustomFee(), getMostCommonCurrency(cartItems))}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {appliedPromoCode && promoDiscount > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-green-600">Promo Discount ({appliedPromoCode})</span>
                                  <span className="text-xs font-medium text-green-600">
                                    -{formatPrice(promoDiscount, getMostCommonCurrency(cartItems))}
                                  </span>
                                </div>
                              )}
                              <div className="pt-2 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-semibold text-gray-900">Estimated Total</span>
                                  <div className="text-right">
                                    {appliedPromoCode && promoDiscount > 0 ? (
                                      <div>
                                        <div className="text-sm font-bold text-gray-400 line-through">
                                          {formatPrice(calculateTotalCost(cartItems) + calculateServiceFee(calculateTotalCost(cartItems)) + calculateEstimatedFees() + calculateEstimatedCustomFee(), getMostCommonCurrency(cartItems))}
                                        </div>
                                        <div className="text-sm font-bold text-green-600">
                                          {formatPrice(calculateFinalTotal(), getMostCommonCurrency(cartItems))}
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-sm font-bold text-green-600">
                                        {formatPrice(calculateFinalTotal(), getMostCommonCurrency(cartItems))}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Exchange Rate</span>
                                <span className="text-xs font-medium text-gray-900">1 USD = 1.00 USD</span>
                              </div>
                            </div>
                            
                            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-xs text-yellow-800">
                                <strong>Notes for other fees:</strong> There may be a local shipping fee (charged by the seller) or an additional fee for hot/difficult-to-buy items. If any, the fees charged will be listed in the Fee Details when the item request is ready for payment.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          {/* Shipping Details */}
                          <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Shipping Details</h3>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Company Warehouse</label>
                                <p className="text-xs text-gray-900">{shippingDetails.warehouse}</p>
                              </div>
                              
                              {/* Address Selection */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Delivery Address</label>
                                {addresses.length > 0 ? (
                                  <div className="space-y-2">
                                    <select
                                      value={selectedAddressId}
                                      onChange={(e) => handleAddressSelect(e.target.value)}
                                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                      <option value="">Select an address</option>
                                      {addresses.map((address) => (
                                        <option key={address._id} value={address._id}>
                                          {address.name} - {address.street}, {address.city}
                                        </option>
                                      ))}
                                    </select>
                                    <button
                                      onClick={() => setShowAddressForm(true)}
                                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                      <Plus className="w-3 h-3" />
                                      Add New Address
                                    </button>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <p className="text-xs text-gray-500">No saved addresses</p>
                                    <button
                                      onClick={() => setShowAddressForm(true)}
                                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                      <Plus className="w-3 h-3" />
                                      Add Address
                                    </button>
                                  </div>
                                )}
                                
                                {selectedAddressId && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-900">{shippingDetails.address}</p>
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Shipment Type</label>
                                <select
                                  value={shippingDetails.shipmentType}
                                  onChange={(e) => setShippingDetails(prev => ({ ...prev, shipmentType: e.target.value }))}
                                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="Standard Shipping">Standard Shipping</option>
                                  <option value="Express Shipping">Express Shipping</option>
                                  <option value="Priority Shipping">Priority Shipping</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Confirmation Questions */}
                          <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Confirmation Preferences</h3>
                            <div className="space-y-3">
                              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-xs text-gray-700 mb-3">
                                  In circumstances when the domestic shipping cost remains unchanged, how would you like us to proceed if we are unable to purchase some items?
                                </p>
                                
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <input
                                      type="radio"
                                      name="unavailableItems"
                                      id="proceedWithRemaining"
                                      checked={confirmationData.proceedWithRemaining}
                                      onChange={() => handleConfirmationChange('proceedWithRemaining')}
                                      className="mt-0.5 w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="proceedWithRemaining" className="text-xs text-gray-700 cursor-pointer">
                                      Proceed to purchase the remaining items and receive a refund for the unavailable items, including additional fees (if any).
                                    </label>
                                  </div>
                                  
                                  <div className="flex items-start gap-2">
                                    <input
                                      type="radio"
                                      name="unavailableItems"
                                      id="cancelEntireOrder"
                                      checked={confirmationData.cancelEntireOrder}
                                      onChange={() => handleConfirmationChange('cancelEntireOrder')}
                                      className="mt-0.5 w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="cancelEntireOrder" className="text-xs text-gray-700 cursor-pointer">
                                      Cancel the entire order and receive a refund for all items, including additional fees (if any).
                                    </label>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-start gap-2">
                                  <input
                                    type="checkbox"
                                    id="confirmRestrictions"
                                    checked={confirmationData.confirmRestrictions}
                                    onChange={() => handleConfirmationChange('confirmRestrictions')}
                                    className="mt-0.5 w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 rounded"
                                  />
                                  <label htmlFor="confirmRestrictions" className="text-xs text-gray-700 cursor-pointer">
                                    I confirm the products requested do not violate HatHak's parcel restrictions or contain any prohibited items. I acknowledge the criteria for refunds and returns under HatHak's Purchase Protection plan.
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center">
                      <button
                        onClick={handleCloseRequestPreview}
                        className="px-3 py-1.5 text-xs text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Back to Cart
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCloseRequestPreview}
                          className="px-3 py-1.5 text-xs text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitOrder}
                          disabled={isSubmitting || !confirmationData.confirmRestrictions || (!confirmationData.proceedWithRemaining && !confirmationData.cancelEntireOrder)}
                          className={`px-6 py-2 text-xs font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                            isSubmitting || !confirmationData.confirmRestrictions || (!confirmationData.proceedWithRemaining && !confirmationData.cancelEntireOrder)
                              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                              : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                          }`}
                        >
                          {isSubmitting ? 'Processing...' : 'Submit for Review'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Checkout Modal */}

            {/* Add Address Form Modal */}
            {showAddressForm && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center p-4">
                  <div 
                    className="fixed inset-0 animate-in fade-in-0 duration-300 backdrop-blur-xs pointer-events-none" 
                  />
                  
                  <div className="relative bg-white/95 backdrop-blur-sm w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-500 ease-out animate-in fade-in-0 zoom-in-95 rounded-2xl shadow-2xl border border-white/20">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100/20 rounded-lg">
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold">Add New Address</h2>
                            <p className="text-blue-100 text-sm">Add a new address for shipping</p>
                          </div>
                        </div>
                        <button
                          onClick={handleCancelManualAddress}
                          className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                      <div className="space-y-4">
                        {/* Address Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={manualAddress.name}
                            onChange={handleManualAddressChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Home, Work, etc."
                          />
                        </div>

                        {/* Street Address */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            name="street"
                            value={manualAddress.street}
                            onChange={handleManualAddressChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="123 Main Street"
                          />
                        </div>

                        {/* City, State, ZIP */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={manualAddress.city}
                              onChange={handleManualAddressChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="New York"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State *
                            </label>
                            <input
                              type="text"
                              name="state"
                              value={manualAddress.state}
                              onChange={handleManualAddressChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="NY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ZIP Code *
                            </label>
                            <input
                              type="text"
                              name="zipCode"
                              value={manualAddress.zipCode}
                              onChange={handleManualAddressChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="10001"
                            />
                          </div>
                        </div>

                        {/* Country and Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country *
                            </label>
                            <input
                              type="text"
                              name="country"
                              value={manualAddress.country}
                              onChange={handleManualAddressChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="United States"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={manualAddress.phone}
                              onChange={handleManualAddressChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handleCancelManualAddress}
                          className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveManualAddress}
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add/Edit Product Form Modal */}
            {showForm && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center p-4">
                  <div 
                    className="fixed inset-0 animate-in fade-in-0 duration-300 bg-white bg-opacity-80 backdrop-blur-sm" 
                    onClick={handleFormCancel} 
                  />
                  
                  <div className="relative bg-white/95 backdrop-blur-sm w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95 rounded-2xl shadow-2xl border border-white/20">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-white/20 rounded-lg">
                            <Edit3 className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h2 className="text-base font-semibold">
                              {editingProduct ? 'Edit Product Request' : 'Add New Product Request'}
                            </h2>
                            <p className="text-xs text-orange-100">
                              {editingProduct 
                                ? `Update the details for: ${editingProduct.productName}`
                                : 'Fill in the details for the product you want us to purchase'
                              }
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleFormCancel}
                          className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 overflow-y-auto max-h-[calc(90vh-100px)]">
                      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                        <BuyMeForm
                          onSubmit={handleFormSubmit}
                          isLoading={submitting}
                          initialData={editingProduct || undefined}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </UserControlPanel>
    </ProtectedRoute>
  );
}
