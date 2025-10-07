'use client';

import React, { useState } from 'react';
import { 
  Headphones, 
  Search, 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  Video, 
  BookOpen, 
  HelpCircle, 
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Send,
  Download,
  ExternalLink,
  Settings,
  User,
  Shield,
  CreditCard,
  Truck,
  Package,
  Gift,
  Wallet
} from 'lucide-react';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdDate: string;
  lastUpdate: string;
  category: string;
}

const HelpSupportContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'tickets' | 'guides'>('faq');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'account' | 'shipping' | 'billing' | 'technical' | 'general'>('all');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketCategory, setTicketCategory] = useState('general');

  // Mock data - in a real app, this would come from an API
  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I track my shipment?',
      answer: 'You can track your shipment by going to the "Your Shipments" section in your control panel. Enter your tracking number or view all your active shipments with real-time status updates.',
      category: 'shipping',
      helpful: 45
    },
    {
      id: '2',
      question: 'How do I add funds to my HatHak balance?',
      answer: 'Navigate to "HatHak Balance" > "Balance Control" in your control panel. Click "Add Funds" and choose your preferred payment method. Funds are typically available within minutes.',
      category: 'billing',
      helpful: 32
    },
    {
      id: '3',
      question: 'Can I cancel a BuyForMe request?',
      answer: 'Yes, you can cancel BuyForMe requests that are still pending. Go to "BuyForMe In Your Control" > "BuyForMe Requests" and select the request you want to cancel.',
      category: 'account',
      helpful: 28
    },
    {
      id: '4',
      question: 'How do I create a gift card?',
      answer: 'Go to "Gift Cards" in your control panel, click "Purchase Card", choose your amount, and follow the checkout process. You can send the gift card immediately or save it for later.',
      category: 'account',
      helpful: 19
    }
  ];

  const supportTickets: SupportTicket[] = [
    // Empty state for now - can be populated later
  ];

  const handleCreateTicket = () => {
    if (ticketSubject && ticketMessage) {
      // In a real app, this would make an API call
      console.log('Creating support ticket:', { subject: ticketSubject, message: ticketMessage, category: ticketCategory });
      setTicketSubject('');
      setTicketMessage('');
    }
  };

  const handleSearchFAQ = (searchTerm: string) => {
    // In a real app, this would filter FAQ items
    console.log('Searching FAQ:', searchTerm);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-700 bg-blue-100';
      case 'in-progress': return 'text-yellow-700 bg-yellow-100';
      case 'resolved': return 'text-green-700 bg-green-100';
      case 'closed': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const filteredFAQ = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const quickActions = [
    {
      title: 'Track Your Shipment',
      description: 'Get real-time updates on your packages',
      icon: Truck,
      href: '/User/ControlPanel/YourShipments',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Manage Your Balance',
      description: 'Add funds or view transaction history',
      icon: Wallet,
      href: '/User/ControlPanel/HatHakBalance',
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'BuyForMe Requests',
      description: 'Manage your personal shopping requests',
      icon: Package,
      href: '/User/ControlPanel/BuyForMe',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Gift Cards',
      description: 'Purchase and manage gift cards',
      icon: Gift,
      href: '/User/ControlPanel/GiftCards',
      color: 'text-pink-600 bg-pink-100'
    }
  ];

  return (
    <UserControlPanel>
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
            Help & Support
          </h1>
          <p className="text-xs text-neutral-700 max-w-3xl mx-auto">
            Get the help you need with our comprehensive support center. Find answers, contact our team, or manage your support tickets.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-gray-200 p-1">
          <div className="flex space-x-1">
            {[
              { id: 'faq', label: 'FAQ', icon: HelpCircle },
              { id: 'contact', label: 'Contact Us', icon: MessageSquare },
              { id: 'tickets', label: 'My Tickets', icon: FileText },
              { id: 'guides', label: 'Guides', icon: BookOpen }
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

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <>
            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearchFAQ(e.target.value);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="account">Account</option>
                <option value="shipping">Shipping</option>
                <option value="billing">Billing</option>
                <option value="technical">Technical</option>
                <option value="general">General</option>
              </select>
            </div>

            {/* FAQ Items */}
            <div className="space-y-3">
              {filteredFAQ.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">{item.question}</h3>
                      <p className="text-xs text-gray-600 mb-2">{item.answer}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="capitalize">{item.category}</span>
                        <span className="flex items-center">
                          <Star className="w-3 h-3 mr-1 text-yellow-500" />
                          {item.helpful} found helpful
                        </span>
                      </div>
                    </div>
                    <button className="ml-3 p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Contact Us Tab */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Contact Methods */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-xs">Live Chat</h4>
                      <p className="text-xs text-gray-600">Available 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-xs">Phone Support</h4>
                      <p className="text-xs text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Mail className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-xs">Email Support</h4>
                      <p className="text-xs text-gray-600">support@hathak.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-2">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        className="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center mr-2 ${action.color}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-xs">{action.title}</h4>
                          <p className="text-xs text-gray-600">{action.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Create Support Ticket */}
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Create Support Ticket</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="Brief description of your issue"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="shipping">Shipping</option>
                    <option value="account">Account</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    placeholder="Please describe your issue in detail..."
                    rows={4}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleCreateTicket}
                  disabled={!ticketSubject || !ticketMessage}
                  className="w-full px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-3 h-3 inline mr-1" />
                  Submit Ticket
                </button>
              </div>
            </div>
          </div>
        )}

        {/* My Tickets Tab */}
        {activeTab === 'tickets' && (
          <>
            {supportTickets.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">No support tickets yet</h3>
                <p className="text-xs text-gray-600 mb-3">When you create support tickets, they will appear here for easy tracking.</p>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Ticket
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white rounded-xl border border-gray-200 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">{ticket.subject}</h3>
                        <div className="flex items-center space-x-3 text-xs text-gray-600">
                          <span>Created: {new Date(ticket.createdDate).toLocaleDateString()}</span>
                          <span>Last Update: {new Date(ticket.lastUpdate).toLocaleDateString()}</span>
                          <span className="capitalize">{ticket.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('-', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Guides Tab */}
        {activeTab === 'guides' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Getting Started Guide',
                description: 'Learn the basics of using HatHak platform',
                icon: BookOpen,
                color: 'text-blue-600 bg-blue-100'
              },
              {
                title: 'Shipping Tutorial',
                description: 'Step-by-step guide to shipping with HatHak',
                icon: Truck,
                color: 'text-green-600 bg-green-100'
              },
              {
                title: 'Balance Management',
                description: 'How to manage your HatHak balance',
                icon: Wallet,
                color: 'text-purple-600 bg-purple-100'
              },
              {
                title: 'BuyForMe Service',
                description: 'Complete guide to BuyForMe requests',
                icon: Package,
                color: 'text-orange-600 bg-orange-100'
              },
              {
                title: 'Security & Privacy',
                description: 'Keep your account secure',
                icon: Shield,
                color: 'text-red-600 bg-red-100'
              },
              {
                title: 'Video Tutorials',
                description: 'Watch video guides and tutorials',
                icon: Video,
                color: 'text-pink-600 bg-pink-100'
              }
            ].map((guide, index) => {
              const Icon = guide.icon;
              return (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 ${guide.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">{guide.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{guide.description}</p>
                  <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                    <span className="text-xs font-medium">Read Guide</span>
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Support Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
          <div className="text-center mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Support Statistics</h3>
            <p className="text-xs text-gray-600">We're here to help you succeed</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">24/7</h4>
              <p className="text-xs text-gray-600">Support Available</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">&lt; 2hr</h4>
              <p className="text-xs text-gray-600">Average Response Time</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">4.9/5</h4>
              <p className="text-xs text-gray-600">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </UserControlPanel>
  );
};

const HelpSupportPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <HelpSupportContent />
    </ProtectedRoute>
  );
};

export default HelpSupportPage;
