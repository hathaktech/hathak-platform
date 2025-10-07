'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 lg:right-24 z-50 w-12 h-12 bg-neutral-900 text-white rounded-full shadow-floating hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center group"
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
    </button>
  );
}
