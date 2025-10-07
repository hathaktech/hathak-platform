'use client';

import Link from 'next/link';
import { User, LayoutDashboard, Settings, LogOut, Bookmark } from 'lucide-react';

interface LoginButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  isAuthenticated?: boolean;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  isUserMenuOpen?: boolean;
  onLogout?: () => void;
  onMouseLeave?: () => void;
}

export default function LoginButton({ 
  href = '/auth/login', 
  onClick,
  className = '',
  isAuthenticated = false,
  userName = '',
  userEmail = '',
  userRole = '',
  isUserMenuOpen = false,
  onLogout,
  onMouseLeave
}: LoginButtonProps) {
  const displayText = isAuthenticated && userName ? userName : 'Login';
  
  const buttonContent = (
    <div 
      className="flex items-center gap-2 px-6 py-3 font-medium shadow-sm"
      style={{
        backgroundColor: isAuthenticated ? '#ffffff' : '#1a1a1a', // White when logged in, dark when not
        color: isAuthenticated ? '#1a1a1a' : '#ffffff', // Dark text when logged in, white when not
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)', // Soft, diffused shadow directly beneath
        border: isAuthenticated ? '1px solid #e5e5e5' : '1px solid #333333', // Light border when logged in, dark when not
        cursor: 'pointer'
      }}
    >
      <User className="w-4 h-4" style={{ color: isAuthenticated ? '#1a1a1a' : '#ffffff' }} />
      <span className="text-sm font-normal">{displayText}</span>
    </div>
  );

  const buttonElement = onClick ? (
    <button 
      onClick={onClick}
      className={`inline-block ${className}`}
      aria-label={isAuthenticated ? "User Menu" : "Login"}
      style={{ border: 'none', background: 'transparent' }}
    >
      {buttonContent}
    </button>
  ) : (
    <Link 
      href={href}
      className={`inline-block ${className}`}
      aria-label="Login"
      style={{ textDecoration: 'none' }}
    >
      {buttonContent}
    </Link>
  );

  return (
    <div 
      className="relative"
      onMouseLeave={onMouseLeave}
    >
      {buttonElement}
      {isAuthenticated && isUserMenuOpen && (
        <>
          {/* Invisible bridge to prevent mouse leave gap */}
          <div className="absolute right-0 top-full w-72 h-1 z-40"></div>
          <div className="absolute right-0 mt-1 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-4 z-50 animate-in slide-in-from-top-2 duration-200">
          {/* User Profile Section */}
          <div className="px-6 py-4 border-b border-gray-100/50">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-lg font-bold text-white">
                    {userName?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {userName}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {userEmail}
                </p>
                <div className="flex items-center mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200">
                    {userRole?.charAt(0)?.toUpperCase()}{userRole?.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="py-2">
            <Link
              href="/User/ControlPanel"
              className="group flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mr-4 transition-colors duration-200">
                <LayoutDashboard className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium">Control Panel</span>
            </Link>
            <Link
              href="/User/ControlPanel/Profile"
              className="group flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center mr-4 transition-colors duration-200">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-medium">Profile</span>
            </Link>
            <Link
              href="/orders"
              className="group flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-green-100 group-hover:bg-green-200 flex items-center justify-center mr-4 transition-colors duration-200">
                <Bookmark className="w-4 h-4 text-green-600" />
              </div>
              <span className="font-medium">Orders</span>
            </Link>
            <Link
              href="/settings"
              className="group flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center mr-4 transition-colors duration-200">
                <Settings className="w-4 h-4 text-orange-600" />
              </div>
              <span className="font-medium">Settings</span>
            </Link>
          </div>
          
          {/* Logout Section */}
          <div className="border-t border-gray-100/50 pt-2 mt-2">
            <button
              onClick={onLogout}
              className="group flex items-center w-full px-6 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 group-hover:bg-red-200 flex items-center justify-center mr-4 transition-colors duration-200">
                <LogOut className="w-4 h-4 text-red-600" />
              </div>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
