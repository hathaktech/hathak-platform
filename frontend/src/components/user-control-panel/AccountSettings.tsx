'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useModernNotification } from '@/context/ModernNotificationContext';
import { 
  Settings, 
  Shield, 
  Key, 
  Globe, 
  Palette, 
  Bell, 
  Eye, 
  EyeOff,
  Save,
  Trash2,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showPhone: boolean;
  allowMessages: boolean;
  dataSharing: boolean;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
}

const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useModernNotification();
  const [activeTab, setActiveTab] = useState<'security' | 'privacy' | 'appearance' | 'notifications'>('security');
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    loginAlerts: true
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'private',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    dataSharing: false
  });

  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    securityAlerts: true,
    weeklyDigest: false
  });

  const tabs = [
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'privacy', name: 'Privacy', icon: Eye },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ];

  const handleSecurityChange = (field: keyof SecuritySettings, value: string | boolean) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (field: keyof PrivacySettings, value: string | boolean) => {
    setPrivacySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleAppearanceChange = (field: keyof AppearanceSettings, value: string) => {
    setAppearanceSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSecurity = async () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      showNotification('error', 'New passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      // API call to update security settings
      showNotification('success', 'Security settings updated successfully');
    } catch (error) {
      showNotification('error', 'Failed to update security settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (type: string) => {
    try {
      setLoading(true);
      // API call to update settings
      showNotification('success', `${type} settings updated successfully`);
    } catch (error) {
      showNotification('error', `Failed to update ${type} settings`);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl text-primary-1">Account Settings</h1>
        <p className="text-xs text-accent-light mt-1.5">
          Manage your account preferences, security, and privacy settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-floating p-4 border border-neutral-200">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center px-3 py-2 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-1 text-white shadow-elegant'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-1'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${
                      activeTab === tab.id ? 'text-white' : 'text-neutral-500'
                    }`} />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl shadow-floating p-4 border border-neutral-200">
            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg text-primary-1 mb-1.5">Security Settings</h2>
                  <p className="text-xs text-accent-light">
                    Manage your password and security preferences
                  </p>
                </div>

                {/* Change Password */}
                <div className="space-y-4">
                  <h3 className="text-sm text-primary-1">Change Password</h3>
                  
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-primary-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={securitySettings.currentPassword}
                          onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                          className="w-full px-2 py-1.5 pr-10 bg-neutral-100 border-2 border-transparent rounded-xl text-xs transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-accent-light hover:text-primary-1"
                        >
                          {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-primary-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={securitySettings.newPassword}
                          onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                          className="w-full px-2 py-1.5 pr-10 bg-neutral-100 border-2 border-transparent rounded-xl text-xs transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-accent-light hover:text-primary-1"
                        >
                          {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-primary-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={securitySettings.confirmPassword}
                          onChange={(e) => handleSecurityChange('confirmPassword', e.target.value)}
                          className="w-full px-2 py-1.5 pr-10 bg-neutral-100 border-2 border-transparent rounded-xl text-xs transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-accent-light hover:text-primary-1"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveSecurity}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary-1 text-white text-sm font-semibold rounded-xl hover:bg-primary-2 transition-all duration-200 shadow-elegant disabled:opacity-50"
                  >
                    <Key className="w-4 h-4" />
                    Update Password
                  </button>
                </div>

                {/* Two-Factor Authentication */}
                <div className="space-y-4">
                  <h3 className="text-heading-3 text-primary-1">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-neutral-100 rounded-xl">
                    <div>
                      <h4 className="font-medium text-primary-1">Enable 2FA</h4>
                      <p className="text-sm text-accent-light">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorEnabled}
                        onChange={(e) => handleSecurityChange('twoFactorEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-1/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-1"></div>
                    </label>
                  </div>
                </div>

                {/* Login Alerts */}
                <div className="space-y-4">
                  <h3 className="text-heading-3 text-primary-1">Login Alerts</h3>
                  <div className="flex items-center justify-between p-4 bg-neutral-100 rounded-xl">
                    <div>
                      <h4 className="font-medium text-primary-1">Email Login Alerts</h4>
                      <p className="text-sm text-accent-light">Get notified when someone logs into your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.loginAlerts}
                        onChange={(e) => handleSecurityChange('loginAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-1/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-1"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-heading-2 text-primary-1 mb-2">Privacy Settings</h2>
                  <p className="text-xs text-accent-light">
                    Control who can see your information and how it's used
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-primary-1">
                      Profile Visibility
                    </label>
                    <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-neutral-100 border-2 border-transparent rounded-xl text-xs transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
                    >
                      <option value="public">Public - Anyone can see your profile</option>
                      <option value="friends">Friends - Only your connections can see</option>
                      <option value="private">Private - Only you can see your profile</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-heading-3 text-primary-1">Information Sharing</h3>
                    {[
                      { key: 'showEmail', label: 'Show Email Address', desc: 'Allow others to see your email' },
                      { key: 'showPhone', label: 'Show Phone Number', desc: 'Allow others to see your phone number' },
                      { key: 'allowMessages', label: 'Allow Direct Messages', desc: 'Let other users send you messages' },
                      { key: 'dataSharing', label: 'Data Sharing', desc: 'Share anonymized data for improvements' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-neutral-100 rounded-xl">
                        <div>
                          <h4 className="font-medium text-primary-1">{item.label}</h4>
                          <p className="text-sm text-accent-light">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings[item.key as keyof PrivacySettings] as boolean}
                            onChange={(e) => handlePrivacyChange(item.key as keyof PrivacySettings, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-1/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-1"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSaveSettings('Privacy')}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary-1 text-white text-sm font-semibold rounded-xl hover:bg-primary-2 transition-all duration-200 shadow-elegant disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    Save Privacy Settings
                  </button>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-heading-2 text-primary-1 mb-2">Appearance Settings</h2>
                  <p className="text-xs text-accent-light">
                    Customize how the interface looks and feels
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-primary-1">
                        Theme
                      </label>
                      <select
                        value={appearanceSettings.theme}
                        onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                        className="w-full px-2 py-1.5 bg-neutral-100 border-2 border-transparent rounded-xl text-xs transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-primary-1">
                        Language
                      </label>
                      <select
                        value={appearanceSettings.language}
                        onChange={(e) => handleAppearanceChange('language', e.target.value)}
                        className="w-full px-2 py-1.5 bg-neutral-100 border-2 border-transparent rounded-xl text-xs transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
                      >
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-primary-1">
                        Timezone
                      </label>
                      <select
                        value={appearanceSettings.timezone}
                        onChange={(e) => handleAppearanceChange('timezone', e.target.value)}
                        className="w-full px-2 py-1.5 bg-neutral-100 border-2 border-transparent rounded-xl text-xs transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Dubai">Dubai</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-primary-1">
                        Date Format
                      </label>
                      <select
                        value={appearanceSettings.dateFormat}
                        onChange={(e) => handleAppearanceChange('dateFormat', e.target.value)}
                        className="w-full px-2 py-1.5 bg-neutral-100 border-2 border-transparent rounded-xl text-xs transition-all duration-200 focus:outline-none focus:ring-0 focus:border-primary-1 focus:bg-white"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveSettings('Appearance')}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary-1 text-white text-sm font-semibold rounded-xl hover:bg-primary-2 transition-all duration-200 shadow-elegant disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    Save Appearance Settings
                  </button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-heading-2 text-primary-1 mb-2">Notification Settings</h2>
                  <p className="text-xs text-accent-light">
                    Choose how and when you want to be notified
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-heading-3 text-primary-1">Notification Channels</h3>
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                      { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications' },
                      { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive text message notifications' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-neutral-100 rounded-xl">
                        <div>
                          <h4 className="font-medium text-primary-1">{item.label}</h4>
                          <p className="text-sm text-accent-light">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                            onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-1/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-1"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-heading-3 text-primary-1">Notification Types</h3>
                    {[
                      { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional emails and offers' },
                      { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about order status changes' },
                      { key: 'securityAlerts', label: 'Security Alerts', desc: 'Important security notifications' },
                      { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of your activity' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-neutral-100 rounded-xl">
                        <div>
                          <h4 className="font-medium text-primary-1">{item.label}</h4>
                          <p className="text-sm text-accent-light">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                            onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-1/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-1"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSaveSettings('Notification')}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary-1 text-white text-sm font-semibold rounded-xl hover:bg-primary-2 transition-all duration-200 shadow-elegant disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    Save Notification Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
