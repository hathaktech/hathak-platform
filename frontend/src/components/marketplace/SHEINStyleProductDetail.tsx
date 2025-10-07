"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  Minus,
  Plus,
  Check,
  Crown,
  Zap,
  Tag,
  Clock,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  Play,
  Pause
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  primaryImage: { url: string; alt: string };
  images: Array<{ url: string; alt: string; isPrimary: boolean; order: number }>;
  badges: Array<{ type: string; text: string; color: string }>;
  reviews: { 
    averageRating: number; 
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  };
  seller: { businessName: string; verified: boolean; rating: number; totalSales: number };
  availability: string;
  shipping: { freeShipping: boolean; handlingTime: number; internationalShipping: boolean };
  analytics: { views: number; wishlistCount: number; clicks: number; conversions: number };
  description: string;
  features: string[];
  specifications: { [key: string]: string };
  variants: Array<{
    id: string;
    name: string;
    type: string;
    options: Array<{ value: string; label: string; available: boolean }>;
  }>;
  createdAt: string;
}

interface SHEINStyleProductDetailProps {
  product: Product;
}

const SHEINStyleProductDetail: React.FC<SHEINStyleProductDetailProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping' | 'returns'>('description');
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const handleVariantChange = (variantType: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantType]: value
    }));
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const getBadgeColor = (badge: any) => {
    switch (badge.color) {
      case 'red': return 'bg-red-500 text-white';
      case 'green': return 'bg-green-500 text-white';
      case 'blue': return 'bg-blue-500 text-white';
      case 'purple': return 'bg-purple-500 text-white';
      case 'orange': return 'bg-orange-500 text-white';
      default: return 'bg-pink-500 text-white';
    }
  };

  const discountPercentage = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/HatHakStore" className="hover:text-pink-600">Home</Link>
            <span>/</span>
            <Link href="/HatHakStore" className="hover:text-pink-600">Products</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
              <Image
                src={product.images[selectedImage]?.url || product.primaryImage.url}
                alt={product.images[selectedImage]?.alt || product.primaryImage.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.badges.map((badge, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getBadgeColor(badge)}`}
                  >
                    {badge.text}
                  </span>
                ))}
                {discountPercentage > 0 && (
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-500 text-white">
                    -{discountPercentage}%
                  </span>
                )}
              </div>

              {/* Zoom Button */}
              <button
                onClick={() => setIsImageZoomed(!isImageZoomed)}
                className="absolute top-4 right-4 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ZoomIn className="w-4 h-4 text-gray-700" />
              </button>

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <ArrowRight className="w-4 h-4 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-pink-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.reviews.averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.reviews.totalReviews} reviews)</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{product.analytics.views} views</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900">${product.price}</span>
              {product.compareAtPrice && (
                <span className="text-2xl text-gray-500 line-through">${product.compareAtPrice}</span>
              )}
              {discountPercentage > 0 && (
                <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                  Save {discountPercentage}%
                </span>
              )}
            </div>

            {/* Seller Info */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {product.seller.businessName.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{product.seller.businessName}</span>
                  {product.seller.verified && (
                    <Crown className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1">{product.seller.rating}</span>
                  </div>
                  <span>{product.seller.totalSales} sales</span>
                </div>
              </div>
            </div>

            {/* Variants */}
            {product.variants.map((variant) => (
              <div key={variant.id}>
                <h3 className="font-medium text-gray-900 mb-3">{variant.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleVariantChange(variant.type, option.value)}
                      disabled={!option.available}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        selectedVariants[variant.type] === option.value
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : option.available
                          ? 'border-gray-200 hover:border-pink-300 text-gray-700'
                          : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-semibold transition-colors flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`p-4 rounded-2xl border-2 transition-colors ${
                    isWishlisted
                      ? 'border-pink-500 bg-pink-50 text-pink-600'
                      : 'border-gray-200 hover:border-pink-300 text-gray-700'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="p-4 border-2 border-gray-200 rounded-2xl hover:border-pink-300 text-gray-700 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              
              <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-2xl font-semibold transition-colors">
                Buy Now
              </button>
            </div>

            {/* Shipping Info */}
            <div className="space-y-3 p-4 bg-green-50 rounded-2xl">
              <div className="flex items-center space-x-2 text-green-700">
                <Truck className="w-5 h-5" />
                <span className="font-medium">Free Shipping</span>
              </div>
              <p className="text-sm text-green-600">
                Get free shipping on orders over $50. Estimated delivery: {product.shipping.handlingTime} days
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Secure Payment</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <RotateCcw className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Easy Returns</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Fast Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', name: 'Description', icon: null },
                { id: 'reviews', name: 'Reviews', icon: Star },
                { id: 'shipping', name: 'Shipping', icon: Truck },
                { id: 'returns', name: 'Returns', icon: RotateCcw }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon && <tab.icon className="w-4 h-4 mr-2" />}
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
                
                {product.features.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-900">{key}</span>
                          <span className="text-gray-700">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.reviews.averageRating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{product.reviews.averageRating}</span>
                    <span className="text-gray-600">({product.reviews.totalReviews} reviews)</span>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 w-8">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${(product.reviews.ratingDistribution[rating] || 0) / product.reviews.totalReviews * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {product.reviews.ratingDistribution[rating] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-green-50 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Truck className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Free Shipping</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Free shipping on orders over $50. Standard delivery takes {product.shipping.handlingTime} business days.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Express Shipping</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Express delivery available for $9.99. Get your order in 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Return Policy</h3>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <RotateCcw className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">30-Day Return Policy</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    You can return this item within 30 days of delivery for a full refund. 
                    Items must be in original condition with tags attached.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SHEINStyleProductDetail;
