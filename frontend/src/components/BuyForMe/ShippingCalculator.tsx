'use client';

import React, { useState } from 'react';
import { Truck, Package, MapPin, Calculator, Info, AlertCircle } from 'lucide-react';
import { ShippingCalculator as ShippingCalculatorType } from '@/types/buyme';

interface ShippingCalculatorProps {
  onCalculate: (shippingCost: number) => void;
  isLoading?: boolean;
}

export default function ShippingCalculator({ onCalculate, isLoading = false }: ShippingCalculatorProps) {
  const [formData, setFormData] = useState<ShippingCalculatorType>({
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    destination: {
      country: '',
      city: '',
      zipCode: ''
    },
    origin: {
      country: 'US',
      city: 'New York'
    }
  });
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'AU', name: 'Australia' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' },
    { code: 'IN', name: 'India' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'EG', name: 'Egypt' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'KE', name: 'Kenya' },
    { code: 'MA', name: 'Morocco' }
  ];

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', description: '7-14 business days', multiplier: 1 },
    { id: 'express', name: 'Express Shipping', description: '3-7 business days', multiplier: 1.5 },
    { id: 'priority', name: 'Priority Shipping', description: '1-3 business days', multiplier: 2 }
  ];

  const [selectedMethod, setSelectedMethod] = useState(shippingMethods[0]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
    setError(null);
    setCalculatedCost(null);
  };

  const calculateShipping = async () => {
    if (!formData.weight || !formData.dimensions.length || !formData.dimensions.width || !formData.dimensions.height) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.destination.country || !formData.destination.city || !formData.destination.zipCode) {
      setError('Please fill in destination details');
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      // Simulate API call to calculate shipping
      // In a real implementation, this would call your backend API
      const response = await fetch('/api/logistics/calculate-shipping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          method: selectedMethod.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate shipping cost');
      }

      const result = await response.json();
      const cost = result.cost * selectedMethod.multiplier;
      setCalculatedCost(cost);
      onCalculate(cost);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate shipping cost');
    } finally {
      setIsCalculating(false);
    }
  };

  const getVolumeWeight = () => {
    const volume = (formData.dimensions.length * formData.dimensions.width * formData.dimensions.height) / 5000;
    return Math.max(formData.weight, volume);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-1 bg-opacity-10 rounded-lg">
          <Truck className="w-6 h-6 text-primary-1" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900">Shipping Cost Calculator</h2>
      </div>

      <div className="space-y-6">
        {/* Package Details */}
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Package Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-neutral-700 mb-2">
                Weight (kg) *
              </label>
              <input
                type="number"
                id="weight"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-1 focus:border-transparent"
                placeholder="0.0"
                step="0.1"
                min="0"
                disabled={isCalculating || isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Dimensions (cm) *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={formData.dimensions.length}
                  onChange={(e) => handleInputChange('dimensions.length', parseFloat(e.target.value) || 0)}
                  className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-1 focus:border-transparent text-sm"
                  placeholder="Length"
                  min="0"
                  disabled={isCalculating || isLoading}
                />
                <input
                  type="number"
                  value={formData.dimensions.width}
                  onChange={(e) => handleInputChange('dimensions.width', parseFloat(e.target.value) || 0)}
                  className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-1 focus:border-transparent text-sm"
                  placeholder="Width"
                  min="0"
                  disabled={isCalculating || isLoading}
                />
                <input
                  type="number"
                  value={formData.dimensions.height}
                  onChange={(e) => handleInputChange('dimensions.height', parseFloat(e.target.value) || 0)}
                  className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-1 focus:border-transparent text-sm"
                  placeholder="Height"
                  min="0"
                  disabled={isCalculating || isLoading}
                />
              </div>
            </div>
          </div>

          {formData.weight > 0 && formData.dimensions.length > 0 && formData.dimensions.width > 0 && formData.dimensions.height > 0 && (
            <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Info className="w-4 h-4" />
                <span>Volume weight: {getVolumeWeight().toFixed(2)} kg (using higher of actual or volume weight)</span>
              </div>
            </div>
          )}
        </div>

        {/* Destination */}
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Destination
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-2">
                Country *
              </label>
              <select
                id="country"
                value={formData.destination.country}
                onChange={(e) => handleInputChange('destination.country', e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-1 focus:border-transparent"
                disabled={isCalculating || isLoading}
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-2">
                City *
              </label>
              <input
                type="text"
                id="city"
                value={formData.destination.city}
                onChange={(e) => handleInputChange('destination.city', e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-1 focus:border-transparent"
                placeholder="Enter city"
                disabled={isCalculating || isLoading}
              />
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700 mb-2">
                ZIP/Postal Code *
              </label>
              <input
                type="text"
                id="zipCode"
                value={formData.destination.zipCode}
                onChange={(e) => handleInputChange('destination.zipCode', e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-1 focus:border-transparent"
                placeholder="Enter ZIP code"
                disabled={isCalculating || isLoading}
              />
            </div>
          </div>
        </div>

        {/* Shipping Method */}
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Shipping Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shippingMethods.map(method => (
              <div
                key={method.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedMethod.id === method.id
                    ? 'border-primary-1 bg-primary-1 bg-opacity-5'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
                onClick={() => setSelectedMethod(method)}
              >
                <div className="font-medium text-neutral-900 mb-1">{method.name}</div>
                <div className="text-sm text-neutral-600">{method.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center">
          <button
            onClick={calculateShipping}
            disabled={isCalculating || isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-primary-1 text-white font-medium rounded-lg hover:bg-primary-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5" />
                Calculate Shipping
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-danger bg-opacity-10 border border-danger border-opacity-20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-danger" />
            <span className="text-danger">{error}</span>
          </div>
        )}

        {calculatedCost !== null && (
          <div className="p-6 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-2">
                ${calculatedCost.toFixed(2)} USD
              </div>
              <div className="text-sm text-neutral-600">
                {selectedMethod.name} • {selectedMethod.description}
              </div>
              <div className="text-xs text-neutral-500 mt-2">
                * Service fees will be calculated after login and profile completion
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
