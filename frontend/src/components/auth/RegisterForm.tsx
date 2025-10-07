'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { RegisterFormData } from '@/types/auth';
import SuccessPage from './SuccessPage';
import WelcomeOnboarding from './WelcomeOnboarding';

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { register, error, clearError, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<Partial<RegisterFormData>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof RegisterFormData]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<RegisterFormData> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await register(formData);
      setRegisteredUser(response.user);
      setShowSuccess(true);
    } catch (error) {
      // Error is handled by the context
      console.error('Registration error:', error);
    }
  };

  const handleSuccessContinue = () => {
    setShowSuccess(false);
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    router.push('/User/ControlPanel');
  };

  // Show success page after registration
  if (showSuccess && registeredUser) {
    return <SuccessPage user={registeredUser} onContinue={handleSuccessContinue} />;
  }

  // Show onboarding after success
  if (showOnboarding && registeredUser) {
    return <WelcomeOnboarding user={registeredUser} onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-neutral-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #BE9D8F 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #BE9D8F 0%, transparent 50%)`,
        }} />
      </div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-1 rounded-2xl mb-4 shadow-floating">
            <span className="text-2xl font-bold text-white">H</span>
          </div>
          <h1 className="text-display-2 text-primary-1 mb-2">Join HatHak</h1>
          <p className="text-body text-accent-light">
            Create your account and start your journey with us
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-floating p-8 border border-neutral-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-in fade-in-0">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-primary-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 bg-neutral-100 border-2 rounded-xl text-body transition-all duration-200 focus:outline-none focus:ring-0 ${
                      validationErrors.name 
                        ? 'border-red-300 focus:border-red-400 bg-red-50' 
                        : 'border-transparent focus:border-primary-1 focus:bg-white'
                    }`}
                    placeholder="Enter your full name"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="h-5 w-5 text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                {validationErrors.name && (
                  <p className="text-sm text-red-600 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-primary-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 bg-neutral-100 border-2 rounded-xl text-body transition-all duration-200 focus:outline-none focus:ring-0 ${
                      validationErrors.email 
                        ? 'border-red-300 focus:border-red-400 bg-red-50' 
                        : 'border-transparent focus:border-primary-1 focus:bg-white'
                    }`}
                    placeholder="Enter your email address"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="h-5 w-5 text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
                {validationErrors.email && (
                  <p className="text-sm text-red-600 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-primary-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 bg-neutral-100 border-2 rounded-xl text-body transition-all duration-200 focus:outline-none focus:ring-0 ${
                      validationErrors.password 
                        ? 'border-red-300 focus:border-red-400 bg-red-50' 
                        : 'border-transparent focus:border-primary-1 focus:bg-white'
                    }`}
                    placeholder="Create a secure password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="h-5 w-5 text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-red-600 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-primary-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 bg-neutral-100 border-2 rounded-xl text-body transition-all duration-200 focus:outline-none focus:ring-0 ${
                      validationErrors.confirmPassword 
                        ? 'border-red-300 focus:border-red-400 bg-red-50' 
                        : 'border-transparent focus:border-primary-1 focus:bg-white'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="h-5 w-5 text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-1 hover:bg-primary-2 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary-1/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-elegant"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Terms and Privacy */}
            <div className="text-center">
              <p className="text-xs text-accent-light">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-primary-1 hover:text-accent-dark transition-colors duration-200">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-1 hover:text-accent-dark transition-colors duration-200">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-8">
          <p className="text-body text-accent-light">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-primary-1 hover:text-accent-dark transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
