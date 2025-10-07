'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ExternalLink, Search, Filter, Grid, List, Globe, Package, Truck, Shield } from 'lucide-react';
import { Brand } from '@/types/buyme';

interface BrandsCatalogProps {
  brands?: Brand[];
}

export default function BrandsCatalog({ brands = [] }: BrandsCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'reviews'>('name');

  // Mock data for demonstration
  const mockBrands: Brand[] = [
    {
      _id: '1',
      name: 'Amazon',
      logo: '/brands/amazon.png',
      website: 'https://amazon.com',
      category: 'Marketplace',
      services: ['Product Sourcing', 'Fast Shipping', 'Prime Delivery'],
      description: 'World\'s largest online marketplace with millions of products',
      rating: 4.8,
      reviewCount: 125000
    },
    {
      _id: '2',
      name: 'eBay',
      logo: '/brands/ebay.png',
      website: 'https://ebay.com',
      category: 'Marketplace',
      services: ['Auction', 'Buy It Now', 'Global Shipping'],
      description: 'Global marketplace for new and used items',
      rating: 4.6,
      reviewCount: 89000
    },
    {
      _id: '3',
      name: 'AliExpress',
      logo: '/brands/aliexpress.png',
      website: 'https://aliexpress.com',
      category: 'Marketplace',
      services: ['Bulk Orders', 'Dropshipping', 'Global Shipping'],
      description: 'Leading global wholesale marketplace',
      rating: 4.4,
      reviewCount: 67000
    },
    {
      _id: '4',
      name: 'Nike',
      logo: '/brands/nike.png',
      website: 'https://nike.com',
      category: 'Fashion',
      services: ['Exclusive Releases', 'Custom Products', 'Fast Shipping'],
      description: 'Just Do It - Premium athletic wear and footwear',
      rating: 4.7,
      reviewCount: 45000
    },
    {
      _id: '5',
      name: 'Apple',
      logo: '/brands/apple.png',
      website: 'https://apple.com',
      category: 'Electronics',
      services: ['Latest Products', 'Premium Support', 'Fast Delivery'],
      description: 'Innovation in technology and design',
      rating: 4.9,
      reviewCount: 78000
    },
    {
      _id: '6',
      name: 'Zara',
      logo: '/brands/zara.png',
      website: 'https://zara.com',
      category: 'Fashion',
      services: ['Trendy Fashion', 'Fast Fashion', 'Global Shipping'],
      description: 'Spanish fast fashion retailer',
      rating: 4.3,
      reviewCount: 32000
    },
    {
      _id: '7',
      name: 'Walmart',
      logo: '/brands/walmart.png',
      website: 'https://walmart.com',
      category: 'Retail',
      services: ['Everyday Low Prices', 'Grocery Delivery', 'Pickup Service'],
      description: 'Save money. Live better.',
      rating: 4.2,
      reviewCount: 95000
    },
    {
      _id: '8',
      name: 'Target',
      logo: '/brands/target.png',
      website: 'https://target.com',
      category: 'Retail',
      services: ['Style & Quality', 'Same Day Delivery', 'Drive Up'],
      description: 'Expect more. Pay less.',
      rating: 4.4,
      reviewCount: 56000
    }
  ];

  const displayBrands = brands.length > 0 ? brands : mockBrands;

  const categories = ['all', ...Array.from(new Set(displayBrands.map(brand => brand.category)))];

  const filteredBrands = displayBrands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedBrands = [...filteredBrands].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'reviews':
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      default:
        return 0;
    }
  });

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

  const getServiceIcon = (service: string) => {
    if (service.toLowerCase().includes('shipping')) return Truck;
    if (service.toLowerCase().includes('product')) return Package;
    if (service.toLowerCase().includes('global')) return Globe;
    return Shield;
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-1 bg-opacity-10 rounded-lg">
          <Package className="w-6 h-6 text-primary-1" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900">Brands Catalog</h2>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search brands..."
            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-1 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-600" />
            <span className="text-sm font-medium text-neutral-700">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-1 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
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
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="reviews">Reviews</option>
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary-1 text-white' : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary-1 text-white' : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Brands Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedBrands.map((brand) => (
            <div
              key={brand._id}
              className="border border-neutral-200 rounded-lg p-6 hover:shadow-elegant transition-shadow group"
            >
              <div className="text-center">
                {/* Brand Logo */}
                <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary-1 bg-opacity-10 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-1">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Brand Name */}
                <h3 className="font-semibold text-neutral-900 mb-2">{brand.name}</h3>
                
                {/* Category */}
                <span className="inline-block px-2 py-1 bg-primary-1 bg-opacity-10 text-primary-1 text-xs font-medium rounded-full mb-3">
                  {brand.category}
                </span>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-2">
                  {renderStars(brand.rating || 0)}
                  <span className="text-sm text-neutral-600 ml-1">
                    ({brand.reviewCount?.toLocaleString()})
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                  {brand.description}
                </p>

                {/* Services */}
                <div className="space-y-2 mb-4">
                  {brand.services.slice(0, 2).map((service, index) => {
                    const ServiceIcon = getServiceIcon(service);
                    return (
                      <div key={index} className="flex items-center gap-2 text-xs text-neutral-600">
                        <ServiceIcon className="w-3 h-3" />
                        <span>{service}</span>
                      </div>
                    );
                  })}
                  {brand.services.length > 2 && (
                    <div className="text-xs text-neutral-500">
                      +{brand.services.length - 2} more services
                    </div>
                  )}
                </div>

                {/* Visit Store Button */}
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-1 text-white text-sm font-medium rounded-lg hover:bg-primary-2 transition-colors group-hover:shadow-elegant"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Store
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBrands.map((brand) => (
            <div
              key={brand._id}
              className="border border-neutral-200 rounded-lg p-6 hover:shadow-elegant transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Brand Logo */}
                <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-1 bg-opacity-10 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-1">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Brand Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">{brand.name}</h3>
                      <span className="inline-block px-2 py-1 bg-primary-1 bg-opacity-10 text-primary-1 text-xs font-medium rounded-full">
                        {brand.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        {renderStars(brand.rating || 0)}
                        <span className="text-sm text-neutral-600">
                          {brand.rating?.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-500">
                        {brand.reviewCount?.toLocaleString()} reviews
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-600 mb-3">{brand.description}</p>

                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {brand.services.map((service, index) => {
                      const ServiceIcon = getServiceIcon(service);
                      return (
                        <div key={index} className="flex items-center gap-1 px-2 py-1 bg-neutral-100 text-xs text-neutral-600 rounded">
                          <ServiceIcon className="w-3 h-3" />
                          <span>{service}</span>
                        </div>
                      );
                    })}
                  </div>

                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-1 text-white text-sm font-medium rounded-lg hover:bg-primary-2 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Store
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="mt-8 text-center text-sm text-neutral-600">
        Showing {sortedBrands.length} of {displayBrands.length} brands
      </div>
    </div>
  );
}
