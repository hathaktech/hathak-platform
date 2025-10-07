'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useModernNotification } from '@/context/ModernNotificationContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Camera,
  Save,
  Edit3,
  X,
  Check
} from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  dateOfBirth?: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
  };
}

const ProfileManagement: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useModernNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    bio: '',
    dateOfBirth: '',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true
    }
  });

  const handleInputChange = (field: keyof ProfileData, value: string | boolean) => {
    if (field === 'preferences') {
      setProfileData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          ...(typeof value === 'boolean' ? { [Object.keys(prev.preferences)[0]]: value } : {})
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Here you would typically call an API to update the user profile
      // await updateUserProfile(profileData);
      
      showNotification('success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      showNotification('error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      bio: '',
      dateOfBirth: '',
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true
      }
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Profile Management</h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Manage your personal information and account preferences
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-all duration-200 text-xs ${
                isEditing
                  ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  : 'text-neutral-700 hover:bg-neutral-200 shadow-sm'
              }`}
              style={!isEditing ? { backgroundColor: '#DFD3C7' } : {}}
            >
              {isEditing ? (
                <>
                  <X className="w-3 h-3" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="w-3 h-3" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/20">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-3">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: '#73C7D4' }}>
                    <span className="text-lg font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-1 right-1 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-neutral-50 transition-colors">
                      <Camera className="w-3 h-3 text-neutral-600" />
                    </button>
                  )}
                </div>

                {/* User Info */}
                <h2 className="text-sm font-semibold text-slate-900 mb-1">
                  {profileData.name}
                </h2>
                <p className="text-xs text-slate-600 mb-2">
                  {profileData.email}
                </p>
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-1/10 text-primary-1">
                  <Shield className="w-3 h-3 mr-1" />
                  {user?.role?.charAt(0)?.toUpperCase()}{user?.role?.slice(1)} Account
                </div>

                {/* Box Number */}
                {user?.boxNumber && (
                  <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#73C7D4]/10 text-[#73C7D4]">
                    <MapPin className="w-3 h-3 mr-1" />
                    Box Number: {user.boxNumber}
                  </div>
                )}

                {/* Member Since */}
                <div className="mt-3 pt-3 border-t border-neutral-200">
                  <div className="flex items-center justify-center text-xs text-slate-600">
                    <Calendar className="w-3 h-3 mr-1" />
                    Member since {new Date(user?.createdAt || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Personal Information */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/20">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Personal Information</h3>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-2 py-1.5 bg-neutral-100 border-2 border-transparent rounded-lg text-xs transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
                    />
                  ) : (
                    <div className="flex items-center px-2 py-1.5 bg-neutral-100 rounded-lg">
                      <User className="w-3 h-3 text-slate-500 mr-1" />
                      <span className="text-xs">{profileData.name}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-2 py-1.5 bg-neutral-100 border-2 border-transparent rounded-lg text-xs transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
                    />
                  ) : (
                    <div className="flex items-center px-2 py-1.5 bg-neutral-100 rounded-lg">
                      <Mail className="w-3 h-3 text-slate-500 mr-1" />
                      <span className="text-xs">{profileData.email}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-2 py-1.5 bg-neutral-100 border-2 border-transparent rounded-lg text-xs transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
                    />
                  ) : (
                    <div className="flex items-center px-2 py-1.5 bg-neutral-100 rounded-lg">
                      <Phone className="w-3 h-3 text-slate-500 mr-1" />
                      <span className="text-xs">{profileData.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-2 py-1.5 bg-neutral-100 border-2 border-transparent rounded-lg text-xs transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
                    />
                  ) : (
                    <div className="flex items-center px-2 py-1.5 bg-neutral-100 rounded-lg">
                      <Calendar className="w-3 h-3 text-slate-500 mr-1" />
                      <span className="text-xs">{profileData.dateOfBirth || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="mt-3 space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your address"
                    rows={2}
                    className="w-full px-2 py-1.5 bg-neutral-100 border-2 border-transparent rounded-lg text-xs transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white resize-none"
                  />
                ) : (
                  <div className="flex items-start px-2 py-1.5 bg-neutral-100 rounded-lg">
                    <MapPin className="w-3 h-3 text-slate-500 mr-1 mt-0.5" />
                    <span className="text-xs">{profileData.address || 'Not provided'}</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="mt-4 space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={3}
                    className="w-full px-2 py-1.5 bg-neutral-100 border-2 border-transparent rounded-lg text-xs transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white resize-none"
                  />
                ) : (
                  <div className="px-2 py-1.5 bg-neutral-100 rounded-lg">
                    <span className="text-xs">{profileData.bio || 'No bio provided'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/20">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Notification Preferences</h3>
              
              <div className="space-y-3">
                {Object.entries(profileData.preferences).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="text-xs font-medium text-slate-700">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {key === 'emailNotifications' && 'Receive email notifications about your account'}
                        {key === 'smsNotifications' && 'Receive SMS notifications for important updates'}
                        {key === 'marketingEmails' && 'Receive promotional emails and offers'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleInputChange('preferences', e.target.checked)}
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-1 px-2.5 py-1 bg-primary-1 text-white text-xs font-semibold rounded-lg hover:bg-primary-2 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;