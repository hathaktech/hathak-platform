'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ModernNotification, { NotificationType } from '@/components/ui/ModernNotification';

interface NotificationMessage {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface ModernNotificationContextType {
  showNotification: (type: NotificationType, message: string, duration?: number) => void;
  hideNotification: (id: string) => void;
}

const ModernNotificationContext = createContext<ModernNotificationContextType | undefined>(undefined);

export const useModernNotification = () => {
  const context = useContext(ModernNotificationContext);
  if (!context) {
    throw new Error('useModernNotification must be used within a ModernNotificationProvider');
  }
  return context;
};

interface ModernNotificationProviderProps {
  children: ReactNode;
}

export const ModernNotificationProvider: React.FC<ModernNotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  const showNotification = useCallback((type: NotificationType, message: string, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    // Shorter duration for a more subtle experience
    const defaultDuration = type === 'error' ? 3000 : 4000;
    const newNotification: NotificationMessage = { id, type, message, duration: duration || defaultDuration };
    
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return (
    <ModernNotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      
      {/* Notification Container - Positioned below header and centered */}
      <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              className="transform transition-all duration-300 ease-out"
              style={{ 
                zIndex: 50 - index
              }}
            >
              <ModernNotification
                type={notification.type}
                message={notification.message}
                duration={notification.duration}
                onClose={() => hideNotification(notification.id)}
                isVisible={true}
              />
            </div>
          ))}
        </div>
      </div>
    </ModernNotificationContext.Provider>
  );
};
