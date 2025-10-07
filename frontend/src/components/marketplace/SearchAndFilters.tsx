'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  Star, 
  Truck, 
  Shield,
  Clock,
  Heart,
  ShoppingCart,
  SlidersHorizontal,
  SortAsc,
  SortDesc,
  Grid,
  List,
  MapPin,
  Tag,
  DollarSign,
  CheckCircle
} from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  value: any;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'select';
  options: FilterOption[];
  expanded?: boolean;
}

interface SearchAndFiltersProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: any) => void;
  onSortChange: (sort: string) => void;
  onViewModeChange: (mode: 'grid' | 'list' | 'masonry') => void;
  viewMode?: 'grid' | 'list' | 'masonry';
  totalResults?: number;
  className?: string;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  onSearch,
  onFiltersChange,
  onSortChange,
  onViewModeChange,
  viewMode = 'grid',
  totalResults = 0,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Mock filter groups - in real app, this would come from API
  const filterGroups: FilterGroup[] = [
    {
      id: 'category',
      label: 'Category',
      type: 'checkbox',
      options: [
        { id: 'electronics', label: 'Electronics', value: 'electronics', count: 1240 },
        { id: 'fashion', label: 'Fashion', value: 'fashion', count: 890 },
        { id: 'home', label: 'Home & Garden', value: 'home', count: 567 },
        { id: 'sports', label: 'Sports', value: 'sports', count: 234 },
        { id: 'beauty', label: 'Beauty', value: 'beauty', count: 456 },
        { id: 'books', label: 'Books', value: 'books', count: 123 }
      ],
      expanded: true
    },
    {
      id: 'brand',
      label: 'Brand',
      type: 'checkbox',
      options: [
        { id: 'apple', label: 'Apple', value: 'apple', count: 89 },
        { id: 'samsung', label: 'Samsung', value: 'samsung', count: 156 },
        { id: 'nike', label: 'Nike', value: 'nike', count: 234 },
        { id: 'adidas', label: 'Adidas', value: 'adidas', count: 189 },
        { id: 'sony', label: 'Sony', value: 'sony', count: 67 },
        { id: 'lg', label: 'LG', value: 'lg', count: 45 }
      ],
      expanded: false
    },
    {
      id: 'rating',
      label: 'Customer Rating',
      type: 'checkbox',
      options: [
        { id: '5', label: '5 Stars & Up', value: 5, count: 1234 },
        { id: '4', label: '4 Stars & Up', value: 4, count: 2345 },
        { id: '3', label: '3 Stars & Up', value: 3, count: 3456 },
        { id: '2', label: '2 Stars & Up', value: 2, count: 4567 },
        { id: '1', label: '1 Star & Up', value: 1, count: 5678 }
      ],
      expanded: false
    },
    {
      id: 'price',
      label: 'Price Range',
      type: 'range',
      options: [
        { id: '0-25', label: 'Under $25', value: [0, 25] },
        { id: '25-50', label: '$25 to $50', value: [25, 50] },
        { id: '50-100', label: '$50 to $100', value: [50, 100] },
        { id: '100-200', label: '$100 to $200', value: [100, 200] },
        { id: '200+', label: '$200 & Above', value: [200, 1000] }
      ],
      expanded: false
    },
    {
      id: 'features',
      label: 'Features',
      type: 'checkbox',
      options: [
        { id: 'free-shipping', label: 'Free Shipping', value: 'free-shipping', count: 2345 },
        { id: 'fast-delivery', label: 'Fast Delivery', value: 'fast-delivery', count: 1234 },
        { id: 'verified-seller', label: 'Verified Seller', value: 'verified-seller', count: 3456 },
        { id: 'new-arrival', label: 'New Arrival', value: 'new-arrival', count: 567 },
        { id: 'bestseller', label: 'Bestseller', value: 'bestseller', count: 890 },
        { id: 'on-sale', label: 'On Sale', value: 'on-sale', count: 1234 }
      ],
      expanded: false
    },
    {
      id: 'availability',
      label: 'Availability',
      type: 'checkbox',
      options: [
        { id: 'in-stock', label: 'In Stock', value: 'in-stock', count: 4567 },
        { id: 'low-stock', label: 'Low Stock', value: 'low-stock', count: 234 },
        { id: 'backorder', label: 'Backorder', value: 'backorder', count: 89 }
      ],
      expanded: false
    }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
  ];

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  // Update filters when state changes
  useEffect(() => {
    const newFilters = {
      categories: selectedCategories,
      brands: selectedBrands,
      ratings: selectedRatings,
      features: selectedFeatures,
      priceRange: priceRange
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  }, [selectedCategories, selectedBrands, selectedRatings, selectedFeatures, priceRange, onFiltersChange]);

  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    switch (groupId) {
      case 'category':
        setSelectedCategories(prev => 
          checked ? [...prev, optionId] : prev.filter(id => id !== optionId)
        );
        break;
      case 'brand':
        setSelectedBrands(prev => 
          checked ? [...prev, optionId] : prev.filter(id => id !== optionId)
        );
        break;
      case 'rating':
        setSelectedRatings(prev => 
          checked ? [...prev, parseInt(optionId)] : prev.filter(rating => rating !== parseInt(optionId))
        );
        break;
      case 'features':
        setSelectedFeatures(prev => 
          checked ? [...prev, optionId] : prev.filter(id => id !== optionId)
        );
        break;
    }
  };

  const handlePriceRangeChange = (range: number[]) => {
    setPriceRange(range);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedRatings([]);
    setSelectedFeatures([]);
    setPriceRange([0, 1000]);
    setSearchQuery('');
  };

  const getActiveFiltersCount = () => {
    return selectedCategories.length + selectedBrands.length + selectedRatings.length + 
           selectedFeatures.length + (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0);
  };

  const renderFilterGroup = (group: FilterGroup) => {
    const isExpanded = group.expanded;
    const hasActiveFilters = group.id === 'category' ? selectedCategories.length > 0 :
                            group.id === 'brand' ? selectedBrands.length > 0 :
                            group.id === 'rating' ? selectedRatings.length > 0 :
                            group.id === 'features' ? selectedFeatures.length > 0 :
                            group.id === 'price' ? (priceRange[0] > 0 || priceRange[1] < 1000) : false;

    return (
      <div key={group.id} className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => {
            // Toggle expansion
            const updatedGroups = filterGroups.map(g => 
              g.id === group.id ? { ...g, expanded: !g.expanded } : g
            );
          }}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          <span className="flex items-center">
            {group.label}
            {hasActiveFilters && (
              <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="space-y-2">
            {group.type === 'checkbox' && group.options.map((option) => {
              const isSelected = group.id === 'category' ? selectedCategories.includes(option.id) :
                                group.id === 'brand' ? selectedBrands.includes(option.id) :
                                group.id === 'rating' ? selectedRatings.includes(option.value) :
                                group.id === 'features' ? selectedFeatures.includes(option.id) : false;

              return (
                <label key={option.id} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleFilterChange(group.id, option.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                  </div>
                  {option.count && (
                    <span className="text-xs text-gray-500">({option.count})</span>
                  )}
                </label>
              );
            })}

            {group.type === 'range' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex space-x-2">
                  {group.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handlePriceRangeChange(option.value)}
                      className={`px-3 py-1 text-xs rounded-full border ${
                        priceRange[0] === option.value[0] && priceRange[1] === option.value[1]
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {/* Search Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products, brands, or categories..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Toggle */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>

            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                onSortChange(e.target.value);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {totalResults > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            {totalResults.toLocaleString()} results found
          </p>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filterGroups.map(renderFilterGroup)}
          </div>
        </div>
      )}

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            
            {selectedCategories.map(categoryId => {
              const category = filterGroups.find(g => g.id === 'category')?.options.find(o => o.id === categoryId);
              return (
                <span key={categoryId} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {category?.label}
                  <button
                    onClick={() => handleFilterChange('category', categoryId, false)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}

            {selectedBrands.map(brandId => {
              const brand = filterGroups.find(g => g.id === 'brand')?.options.find(o => o.id === brandId);
              return (
                <span key={brandId} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {brand?.label}
                  <button
                    onClick={() => handleFilterChange('brand', brandId, false)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}

            {selectedRatings.map(rating => (
              <span key={rating} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {rating} Stars & Up
                <button
                  onClick={() => handleFilterChange('rating', rating.toString(), false)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {selectedFeatures.map(featureId => {
              const feature = filterGroups.find(g => g.id === 'features')?.options.find(o => o.id === featureId);
              return (
                <span key={featureId} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {feature?.label}
                  <button
                    onClick={() => handleFilterChange('features', featureId, false)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}

            {(priceRange[0] > 0 || priceRange[1] < 1000) && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                ${priceRange[0]} - ${priceRange[1]}
                <button
                  onClick={() => setPriceRange([0, 1000])}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;
