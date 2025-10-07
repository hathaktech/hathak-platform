"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Eye, 
  Filter, 
  SortAsc, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  Zap,
  Tag,
  Clock,
  Crown,
  Sparkles,
  ArrowRight,
  ChevronDown,
  X
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  primaryImage: { url: string; alt: string };
  images: Array<{ url: string; alt: string; isPrimary: boolean; order: number }>;
  badges: Array<{ type: string; text: string; color: string }>;
  reviews: { averageRating: number; totalReviews: number };
  seller: { businessName: string; verified: boolean };
  availability: string;
  shipping: { freeShipping: boolean; handlingTime: number };
  analytics: { views: number; wishlistCount: number };
  createdAt: string;
}

interface FilterOption {
  id: string;
  name: string;
  count: number;
  selected: boolean;
}

interface FilterGroup {
  id: string;
  name: string;
  options: FilterOption[];
  type: 'checkbox' | 'radio' | 'range';
}

const SHEINStyleProductGrid: React.FC<{
  products: Product[];
  loading: boolean;
  viewMode: 'grid' | 'list' | 'masonry';
  onViewModeChange: (mode: 'grid' | 'list' | 'masonry') => void;
  onSortChange: (sort: string) => void;
  onFilterChange: (filters: any) => void;
  showFilters: boolean;
  totalResults: number;
}> = ({ products, loading, viewMode, onViewModeChange, onSortChange, onFilterChange, showFilters, totalResults }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedFilters, setSelectedFilters] = useState<any>({});
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());

  const filterGroups: FilterGroup[] = [
    {
      id: 'price',
      name: 'Price',
      type: 'range',
      options: [
        { id: '0-25', name: 'Under $25', count: 0, selected: false },
        { id: '25-50', name: '$25 - $50', count: 0, selected: false },
        { id: '50-100', name: '$50 - $100', count: 0, selected: false },
        { id: '100+', name: 'Over $100', count: 0, selected: false }
      ]
    },
    {
      id: 'rating',
      name: 'Rating',
      type: 'checkbox',
      options: [
        { id: '5', name: '5 Stars', count: 0, selected: false },
        { id: '4', name: '4+ Stars', count: 0, selected: false },
        { id: '3', name: '3+ Stars', count: 0, selected: false }
      ]
    },
    {
      id: 'shipping',
      name: 'Shipping',
      type: 'checkbox',
      options: [
        { id: 'free', name: 'Free Shipping', count: 0, selected: false },
        { id: 'fast', name: 'Fast Delivery', count: 0, selected: false }
      ]
    },
    {
      id: 'badges',
      name: 'Special Offers',
      type: 'checkbox',
      options: [
        { id: 'sale', name: 'On Sale', count: 0, selected: false },
        { id: 'new', name: 'New Arrivals', count: 0, selected: false },
        { id: 'trending', name: 'Trending', count: 0, selected: false }
      ]
    }
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSortChange(value);
  };

  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    const newFilters = { ...selectedFilters };
    if (!newFilters[groupId]) {
      newFilters[groupId] = [];
    }
    
    if (checked) {
      newFilters[groupId].push(optionId);
    } else {
      newFilters[groupId] = newFilters[groupId].filter((id: string) => id !== optionId);
    }
    
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlistItems);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlistItems(newWishlist);
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

  const ProductCard = ({ product, isList = false }: { product: Product; isList?: boolean }) => (
    <div className={`group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 ${
      isList ? 'flex' : ''
    }`}>
      <div className={`relative ${isList ? 'w-48 h-48' : 'aspect-square'} overflow-hidden`}>
        <Image
          src={product.primaryImage.url}
          alt={product.primaryImage.alt}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.badges.slice(0, 2).map((badge, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(badge)}`}
            >
              {badge.text}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => toggleWishlist(product._id)}
            className={`p-2 rounded-full ${
              wishlistItems.has(product._id) 
                ? 'bg-pink-500 text-white' 
                : 'bg-white/80 text-gray-700 hover:bg-pink-500 hover:text-white'
            } transition-colors duration-300`}
          >
            <Heart className={`w-4 h-4 ${wishlistItems.has(product._id) ? 'fill-current' : ''}`} />
          </button>
          <button className="p-2 bg-white/80 rounded-full text-gray-700 hover:bg-pink-500 hover:text-white transition-colors duration-300">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add to Cart */}
        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Quick Add
          </button>
        </div>
      </div>

      <div className={`p-4 ${isList ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors">
            {product.name}
          </h3>
          {product.seller.verified && (
            <Crown className="w-4 h-4 text-blue-500 flex-shrink-0 ml-2" />
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.reviews.averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews.totalReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900 text-lg">${product.price}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">${product.compareAtPrice}</span>
            )}
          </div>
          {product.shipping.freeShipping && (
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
              Free
            </span>
          )}
        </div>

        {/* Seller */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>by {product.seller.businessName}</span>
          <span>{product.analytics.wishlistCount} ♥</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Results Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-900">
            {totalResults.toLocaleString()} Products
          </h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4" />
            <span>Trending Now</span>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-4">
          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* View Mode */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {isFilterOpen && (
          <div className="w-64 bg-white rounded-2xl p-6 border border-gray-100 sticky top-24 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="md:hidden p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {filterGroups.map((group) => (
                <div key={group.id}>
                  <h4 className="font-medium text-gray-900 mb-3">{group.name}</h4>
                  <div className="space-y-2">
                    {group.options.map((option) => (
                      <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type={group.type === 'radio' ? 'radio' : 'checkbox'}
                          name={group.type === 'radio' ? group.id : undefined}
                          checked={selectedFilters[group.id]?.includes(option.id) || false}
                          onChange={(e) => handleFilterChange(group.id, option.id, e.target.checked)}
                          className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-700">{option.name}</span>
                        <span className="text-xs text-gray-500 ml-auto">({option.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedFilters({});
                  onFilterChange({});
                }}
                className="w-full text-sm text-gray-600 hover:text-pink-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {viewMode === 'list' ? (
            <div className="space-y-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} isList={true} />
              ))}
            </div>
          ) : (
            <div className={`grid gap-4 ${
              viewMode === 'masonry' 
                ? 'columns-1 md:columns-2 lg:columns-3 xl:columns-4' 
                : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'
            }`}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {products.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Tag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setSelectedFilters({});
                  onFilterChange({});
                }}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SHEINStyleProductGrid;
