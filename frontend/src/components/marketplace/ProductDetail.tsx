'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingCart, 
  Share2, 
  Star, 
  Truck, 
  Shield, 
  Clock,
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Eye,
  Zap,
  Award,
  Users,
  MapPin,
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface ProductVariant {
  _id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventory: {
    quantity: number;
    trackQuantity: boolean;
    allowBackorder: boolean;
  };
  options: {
    size?: string;
    color?: string;
    material?: string;
    style?: string;
  };
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  availability: string;
}

interface Review {
  _id: string;
  user: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  rating: number;
  title: string;
  comment: string;
  images?: Array<{
    url: string;
    alt: string;
  }>;
  helpful: number;
  verified: boolean;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  videos?: Array<{
    url: string;
    thumbnail: string;
    duration: number;
    type: string;
  }>;
  variants: ProductVariant[];
  seller: {
    _id: string;
    businessName: string;
    verified: boolean;
    rating: number;
    totalSales: number;
    responseTime: number;
    location: string;
  };
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  features: Array<{
    name: string;
    value: string;
    icon: string;
  }>;
  badges: Array<{
    type: string;
    text: string;
    color: string;
  }>;
  shipping: {
    freeShipping: boolean;
    handlingTime: number;
    internationalShipping: boolean;
  };
  reviews: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  analytics: {
    views: number;
    wishlistCount: number;
  };
  relatedProducts: Array<{
    _id: string;
    name: string;
    price: number;
    primaryImage: {
      url: string;
      alt: string;
    };
    reviews: {
      averageRating: number;
      totalReviews: number;
    };
  }>;
}

interface ProductDetailProps {
  product: Product;
  reviews: Review[];
  onAddToCart: (variantId: string, quantity: number) => void;
  onAddToWishlist: (productId: string) => void;
  onShare: (productId: string) => void;
  className?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  reviews,
  onAddToCart,
  onAddToWishlist,
  onShare,
  className = ''
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({});
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews' | 'shipping'>('description');
  const [showImageModal, setShowImageModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    // Set initial variant
    if (product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product.variants]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };
    
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${sizeClasses[size]} ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getAvailabilityColor = (availability: string) => {
    const colors = {
      in_stock: 'text-green-600',
      low_stock: 'text-yellow-600',
      out_of_stock: 'text-red-600',
      backorder: 'text-orange-600',
      unavailable: 'text-gray-500'
    };
    return colors[availability as keyof typeof colors] || 'text-gray-500';
  };

  const getBadgeColor = (type: string) => {
    const colors = {
      new: 'bg-green-500',
      sale: 'bg-red-500',
      bestseller: 'bg-purple-500',
      trending: 'bg-orange-500',
      limited: 'bg-pink-500',
      exclusive: 'bg-indigo-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const handleOptionChange = (optionType: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionType]: value };
    setSelectedOptions(newOptions);
    
    // Find matching variant
    const variant = product.variants.find(v => 
      Object.keys(newOptions).every(key => v.options[key] === newOptions[key])
    );
    
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    if (selectedVariant && selectedVariant.inventory.trackQuantity) {
      const maxQuantity = selectedVariant.inventory.allowBackorder 
        ? newQuantity 
        : Math.min(newQuantity, selectedVariant.inventory.quantity);
      setQuantity(maxQuantity);
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      onAddToCart(selectedVariant._id, quantity);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist(product._id);
  };

  const currentImages = selectedVariant?.images || product.images;
  const currentPrice = selectedVariant?.price || product.price;
  const currentComparePrice = selectedVariant?.compareAtPrice || product.compareAtPrice;
  const currentAvailability = selectedVariant?.availability || 'in_stock';

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <span>/</span>
        <Link href={`/categories/${product.category.slug}`} className="hover:text-gray-900">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <Image
              src={currentImages[selectedImageIndex]?.url || '/api/placeholder/600/600'}
              alt={currentImages[selectedImageIndex]?.alt || product.name}
              fill
              className="object-cover cursor-pointer"
              onClick={() => setShowImageModal(true)}
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {product.badges.map((badge, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-sm font-medium text-white rounded-full ${getBadgeColor(badge.type)}`}
                >
                  {badge.text || badge.type}
                </span>
              ))}
            </div>

            {/* Video Play Button */}
            {product.videos && product.videos.length > 0 && (
              <button
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="absolute bottom-4 right-4 w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
              >
                {isVideoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
            )}

            {/* Image Navigation */}
            {currentImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex(Math.min(currentImages.length - 1, selectedImageIndex + 1))}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          {currentImages.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {currentImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    index === selectedImageIndex ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Seller Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                href={`/sellers/${product.seller._id}`}
                className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
              >
                <span className="font-medium text-gray-900">{product.seller.businessName}</span>
                {product.seller.verified && (
                  <Shield className="w-4 h-4 text-blue-500" />
                )}
              </Link>
              <div className="flex items-center space-x-1">
                {renderStars(product.seller.rating, 'sm')}
                <span className="text-sm text-gray-600">({product.seller.totalSales} sales)</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Eye className="w-4 h-4" />
              <span>{product.analytics.views.toLocaleString()} views</span>
            </div>
          </div>

          {/* Product Name */}
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          {/* Rating & Reviews */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {renderStars(product.reviews.averageRating, 'md')}
              <span className="font-medium text-gray-900">{product.reviews.averageRating}</span>
            </div>
            <Link
              href="#reviews"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ({product.reviews.totalReviews} reviews)
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-600">
              {product.analytics.wishlistCount} people added to wishlist
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(currentPrice)}</span>
            {currentComparePrice && (
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(currentComparePrice)}
              </span>
            )}
            {currentComparePrice && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
                {Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${getAvailabilityColor(currentAvailability)}`}>
              {currentAvailability.replace('_', ' ').toUpperCase()}
            </span>
            {selectedVariant?.inventory.trackQuantity && selectedVariant.inventory.quantity <= 10 && (
              <span className="text-sm text-orange-600">
                Only {selectedVariant.inventory.quantity} left in stock!
              </span>
            )}
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="space-y-4">
              {/* Size Selection */}
              {product.variants.some(v => v.options.size) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(product.variants.map(v => v.options.size).filter(Boolean))).map((size) => (
                      <button
                        key={size}
                        onClick={() => handleOptionChange('size', size!)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                          selectedOptions.size === size
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.variants.some(v => v.options.color) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(product.variants.map(v => v.options.color).filter(Boolean))).map((color) => (
                      <button
                        key={color}
                        onClick={() => handleOptionChange('color', color!)}
                        className={`w-10 h-10 rounded-full border-2 ${
                          selectedOptions.color === color
                            ? 'border-blue-500'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Quantity:</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-center min-w-[60px]">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={currentAvailability === 'out_of_stock'}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
            
            <button
              onClick={handleWishlistToggle}
              className={`p-3 border rounded-lg transition-colors ${
                isWishlisted
                  ? 'border-red-500 bg-red-50 text-red-600'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={() => onShare(product._id)}
              className="p-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Features */}
          {product.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{feature.name}: {feature.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Shipping Information</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {product.shipping.freeShipping && (
                <p className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Free shipping on orders over $50</span>
                </p>
              )}
              <p className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Handling time: {product.shipping.handlingTime} business days</span>
              </p>
              {product.shipping.internationalShipping && (
                <p className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <span>International shipping available</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'reviews', label: `Reviews (${product.reviews.totalReviews})` },
              { id: 'shipping', label: 'Shipping & Returns' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed">
                {showFullDescription ? product.description : product.shortDescription}
                {product.description.length > product.shortDescription.length && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showFullDescription ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Product Specifications</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Brand</dt>
                    <dd className="text-gray-900">{product.seller.businessName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Category</dt>
                    <dd className="text-gray-900">{product.category.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">SKU</dt>
                    <dd className="text-gray-900">{selectedVariant?.sku || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Review Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {product.reviews.averageRating}
                  </div>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {renderStars(product.reviews.averageRating, 'lg')}
                  </div>
                  <p className="text-gray-600">Based on {product.reviews.totalReviews} reviews</p>
                </div>
                
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 w-8">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${(product.reviews.ratingDistribution[rating as keyof typeof product.reviews.ratingDistribution] / product.reviews.totalReviews) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {product.reviews.ratingDistribution[rating as keyof typeof product.reviews.ratingDistribution]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {review.user.name.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">{review.user.name}</span>
                          {review.user.verified && (
                            <Shield className="w-4 h-4 text-blue-500" />
                          )}
                          <div className="flex items-center">
                            {renderStars(review.rating, 'sm')}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        
                        <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                        <p className="text-gray-700 mb-4">{review.comment}</p>
                        
                        {review.images && review.images.length > 0 && (
                          <div className="flex space-x-2 mb-4">
                            {review.images.map((image, index) => (
                              <Image
                                key={index}
                                src={image.url}
                                alt={image.alt}
                                width={80}
                                height={80}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                            <ThumbsUp className="w-4 h-4" />
                            <span>Helpful ({review.helpful})</span>
                          </button>
                          <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                            <ThumbsDown className="w-4 h-4" />
                            <span>Not helpful</span>
                          </button>
                          <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                            <Flag className="w-4 h-4" />
                            <span>Report</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Shipping Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span>Standard shipping: 5-7 business days</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-orange-600" />
                    <span>Express shipping: 2-3 business days</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>Free shipping on orders over $50</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Return Policy</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="w-5 h-5 text-purple-600" />
                    <span>30-day return window</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Free return shipping</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <span>Money-back guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {product.relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct._id}
                href={`/products/${relatedProduct._id}`}
                className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gray-100">
                  <Image
                    src={relatedProduct.primaryImage.url}
                    alt={relatedProduct.primaryImage.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    {renderStars(relatedProduct.reviews.averageRating, 'sm')}
                    <span className="text-sm text-gray-600">
                      ({relatedProduct.reviews.totalReviews})
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPrice(relatedProduct.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
