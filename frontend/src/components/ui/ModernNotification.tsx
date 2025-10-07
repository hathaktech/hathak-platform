'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface ModernNotificationProps {
  type: NotificationType;
  message: string;
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

const ModernNotification: React.FC<ModernNotificationProps> = ({ 
  type, 
  message, 
  duration = 4000, 
  onClose, 
  isVisible 
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const getNotificationStyles = () => {
    const baseStyles = "w-full transform transition-all duration-500 ease-out rounded-lg shadow-lg";
    
    const typeStyles = {
      success: "bg-white border-l-4 border-green-500",
      error: "bg-white border-l-4 border-red-500", 
      warning: "bg-white border-l-4 border-amber-500",
      info: "bg-white border-l-4 border-blue-500"
    };

    const visibilityStyles = isVisible && !isExiting 
      ? "translate-y-0 opacity-100 scale-100" 
      : "-translate-y-4 opacity-0 scale-95";

    return `${baseStyles} ${typeStyles[type]} ${visibilityStyles}`;
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-amber-500`} />;
      case 'info':
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'info': return 'Information';
    }
  };

  return (
    <div className={getNotificationStyles()}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {getTitle()}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernNotification;
