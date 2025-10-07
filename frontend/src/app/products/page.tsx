'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/marketplace/ProductGrid';
import SearchAndFilters from '@/components/marketplace/SearchAndFilters';
import { Product } from '@/types/product';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'masonry'>('grid');
  const [filters, setFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in real app, this would come from API
  const mockProducts: Product[] = [
    {
      _id: '1',
      name: 'Wireless Bluetooth Headphones',
      shortDescription: 'Premium quality wireless headphones with noise cancellation',
      price: 89.99,
      compareAtPrice: 129.99,
      primaryImage: { url: '/api/placeholder/300/300', alt: 'Headphones' },
      images: [{ url: '/api/placeholder/300/300', alt: 'Headphones', isPrimary: true, order: 0 }],
      badges: [{ type: 'featured', text: 'Featured', color: 'blue' }],
      reviews: { averageRating: 4.5, totalReviews: 234, ratingDistribution: { 5: 150, 4: 60, 3: 20, 2: 3, 1: 1 } },
      seller: { businessName: 'TechStore', verified: true },
      availability: 'in_stock',
      shipping: { freeShipping: true, handlingTime: 2, internationalShipping: true },
      analytics: { views: 1250, wishlistCount: 45, clicks: 200, conversions: 15 },
      createdAt: '2024-01-15T00:00:00Z'
    },
    {
      _id: '2',
      name: 'Smart Fitness Watch',
      shortDescription: 'Advanced fitness tracking with heart rate monitoring',
      price: 199.99,
      primaryImage: { url: '/api/placeholder/300/300', alt: 'Smart Watch' },
      images: [{ url: '/api/placeholder/300/300', alt: 'Smart Watch', isPrimary: true, order: 0 }],
      badges: [{ type: 'bestseller', text: 'Bestseller', color: 'purple' }],
      reviews: { averageRating: 4.8, totalReviews: 156, ratingDistribution: { 5: 120, 4: 30, 3: 5, 2: 1, 1: 0 } },
      seller: { businessName: 'WearableTech', verified: true },
      availability: 'in_stock',
      shipping: { freeShipping: true, handlingTime: 1, internationalShipping: true },
      analytics: { views: 980, wishlistCount: 67, clicks: 150, conversions: 25 },
      createdAt: '2024-01-10T00:00:00Z'
    },
    {
      _id: '3',
      name: 'Premium Coffee Beans',
      shortDescription: 'Single-origin coffee beans from Ethiopia',
      price: 24.99,
      primaryImage: { url: '/api/placeholder/300/300', alt: 'Coffee' },
      images: [{ url: '/api/placeholder/300/300', alt: 'Coffee', isPrimary: true, order: 0 }],
      badges: [{ type: 'trending', text: 'Trending', color: 'orange' }],
      reviews: { averageRating: 4.3, totalReviews: 89, ratingDistribution: { 5: 50, 4: 25, 3: 10, 2: 3, 1: 1 } },
      seller: { businessName: 'CoffeeCo', verified: true },
      availability: 'in_stock',
      shipping: { freeShipping: false, handlingTime: 3, internationalShipping: false },
      analytics: { views: 750, wishlistCount: 23, clicks: 100, conversions: 8 },
      createdAt: '2024-01-12T00:00:00Z'
    },
    {
      _id: '4',
      name: 'Organic Skincare Set',
      shortDescription: 'Complete skincare routine with natural ingredients',
      price: 79.99,
      primaryImage: { url: '/api/placeholder/300/300', alt: 'Skincare' },
      images: [{ url: '/api/placeholder/300/300', alt: 'Skincare', isPrimary: true, order: 0 }],
      badges: [{ type: 'new', text: 'New', color: 'green' }],
      reviews: { averageRating: 4.6, totalReviews: 45, ratingDistribution: { 5: 30, 4: 12, 3: 2, 2: 1, 1: 0 } },
      seller: { businessName: 'BeautyBrand', verified: true },
      availability: 'in_stock',
      shipping: { freeShipping: true, handlingTime: 2, internationalShipping: true },
      analytics: { views: 320, wishlistCount: 12, clicks: 50, conversions: 5 },
      createdAt: '2024-01-20T00:00:00Z'
    },
    {
      _id: '5',
      name: 'Yoga Mat Premium',
      shortDescription: 'Non-slip yoga mat with carrying strap',
      price: 39.99,
      primaryImage: { url: '/api/placeholder/300/300', alt: 'Yoga Mat' },
      images: [{ url: '/api/placeholder/300/300', alt: 'Yoga Mat', isPrimary: true, order: 0 }],
      badges: [{ type: 'bestseller', text: 'Bestseller', color: 'purple' }],
      reviews: { averageRating: 4.7, totalReviews: 123, ratingDistribution: { 5: 90, 4: 25, 3: 6, 2: 2, 1: 0 } },
      seller: { businessName: 'FitnessGear', verified: true },
      availability: 'in_stock',
      shipping: { freeShipping: true, handlingTime: 1, internationalShipping: true },
      analytics: { views: 890, wishlistCount: 34, clicks: 120, conversions: 18 },
      createdAt: '2024-01-05T00:00:00Z'
    },
    {
      _id: '6',
      name: 'Wireless Charging Pad',
      shortDescription: 'Fast wireless charging for smartphones',
      price: 29.99,
      compareAtPrice: 39.99,
      primaryImage: { url: '/api/placeholder/300/300', alt: 'Charging Pad' },
      images: [{ url: '/api/placeholder/300/300', alt: 'Charging Pad', isPrimary: true, order: 0 }],
      badges: [{ type: 'sale', text: 'Sale', color: 'red' }],
      reviews: { averageRating: 4.2, totalReviews: 78, ratingDistribution: { 5: 40, 4: 25, 3: 10, 2: 2, 1: 1 } },
      seller: { businessName: 'TechStore', verified: true },
      availability: 'in_stock',
      shipping: { freeShipping: true, handlingTime: 2, internationalShipping: true },
      analytics: { views: 450, wishlistCount: 19, clicks: 80, conversions: 12 },
      createdAt: '2024-01-18T00:00:00Z'
    },
    {
      _id: '7',
      name: 'Bluetooth Speaker',
      shortDescription: 'Portable speaker with 360-degree sound',
      price: 59.99,
      primaryImage: { url: '/api/placeholder/300/300', alt: 'Speaker' },
      images: [{ url: '/api/placeholder/300/300', alt: 'Speaker', isPrimary: true, order: 0 }],
      badges: [{ type: 'trending', text: 'Trending', color: 'orange' }],
      reviews: { averageRating: 4.4, totalReviews: 167, ratingDistribution: { 5: 100, 4: 50, 3: 15, 2: 2, 1: 0 } },
      seller: { businessName: 'AudioPro', verified: true },
      availability: 'in_stock',
      shipping: { freeShipping: true, handlingTime: 1, internationalShipping: true },
      analytics: { views: 680, wishlistCount: 28, clicks: 110, conversions: 20 },
      createdAt: '2024-01-14T00:00:00Z'
    },
    {
      _id: '8',
      name: 'Mechanical Keyboard',
      shortDescription: 'RGB mechanical keyboard for gaming and typing',
      price: 149.99,
      primaryImage: { url: '/api/placeholder/300/300', alt: 'Keyboard' },
      images: [{ url: '/api/placeholder/300/300', alt: 'Keyboard', isPrimary: true, order: 0 }],
      badges: [{ type: 'featured', text: 'Featured', color: 'blue' }],
      reviews: { averageRating: 4.9, totalReviews: 92, ratingDistribution: { 5: 85, 4: 6, 3: 1, 2: 0, 1: 0 } },
      seller: { businessName: 'GamingGear', verified: true },
      availability: 'in_stock',
      shipping: { freeShipping: true, handlingTime: 2, internationalShipping: true },
      analytics: { views: 1100, wishlistCount: 56, clicks: 180, conversions: 30 },
      createdAt: '2024-01-08T00:00:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadProducts = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts(mockProducts);
      setTotalResults(mockProducts.length);
      setLoading(false);
    };

    loadProducts();
  }, [searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sort: string) => {
    // In real app, this would trigger a new API call
    console.log('Sort changed:', sort);
  };

  const handleViewModeChange = (mode: 'grid' | 'list' | 'masonry') => {
    setViewMode(mode);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-gray-600">
            Discover amazing products from our marketplace
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchAndFilters
            onSearch={handleSearch}
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
            onViewModeChange={handleViewModeChange}
            viewMode={viewMode}
            totalResults={totalResults}
          />
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={products}
          loading={loading}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onSortChange={handleSortChange}
          onFilterChange={handleFiltersChange}
          showFilters={false}
        />
      </div>
    </div>
  );
}
