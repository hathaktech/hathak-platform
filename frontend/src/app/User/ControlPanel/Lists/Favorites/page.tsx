'use client';

import React, { useState } from 'react';
import { Heart, Search, Filter, Grid, List, Trash2, ShoppingCart } from 'lucide-react';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';

interface FavoriteItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  addedDate: string;
}

const FavoritesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Mock data - in a real app, this would come from an API
  const favorites: FavoriteItem[] = [
    // Empty state for now - can be populated later
  ];

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleRemoveFromFavorites = (itemId: string) => {
    // In a real app, this would make an API call
    console.log('Remove from favorites:', itemId);
  };

  const handleAddToCart = (itemId: string) => {
    // In a real app, this would make an API call
    console.log('Add to cart:', itemId);
  };

  return (
    <UserControlPanel>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  My Favorites
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Your saved items and wishlist
                </p>
              </div>
              
              {/* Selected Items Actions */}
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedItems([])}
                    className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove ({selectedItems.length})
                  </button>
                  <button className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    <ShoppingCart className="w-3 h-3" />
                    Add to Cart ({selectedItems.length})
                  </button>
                </div>
              )}
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-neutral-100 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-neutral-200'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-neutral-200'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search favorites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-neutral-100 border-2 border-transparent rounded-lg text-xs focus:outline-none focus:border-primary-1 focus:bg-white transition-all duration-200"
                  />
                </div>
                <button className="flex items-center gap-1 px-3 py-2 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg hover:bg-neutral-200 transition-colors">
                  <Filter className="w-3.5 h-3.5 mr-1" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-xs text-gray-600 mb-4">Start adding items to your favorites by clicking the heart icon on any product.</p>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                Browse Products
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-3'
            }>
              {favorites.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:shadow-md transition-all duration-200 ${
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
                          className={`absolute top-1.5 left-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedItems.includes(item.id)
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : 'bg-white border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {selectedItems.includes(item.id) && '✓'}
                        </button>
                        <button
                          onClick={() => handleRemoveFromFavorites(item.id)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                        >
                          <Heart className="w-3 h-3 text-red-500 fill-current" />
                        </button>
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{item.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-900">{item.price}</span>
                          <button
                            onClick={() => handleAddToCart(item.id)}
                            className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    // List View
                    <div className="flex p-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg mr-3 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.name}</h3>
                            <p className="text-xs text-gray-600 mb-1">{item.category}</p>
                            <p className="text-sm font-bold text-gray-900">{item.price}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-3">
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
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRemoveFromFavorites(item.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Heart className="w-3.5 h-3.5 fill-current" />
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
      </div>
    </UserControlPanel>
  );
};

export default FavoritesPage;