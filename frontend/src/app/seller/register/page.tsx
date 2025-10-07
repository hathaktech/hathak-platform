'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useModernNotification } from '@/context/ModernNotificationContext';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Upload, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  FileText,
  Camera,
  X
} from 'lucide-react';

interface FormData {
  // Step 1: Basic Information
  businessName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  businessType: 'individual' | 'company' | 'brand';
  
  // Step 2: Business Details
  description: string;
  website: string;
  taxId: string;
  businessLicense: string;
  
  // Step 3: Address
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  
  // Step 4: Bank Details
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber: string;
  };
  
  // Step 5: Documents
  documents: {
    identity: File | null;
    businessLicense: File | null;
    taxCertificate: File | null;
    bankStatement: File | null;
  };
  
  // Step 6: Social Media
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
    tiktok: string;
  };
  
  // Terms and Conditions
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  agreeToMarketing: boolean;
}

const SellerRegistration: React.FC = () => {
  const router = useRouter();
  const { showNotification } = useModernNotification();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: string}>({});

  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessType: 'individual',
    description: '',
    website: '',
    taxId: '',
    businessLicense: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      routingNumber: ''
    },
    documents: {
      identity: null,
      businessLicense: null,
      taxCertificate: null,
      bankStatement: null
    },
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: '',
      tiktok: ''
    },
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToMarketing: false
  });

  const steps = [
    { id: 1, title: 'Basic Information', icon: User },
    { id: 2, title: 'Business Details', icon: Building2 },
    { id: 3, title: 'Address', icon: MapPin },
    { id: 4, title: 'Bank Details', icon: CreditCard },
    { id: 5, title: 'Documents', icon: FileText },
    { id: 6, title: 'Social Media', icon: Camera },
    { id: 7, title: 'Review & Submit', icon: CheckCircle }
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => {
        const parentValue = prev[parent as keyof FormData];
        const parentObject = parentValue && typeof parentValue === 'object' ? parentValue : {};
        
        return {
          ...prev,
          [parent]: {
            ...parentObject,
            [child]: value
          }
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFileUpload = (field: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedFiles(prev => ({
        ...prev,
        [field]: e.target?.result as string
      }));
    };
    reader.readAsDataURL(file);
    
    handleInputChange(`documents.${field}`, file);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.businessName && formData.email && formData.password && 
                 formData.confirmPassword && formData.phone && formData.businessType &&
                 formData.password === formData.confirmPassword);
      case 2:
        return !!(formData.description && formData.taxId);
      case 3:
        return !!(formData.address.street && formData.address.city && 
                 formData.address.state && formData.address.country && formData.address.zipCode);
      case 4:
        return !!(formData.bankDetails.accountName && formData.bankDetails.accountNumber && 
                 formData.bankDetails.bankName && formData.bankDetails.routingNumber);
      case 5:
        return !!(formData.documents.identity && formData.documents.businessLicense);
      case 6:
        return true; // Social media is optional
      case 7:
        return formData.agreeToTerms && formData.agreeToPrivacy;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      showNotification('error', 'Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(7)) {
      showNotification('error', 'Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    try {
      // Here you would make the API call to register the seller
      const response = await fetch('/api/seller/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showNotification('success', 'Registration submitted successfully! We will review your application and get back to you within 24-48 hours.');
        router.push('/seller/registration-success');
      } else {
        const error = await response.json();
        showNotification('error', error.message || 'Registration failed');
      }
    } catch (error) {
      showNotification('error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your business name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type *
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                  <option value="brand">Brand</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your business and what you sell"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID / EIN *
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your tax ID"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business License Number (Optional)
              </label>
              <input
                type="text"
                value={formData.businessLicense}
                onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your business license number"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State / Province *
                </label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your state"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  value={formData.address.country}
                  onChange={(e) => handleInputChange('address.country', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="NL">Netherlands</option>
                  <option value="SE">Sweden</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP / Postal Code *
                </label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your ZIP code"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">
                  Your bank details are encrypted and secure. We only use this information for payments.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Holder Name *
              </label>
              <input
                type="text"
                value={formData.bankDetails.accountName}
                onChange={(e) => handleInputChange('bankDetails.accountName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the account holder name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={formData.bankDetails.accountNumber}
                  onChange={(e) => handleInputChange('bankDetails.accountNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your account number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={formData.bankDetails.bankName}
                  onChange={(e) => handleInputChange('bankDetails.bankName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your bank name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Routing Number *
              </label>
              <input
                type="text"
                value={formData.bankDetails.routingNumber}
                onChange={(e) => handleInputChange('bankDetails.routingNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your routing number"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Please upload clear, high-quality images of your documents. All documents will be verified before approval.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Government ID *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('identity', e.target.files[0])}
                    className="hidden"
                    id="identity-upload"
                  />
                  <label htmlFor="identity-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploadedFiles.identity ? 'File uploaded' : 'Click to upload ID'}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business License *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('businessLicense', e.target.files[0])}
                    className="hidden"
                    id="license-upload"
                  />
                  <label htmlFor="license-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploadedFiles.businessLicense ? 'File uploaded' : 'Click to upload license'}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Certificate (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('taxCertificate', e.target.files[0])}
                    className="hidden"
                    id="tax-upload"
                  />
                  <label htmlFor="tax-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploadedFiles.taxCertificate ? 'File uploaded' : 'Click to upload certificate'}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Statement (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('bankStatement', e.target.files[0])}
                    className="hidden"
                    id="bank-upload"
                  />
                  <label htmlFor="bank-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploadedFiles.bankStatement ? 'File uploaded' : 'Click to upload statement'}
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                Social media links help customers discover your brand. All fields are optional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.instagram}
                  onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://instagram.com/yourbrand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.facebook}
                  onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://facebook.com/yourbrand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.twitter}
                  onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://twitter.com/yourbrand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TikTok
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.tiktok}
                  onChange={(e) => handleInputChange('socialMedia.tiktok', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://tiktok.com/@yourbrand"
                />
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Review Your Information</h3>
              <p className="text-sm text-green-700">
                Please review all your information before submitting. You can go back to make changes if needed.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Business Information</h4>
                <p className="text-sm text-gray-600">{formData.businessName}</p>
                <p className="text-sm text-gray-600">{formData.email}</p>
                <p className="text-sm text-gray-600">{formData.phone}</p>
                <p className="text-sm text-gray-600 capitalize">{formData.businessType}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                <p className="text-sm text-gray-600">
                  {formData.address.street}, {formData.address.city}, {formData.address.state} {formData.address.zipCode}, {formData.address.country}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Bank Details</h4>
                <p className="text-sm text-gray-600">{formData.bankDetails.accountName}</p>
                <p className="text-sm text-gray-600">{formData.bankDetails.bankName}</p>
                <p className="text-sm text-gray-600">****{formData.bankDetails.accountNumber.slice(-4)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="mt-1 mr-3"
                />
                <span className="text-sm text-gray-700">
                  I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/seller-agreement" className="text-blue-600 hover:underline">Seller Agreement</a> *
                </span>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.agreeToPrivacy}
                  onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)}
                  className="mt-1 mr-3"
                />
                <span className="text-sm text-gray-700">
                  I agree to the <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> *
                </span>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.agreeToMarketing}
                  onChange={(e) => handleInputChange('agreeToMarketing', e.target.checked)}
                  className="mt-1 mr-3"
                />
                <span className="text-sm text-gray-700">
                  I would like to receive marketing emails and updates about new features
                </span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Become a Seller
          </h1>
          <p className="text-gray-600">
            Join our marketplace and start selling to customers worldwide
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">
              Step {currentStep} of {steps.length}
            </p>
          </div>

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegistration;
