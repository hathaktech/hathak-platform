'use client';

import React, { useState, useEffect } from 'react';
import { Package, Calculator, Truck, TrendingUp, Star, Globe } from 'lucide-react';

interface ScrollNavigationProps {
  sections: Array<{
    id: string;
    title: string;
    icon: React.ComponentType<any>;
  }>;
}

export default function ScrollNavigation({ sections }: ScrollNavigationProps) {
  const [activeSection, setActiveSection] = useState('how-it-works');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for header
      setIsVisible(window.scrollY > 300);

      // Find the current section based on scroll position
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
      <div className="bg-white rounded-xl shadow-floating border border-neutral-200 p-2">
        <div className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all group relative ${
                  activeSection === section.id
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                title={section.title}
              >
                <Icon className="w-5 h-5" />
                
                {/* Tooltip */}
                <div className="absolute right-full mr-3 px-3 py-2 bg-neutral-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {section.title}
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-neutral-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
