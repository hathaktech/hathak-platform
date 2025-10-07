'use client';

import React from 'react';
import { 
  ShoppingCart, 
  Package, 
  RotateCcw, 
  Shield, 
  Clock, 
  Truck,
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';

export default function HatHakStorePage() {
  const services = [
    {
      title: 'HatHak Store Orders',
      description: 'Browse and manage your HatHak store orders with real-time tracking and status updates.',
      icon: Package,
      href: '/User/ControlPanel/HatHakStore/Orders',
      features: ['Order tracking', 'Status updates', 'Order history', 'Invoice management']
    },
    {
      title: 'HatHakStore Return',
      description: 'Process returns and exchanges for your HatHak store purchases with ease.',
      icon: RotateCcw,
      href: '/User/ControlPanel/HatHakStore/Return',
      features: ['Return requests', 'Exchange processing', 'Refund tracking', 'Return status']
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'All transactions are protected with advanced encryption and security measures.'
    },
    {
      icon: Clock,
      title: 'Fast Processing',
      description: 'Quick order processing and fast delivery to your international address.'
    },
    {
      icon: Truck,
      title: 'Global Shipping',
      description: 'Worldwide shipping with tracking and insurance coverage.'
    },
    {
      icon: Star,
      title: 'Quality Guarantee',
      description: 'Quality assurance on all products with easy return policies.'
    }
  ];

  return (
    <UserControlPanel>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold mb-2">
              HatHak Store Services
            </h1>
            <p className="text-xs text-blue-100 max-w-3xl mx-auto">
              Your comprehensive platform for managing HatHak store orders, returns, and customer service. 
              Access all your store-related services in one convenient location.
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
            Available Services
          </h2>
          <p className="text-xs text-gray-600 max-w-2xl mx-auto">
            Choose from our comprehensive range of HatHak store services designed to enhance your shopping experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                href={service.href}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 border border-gray-100 hover:border-blue-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      {service.description}
                    </p>
                    <div className="space-y-1">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-xs text-gray-500">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center text-blue-600 font-medium text-xs group-hover:text-blue-700">
                      Access Service
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-gray-50 rounded-3xl p-4">
          <div className="text-center mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
              Why Choose HatHak Store Services?
            </h2>
            <p className="text-xs text-gray-600 max-w-2xl mx-auto">
              Experience the benefits of our integrated store services platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/User/ControlPanel/HatHakStore/Orders"
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Package className="w-3 h-3 mr-1" />
              View Orders
            </Link>
            <Link
              href="/User/ControlPanel/HatHakStore/Return"
              className="inline-flex items-center px-3 py-2 bg-gray-600 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Process Return
            </Link>
          </div>
        </div>
      </div>
      </div>
    </UserControlPanel>
  );
}
