'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  Shield,
  Lock,
  Unlock,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreVertical
} from 'lucide-react';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';

interface BalanceCard {
  id: string;
  cardNumber: string;
  cardName: string;
  balance: string;
  status: 'active' | 'suspended' | 'expired';
  expiryDate: string;
  spendingLimit?: string;
  dailyLimit?: string;
  transactions: number;
  lastUsed: string;
  cardType: 'virtual' | 'physical';
}

const HatHakBalanceCardsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'expired'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'virtual' | 'physical'>('all');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [showCardNumbers, setShowCardNumbers] = useState<{ [key: string]: boolean }>({});

  // Mock data - in a real app, this would come from an API
  const balanceCards: BalanceCard[] = [
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
    console.log('Create new balance card');
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

  const handleToggleCardStatus = (cardId: string) => {
    // In a real app, this would make an API call
    console.log('Toggle card status:', cardId);
  };

  const handleCopyCardNumber = (cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber);
    // In a real app, this would show a toast notification
    console.log('Card number copied to clipboard');
  };

  const toggleShowCardNumber = (cardId: string) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const maskCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\d{4})\d{8}(\d{4})/, '$1 **** **** $2');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'suspended': return 'text-red-700 bg-red-100';
      case 'expired': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'suspended': return Lock;
      case 'expired': return AlertTriangle;
      default: return Clock;
    }
  };

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'virtual': return 'text-blue-600 bg-blue-100';
      case 'physical': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredCards = balanceCards.filter(card => {
    const matchesSearch = card.cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.cardNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || card.status === statusFilter;
    const matchesType = typeFilter === 'all' || card.cardType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <UserControlPanel>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">HatHak Balance Cards</h1>
            <p className="text-xs text-gray-600 mt-0.5">
              {balanceCards.length} {balanceCards.length === 1 ? 'card' : 'cards'} total
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {selectedCards.length > 0 && (
              <div className="flex items-center space-x-2 mr-3">
                <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Bulk Action
                </button>
                <button className="px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs">
                  <Trash2 className="w-3 h-3 inline mr-1" />
                  Delete Selected
                </button>
              </div>
            )}
            <button
              onClick={handleCreateCard}
              className="flex items-center px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3 h-3 mr-1" />
              Create New Card
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search balance cards..."
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
            <option value="suspended">Suspended</option>
            <option value="expired">Expired</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="virtual">Virtual Cards</option>
            <option value="physical">Physical Cards</option>
          </select>
          <button className="flex items-center px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-1" />
            More Filters
          </button>
        </div>

        {/* Stats Cards */}
        {balanceCards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Active Cards</p>
                  <p className="text-lg font-bold text-gray-900">
                    {balanceCards.filter(c => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Balance</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${balanceCards.reduce((sum, card) => sum + parseFloat(card.balance.replace('$', '')), 0).toFixed(2)}
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
                  <p className="text-xs text-gray-600">This Month</p>
                  <p className="text-lg font-bold text-gray-900">
                    {balanceCards.reduce((sum, card) => sum + card.transactions, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-2">
                  <Shield className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Security</p>
                  <p className="text-lg font-bold text-gray-900">Protected</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {balanceCards.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">No balance cards yet</h3>
            <p className="text-xs text-gray-600 mb-3">
              Create your first HatHak balance card to start managing your funds more efficiently.
            </p>
            <button
              onClick={handleCreateCard}
              className="px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Card
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
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 text-white relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCards.includes(card.id)}
                          onChange={() => handleSelectCard(card.id)}
                          className="rounded border-gray-300 mr-2"
                        />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCardTypeColor(card.cardType)}`}>
                          {card.cardType}
                        </span>
                      </div>
                      <button className="text-white hover:text-blue-200 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Card Number */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-mono text-sm">
                        {showCardNumbers[card.id] ? card.cardNumber : maskCardNumber(card.cardNumber)}
                      </div>
                      <button
                        onClick={() => toggleShowCardNumber(card.id)}
                        className="text-white hover:text-blue-200 transition-colors"
                      >
                        {showCardNumbers[card.id] ? <Lock className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                    
                    {/* Card Name */}
                    <div className="text-blue-100 text-xs">{card.cardName}</div>
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

                    {/* Status */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Status</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(card.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {card.status}
                      </span>
                    </div>

                    {/* Expiry Date */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Expires</span>
                      <span className="text-xs text-gray-900 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {card.expiryDate}
                      </span>
                    </div>

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
                        <button
                          onClick={() => handleCopyCardNumber(card.cardNumber)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Copy Card Number"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleToggleCardStatus(card.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            card.status === 'active'
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={card.status === 'active' ? 'Suspend Card' : 'Activate Card'}
                        >
                          {card.status === 'active' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </button>
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
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gray-50 rounded-xl p-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <Plus className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-xs font-medium text-gray-700">Create New Card</span>
            </button>
            <button className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <Shield className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-xs font-medium text-gray-700">Security Settings</span>
            </button>
            <button className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <TrendingUp className="w-4 h-4 text-purple-500 mr-2" />
              <span className="text-xs font-medium text-gray-700">View Analytics</span>
            </button>
            <button className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <Calendar className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-xs font-medium text-gray-700">Transaction History</span>
            </button>
          </div>
        </div>
      </div>
    </UserControlPanel>
  );
};

export default HatHakBalanceCardsPage;
