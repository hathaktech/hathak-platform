'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@/types/auth';

interface SuccessPageProps {
  user: User;
  onContinue: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ user, onContinue }) => {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Hide confetti after 3 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(confettiTimer);
    };
  }, [onContinue]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  ['bg-yellow-400', 'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][
                    Math.floor(Math.random() * 5)
                  ]
                }`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-md w-full text-center relative z-10">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-4 animate-pulse">
            <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to HatHak! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Your account has been created successfully!
          </p>
          <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 mb-8">
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Start Exploring
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/HatHakStore"
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Browse Products
            </Link>
            <Link
              href="/BuyForMe"
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Buy For Me
            </Link>
          </div>
        </div>

        {/* Auto-redirect notice */}
        <div className="text-sm text-gray-500">
          <p>Redirecting to your control panel in {countdown} seconds...</p>
          <button
            onClick={onContinue}
            className="text-indigo-600 hover:text-indigo-500 font-medium mt-1"
          >
            Continue now
          </button>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">What's next?</h3>
          <ul className="text-sm text-blue-700 space-y-1 text-left">
            <li>• Explore our product catalog</li>
            <li>• Set up your profile preferences</li>
            <li>• Try our "Buy For Me" service</li>
            <li>• Check out your dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
