"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useBuyForMeCart } from "@/context/BuyForMeCartContext";
import { 
  ShoppingCart, 
  Bookmark, 
  Heart,
  User, 
  Search,
  Menu,
  X,
  Bell,
  LayoutDashboard,
  Settings,
  LogOut,
  Globe,
  DollarSign,
  MapPin,
  ChevronDown
} from "lucide-react";
import LoginButton from "./LoginButton";
import CartDropdown from "./cart/CartDropdown";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemCount, getTotalCartItemCount } = useCart();
  const { getCartItemCount: getBuyForMeCartItemCount } = useBuyForMeCart();
  const pathname = usePathname();

  // Get the appropriate cart count based on current page
  const getDisplayCartCount = () => {
    if (pathname.startsWith('/BuyForMe') || pathname.startsWith('/buyme')) {
      // For buyme pages, use buyforme cart count
      return getBuyForMeCartItemCount();
    } else if (pathname.startsWith('/HatHakStore') || pathname.startsWith('/cart')) {
      return getCartItemCount('store');
    } else {
      // Home page - show total count including buyforme cart
      return getTotalCartItemCount() + getBuyForMeCartItemCount();
    }
  };
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [isTabsExpanded, setIsTabsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedLocation, setSelectedLocation] = useState("US");

  // Refs for dropdown containers
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const currencyMenuRef = useRef<HTMLDivElement>(null);
  const locationMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
        setIsNotificationMenuOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target as Node)) {
        setIsCurrencyMenuOpen(false);
      }
      if (locationMenuRef.current && !locationMenuRef.current.contains(event.target as Node)) {
        setIsLocationMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top Black Bar with Language, Currency, and Location */}
      <div className="bg-black text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-45 ml-45">
              <span className="text-gray-300">Welcome to HatHak Platform</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="relative" ref={languageMenuRef}>
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex items-center space-x-1 hover:text-gray-300 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{selectedLanguage}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setSelectedLanguage("EN");
                        setIsLanguageMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLanguage("AR");
                        setIsLanguageMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      العربية
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLanguage("FR");
                        setIsLanguageMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Français
                    </button>
                  </div>
                )}
              </div>

              {/* Currency Switcher */}
              <div className="relative" ref={currencyMenuRef}>
                <button
                  onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                  className="flex items-center space-x-1 hover:text-gray-300 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{selectedCurrency}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {isCurrencyMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setSelectedCurrency("USD");
                        setIsCurrencyMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      USD ($)
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCurrency("EUR");
                        setIsCurrencyMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      EUR (€)
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCurrency("GBP");
                        setIsCurrencyMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      GBP (£)
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCurrency("AED");
                        setIsCurrencyMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      AED (د.إ)
                    </button>
                  </div>
                )}
              </div>

              {/* Location Switcher */}
              <div className="relative" ref={locationMenuRef}>
                <button
                  onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
                  className="flex items-center space-x-1 hover:text-gray-300 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{selectedLocation}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {isLocationMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setSelectedLocation("US");
                        setIsLocationMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🇺🇸 United States
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLocation("AE");
                        setIsLocationMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🇦🇪 United Arab Emirates
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLocation("GB");
                        setIsLocationMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🇬🇧 United Kingdom
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLocation("FR");
                        setIsLocationMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🇫🇷 France
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="bg-white shadow-elegant sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16 min-h-[64px]">
            {/* Left Side - Logo and Selectors */}
            <div className="flex items-center space-x-2 sm:space-x-16">
              {/* Logo */}
              <div className="flex-shrink-0 ml-4">
                <Link href="/" className="flex items-center group">
                  <div className="w-30 h-30 relative group-hover:scale-105 transition-transform duration-200">
                    <Image
                      src="/logo.png"
                      alt="HatHak Logo"
                      width={96}                  
                      height={96}
                      className="object-contain w-full h-full"
                      priority
                    />
                  </div>
                </Link>
              </div>

            </div>

            {/* Center Navigation - Always Centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:flex items-center">
              <div className="flex items-center gap-4 p-1.5">
                <Link
                  href="/BuyForMe"
                  className={`relative w-32 px-6 py-3 text-sm font-bold transition-all duration-500 group overflow-hidden border-2 flex items-center justify-center ${
                    pathname === '/BuyForMe' || pathname.startsWith('/BuyForMe')
                      ? 'text-white bg-gradient-to-r from-primary-1 to-primary-2 shadow-xl transform scale-105 border-primary-1/30'
                      : 'text-neutral-700 border-neutral-300/50 hover:text-white hover:bg-gradient-to-r hover:from-primary-1/80 hover:to-primary-2/80 hover:shadow-lg hover:transform hover:scale-105 hover:border-primary-1/50'
                  }`}
                >
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-1 to-primary-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <span className="relative z-10 whitespace-nowrap uppercase tracking-wide">
                    Buy for Me
                  </span>
                  
                  {/* Active indicator with glow */}
                  {(pathname === '/BuyForMe' || pathname.startsWith('/BuyForMe')) && (
                    <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary-1 to-primary-2 rounded-full shadow-lg shadow-primary-1/50"></div>
                  )}
                  
                  {/* Icon for active state */}
                  {(pathname === '/BuyForMe' || pathname.startsWith('/BuyForMe')) && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent-default rounded-full shadow-lg"></div>
                  )}
                </Link>
                
                <Link
                  href="/HatHakStore"
                  className={`relative w-32 px-6 py-3 text-sm font-bold transition-all duration-500 group overflow-hidden border-2 flex items-center justify-center ${
                    pathname === '/HatHakStore' || pathname.startsWith('/HatHakStore')
                      ? 'text-white bg-gradient-to-r from-primary-1 to-primary-2 shadow-xl transform scale-105 border-primary-1/30'
                      : 'text-neutral-700 border-neutral-300/50 hover:text-white hover:bg-gradient-to-r hover:from-primary-1/80 hover:to-primary-2/80 hover:shadow-lg hover:transform hover:scale-105 hover:border-primary-1/50'
                  }`}
                >
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-1 to-primary-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <span className="relative z-10 whitespace-nowrap uppercase tracking-wide">
                    HatHak Store
                  </span>
                  
                  {/* Active indicator with glow */}
                  {(pathname === '/HatHakStore' || pathname.startsWith('/HatHakStore')) && (
                    <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary-1 to-primary-2 rounded-full shadow-lg shadow-primary-1/50"></div>
                  )}
                  
                  {/* Icon for active state */}
                  {(pathname === '/HatHakStore' || pathname.startsWith('/HatHakStore')) && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent-default rounded-full shadow-lg"></div>
                  )}
                </Link>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Search - Desktop */}
              <div className="hidden md:block">
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <div className="relative">
                      <input
                        ref={searchRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-64 px-4 py-2 pl-10 pr-4 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-1 focus:border-transparent"
                        onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={toggleSearch}
                    className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-200 transition-colors"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5 text-neutral-600" />
                  </button>
                )}
              </div>

              {/* Mobile Search Button */}
              <button
                onClick={toggleSearch}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-200 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-neutral-600" />
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationMenuRef}>
                <button
                  onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
                  className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-200 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-neutral-600" />
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-default rounded-full"></span>
                </button>
                
                {isNotificationMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-panel border border-neutral-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-neutral-200">
                      <h3 className="text-body font-medium text-neutral-900">Notifications</h3>
                    </div>
                    <div className="px-4 py-3 text-center text-neutral-500 text-sm">
                      No new notifications
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Icon */}
              <button
                onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)}
                className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-200 transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5 text-neutral-600" />
                {getDisplayCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-default text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-medium">
                    {getDisplayCartCount()}
                  </span>
                )}
              </button>

              {/* User Account */}
              <div className="relative" ref={userMenuRef}>
                <LoginButton 
                  isAuthenticated={isAuthenticated}
                  userName={user?.name || ''}
                  userEmail={user?.email || ''}
                  userRole={user?.role || ''}
                  isUserMenuOpen={isUserMenuOpen}
                  onClick={isAuthenticated ? () => setIsUserMenuOpen(!isUserMenuOpen) : undefined}
                  onLogout={handleLogout}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-200 transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-neutral-600" />
                ) : (
                  <Menu className="w-5 h-5 text-neutral-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-3">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative flex-1">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-1 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Navigation Tabs - Second Layer */}
        <div className="lg:hidden bg-white border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-3">
              <div className="flex items-center gap-4 p-1.5 w-full max-w-sm">
                <Link
                  href="/BuyForMe"
                  className={`relative flex-1 px-4 py-3 text-sm font-bold transition-all duration-500 group text-center overflow-hidden border-2 flex items-center justify-center min-h-[48px] ${
                    pathname === '/BuyForMe' || pathname.startsWith('/BuyForMe')
                      ? 'text-white bg-gradient-to-r from-primary-1 to-primary-2 shadow-xl transform scale-105 border-primary-1/30'
                      : 'text-neutral-700 border-neutral-300/50 hover:text-white hover:bg-gradient-to-r hover:from-primary-1/80 hover:to-primary-2/80 hover:shadow-lg hover:transform hover:scale-105 hover:border-primary-1/50'
                  }`}
                >
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-1 to-primary-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <span className="relative z-10 whitespace-nowrap uppercase tracking-wide">
                    Buy for Me
                  </span>
                  
                  {/* Active indicator with glow */}
                  {(pathname === '/BuyForMe' || pathname.startsWith('/BuyForMe')) && (
                    <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary-1 to-primary-2 rounded-full shadow-lg shadow-primary-1/50"></div>
                  )}
                  
                  {/* Icon for active state */}
                  {(pathname === '/BuyForMe' || pathname.startsWith('/BuyForMe')) && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent-default rounded-full shadow-lg"></div>
                  )}
                </Link>
                
                <Link
                  href="/HatHakStore"
                  className={`relative flex-1 px-4 py-3 text-sm font-bold transition-all duration-500 group text-center overflow-hidden border-2 flex items-center justify-center min-h-[48px] ${
                    pathname === '/HatHakStore' || pathname.startsWith('/HatHakStore')
                      ? 'text-white bg-gradient-to-r from-primary-1 to-primary-2 shadow-xl transform scale-105 border-primary-1/30'
                      : 'text-neutral-700 border-neutral-300/50 hover:text-white hover:bg-gradient-to-r hover:from-primary-1/80 hover:to-primary-2/80 hover:shadow-lg hover:transform hover:scale-105 hover:border-primary-1/50'
                  }`}
                >
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-1 to-primary-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <span className="relative z-10 whitespace-nowrap uppercase tracking-wide">
                    HatHak Store
                  </span>
                  
                  {/* Active indicator with glow */}
                  {(pathname === '/HatHakStore' || pathname.startsWith('/HatHakStore')) && (
                    <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary-1 to-primary-2 rounded-full shadow-lg shadow-primary-1/50"></div>
                  )}
                  
                  {/* Icon for active state */}
                  {(pathname === '/HatHakStore' || pathname.startsWith('/HatHakStore')) && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent-default rounded-full shadow-lg"></div>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Integrated into header */}
        <div className={`lg:hidden bg-white border-t border-neutral-200 transform transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 py-6 space-y-4">

            {/* Mobile User Actions */}
            <div className="space-y-2">
              <Link
                href="/wishlist"
                className="flex items-center px-4 py-3 rounded-lg text-body text-neutral-700 hover:bg-neutral-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Bookmark className="w-5 h-5 mr-3" />
                Wishlist
              </Link>
              <Link
                href="/favorites"
                className="flex items-center px-4 py-3 rounded-lg text-body text-neutral-700 hover:bg-neutral-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5 mr-3" />
                Favorites
              </Link>
            </div>

            {/* Mobile User Menu */}
            <div className="border-t border-neutral-200 pt-4 mt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-4 py-2">
                    <p className="text-body-small text-neutral-600">Welcome, {user?.name}</p>
                    <p className="text-caption text-neutral-400 capitalize">{user?.role}</p>
                  </div>
                  <Link
                    href="/User/ControlPanel/Profile"
                    className="block px-4 py-3 rounded-lg text-body text-neutral-700 hover:bg-neutral-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-3 rounded-lg text-body text-neutral-700 hover:bg-neutral-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin/buyme"
                      className="block px-4 py-3 rounded-lg text-body text-neutral-700 hover:bg-neutral-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 rounded-lg text-body text-danger hover:bg-neutral-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/login"
                    className="block px-4 py-3 rounded-lg text-body text-neutral-700 hover:bg-neutral-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-4 py-3 rounded-lg text-body text-neutral-700 hover:bg-neutral-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop - covers entire screen with grey transparent overlay */}
      {isCartDropdownOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(107, 114, 128, 0.5)',
            zIndex: 9999
          }}
        />
      )}

      {/* Cart Dropdown */}
      <CartDropdown 
        isOpen={isCartDropdownOpen} 
        onClose={() => setIsCartDropdownOpen(false)} 
      />
    </>
  );
}
