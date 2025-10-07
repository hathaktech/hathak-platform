'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Star, ExternalLink, ShoppingCart, Globe, Truck, AlertCircle, CheckCircle } from 'lucide-react';
import { ProductComparison } from '@/types/buyme';

interface PriceComparisonProps {
  productName?: string;
  comparisons?: ProductComparison[];
  onAddToCart?: (comparison: ProductComparison) => void;
}

export default function PriceComparison({ 
  productName = 'Sample Product',
  comparisons = [],
  onAddToCart 
}: PriceComparisonProps) {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'delivery'>('price');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);

  // Mock data for demonstration
  const mockComparisons: ProductComparison[] = [
    {
      productId: '1',
      storeName: 'Amazon US',
      storeUrl: 'https://amazon.com/product',
      price: 299.99,
      currency: 'USD',
      availability: true,
      shippingCost: 0,
      estimatedDelivery: '2-3 days',
      rating: 4.8,
      reviewCount: 1250
    },
    {
      productId: '2',
      storeName: 'eBay',
      storeUrl: 'https://ebay.com/product',
      price: 275.50,
      currency: 'USD',
      availability: true,
      shippingCost: 15.99,
      estimatedDelivery: '5-7 days',
      rating: 4.6,
      reviewCount: 890
    },
    {
      productId: '3',
      storeName: 'AliExpress',
      storeUrl: 'https://aliexpress.com/product',
      price: 189.99,
      currency: 'USD',
      availability: true,
      shippingCost: 25.00,
      estimatedDelivery: '15-25 days',
      rating: 4.4,
      reviewCount: 2340
    },
    {
      productId: '4',
      storeName: 'Walmart',
      storeUrl: 'https://walmart.com/product',
      price: 319.99,
      currency: 'USD',
      availability: true,
      shippingCost: 0,
      estimatedDelivery: '3-5 days',
      rating: 4.2,
      reviewCount: 567
    },
    {
      productId: '5',
      storeName: 'Target',
      storeUrl: 'https://target.com/product',
      price: 329.99,
      currency: 'USD',
      availability: false,
      shippingCost: 0,
      estimatedDelivery: 'N/A',
      rating: 4.3,
      reviewCount: 234
    },
    {
      productId: '6',
      storeName: 'Best Buy',
      storeUrl: 'https://bestbuy.com/product',
      price: 289.99,
      currency: 'USD',
      availability: true,
      shippingCost: 0,
      estimatedDelivery: '1-2 days',
      rating: 4.7,
      reviewCount: 1890
    }
  ];

  const displayComparisons = comparisons.length > 0 ? comparisons : mockComparisons;

  const currencies = [
    { code: 'USD', symbol: '$', rate: 1 },
    { code: 'EUR', symbol: '€', rate: 0.85 },
    { code: 'GBP', symbol: '£', rate: 0.73 },
    { code: 'CAD', symbol: 'C$', rate: 1.35 },
    { code: 'AUD', symbol: 'A$', rate: 1.50 },
    { code: 'JPY', symbol: '¥', rate: 110 }
  ];

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency) || currencies[0];

  const filteredComparisons = displayComparisons.filter(comparison => {
    if (showOnlyAvailable && !comparison.availability) return false;
    return true;
  });

  const sortedComparisons = [...filteredComparisons].sort((a, b) => {
    const totalPriceA = a.price + a.shippingCost;
    const totalPriceB = b.price + b.shippingCost;
    
    switch (sortBy) {
      case 'price':
        return totalPriceA - totalPriceB;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'delivery':
        // Sort by delivery days (extract number from string)
        const daysA = parseInt(a.estimatedDelivery) || 999;
        const daysB = parseInt(b.estimatedDelivery) || 999;
        return daysA - daysB;
      default:
        return 0;
    }
  });

  const bestPrice = Math.min(...sortedComparisons.map(c => c.price + c.shippingCost));
  const bestRating = Math.max(...sortedComparisons.map(c => c.rating || 0));

  const convertPrice = (price: number) => {
    return price * selectedCurrencyData.rate;
  };

  const formatPrice = (price: number) => {
    const convertedPrice = convertPrice(price);
    return `${selectedCurrencyData.symbol}${convertedPrice.toFixed(2)}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-neutral-300'
        }`}
      />
    ));
  };

  const getDeliveryIcon = (delivery: string) => {
    const days = parseInt(delivery);
    if (days <= 3) return <TrendingUp className="w-4 h-4 text-success" />;
    if (days <= 7) return <Minus className="w-4 h-4 text-warning" />;
    return <TrendingDown className="w-4 h-4 text-danger" />;
  };

  const getPriceTrend = (totalPrice: number) => {
    if (totalPrice === bestPrice) return 'best';
    if (totalPrice <= bestPrice * 1.1) return 'good';
    return 'high';
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-1 bg-opacity-10 rounded-lg">
          <TrendingUp className="w-6 h-6 text-primary-1" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900">Price Comparison</h2>
      </div>

      {/* Product Name */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-2">{productName}</h3>
        <p className="text-sm text-neutral-600">Compare prices across different stores and countries</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-700">Currency:</span>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="px-3 py-1 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-1 focus:border-transparent"
          >
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.code} ({currency.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-1 focus:border-transparent"
          >
            <option value="price">Total Price</option>
            <option value="rating">Rating</option>
            <option value="delivery">Delivery Time</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showOnlyAvailable"
            checked={showOnlyAvailable}
            onChange={(e) => setShowOnlyAvailable(e.target.checked)}
            className="w-4 h-4 text-primary-1 border-neutral-300 rounded focus:ring-primary-1"
          />
          <label htmlFor="showOnlyAvailable" className="text-sm text-neutral-700">
            Show only available
          </label>
        </div>
      </div>

      {/* Comparison Results */}
      <div className="space-y-4">
        {sortedComparisons.map((comparison, index) => {
          const totalPrice = comparison.price + comparison.shippingCost;
          const priceTrend = getPriceTrend(totalPrice);
          const isBestPrice = totalPrice === bestPrice;
          const isBestRating = comparison.rating === bestRating;

          return (
            <div
              key={comparison.productId}
              className={`border rounded-lg p-6 transition-all ${
                isBestPrice
                  ? 'border-success bg-success bg-opacity-5'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-neutral-900">{comparison.storeName}</h4>
                    {isBestPrice && (
                      <span className="px-2 py-1 bg-success text-white text-xs font-medium rounded-full">
                        Best Price
                      </span>
                    )}
                    {isBestRating && (
                      <span className="px-2 py-1 bg-primary-1 text-white text-xs font-medium rounded-full">
                        Best Rating
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <div className="flex items-center gap-1">
                      {renderStars(comparison.rating || 0)}
                      <span>({comparison.reviewCount?.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>{comparison.currency}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">
                    {formatPrice(totalPrice)}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {formatPrice(comparison.price)} + {formatPrice(comparison.shippingCost)} shipping
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-neutral-400" />
                  <div>
                    <div className="text-sm font-medium text-neutral-900">Delivery</div>
                    <div className="text-sm text-neutral-600 flex items-center gap-1">
                      {getDeliveryIcon(comparison.estimatedDelivery)}
                      {comparison.estimatedDelivery}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {comparison.availability ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-danger" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-neutral-900">Availability</div>
                    <div className={`text-sm ${comparison.availability ? 'text-success' : 'text-danger'}`}>
                      {comparison.availability ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-neutral-400" />
                  <div>
                    <div className="text-sm font-medium text-neutral-900">Rating</div>
                    <div className="text-sm text-neutral-600">
                      {comparison.rating?.toFixed(1)}/5.0
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={comparison.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Store
                </a>
                
                {comparison.availability && onAddToCart && (
                  <button
                    onClick={() => onAddToCart(comparison)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-1 text-white font-medium rounded-lg hover:bg-primary-2 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 p-4 bg-neutral-50 rounded-lg">
        <h4 className="font-medium text-neutral-900 mb-2">Price Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-neutral-600">Best Price</div>
            <div className="font-semibold text-success">{formatPrice(bestPrice)}</div>
          </div>
          <div>
            <div className="text-neutral-600">Price Range</div>
            <div className="font-semibold text-neutral-900">
              {formatPrice(Math.min(...sortedComparisons.map(c => c.price + c.shippingCost)))} - {formatPrice(Math.max(...sortedComparisons.map(c => c.price + c.shippingCost)))}
            </div>
          </div>
          <div>
            <div className="text-neutral-600">Average Rating</div>
            <div className="font-semibold text-neutral-900">
              {(sortedComparisons.reduce((sum, c) => sum + (c.rating || 0), 0) / sortedComparisons.length).toFixed(1)}/5.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
