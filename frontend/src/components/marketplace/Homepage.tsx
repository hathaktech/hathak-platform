'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  Star, 
  TrendingUp, 
  Zap, 
  Clock, 
  Truck, 
  Shield,
  Heart,
  ShoppingCart,
  Eye,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import ProductGrid from './ProductGrid';
import { Category, Product } from '@/types/product';

interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  position: 'left' | 'center' | 'right';
}

interface HomepageProps {
  categories: Category[];
  featuredProducts: Product[];
  trendingProducts: Product[];
  newProducts: Product[];
  bestsellers: Product[];
}

const Homepage: React.FC<HomepageProps> = ({
  categories,
  featuredProducts,
  trendingProducts,
  newProducts,
  bestsellers
}) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'masonry'>('grid');

  // Mock hero banners
  const heroBanners: HeroBanner[] = [
    {
      id: '1',
      title: 'Discover Amazing Products',
      subtitle: 'Shop from thousands of verified sellers worldwide',
      image: '/api/placeholder/1200/600',
      ctaText: 'Shop Now',
      ctaLink: '/products',
      badge: 'New Collection',
      position: 'left'
    },
    {
      id: '2',
      title: 'Trending This Week',
      subtitle: 'Find the hottest products everyone is talking about',
      image: '/api/placeholder/1200/600',
      ctaText: 'Explore Trends',
      ctaLink: '/trending',
      badge: 'Trending',
      position: 'center'
    },
    {
      id: '3',
      title: 'Free Shipping Worldwide',
      subtitle: 'On orders over $50. No hidden fees, no surprises.',
      image: '/api/placeholder/1200/600',
      ctaText: 'Start Shopping',
      ctaLink: '/products',
      badge: 'Free Shipping',
      position: 'right'
    }
  ];

  // Auto-rotate banners
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, heroBanners.length]);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="relative w-full h-full">
          {heroBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentBanner ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                
                <div className={`absolute inset-0 flex items-center ${
                  banner.position === 'left' ? 'justify-start pl-8 lg:pl-16' :
                  banner.position === 'center' ? 'justify-center' :
                  'justify-end pr-8 lg:pr-16'
                }`}>
                  <div className={`max-w-md text-white ${
                    banner.position === 'center' ? 'text-center' : ''
                  }`}>
                    {banner.badge && (
                      <div className="inline-flex items-center px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium mb-4">
                        <Zap className="w-4 h-4 mr-2" />
                        {banner.badge}
                      </div>
                    )}
                    
                    <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                      {banner.title}
                    </h1>
                    
                    <p className="text-lg lg:text-xl mb-8 opacity-90">
                      {banner.subtitle}
                    </p>
                    
                    <Link
                      href={banner.ctaLink}
                      className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      {banner.ctaText}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Banner Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
          <button
            onClick={prevBanner}
            className="p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex space-x-2">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentBanner ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextBanner}
            className="p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <button
            onClick={toggleAutoPlay}
            className="p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-colors"
          >
            {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover products from our carefully curated categories
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className="group text-center"
              >
                <div className="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden bg-gray-100 group-hover:shadow-lg transition-all duration-300">
                  <Image
                    src={typeof category.image === 'string' ? category.image : category.image?.url || '/api/placeholder/200/200'}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {category.productCount} products
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Handpicked products from our top sellers
              </p>
            </div>
            <Link
              href="/products?featured=true"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <ProductGrid
            products={featuredProducts}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showFilters={false}
          />
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Trending Now
                </h2>
                <p className="text-gray-600">
                  What's hot and happening right now
                </p>
              </div>
            </div>
            <Link
              href="/trending"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.slice(0, 4).map((product, index) => (
              <div
                key={product._id}
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-square">
                  <Link href={`/products/${product._id}`}>
                    <div className="relative w-full h-full overflow-hidden">
                      {product.primaryImage ? (
                        <Image
                          src={product.primaryImage.url}
                          alt={product.primaryImage.alt}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-sm font-medium">No Image</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded-full">
                          Trending
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">
                      {typeof product.seller === 'string' 
                        ? product.seller 
                        : product.seller.businessName}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Eye className="w-3 h-3" />
                      <span>{product.analytics.views.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link href={`/products/${product._id}`}>
                    <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {renderStars(product.reviews.averageRating)}
                    </div>
                    <span className="text-xs text-gray-500">
                      ({product.reviews.totalReviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    
                    <button className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  New Arrivals
                </h2>
                <p className="text-gray-600">
                  Fresh products just added to our marketplace
                </p>
              </div>
            </div>
            <Link
              href="/products?sort=newest"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <ProductGrid
            products={newProducts}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showFilters={false}
          />
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Bestsellers
                </h2>
                <p className="text-gray-600">
                  Our most popular products loved by customers
                </p>
              </div>
            </div>
            <Link
              href="/products?sort=popular"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <ProductGrid
            products={bestsellers}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showFilters={false}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of sellers and start your own online store today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/seller/register"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Become a Seller
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/seller/learn-more"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
