"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X,
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  Tag,
  Zap,
  Crown,
  Gift,
  Sparkles,
  ArrowRight,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  subcategories: string[] | Array<{ name: string; subcategories: string[] }>;
  isTrending?: boolean;
}

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

interface HeroBanner {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  isActive: boolean;
}

const SHEINStyleHomepage: React.FC<{
  categories: Category[];
  featuredProducts: Product[];
  trendingProducts: Product[];
  newProducts: Product[];
  bestsellers: Product[];
  heroBanners: HeroBanner[];
  products?: Product[];
  loading?: boolean;
  viewMode?: 'grid' | 'list' | 'masonry';
  onViewModeChange?: (mode: 'grid' | 'list' | 'masonry') => void;
  onSortChange?: (sort: string) => void;
  onFilterChange?: (filters: any) => void;
  totalResults?: number;
  searchQuery?: string;
  onSearch?: (query: string) => void;
}> = ({ 
  categories, 
  featuredProducts, 
  trendingProducts, 
  newProducts, 
  bestsellers, 
  heroBanners,
  products = [],
  loading = false,
  viewMode = 'grid',
  onViewModeChange,
  onSortChange,
  onFilterChange,
  totalResults = 0,
  searchQuery = '',
  onSearch
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedFilters, setSelectedFilters] = useState<any>({});
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categoryPositions, setCategoryPositions] = useState<{[key: string]: {left: number, width: number}}>({});
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Debug: Log hover state changes
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showScrollButtons, setShowScrollButtons] = useState(true);

  // Category position tracking
  const updateCategoryPosition = (categoryId: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const container = document.getElementById('desktop-nav');
    if (container) {
      const containerRect = container.getBoundingClientRect();
      setCategoryPositions(prev => ({
        ...prev,
        [categoryId]: {
          left: rect.left - containerRect.left,
          width: rect.width
        }
      }));
    }
  };

  // Hover handlers with delay
  const handleCategoryMouseEnter = (categoryId: string, element: HTMLElement) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredCategory(categoryId);
    updateCategoryPosition(categoryId, element);
  };

  const handleCategoryMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCategory(null);
    }, 150); // 150ms delay
    setHoverTimeout(timeout);
  };

  const handleDropdownMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleDropdownMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCategory(null);
    }, 150); // 150ms delay
    setHoverTimeout(timeout);
  };

  // Scroll functions
  const scrollLeft = (containerId: string) => {
    console.log('Scrolling left for:', containerId);
    const container = document.getElementById(containerId);
    if (container) {
      console.log('Container found, scrolling...');
      container.scrollBy({ left: -200, behavior: 'smooth' });
    } else {
      console.log('Container not found:', containerId);
    }
  };

  const scrollRight = (containerId: string) => {
    console.log('Scrolling right for:', containerId);
    const container = document.getElementById(containerId);
    if (container) {
      console.log('Container found, scrolling...');
      container.scrollBy({ left: 200, behavior: 'smooth' });
    } else {
      console.log('Container not found:', containerId);
    }
  };

  const checkScrollPosition = (containerId: string) => {
    const container = document.getElementById(containerId);
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Initialize scroll position check
  React.useEffect(() => {
    const checkAllScrollPositions = () => {
      checkScrollPosition('desktop-nav');
      checkScrollPosition('tablet-nav');
      checkScrollPosition('mobile-nav');
    };
    
    checkAllScrollPositions();
    window.addEventListener('resize', checkAllScrollPositions);
    
    return () => window.removeEventListener('resize', checkAllScrollPositions);
  }, []);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Mock data for additional sections
  const flashSales = [
    { id: 1, title: "Flash Sale", subtitle: "Up to 70% OFF", timeLeft: "23:59:59", color: "bg-red-500" },
    { id: 2, title: "New Arrivals", subtitle: "Fresh Styles", timeLeft: "12:30:45", color: "bg-pink-500" },
    { id: 3, title: "Weekend Special", subtitle: "Extra 20% OFF", timeLeft: "05:15:30", color: "bg-purple-500" }
  ];

  const influencerPicks = [
    { id: 1, name: "Emma's Picks", image: "/api/placeholder/200/200", followers: "2.3M", verified: true },
    { id: 2, name: "Fashion Forward", image: "/api/placeholder/200/200", followers: "1.8M", verified: true },
    { id: 3, name: "Style Guide", image: "/api/placeholder/200/200", followers: "950K", verified: false }
  ];

  const gamificationElements = [
    { id: 1, title: "Spin to Win", icon: "🎰", description: "Get instant discounts", color: "bg-gradient-to-r from-pink-500 to-purple-500" },
    { id: 2, title: "Daily Check-in", icon: "📅", description: "Earn points daily", color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
    { id: 3, title: "Refer & Earn", icon: "🎁", description: "Get $10 for each friend", color: "bg-gradient-to-r from-green-500 to-emerald-500" }
  ];

  return (
    <>
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="min-h-screen bg-white">
      {/* Top Header - Search and Actions */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search for products, brands, and more..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-pink-600 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-700 hover:text-pink-600 transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-700 hover:text-pink-600 transition-colors">
                <User className="w-5 h-5" />
              </button>
              <button 
                className="md:hidden p-2 text-gray-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Header - Category Navigation */}
      <header className="sticky top-16 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Left Scroll Indicator - Outside the bar */}
          <button
            onClick={() => scrollLeft('desktop-nav')}
            className="absolute -left-12 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white border-2 border-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-30 hidden lg:flex"
            aria-label="Scroll left"
          >
            <ChevronRight className="w-4 h-4 text-pink-600 rotate-180" />
          </button>
          
          {/* Right Scroll Indicator - Outside the bar */}
          <button
            onClick={() => scrollRight('desktop-nav')}
            className="absolute -right-12 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white border-2 border-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-30 hidden lg:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 text-pink-600" />
          </button>

          {/* Tablet Left Scroll Indicator - Outside the bar */}
          <button
            onClick={() => scrollLeft('tablet-nav')}
            className="absolute -left-12 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white border-2 border-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-30 hidden md:flex lg:hidden"
            aria-label="Scroll left"
          >
            <ChevronRight className="w-4 h-4 text-pink-600 rotate-180" />
          </button>
          
          {/* Tablet Right Scroll Indicator - Outside the bar */}
          <button
            onClick={() => scrollRight('tablet-nav')}
            className="absolute -right-12 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white border-2 border-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-30 hidden md:flex lg:hidden"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 text-pink-600" />
          </button>

          {/* Mobile Left Scroll Indicator - Outside the bar */}
          <button
            onClick={() => scrollLeft('mobile-nav')}
            className="absolute -left-10 top-1/2 transform -translate-y-1/2 w-7 h-7 bg-white border-2 border-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-30 md:hidden"
            aria-label="Scroll left"
          >
            <ChevronRight className="w-3 h-3 text-pink-600 rotate-180" />
          </button>
          
          {/* Mobile Right Scroll Indicator - Outside the bar */}
          <button
            onClick={() => scrollRight('mobile-nav')}
            className="absolute -right-10 top-1/2 transform -translate-y-1/2 w-7 h-7 bg-white border-2 border-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-30 md:hidden"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3 h-3 text-pink-600" />
          </button>

          <div className="flex items-center h-14">
            
            {/* Desktop Navigation with Modern Scrolling */}
            <div className="hidden lg:flex items-center w-full relative">
              <div 
                id="desktop-nav"
                className="flex items-center space-x-1 overflow-x-auto scrollbar-hide scroll-smooth w-full"
                onScroll={() => checkScrollPosition('desktop-nav')}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >

                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="relative group"
                    onMouseEnter={(e) => handleCategoryMouseEnter(category._id, e.currentTarget)}
                    onMouseLeave={handleCategoryMouseLeave}
                  >
                    <Link
                      href={`/HatHakStore?category=${category.slug}`}
                      className="flex items-center px-2 py-1.5 text-sm text-gray-700 hover:text-pink-600 font-medium transition-colors whitespace-nowrap rounded-lg hover:bg-pink-50 flex-shrink-0"
                    >
                      {category.name}
                      <ChevronDown className="ml-1 w-2.5 h-2.5 transition-transform group-hover:rotate-180" />
                    </Link>
                    
                  </div>
                ))}
              </div>
              
              {/* Dropdown Container - Outside scroll area */}
              <div 
                className="absolute top-full left-0 w-full pointer-events-none z-50"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                {categories.map((category) => (
                  hoveredCategory === category._id && categoryPositions[category._id] && (
                    <div 
                      key={`dropdown-${category._id}`} 
                      className="absolute top-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl py-0 pointer-events-auto transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-2"
                      style={{
                        left: `${categoryPositions[category._id].left}px`,
                        transform: 'translateY(8px)',
                        opacity: 1,
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                      }}
                    >
                      {/* Arrow pointing up */}
                      <div 
                        className="absolute -top-2 left-6 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"
                        style={{ zIndex: 1 }}
                      ></div>
                      {/* Category Header */}
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900">{category.name}</h3>
                      </div>
                      
                      {/* Subcategories */}
                      {Array.isArray(category.subcategories) && category.subcategories.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto">
                          {category.subcategories.map((sub, index) => {
                            if (typeof sub === 'string') {
                              return (
                                <Link
                                  key={index}
                                  href={`/HatHakStore?category=${category.slug}&subcategory=${sub.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors border-b border-gray-50 last:border-b-0 group/item"
                                >
                                  <span className="group-hover/item:translate-x-1 transition-transform duration-150">
                                    {sub}
                                  </span>
                                </Link>
                              );
                            } else {
                              return (
                                <div key={index} className="border-b border-gray-50 last:border-b-0">
                                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                                    {sub.name}
                                  </div>
                                  {sub.subcategories.map((subSub, subIndex) => (
                                    <Link
                                      key={subIndex}
                                      href={`/HatHakStore?category=${category.slug}&subcategory=${subSub.toLowerCase().replace(/\s+/g, '-')}`}
                                      className="block px-6 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors group/sub"
                                    >
                                      <span className="group-hover/sub:translate-x-1 transition-transform duration-150">
                                        {subSub}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              );
                            }
                          })}
                        </div>
                      ) : (
                        <div className="px-4 py-6 text-sm text-gray-500 text-center">
                          No subcategories available
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
            
            {/* Tablet Navigation - Modern Scrolling */}
            <div className="hidden md:flex lg:hidden items-center w-full">
              <div 
                id="tablet-nav"
                className="flex items-center space-x-1 overflow-x-auto scrollbar-hide scroll-smooth w-full"
                onScroll={() => checkScrollPosition('tablet-nav')}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categories.slice(0, 8).map((category) => (
                  <div
                    key={category._id}
                    className="relative group"
                    onMouseEnter={() => setHoveredCategory(category._id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <Link
                      href={`/HatHakStore?category=${category.slug}`}
                      className="flex items-center px-2 py-1.5 text-sm text-gray-700 hover:text-pink-600 font-medium transition-colors whitespace-nowrap rounded-lg hover:bg-pink-50 flex-shrink-0"
                    >
                      {category.name}
                      <ChevronDown className="ml-1 w-2.5 h-2.5 transition-transform group-hover:rotate-180" />
                    </Link>
                    
                    {/* Dropdown Menu */}
                    {hoveredCategory === category._id && (
                      <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-3 z-50">
                        {Array.isArray(category.subcategories) && category.subcategories.length > 0 ? (
                          <div className="max-h-80 overflow-y-auto">
                            {category.subcategories.slice(0, 6).map((sub, index) => {
                              if (typeof sub === 'string') {
                                return (
                                  <Link
                                    key={index}
                                    href={`/HatHakStore?category=${category.slug}&subcategory=${sub.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors border-b border-gray-100 last:border-b-0"
                                  >
                                    {sub}
                                  </Link>
                                );
                              } else {
                                return (
                                  <div key={index} className="border-b border-gray-100 last:border-b-0">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                                      {sub.name}
                                    </div>
                                    {sub.subcategories.slice(0, 4).map((subSub, subIndex) => (
                                      <Link
                                        key={subIndex}
                                        href={`/HatHakStore?category=${category.slug}&subcategory=${subSub.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="block px-6 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                                      >
                                        {subSub}
                                      </Link>
                                    ))}
                                  </div>
                                );
                              }
                            })}
                          </div>
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">No subcategories available</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Navigation - Horizontal Scroll */}
            <div className="md:hidden flex items-center w-full">
              <div 
                id="mobile-nav"
                className="flex items-center space-x-1 overflow-x-auto scrollbar-hide scroll-smooth w-full"
                onScroll={() => checkScrollPosition('mobile-nav')}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/HatHakStore?category=${category.slug}`}
                    className="flex items-center px-2 py-1.5 text-gray-700 hover:text-pink-600 font-medium transition-colors whitespace-nowrap rounded-lg hover:bg-pink-50 flex-shrink-0 text-sm"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
                <div className="px-4 py-4 space-y-4">
                  {categories.map((category) => (
                    <div key={category._id}>
                      <Link
                        href={`/HatHakStore?category=${category.slug}`}
                        className="block text-gray-700 hover:text-pink-600 font-medium mb-2"
                      >
                        {category.name}
                      </Link>
                      {Array.isArray(category.subcategories) && category.subcategories.length > 0 && (
                        <div className="ml-4 space-y-1">
                          {category.subcategories.slice(0, 3).map((sub, index) => {
                            if (typeof sub === 'string') {
                              return (
                                <Link
                                  key={index}
                                  href={`/HatHakStore?category=${category.slug}&subcategory=${sub.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="block text-sm text-gray-600 hover:text-pink-600"
                                >
                                  {sub}
                                </Link>
                              );
                            } else {
                              return (
                                <div key={index}>
                                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-2 mb-1">
                                    {sub.name}
                                  </div>
                                  {sub.subcategories.slice(0, 2).map((subSub, subIndex) => (
                                    <Link
                                      key={subIndex}
                                      href={`/HatHakStore?category=${category.slug}&subcategory=${subSub.toLowerCase().replace(/\s+/g, '-')}`}
                                      className="block text-sm text-gray-600 hover:text-pink-600 ml-2"
                                    >
                                      {subSub}
                                    </Link>
                                  ))}
                                </div>
                              );
                            }
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Carousel */}
      <section className="relative">
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          {heroBanners.map((banner, index) => (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === 0 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative h-full">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                      {banner.badge && (
                        <span className="inline-block px-3 py-1 bg-pink-500 text-white text-sm font-medium rounded-full mb-4">
                          {banner.badge}
                        </span>
                      )}
                      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        {banner.title}
                      </h1>
                      <p className="text-xl text-white mb-6">
                        {banner.subtitle}
                      </p>
                      <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-semibold transition-colors flex items-center">
                        {banner.ctaText}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === 0 ? 'bg-pink-500' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Flash Sales Section */}
      <section className="py-8 bg-gradient-to-r from-pink-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {flashSales.map((sale) => (
              <div key={sale.id} className={`${sale.color} rounded-2xl p-6 text-white relative overflow-hidden`}>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">{sale.title}</h3>
                  <p className="text-lg mb-4">{sale.subtitle}</p>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono text-lg">{sale.timeLeft}</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <Link href="/HatHakStore" className="text-pink-600 hover:text-pink-700 font-medium flex items-center">
              View All
              <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/HatHakStore?category=${category.slug}`}
                className="group relative bg-white rounded-2xl p-4 text-center hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="relative w-12 h-12 mx-auto mb-3">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                  {category.isTrending && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                      <Zap className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.productCount} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Earn Rewards & Save More</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gamificationElements.map((element) => (
              <div key={element.id} className={`${element.color} rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-300 cursor-pointer`}>
                <div className="text-4xl mb-3">{element.icon}</div>
                <h3 className="text-xl font-bold mb-2">{element.title}</h3>
                <p className="text-white/90">{element.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link href="/HatHakStore" className="text-pink-600 hover:text-pink-700 font-medium flex items-center">
              View All
              <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredProducts.map((product) => (
              <div key={product._id} className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.primaryImage.url}
                    alt={product.primaryImage.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.badges.map((badge, index) => (
                    <div
                      key={index}
                      className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full ${
                        badge.color === 'red' ? 'bg-red-500 text-white' :
                        badge.color === 'green' ? 'bg-green-500 text-white' :
                        badge.color === 'blue' ? 'bg-blue-500 text-white' :
                        'bg-pink-500 text-white'
                      }`}
                    >
                      {badge.text}
                    </div>
                  ))}
                  <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Heart className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">${product.price}</span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.compareAtPrice}</span>
                      )}
                    </div>
                    {product.shipping.freeShipping && (
                      <span className="text-xs text-green-600 font-medium">Free</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Influencer Picks */}
      <section className="py-12 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Influencer Picks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {influencerPicks.map((influencer) => (
              <div key={influencer.id} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image
                    src={influencer.image}
                    alt={influencer.name}
                    fill
                    className="object-cover rounded-full"
                  />
                  {influencer.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{influencer.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{influencer.followers} followers</p>
                <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Browsing Section */}
      {products.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-900">
                  All Products ({totalResults.toLocaleString()})
                </h2>
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
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      onSortChange?.(e.target.value);
                    }}
                    className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* View Mode */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => onViewModeChange?.('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onViewModeChange?.('list')}
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
                    {/* Price Filter */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Price</h4>
                      <div className="space-y-2">
                        {['Under $25', '$25 - $50', '$50 - $100', 'Over $100'].map((option) => (
                          <label key={option} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                            />
                            <span className="text-sm text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
                      <div className="space-y-2">
                        {['5 Stars', '4+ Stars', '3+ Stars'].map((option) => (
                          <label key={option} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                            />
                            <span className="text-sm text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Special Offers */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Special Offers</h4>
                      <div className="space-y-2">
                        {['On Sale', 'New Arrivals', 'Trending', 'Free Shipping'].map((option) => (
                          <label key={option} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                            />
                            <span className="text-sm text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setSelectedFilters({});
                        onFilterChange?.({});
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
                {loading ? (
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
                ) : (
                  <div className={`grid gap-4 ${
                    viewMode === 'list' 
                      ? 'grid-cols-1' 
                      : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'
                  }`}>
                    {products.map((product) => (
                      <div key={product._id} className={`group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}>
                        <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'} overflow-hidden`}>
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
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  badge.color === 'red' ? 'bg-red-500 text-white' :
                                  badge.color === 'green' ? 'bg-green-500 text-white' :
                                  badge.color === 'blue' ? 'bg-blue-500 text-white' :
                                  badge.color === 'purple' ? 'bg-purple-500 text-white' :
                                  badge.color === 'orange' ? 'bg-orange-500 text-white' :
                                  'bg-pink-500 text-white'
                                }`}
                              >
                                {badge.text}
                              </span>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => {
                                const newWishlist = new Set(wishlistItems);
                                if (newWishlist.has(product._id)) {
                                  newWishlist.delete(product._id);
                                } else {
                                  newWishlist.add(product._id);
                                }
                                setWishlistItems(newWishlist);
                              }}
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

                        <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
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
                    ))}
                  </div>
                )}

                {products.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Tag className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                    <button
                      onClick={() => {
                        setSelectedFilters({});
                        onFilterChange?.({});
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
        </section>
      )}

      {/* Sticky Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="grid grid-cols-4 h-16">
          <button className="flex flex-col items-center justify-center text-pink-600">
            <div className="w-6 h-6 mb-1">🏠</div>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-600">
            <Search className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Search</span>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-600 relative">
            <ShoppingBag className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Cart</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-600">
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

export default SHEINStyleHomepage;
