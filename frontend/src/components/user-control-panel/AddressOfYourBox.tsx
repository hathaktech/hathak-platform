'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useModernNotification } from '@/context/ModernNotificationContext';
import { 
  Copy, 
  MapPin, 
  User, 
  Building, 
  Phone, 
  FileText,
  Check
} from 'lucide-react';

interface AddressData {
  addressType: string;
  fullName: string;
  firstName: string;
  lastName: string;
  city: string;
  district: string;
  postcode: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  phoneNumber: string;
  companyName: string;
  taxOffice: string;
  taxId: string;
}

const AddressOfYourBox: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useModernNotification();
  const [addressData, setAddressData] = useState<AddressData>({
    addressType: '',
    fullName: '',
    firstName: '',
    lastName: '',
    city: '',
    district: '',
    postcode: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    phoneNumber: '',
    companyName: '',
    taxOffice: '',
    taxId: ''
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    // Fetch address data from API
    fetchAddressData();
  }, []);

  const fetchAddressData = async () => {
    try {
      // This would typically fetch from your API
      // For now, using mock data
      const mockData: AddressData = {
        addressType: 'Personal',
        fullName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        city: 'Istanbul',
        district: 'Kadıköy',
        postcode: '34710',
        addressLine1: 'Bağdat Caddesi No:123',
        addressLine2: 'Kadıköy Mahallesi',
        addressLine3: 'Istanbul, Turkey',
        phoneNumber: '+90 555 123 4567',
        companyName: 'HatHak Logistics',
        taxOffice: 'Kadıköy VD',
        taxId: '1234567890'
      };
      setAddressData(mockData);
    } catch (error) {
      console.error('Error fetching address data:', error);
    }
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      showNotification('success', 'Copied to clipboard!');
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      showNotification('error', 'Failed to copy to clipboard');
    }
  };

  const copyFullAddress = async () => {
    const fullAddress = `${addressData.addressLine1}\n${addressData.addressLine2}\n${addressData.addressLine3}`;
    await copyToClipboard(fullAddress, 'fullAddress');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl lg:text-2xl text-[#FF7060] mb-3">Address of your box</h1>
        <p className="text-xs text-neutral-700 max-w-2xl mx-auto">
          Ship all your purchases to the following address. They will appear in the{' '}
          <span className="text-[#FF7060] font-semibold">Contents of your box</span>{' '}
          page when they arrive.
        </p>
      </div>

      {/* Box Number Display */}
      <div className="bg-gradient-to-r from-[#73C7D4] to-[#5AB3C4] rounded-2xl p-4 text-center shadow-lg">
        <div className="flex items-center justify-center gap-2">
          <MapPin className="w-5 h-5 text-white" />
          <span className="text-lg font-bold text-white">Box Number: {user?.boxNumber || '123456'}</span>
        </div>
      </div>

      {/* Country Indicator */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-white font-bold text-sm">Turkey</h3>
          <p className="text-gray-300 text-xs">For Shopping From Turkey</p>
        </div>
      </div>

      {/* Address Form */}
      <div className="bg-white rounded-3xl shadow-floating p-4 border border-neutral-200">
        <div className="space-y-4">
          {/* Address Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Address Type
              </label>
              <p className="text-xs text-neutral-500">Adres Başlığı</p>
            </div>
            <div className="md:col-span-2 relative">
              <input
                type="text"
                value={addressData.addressType}
                readOnly
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(addressData.addressType, 'addressType')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {copiedField === 'addressType' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-neutral-500" />
                )}
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Full Name
              </label>
              <p className="text-xs text-neutral-500">Adı Soyadı</p>
            </div>
            <div className="md:col-span-2 relative">
              <input
                type="text"
                value={addressData.fullName}
                readOnly
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(addressData.fullName, 'fullName')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {copiedField === 'fullName' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-neutral-500" />
                )}
              </button>
            </div>
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                First Name & Last Name
              </label>
              <p className="text-xs text-neutral-500">Ad & Soyad</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={addressData.firstName}
                  readOnly
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(addressData.firstName, 'firstName')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  {copiedField === 'firstName' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-neutral-500" />
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={addressData.lastName}
                  readOnly
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(addressData.lastName, 'lastName')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  {copiedField === 'lastName' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-neutral-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* City */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                City
              </label>
              <p className="text-xs text-neutral-500">İl / Şehir</p>
            </div>
            <div className="md:col-span-2 relative">
              <input
                type="text"
                value={addressData.city}
                readOnly
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(addressData.city, 'city')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {copiedField === 'city' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-neutral-500" />
                )}
              </button>
            </div>
          </div>

          {/* District */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                District
              </label>
              <p className="text-xs text-neutral-500">İlçe</p>
            </div>
            <div className="md:col-span-2 relative">
              <input
                type="text"
                value={addressData.district}
                readOnly
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(addressData.district, 'district')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {copiedField === 'district' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-neutral-500" />
                )}
              </button>
            </div>
          </div>

          {/* Postcode */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Postcode
              </label>
              <p className="text-xs text-neutral-500">Posta Kodu</p>
            </div>
            <div className="md:col-span-2 relative">
              <input
                type="text"
                value={addressData.postcode}
                readOnly
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(addressData.postcode, 'postcode')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {copiedField === 'postcode' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-neutral-500" />
                )}
              </button>
            </div>
          </div>

          {/* Full Address */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Full Address
              </label>
              <p className="text-xs text-neutral-500">Adres</p>
            </div>
            <div className="md:col-span-2 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={addressData.addressLine1}
                  readOnly
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(addressData.addressLine1, 'addressLine1')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  {copiedField === 'addressLine1' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-neutral-500" />
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={addressData.addressLine2}
                  readOnly
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(addressData.addressLine2, 'addressLine2')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  {copiedField === 'addressLine2' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-neutral-500" />
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={addressData.addressLine3}
                  readOnly
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(addressData.addressLine3, 'addressLine3')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  {copiedField === 'addressLine3' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-neutral-500" />
                  )}
                </button>
              </div>
              {/* Copy Full Address Button */}
              <div className="flex justify-end">
                <button
                  onClick={copyFullAddress}
                  className="flex items-center gap-2 px-4 py-2 bg-[#73C7D4] text-white rounded-lg hover:bg-[#5AB3C4] transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy Full Address
                </button>
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Phone Number
              </label>
              <p className="text-xs text-neutral-500">Cep Telefonu</p>
            </div>
            <div className="md:col-span-2 relative">
              <input
                type="text"
                value={addressData.phoneNumber}
                readOnly
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(addressData.phoneNumber, 'phoneNumber')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {copiedField === 'phoneNumber' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-neutral-500" />
                )}
              </button>
            </div>
          </div>

          {/* Company Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Name of Company
              </label>
              <p className="text-xs text-neutral-500">Şirket Adı</p>
            </div>
            <div className="md:col-span-2 relative">
              <input
                type="text"
                value={addressData.companyName}
                readOnly
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(addressData.companyName, 'companyName')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {copiedField === 'companyName' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-neutral-500" />
                )}
              </button>
            </div>
          </div>

          {/* Tax Office */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Tax Office
              </label>
              <p className="text-xs text-neutral-500">Vergi Dairesi / VD</p>
            </div>
            <div className="md:col-span-2 relative">
              <input
                type="text"
                value={addressData.taxOffice}
                readOnly
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(addressData.taxOffice, 'taxOffice')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {copiedField === 'taxOffice' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-neutral-500" />
                )}
              </button>
            </div>
          </div>

          {/* Tax ID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Tax ID
              </label>
              <p className="text-xs text-neutral-500">Vergi Numarası / VKN</p>
            </div>
            <div className="md:col-span-2 relative">
              <input
                type="text"
                value={addressData.taxId}
                readOnly
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(addressData.taxId, 'taxId')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {copiedField === 'taxId' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-neutral-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressOfYourBox;
