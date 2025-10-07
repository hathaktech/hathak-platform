'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@/types/auth';
import { formatDate } from '@/utils/auth';

interface WelcomeOnboardingProps {
  user: User;
  onComplete: () => void;
}

const WelcomeOnboarding: React.FC<WelcomeOnboardingProps> = ({ user, onComplete }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to HatHak!',
      description: `Hi ${user.name}, your account has been created successfully!`,
      icon: '🎉',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Account created successfully
                </p>
                <p className="text-sm text-green-700">
                  Member since {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Your Account Details</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex justify-between">
                <span>Name:</span>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Type:</span>
                <span className="font-medium capitalize">{user.role}</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Explore Your Control Panel',
      description: 'Discover all the features available to you',
      icon: '🚀',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Browse Products</h4>
                  <p className="text-sm text-gray-500">Explore our product catalog</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Buy For Me</h4>
                  <p className="text-sm text-gray-500">Request custom purchases</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Shopping Cart</h4>
                  <p className="text-sm text-gray-500">Manage your purchases</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Profile</h4>
                  <p className="text-sm text-gray-500">Manage your account</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Get Started',
      description: 'Ready to explore? Let\'s take you to your control panel',
      icon: '✨',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-indigo-900 mb-2">You're all set!</h4>
            <p className="text-indigo-700">
              Your HatHak account is ready. You can now access all features and start exploring our platform.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Quick Tips:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                <span>Complete your profile to get personalized recommendations</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                <span>Browse our product catalog to discover new items</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                <span>Use "Buy For Me" service for custom requests</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                <span>Check your dashboard regularly for updates</span>
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">{steps[currentStep].icon}</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-lg text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="mb-8">
            {steps[currentStep].content}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Skip to Control Panel
            </button>
            
            <div className="flex space-x-3">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help? <Link href="/support" className="text-indigo-600 hover:text-indigo-500">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOnboarding;
