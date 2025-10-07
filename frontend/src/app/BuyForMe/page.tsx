'use client';

import React, { useState, useEffect } from 'react';
import { TrackingInfo, ProductComparison } from '@/types/buyme';
import { useModernNotification } from '@/context/ModernNotificationContext';
import { useAuth } from '@/context/AuthContext';
import { useBuyForMeCart } from '@/context/BuyForMeCartContext';
import ProductRequestForm from '@/components/BuyForMe/ProductRequestForm';
import ShippingCalculator from '@/components/BuyForMe/ShippingCalculator';
import ShipmentTracking from '@/components/BuyForMe/ShipmentTracking';
import CustomerReviews from '@/components/BuyForMe/CustomerReviews';
import BrandsCatalog from '@/components/BuyForMe/BrandsCatalog';
import PriceComparison from '@/components/BuyForMe/PriceComparison';
import ScrollNavigation from '@/components/BuyForMe/ScrollNavigation';
import BackToTop from '@/components/BuyForMe/BackToTop';
import { 
  Package, 
  Shield, 
  Truck, 
  Globe, 
  Clock, 
  CheckCircle, 
  Star,
  ChevronDown,
  Users,
  Award,
  Calculator,
  TrendingUp,
  Plus,
  ShoppingCart
} from 'lucide-react';
import Link from 'next/link';

interface ProductRequestFormData {
  productLink: string;
  productImage?: string;
  size: string;
  color: string;
  quantity: number;
  pricePerUnit: number;
  currency: string;
  additionalDetails: string;
}

interface CartItem {
  _id: string;
  productName: string;
  productLink: string;
  images?: string[];
  quantity: number;
  estimatedPrice: number;
  currency: string;
  sizes?: string[];
  colors?: string[];
  notes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function BuyForMePage() {
  const [submitting, setSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // New state for enhanced features
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [comparisonProduct, setComparisonProduct] = useState<string>('');
  

  const { showNotification } = useModernNotification();
  const { isAuthenticated, user } = useAuth();
  const { addCartItem } = useBuyForMeCart();


  const handleShopNowClick = () => {
    setShowRequestForm(true);
  };

  const handleSaveRequest = async (data: ProductRequestFormData) => {
    try {
      setSubmitting(true);
      
      // Check if user is authenticated before saving
      if (!isAuthenticated) {
        showNotification('error', 'Please login to save products to your list');
        setShowRequestForm(false);
        return;
      }
      
      // Create a product using the context
      await addCartItem({
        productName: data.productLink.split('/').pop()?.split('?')[0] || 'Product', // Extract product name from URL
        productLink: data.productLink,
        images: data.productImage ? [data.productImage] : [],
        quantity: data.quantity,
        estimatedPrice: data.pricePerUnit,
        currency: data.currency,
        sizes: data.size ? [data.size] : [],
        colors: data.color ? [data.color] : [],
        notes: data.additionalDetails || '', // Only save additional details in notes
      });
      
      showNotification('success', 'Product saved to your BuyForMe cart successfully!');
      setShowRequestForm(false);
    } catch (err: any) {
      console.error('Error saving product:', err);
      showNotification('error', err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = () => {
    setShowRequestForm(false);
  };



  const handleShippingCalculated = (cost: number) => {
    setShippingCost(cost);
  };

  const handleTrackingResult = (info: TrackingInfo) => {
    setTrackingInfo(info);
  };

  const handleAddToCart = (comparison: ProductComparison) => {
    showNotification('success', `Added ${comparison.storeName} product to cart!`);
  };

  // Scroll navigation sections
  const scrollSections = [
    { id: 'product-input', title: 'Submit Request', icon: Package },
    { id: 'how-it-works', title: 'How It Works', icon: Package },
    { id: 'shipping-calculator', title: 'Shipping Calculator', icon: Calculator },
    { id: 'shipment-tracking', title: 'Track Shipments', icon: Truck },
    { id: 'price-comparison', title: 'Compare Prices', icon: TrendingUp },
    { id: 'brands-catalog', title: 'Brands Catalog', icon: Globe },
    { id: 'customer-reviews', title: 'Customer Reviews', icon: Star }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Submit Request",
      description: "Share the product link and details with us",
      icon: Package,
      color: "bg-neutral-900"
    },
    {
      step: 2,
      title: "We Review",
      description: "Our team reviews and approves your request",
      icon: CheckCircle,
      color: "bg-neutral-700"
    },
    {
      step: 3,
      title: "We Purchase",
      description: "We buy the product from the original store",
      icon: ShoppingCart,
      color: "bg-neutral-600"
    },
    {
      step: 4,
      title: "We Ship",
      description: "We handle shipping and delivery to you",
      icon: Truck,
      color: "bg-neutral-500"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Bank-level security for all transactions and personal data protection"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Shop from any store worldwide - Amazon, eBay, AliExpress, and more"
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Quick review and approval process, typically within 24 hours"
    },
    {
      icon: Truck,
      title: "Reliable Delivery",
      description: "Tracked shipping with insurance and delivery confirmation"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Dedicated customer service team to assist with your requests"
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "We ensure product authenticity and quality before delivery"
    }
  ];

  const pricingTiers = [
    {
      name: "Basic",
      price: "5%",
      description: "Service fee on product cost",
      features: [
        "Product sourcing",
        "Purchase handling",
        "Basic shipping",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: "8%",
      description: "Service fee on product cost",
      features: [
        "Everything in Basic",
        "Priority processing",
        "Express shipping",
        "Phone support",
        "Insurance included"
      ],
      popular: true
    },
    {
      name: "VIP",
      price: "12%",
      description: "Service fee on product cost",
      features: [
        "Everything in Premium",
        "White-glove service",
        "Custom packaging",
        "Dedicated account manager",
        "Rush delivery options"
      ],
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How does the Buy for Me service work?",
      answer: "Simply submit a product link with details, we review and approve your request, purchase the item, and ship it directly to you. You only pay the product cost plus our service fee."
    },
    {
      question: "What stores can you shop from?",
      answer: "We can purchase from most major online retailers including Amazon, eBay, AliExpress, Walmart, Target, Best Buy, and many international stores."
    },
    {
      question: "How long does the process take?",
      answer: "Request review typically takes 24 hours. Once approved, we purchase immediately and shipping depends on the store and your location, usually 3-7 business days."
    },
    {
      question: "What if the product is out of stock?",
      answer: "We'll notify you immediately if a product becomes unavailable and work with you to find alternatives or process a refund if you prefer."
    },
    {
      question: "Is there a minimum order value?",
      answer: "No minimum order value. However, our service fee structure makes it most cost-effective for orders over $25."
    },
    {
      question: "What if I'm not satisfied with my purchase?",
      answer: "We offer a satisfaction guarantee. If you're not happy with your purchase, contact us within 7 days and we'll work to resolve the issue."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      text: "Amazing service! Got my favorite Japanese skincare products delivered right to my door. The team was so helpful throughout the process.",
      avatar: "👩‍💼"
    },
    {
      name: "Ahmed Al-Rashid",
      location: "Dubai, UAE",
      rating: 5,
      text: "Finally found a way to get those exclusive sneakers from the US. HatHak made it so easy and the delivery was super fast!",
      avatar: "👨‍💻"
    },
    {
      name: "Maria Garcia",
      location: "Madrid, Spain",
      rating: 5,
      text: "I love shopping from international stores but shipping was always a problem. HatHak solved that completely. Highly recommended!",
      avatar: "👩‍🎨"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-16">
          {/* Product Request Section */}
          <section id="product-input">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                LET'S SHOP FOR YOU
              </h1>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
                Click the button below to submit a product request form
              </p>
              <button
                onClick={handleShopNowClick}
                className="bg-orange-500 text-white px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-elegant font-medium text-lg"
              >
                Submit Product Request
              </button>
            </div>
          </section>



          {/* How It Works - Shortcut */}
          <section id="how-it-works">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Simple 4-step process to get your products delivered
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div key={step.step} className="text-center">
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-medium text-primary-1 mb-2">Step {step.step}</div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{step.title}</h3>
                  <p className="text-neutral-600">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Shipping Cost Calculator */}
          <section id="shipping-calculator">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Shipping Cost Calculator
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Calculate shipping costs based on weight, dimensions, and destination
              </p>
            </div>
            <ShippingCalculator onCalculate={handleShippingCalculated} />
          </section>

          {/* Shipment Tracking */}
          <section id="shipment-tracking">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Track Your Shipments
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Track your packages in real-time using tracking numbers from any carrier
              </p>
            </div>
            <ShipmentTracking onTrack={handleTrackingResult} />
          </section>

          {/* Product & Price Comparison */}
          <section id="price-comparison">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Compare Prices Across Stores
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Find the best deals by comparing the same product across different stores and countries
              </p>
            </div>
            <PriceComparison
              productName={comparisonProduct || 'Sample Product'}
              onAddToCart={handleAddToCart}
            />
          </section>

          {/* Brands Catalog */}
          <section id="brands-catalog">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Partner Brands & Stores
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Browse our extensive catalog of partner brands and stores worldwide
              </p>
            </div>
            <BrandsCatalog />
          </section>

          {/* Customer Reviews */}
          <section id="customer-reviews">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Customer Reviews
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                See what our customers say about our Buy for Me service
              </p>
            </div>
            <CustomerReviews />
          </section>

          {/* Features */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Why Choose Our Service
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                We make international shopping simple, secure, and reliable
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-xl hover:shadow-elegant transition-shadow">
                  <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-neutral-900" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                No hidden fees. Pay only for the product cost plus our service fee
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => (
                <div
                  key={tier.name}
                  className={`relative p-8 rounded-2xl border-2 ${
                    tier.popular
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-neutral-900 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">{tier.name}</h3>
                    <div className="text-4xl font-bold text-neutral-900 mb-2">{tier.price}</div>
                    <p className="text-neutral-600 mb-6">{tier.description}</p>
                    <ul className="space-y-3 text-left">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-neutral-900 mr-3 flex-shrink-0" />
                          <span className="text-neutral-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust us with their international shopping
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-neutral-50 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="text-2xl mr-3">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                      <div className="text-sm text-neutral-500">{testimonial.location}</div>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-neutral-600 italic">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Everything you need to know about our Buy for Me service
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-neutral-200 last:border-b-0">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full py-6 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors"
                  >
                    <span className="font-medium text-neutral-900">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-neutral-500 transition-transform ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="pb-6 text-neutral-600">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Scroll Navigation */}
      <ScrollNavigation sections={scrollSections} />
      
      {/* Back to Top Button */}
      <BackToTop />

      {/* Product Request Form Modal */}
      <ProductRequestForm
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        onSave={handleSaveRequest}
        onCancel={handleCancelRequest}
        isLoading={submitting}
      />
    </div>
  );
}
