"use client";
import { 
  Globe, 
  DollarSign, 
  MapPin,
  ChevronDown
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function TopBar() {
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);

  // Refs for dropdown containers
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const currencyMenuRef = useRef<HTMLDivElement>(null);
  const locationMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  return (
    <div className="bg-black text-white py-2 text-xs sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end space-x-4">
          {/* Language Selector */}
          <div className="relative" ref={languageMenuRef}>
            <button
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-800 transition-colors"
              aria-label="Select Language"
            >
              <Globe className="w-3 h-3" />
              <span className="hidden sm:inline">EN</span>
              <ChevronDown className="w-2 h-2" />
            </button>
            
            {isLanguageMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  English
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  العربية
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  Français
                </button>
              </div>
            )}
          </div>

          {/* Currency Selector */}
          <div className="relative" ref={currencyMenuRef}>
            <button
              onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
              className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-800 transition-colors"
              aria-label="Select Currency"
            >
              <DollarSign className="w-3 h-3" />
              <span className="hidden sm:inline">USD</span>
              <ChevronDown className="w-2 h-2" />
            </button>
            
            {isCurrencyMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  USD ($)
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  AED (د.إ)
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  EUR (€)
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  GBP (£)
                </button>
              </div>
            )}
          </div>

          {/* Location Selector */}
          <div className="relative" ref={locationMenuRef}>
            <button
              onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
              className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-800 transition-colors"
              aria-label="Select Country"
            >
              <MapPin className="w-3 h-3" />
              <span className="hidden sm:inline">US</span>
              <ChevronDown className="w-2 h-2" />
            </button>
            
            {isLocationMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  🇺🇸 United States
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  🇦🇪 United Arab Emirates
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  🇫🇷 France
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  🇬🇧 United Kingdom
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
