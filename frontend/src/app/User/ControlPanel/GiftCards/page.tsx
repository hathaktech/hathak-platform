'use client';

import React, { useState } from 'react';
import { 
  Gift, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  Calendar,
  DollarSign,
  CreditCard,
  Send,
  Download,
  Upload,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Tag
} from 'lucide-react';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface GiftCard {
  id: string;
  cardNumber: string;
  cardName: string;
  value: string;
  balance: string;
  status: 'active' | 'used' | 'expired' | 'suspended';
  expiryDate: string;
  recipient?: string;
  recipientEmail?: string;
  purchaseDate: string;
  lastUsed?: string;
  transactions: number;
  category: 'digital' | 'physical' | 'gift';
}

const GiftCardsContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'used' | 'expired' | 'suspended'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'digital' | 'physical' | 'gift'>('all');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'my-cards' | 'purchase' | 'send' | 'history'>('my-cards');

  // Mock data - in a real app, this would come from an API
  const giftCards: GiftCard[] = [
    // Empty state for now - can be populated later
  ];

  const handleSelectCard = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleCreateCard = () => {
    // In a real app, this would open a modal or navigate to a form
    console.log('Create new gift card');
  };

  const handlePurchaseCard = () => {
    // In a real app, this would open a purchase modal
    console.log('Purchase gift card');
  };

  const handleSendCard = (cardId: string) => {
    // In a real app, this would open a send modal
    console.log('Send gift card:', cardId);
  };

  const handleViewCard = (cardId: string) => {
    // In a real app, this would navigate to card details
    console.log('View card:', cardId);
  };

  const handleEditCard = (cardId: string) => {
    // In a real app, this would open edit modal
    console.log('Edit card:', cardId);
  };

  const handleDeleteCard = (cardId: string) => {
    // In a real app, this would make an API call
    console.log('Delete card:', cardId);
  };

  const handleCopyCardNumber = (cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber);
    // In a real app, this would show a toast notification
    console.log('Card number copied to clipboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'used': return 'text-blue-700 bg-blue-100';
      case 'expired': return 'text-gray-700 bg-gray-100';
      case 'suspended': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'used': return Star;
      case 'expired': return AlertCircle;
      case 'suspended': return Clock;
      default: return Gift;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'digital': return 'text-blue-600 bg-blue-100';
      case 'physical': return 'text-purple-600 bg-purple-100';
      case 'gift': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredCards = giftCards.filter(card => {
    const matchesSearch = card.cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.cardNumber.includes(searchTerm) ||
                         (card.recipient && card.recipient.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || card.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || card.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <UserControlPanel>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Gift Cards</h1>
            <p className="text-xs text-gray-600 mt-0.5">
              {giftCards.length} {giftCards.length === 1 ? 'card' : 'cards'} total
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {selectedCards.length > 0 && (
              <div className="flex items-center space-x-2 mr-3">
                <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs">
                  <Download className="w-3 h-3 inline mr-1" />
                  Export
                </button>
                <button className="px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs">
                  <Trash2 className="w-3 h-3 inline mr-1" />
                  Delete Selected
                </button>
              </div>
            )}
            <button
              onClick={handlePurchaseCard}
              className="flex items-center px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-3 h-3 mr-1" />
              Purchase Card
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-gray-200 p-1">
          <div className="flex space-x-1">
            {[
              { id: 'my-cards', label: 'My Cards', icon: Gift },
              { id: 'purchase', label: 'Purchase', icon: Plus },
              { id: 'send', label: 'Send Gift', icon: Send },
              { id: 'history', label: 'History', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-xs ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* My Cards Tab */}
        {activeTab === 'my-cards' && (
          <>
            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search gift cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="used">Used</option>
                <option value="expired">Expired</option>
                <option value="suspended">Suspended</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="digital">Digital</option>
                <option value="physical">Physical</option>
                <option value="gift">Gift</option>
              </select>
              <button className="flex items-center px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 mr-1" />
                More Filters
              </button>
            </div>

            {/* Stats Cards */}
            {giftCards.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Active Cards</p>
                      <p className="text-lg font-bold text-gray-900">
                        {giftCards.filter(c => c.status === 'active').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Value</p>
                      <p className="text-lg font-bold text-gray-900">
                        ${giftCards.reduce((sum, card) => sum + parseFloat(card.value.replace('$', '')), 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Used This Month</p>
                      <p className="text-lg font-bold text-gray-900">
                        {giftCards.filter(c => c.status === 'used').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Expiring Soon</p>
                      <p className="text-lg font-bold text-gray-900">
                        {giftCards.filter(c => {
                          const expiryDate = new Date(c.expiryDate);
                          const thirtyDaysFromNow = new Date();
                          thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                          return expiryDate <= thirtyDaysFromNow && c.status === 'active';
                        }).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Gift Cards Grid */}
            {giftCards.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">No gift cards yet</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Purchase your first gift card or receive one from a friend to get started.
                </p>
                <button
                  onClick={() => setActiveTab('purchase')}
                  className="px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Purchase Your First Card
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCards.map((card) => {
                  const StatusIcon = getStatusIcon(card.status);
                  return (
                    <div
                      key={card.id}
                      className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 ${
                        selectedCards.includes(card.id) ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      {/* Card Header */}
                      <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 text-white relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedCards.includes(card.id)}
                              onChange={() => handleSelectCard(card.id)}
                              className="rounded border-gray-300 mr-2"
                            />
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(card.category)}`}>
                              {card.category}
                            </span>
                          </div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(card.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {card.status}
                          </span>
                        </div>
                        
                        {/* Card Value */}
                        <div className="text-lg font-bold mb-1">{card.value}</div>
                        
                        {/* Card Name */}
                        <div className="text-green-100 text-xs">{card.cardName}</div>
                        
                        {/* Card Number */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="font-mono text-xs">{card.cardNumber}</div>
                          <button
                            onClick={() => handleCopyCardNumber(card.cardNumber)}
                            className="text-green-200 hover:text-white transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-3">
                        {/* Balance */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">Balance</span>
                          <span className="text-sm font-bold text-gray-900 flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {card.balance}
                          </span>
                        </div>

                        {/* Expiry Date */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">Expires</span>
                          <span className="text-xs text-gray-900 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(card.expiryDate).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Recipient */}
                        {card.recipient && (
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-600">Recipient</span>
                            <span className="text-xs text-gray-900 flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {card.recipient}
                            </span>
                          </div>
                        )}

                        {/* Transactions */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-600">Transactions</span>
                          <span className="text-xs text-gray-900">{card.transactions}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleViewCard(card.id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleEditCard(card.id)}
                              className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Edit Card"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            {card.status === 'active' && (
                              <button
                                onClick={() => handleSendCard(card.id)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Send Card"
                              >
                                <Send className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteCard(card.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Card"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Purchase Tab */}
        {activeTab === 'purchase' && (
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Purchase Gift Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['$25', '$50', '$100', '$250', '$500', 'Custom'].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handlePurchaseCard()}
                  className="p-3 border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all text-center"
                >
                  <div className="text-lg font-bold text-gray-900 mb-1">{amount}</div>
                  <div className="text-xs text-gray-600">Gift Card</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Send Gift Tab */}
        {activeTab === 'send' && (
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Send Gift Card</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Recipient Email</label>
                  <input
                    type="email"
                    placeholder="Enter recipient email"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Recipient Name</label>
                  <input
                    type="text"
                    placeholder="Enter recipient name"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    placeholder="Add a personal message"
                    rows={2}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2 text-xs">Available Cards</h4>
                <p className="text-xs text-gray-600 mb-3">Select a gift card to send</p>
                <div className="space-y-2">
                  {giftCards.filter(c => c.status === 'active').slice(0, 3).map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleSendCard(card.id)}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg hover:border-green-300 transition-colors text-left"
                    >
                      <div className="font-medium text-gray-900 text-xs">{card.cardName}</div>
                      <div className="text-xs text-gray-600">{card.value}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Gift Card History</h3>
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">No history yet</h3>
              <p className="text-xs text-gray-600">Your gift card transaction history will appear here.</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gray-50 rounded-xl p-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
              <Plus className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-xs font-medium text-gray-700">Purchase Card</span>
            </button>
            <button className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
              <Send className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-xs font-medium text-gray-700">Send Gift</span>
            </button>
            <button className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
              <Download className="w-4 h-4 text-purple-500 mr-2" />
              <span className="text-xs font-medium text-gray-700">Export Cards</span>
            </button>
            <button className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
              <Upload className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-xs font-medium text-gray-700">Import Cards</span>
            </button>
          </div>
        </div>
      </div>
    </UserControlPanel>
  );
};

const GiftCardsPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <GiftCardsContent />
    </ProtectedRoute>
  );
};

export default GiftCardsPage;
