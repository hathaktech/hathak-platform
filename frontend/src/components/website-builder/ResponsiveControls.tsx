'use client';

import { Smartphone, Tablet, Monitor } from 'lucide-react';

interface ResponsiveControlsProps {
  currentDevice: string;
  onDeviceChange: (device: string) => void;
}

export default function ResponsiveControls({ currentDevice, onDeviceChange }: ResponsiveControlsProps) {
  const devices = [
    { id: 'mobile', label: 'Mobile', icon: Smartphone, width: '375px' },
    { id: 'tablet', label: 'Tablet', icon: Tablet, width: '768px' },
    { id: 'desktop', label: 'Desktop', icon: Monitor, width: '100%' }
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {devices.map((device) => {
        const Icon = device.icon;
        const isActive = currentDevice === device.id;
        
        return (
          <button
            key={device.id}
            onClick={() => onDeviceChange(device.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              isActive
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
            title={`${device.label} (${device.width})`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{device.label}</span>
          </button>
        );
      })}
    </div>
  );
}

