'use client';

import React, { useState } from 'react';
import { Bookmark, Search, Filter, Grid, List, Trash2, ShoppingCart, Plus, Calendar } from 'lucide-react';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';

interface WishlistItem {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  addedDate: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

const WishlistPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // Mock data - in a real app, this would come from an API
  const wishlist: WishlistItem[] = [
    // Empty state for now - can be populated later
  ];

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    // In a real app, this would make an API call
    console.log('Remove from wishlist:', itemId);
  };

  const handleAddToCart = (itemId: string) => {
    // In a real app, this would make an API call
    console.log('Add to cart:', itemId);
  };

  const handleMoveToFavorites = (itemId: string) => {
    // In a real app, this would make an API call
    console.log('Move to favorites:', itemId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredWishlist = wishlist.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <UserControlPanel>
      <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Wishlist</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-2 mr-3">
              <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs">
                <ShoppingCart className="w-3 h-3 inline mr-1" />
                Add to Cart
              </button>
              <button className="px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs">
                <Trash2 className="w-3 h-3 inline mr-1" />
                Remove Selected
              </button>
            </div>
          )}
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search your wishlist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as any)}
          className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <button className="flex items-center px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4 mr-1" />
          More Filters
        </button>
      </div>

      {/* Wishlist Stats */}
      {wishlist.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                <Bookmark className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Items</p>
                <p className="text-lg font-bold text-gray-900">{wishlist.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                <ShoppingCart className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Ready to Buy</p>
                <p className="text-lg font-bold text-gray-900">
                  {wishlist.filter(item => item.priority === 'high').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-2">
                <Calendar className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Added This Week</p>
                <p className="text-lg font-bold text-gray-900">
                  {wishlist.filter(item => {
                    const addedDate = new Date(item.addedDate);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return addedDate >= weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {wishlist.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bookmark className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-xs text-gray-600 mb-3">Save items you want to buy later by adding them to your wishlist.</p>
          <button className="px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Browse Products
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-3'
        }>
          {filteredWishlist.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 ${
                selectedItems.includes(item.id) ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {viewMode === 'grid' ? (
                // Grid View
                <>
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleSelectItem(item.id)}
                      className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedItems.includes(item.id)
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-white border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {selectedItems.includes(item.id) && '✓'}
                    </button>
                    <div className="absolute top-2 right-2 flex flex-col space-y-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                      >
                        <Bookmark className="w-3 h-3 text-blue-500 fill-current" />
                      </button>
                    </div>
                    {item.originalPrice && item.originalPrice !== item.price && (
                      <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Sale
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{item.category}</p>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">{item.price}</span>
                        {item.originalPrice && item.originalPrice !== item.price && (
                          <span className="text-xs text-gray-500 line-through">{item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Added {new Date(item.addedDate).toLocaleDateString()}</span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleAddToCart(item.id)}
                          className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveToFavorites(item.id)}
                          className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Move to Favorites"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // List View
                <div className="flex p-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg mr-3 flex-shrink-0 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <span className={`absolute -top-1 -right-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-600 mb-1">{item.category}</p>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg font-bold text-gray-900">{item.price}</span>
                          {item.originalPrice && item.originalPrice !== item.price && (
                            <span className="text-xs text-gray-500 line-through">{item.originalPrice}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">Added {new Date(item.addedDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-1 ml-3">
                        <button
                          onClick={() => handleSelectItem(item.id)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedItems.includes(item.id)
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : 'bg-white border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {selectedItems.includes(item.id) && '✓'}
                        </button>
                        <button
                          onClick={() => handleAddToCart(item.id)}
                          className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveToFavorites(item.id)}
                          className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Move to Favorites"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Remove from Wishlist"
                        >
                          <Bookmark className="w-3 h-3 fill-current" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
    </UserControlPanel>
  );
};

export default WishlistPage;
