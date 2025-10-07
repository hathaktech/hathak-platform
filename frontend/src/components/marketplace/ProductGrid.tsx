'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  Star, 
  Zap, 
  TrendingUp,
  Clock,
  Truck,
  Shield,
  ArrowRight,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  viewMode?: 'grid' | 'list' | 'masonry';
  onViewModeChange?: (mode: 'grid' | 'list' | 'masonry') => void;
  onSortChange?: (sort: string) => void;
  onFilterChange?: (filters: any) => void;
  showFilters?: boolean;
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  viewMode = 'grid',
  onViewModeChange,
  onSortChange,
  onFilterChange,
  showFilters = true,
  className = ''
}) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());

  const handleWishlistToggle = useCallback((productId: string) => {
    setWishlistItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'New';
    if (diffDays <= 7) return `${diffDays}d ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}w ago`;
    return `${Math.ceil(diffDays / 30)}mo ago`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
    const isHovered = hoveredProduct === product._id;
    const isWishlisted = wishlistItems.has(product._id);
    const discountPercentage = product.compareAtPrice 
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

    return (
      <div
        className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${
          viewMode === 'list' ? 'flex' : ''
        }`}
        onMouseEnter={() => setHoveredProduct(product._id)}
        onMouseLeave={() => setHoveredProduct(null)}
        style={{
          animationDelay: `${index * 50}ms`
        }}
      >
        {/* Image Container */}
        <div className={`relative ${viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-square'}`}>
          <Link href={`/products/${product._id}`}>
            <div className="relative w-full h-full overflow-hidden">
              {product.primaryImage ? (
                <Image
                  src={product.primaryImage.url}
                  alt={product.primaryImage.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes={viewMode === 'list' ? '192px' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm font-medium">No Image</span>
                  </div>
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {product.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getBadgeColor(badge.type)}`}
                  >
                    {badge.text || badge.type}
                  </span>
                ))}
                {product.createdAt && formatDate(product.createdAt) === 'New' && (
                  <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">
                    New
                  </span>
                )}
              </div>

              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                    -{discountPercentage}%
                  </span>
                </div>
              )}

              {/* Quick Actions */}
              <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleWishlistToggle(product._id);
                    }}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isWishlisted 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button className="p-2 bg-white text-gray-700 rounded-full hover:bg-blue-50 hover:text-blue-500 transition-all duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 bg-white text-gray-700 rounded-full hover:bg-green-50 hover:text-green-500 transition-all duration-200">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Product Info */}
        <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          {/* Seller Info */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-600">
                {typeof product.seller === 'string' 
                  ? product.seller 
                  : product.seller.businessName}
              </span>
              {typeof product.seller === 'object' && 'verified' in product.seller && product.seller.verified && (
                <Shield className="w-3 h-3 text-blue-500" />
              )}
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Eye className="w-3 h-3" />
              <span>{product.analytics.views.toLocaleString()}</span>
            </div>
          </div>

          {/* Product Name */}
          <Link href={`/products/${product._id}`}>
            <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          {product.shortDescription && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {product.shortDescription}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {renderStars(product.reviews.averageRating)}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviews.totalReviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Availability & Shipping */}
          <div className="space-y-1">
            <div className={`text-xs font-medium ${getAvailabilityColor(product.availability)}`}>
              {product.availability.replace('_', ' ').toUpperCase()}
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {product.shipping.freeShipping && (
                <div className="flex items-center space-x-1">
                  <Truck className="w-3 h-3" />
                  <span>Free Shipping</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{product.shipping.handlingTime}d handling</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4">
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 group">
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controls */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                {products.length} products found
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange?.('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange?.('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              onChange={(e) => onSortChange?.(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : viewMode === 'list'
          ? 'grid-cols-1'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }`}>
        {products.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
          <button
            onClick={() => onFilterChange?.({})}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
