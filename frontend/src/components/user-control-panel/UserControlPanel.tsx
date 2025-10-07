'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Settings, 
  Bell, 
  Package, 
  ShoppingCart, 
  Heart, 
  CreditCard, 
  Shield, 
  HelpCircle, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Activity,
  BarChart3,
  Bookmark,
  MessageSquare,
  MapPin,
  Box,
  Truck,
  Gift,
  List,
  RotateCcw,
  Wallet,
  Headphones
} from 'lucide-react';

interface UserControlPanelProps {
  children: React.ReactNode;
}

const UserControlPanel: React.FC<UserControlPanelProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navigationItems = [
    {
      name: 'Control Panel',
      href: '/User/ControlPanel',
      icon: BarChart3,
      description: 'Overview and quick actions'
    },
    {
      name: 'Profile',
      href: '/User/ControlPanel/Profile',
      icon: User,
      description: 'Manage your profile',
      subItems: [
        {
          name: 'Your Addresses',
          href: '/User/ControlPanel/Profile/Addresses',
          icon: MapPin,
          description: 'Manage your saved addresses'
        }
      ]
    },
    {
      name: 'Your Box',
      href: '/User/ControlPanel/Box',
      icon: Package,
      description: 'Manage your international shipping box',
      subItems: [
        {
          name: 'Contents Of Your Box',
          href: '/User/ControlPanel/Box/BoxContents',
          icon: Box,
          description: 'View box contents'
        },
        {
          name: 'Address Of Your Box',
          href: '/User/ControlPanel/Box/BoxAddress',
          icon: MapPin,
          description: 'Manage your box address'
        }
      ]
    },
    {
      name: 'Your Shipments',
      href: '/User/ControlPanel/YourShipments',
      icon: Truck,
      description: 'Track your shipments'
    },
    {
      name: 'BuyForMe In Your Control',
      href: '/User/ControlPanel/BuyForMe',
      icon: MessageSquare,
      description: 'Manage your BuyForMe service',
      subItems: [
        {
          name: 'BuyForMe Cart',
          href: '/User/ControlPanel/BuyForMe/cart',
          icon: ShoppingCart,
          description: 'Manage your BuyForMe product cart'
        },
        {
          name: 'BuyForMe Requests',
          href: '/User/ControlPanel/BuyForMe/BuyForMeRequests',
          icon: MessageSquare,
          description: 'Your BuyForMe requests'
        },
        {
          name: 'BuyForMe Orders',
          href: '/buyme-orders',
          icon: Package,
          description: 'BuyForMe order history'
        },
        {
          name: 'BuyForMe Return Requests',
          href: '/User/ControlPanel/BuyForMe/BuyForMeReturn',
          icon: RotateCcw,
          description: 'Manage BuyForMe returns'
        }
      ]
    },
    {
      name: 'HatHakStore Services',
      href: '/User/ControlPanel/HatHakStore',
      icon: ShoppingCart,
      description: 'HatHak store services and orders',
      subItems: [
        {
          name: 'HatHak Store Orders',
          href: '/User/ControlPanel/HatHakStore/Orders',
          icon: Package,
          description: 'View your HatHak store orders'
        },
        {
          name: 'HatHakStore Return',
          href: '/User/ControlPanel/HatHakStore/Return',
          icon: RotateCcw,
          description: 'Manage HatHak store returns'
        }
      ]
    },
    {
      name: 'Your Lists',
      href: '/User/ControlPanel/Lists',
      icon: List,
      description: 'Manage your lists',
      subItems: [
        {
          name: 'Your Favorites',
          href: '/User/ControlPanel/Lists/Favorites',
          icon: Heart,
          description: 'Your favorite items'
        },
        {
          name: 'Wishlist',
          href: '/User/ControlPanel/Lists/Wishlist',
          icon: Bookmark,
          description: 'Your wishlist items'
        }
      ]
    },
    {
      name: 'Payment Methods',
      href: '/User/ControlPanel/PaymentMethods',
      icon: CreditCard,
      description: 'Manage payment info'
    },
    {
      name: 'HatHak Balance',
      href: '/User/ControlPanel/HatHakBalance',
      icon: Wallet,
      description: 'Manage your HatHak balance and cards',
      subItems: [
        {
          name: 'Balance Control',
          href: '/User/ControlPanel/HatHakBalance/HatHakBalanceManage',
          icon: Wallet,
          description: 'Manage your balance'
        },
        {
          name: 'HatHak Balance Cards',
          href: '/User/ControlPanel/HatHakBalance/HatHakBalanceCards',
          icon: CreditCard,
          description: 'Manage your balance cards'
        }
      ]
    },
    {
      name: 'Gift Cards',
      href: '/User/ControlPanel/GiftCards',
      icon: Gift,
      description: 'Manage gift cards'
    },
    {
      name: 'Help & Support',
      href: '/User/ControlPanel/Help&Support',
      icon: Headphones,
      description: 'Get help and support'
    }
  ];

  const handleLogout = async () => {
    await logout();
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isItemExpanded = (itemName: string) => {
    return expandedItems.includes(itemName);
  };

  const isActive = (href: string) => {
    // For exact matches
    if (pathname === href) {
      return true;
    }
    
    // Special case: Control Panel should only be active on exact match
    if (href === '/User/ControlPanel') {
      return pathname === '/User/ControlPanel';
    }
    
    // For other sub-routes, match if the pathname starts with href + '/'
    if (pathname.startsWith(href + '/')) {
      const remainingPath = pathname.slice(href.length + 1);
      // Only match if there's actually content after the slash
      return remainingPath.length > 0;
    }
    
    return false;
  };

  const isParentActive = (item: any) => {
    if (isActive(item.href)) return true;
    if (item.subItems) {
      return item.subItems.some((subItem: any) => isActive(subItem.href));
    }
    return false;
  };

  // Auto-expand parent items when sub-items are active
  React.useEffect(() => {
    navigationItems.forEach(item => {
      if (item.subItems && isParentActive(item) && !isItemExpanded(item.name)) {
        setExpandedItems(prev => [...prev, item.name]);
      }
    });
  }, [pathname]);

  const getPageTitle = () => {
    const currentItem = navigationItems.find(item => isActive(item.href));
    return currentItem ? currentItem.name : 'Profile';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-neutral-200">
      {/* Mobile Menu Button - Floating on mobile */}
      <div className="lg:hidden fixed top-20 left-4 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 rounded-full bg-white/95 backdrop-blur-sm shadow-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5 text-neutral-600" />
        </button>
      </div>

      {/* Main Content Layout - Full height */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Left Navigation Panel - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:flex lg:flex-col w-72 xl:w-80 bg-gradient-to-b from-white to-neutral-50 border-r border-neutral-200 flex-shrink-0 shadow-sm rounded-l-xl">
            {/* Navigation Menu - Scrollable */}
            <nav className="flex-1 px-4 xl:px-6 py-4 overflow-y-auto">
              <div className="space-y-1">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  const parentActive = isParentActive(item);
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const expanded = isItemExpanded(item.name);
                  
                  return (
                    <div key={item.name}>
                      {/* Parent Item */}
                      <div className="relative">
                        <Link
                          href={item.href}
                          className={`group relative flex items-center px-3 xl:px-4 py-3 xl:py-4 rounded-xl transition-all duration-300 ${
                            parentActive
                              ? 'bg-gradient-to-r from-neutral-50 to-blue-50 text-blue-600 shadow-md transform scale-[1.01]'
                              : 'text-neutral-700 hover:bg-gradient-to-r hover:from-neutral-50 hover:to-blue-50 hover:text-blue-600 hover:shadow-md hover:transform hover:scale-[1.01]'
                          }`}
                        >
                        {/* Elegant active indicator */}
                        {parentActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-sm"></div>
                        )}
                        
                        {/* Icon with elegant styling */}
                        <div className={`flex-shrink-0 w-7 h-7 xl:w-8 xl:h-8 rounded-xl flex items-center justify-center mr-2 xl:mr-3 transition-all duration-300 ${
                          parentActive 
                            ? 'bg-blue-100 shadow-sm' 
                            : 'bg-neutral-100 group-hover:bg-blue-100 group-hover:shadow-sm'
                        }`}>
                          <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 transition-all duration-300 ${
                            parentActive ? 'text-blue-600' : 'text-neutral-600 group-hover:text-blue-600'
                          }`} />
                        </div>
                        
                        {/* Text content with elegant typography */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs xl:text-sm font-semibold transition-all duration-300 ${
                            parentActive ? 'text-blue-600' : 'text-neutral-900 group-hover:text-blue-600'
                          }`}>
                            {item.name}
                          </p>
                          <p className={`text-xs mt-0.5 hidden xl:block transition-all duration-300 ${
                            parentActive ? 'text-blue-500' : 'text-neutral-500 group-hover:text-blue-500'
                          }`}>
                            {item.description}
                          </p>
                        </div>
                        
                        {/* Arrow indicator - shows expand/collapse for items with sub-items */}
                        {hasSubItems ? (
                          <ChevronRight className={`w-3.5 h-3.5 xl:w-4 xl:h-4 flex-shrink-0 hidden xl:block transition-all duration-300 ${
                            parentActive ? 'text-blue-500' : 'text-neutral-400 group-hover:text-blue-500'
                          } ${expanded ? 'rotate-90' : ''}`} />
                        ) : (
                          <ChevronRight className={`w-3.5 h-3.5 xl:w-4 xl:h-4 flex-shrink-0 hidden xl:block transition-all duration-300 ${
                            parentActive ? 'text-blue-500' : 'text-neutral-400 group-hover:text-blue-500 group-hover:translate-x-0.5'
                          }`} />
                        )}
                        </Link>
                        
                        {/* Expand/Collapse Button for items with sub-items */}
                        {hasSubItems && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleExpanded(item.name);
                            }}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                              parentActive 
                                ? 'bg-blue-100 hover:bg-blue-200 text-blue-600' 
                                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-blue-500'
                            }`}
                          >
                            <ChevronRight className={`w-3 h-3 transition-all duration-300 ${expanded ? 'rotate-90' : ''}`} />
                          </button>
                        )}
                      </div>
                      
                      {/* Sub-items */}
                      {hasSubItems && expanded && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.subItems.map((subItem: any) => {
                            const SubIcon = subItem.icon;
                            const subActive = isActive(subItem.href);
                            
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={`group relative flex items-center px-3 xl:px-4 py-3 xl:py-4 rounded-lg transition-all duration-300 ${
                                  subActive
                                    ? 'bg-gradient-to-r from-neutral-50 to-blue-50 text-blue-600 shadow-sm'
                                    : 'text-neutral-600 hover:bg-gradient-to-r hover:from-neutral-50 hover:to-blue-50 hover:text-blue-600 hover:shadow-sm'
                                }`}
                              >
                                {/* Sub-item active indicator */}
                                {subActive && (
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-sm"></div>
                                )}
                                
                                {/* Sub-item icon */}
                                <div className={`flex-shrink-0 w-6 h-6 xl:w-7 xl:h-7 rounded-lg flex items-center justify-center mr-2 xl:mr-3 transition-all duration-300 ${
                                  subActive 
                                    ? 'bg-blue-100' 
                                    : 'bg-neutral-100 group-hover:bg-blue-100'
                                }`}>
                                  <SubIcon className={`w-3 h-3 xl:w-3.5 xl:h-3.5 transition-all duration-300 ${
                                    subActive ? 'text-blue-600' : 'text-neutral-500 group-hover:text-blue-600'
                                  }`} />
                                </div>
                                
                                {/* Sub-item text */}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs xl:text-sm font-medium transition-all duration-300 ${
                                    subActive ? 'text-blue-600' : 'text-neutral-700 group-hover:text-blue-600'
                                  }`}>
                                    {subItem.name}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </nav>

            {/* Menu Footer - Responsive */}
            <div className="px-3 xl:px-4 py-3 xl:py-4 border-t border-neutral-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-2 xl:px-3 py-2 xl:py-3 text-xs xl:text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
              >
                <div className="flex-shrink-0 w-7 h-7 xl:w-8 xl:h-8 rounded-lg bg-red-100 group-hover:bg-red-200 flex items-center justify-center mr-2 xl:mr-3">
                  <LogOut className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-red-600" />
                </div>
                <span className="truncate">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Right Content Area - Responsive */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="py-4 lg:py-6 px-0 lg:px-6">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar - Responsive */}
      <div className={`fixed inset-y-0 left-0 z-50 w-96 sm:w-[28rem] bg-gradient-to-b from-white to-neutral-50 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Mobile Sidebar Header - Close Button Only */}
        <div className="flex items-center justify-end h-16 sm:h-18 px-4 sm:px-6 border-b border-neutral-200">
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {/* Mobile Navigation - Responsive */}
        <nav className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const parentActive = isParentActive(item);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const expanded = isItemExpanded(item.name);
              
              return (
                <div key={item.name}>
                  {/* Parent Item */}
                  <div className="relative">
                    <Link
                      href={item.href}
                      className={`group relative flex items-center px-3 sm:px-4 py-3 sm:py-4 rounded-xl transition-all duration-300 ${
                        parentActive
                          ? 'bg-gradient-to-r from-neutral-50 to-blue-50 text-blue-600 shadow-md transform scale-[1.01]'
                          : 'text-neutral-700 hover:bg-gradient-to-r hover:from-neutral-50 hover:to-blue-50 hover:text-blue-600 hover:shadow-md hover:transform hover:scale-[1.01]'
                      }`}
                      onClick={() => {
                        // Only close sidebar for leaf nodes (items without sub-items)
                        if (!hasSubItems) {
                          setSidebarOpen(false);
                        }
                        // For parent items with sub-items, keep sidebar open
                      }}
                    >
                    {/* Elegant active indicator */}
                    {parentActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-blue-500 rounded-r-full shadow-sm"></div>
                    )}
                    
                    {/* Icon with elegant styling */}
                    <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mr-3 sm:mr-4 transition-all duration-300 ${
                      parentActive 
                        ? 'bg-blue-100 shadow-sm' 
                        : 'bg-neutral-100 group-hover:bg-blue-100 group-hover:shadow-sm'
                    }`}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                        parentActive ? 'text-blue-600' : 'text-neutral-600 group-hover:text-blue-600'
                      }`} />
                    </div>
                    
                    {/* Text content with elegant typography */}
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm sm:text-base font-semibold transition-all duration-300 ${
                          parentActive ? 'text-blue-600' : 'text-neutral-900 group-hover:text-blue-600'
                        }`}>
                          {item.name}
                        </p>
                        <p className={`text-xs sm:text-sm mt-1 transition-all duration-300 ${
                          parentActive ? 'text-blue-500' : 'text-neutral-500 group-hover:text-blue-500'
                        }`}>
                          {item.description}
                        </p>
                    </div>
                    
                    {/* Arrow indicator - shows expand/collapse for items with sub-items */}
                    {hasSubItems ? (
                      <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-all duration-300 ${
                        parentActive ? 'text-blue-500' : 'text-neutral-400 group-hover:text-blue-500'
                      } ${expanded ? 'rotate-90' : ''}`} />
                    ) : (
                      <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-all duration-300 ${
                        parentActive ? 'text-blue-500' : 'text-neutral-400 group-hover:text-blue-500 group-hover:translate-x-0.5'
                      }`} />
                    )}
                    </Link>
                    
                    {/* Expand/Collapse Button for items with sub-items */}
                    {hasSubItems && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleExpanded(item.name);
                        }}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          parentActive 
                            ? 'bg-blue-100 hover:bg-blue-200 text-blue-600' 
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-blue-500'
                        }`}
                      >
                        <ChevronRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${expanded ? 'rotate-90' : ''}`} />
                      </button>
                    )}
                  </div>
                  
                  {/* Sub-items */}
                  {hasSubItems && expanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.subItems.map((subItem: any) => {
                        const SubIcon = subItem.icon;
                        const subActive = isActive(subItem.href);
                        
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={`group relative flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-300 ${
                              subActive
                                ? 'bg-gradient-to-r from-neutral-50 to-blue-50 text-blue-600 shadow-sm'
                                : 'text-neutral-600 hover:bg-gradient-to-r hover:from-neutral-50 hover:to-blue-50 hover:text-blue-600 hover:shadow-sm'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            {/* Sub-item active indicator */}
                            {subActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-sm"></div>
                            )}
                            
                            {/* Sub-item icon */}
                            <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mr-3 sm:mr-4 transition-all duration-300 ${
                              subActive 
                                ? 'bg-blue-100' 
                                : 'bg-neutral-100 group-hover:bg-blue-100'
                            }`}>
                              <SubIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
                                subActive ? 'text-blue-600' : 'text-neutral-500 group-hover:text-blue-600'
                              }`} />
                            </div>
                            
                            {/* Sub-item text */}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm sm:text-base font-medium transition-all duration-300 ${
                                subActive ? 'text-blue-600' : 'text-neutral-700 group-hover:text-blue-600'
                              }`}>
                                {subItem.name}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Mobile Logout Button - Responsive */}
        <div className="px-3 sm:px-4 py-4 border-t border-neutral-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
          >
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-red-100 group-hover:bg-red-200 flex items-center justify-center mr-3 sm:mr-4">
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <span className="truncate">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserControlPanel;
