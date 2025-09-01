import React, { createContext, useContext, useState, useCallback } from 'react';

// Define notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'custom';

// Define notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  customIcon?: React.ReactNode;
  customColor?: string;
}

// Define notification context state
type NotificationContextState = {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
};

// Create initial context state
const initialState: NotificationContextState = {
  notifications: [],
  showNotification: () => null,
  removeNotification: () => null,
  clearAllNotifications: () => null,
};

// Create context
const NotificationContext = createContext<NotificationContextState>(initialState);

// Define provider props
type NotificationProviderProps = {
  children: React.ReactNode;
  maxNotifications?: number;
};

export function NotificationProvider({
  children,
  maxNotifications = 5,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate unique ID for notifications
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Add a new notification
  const showNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = generateId();
      const newNotification = {
        ...notification,
        id,
        duration: notification.duration || 5000, // Default 5 seconds
      };

      setNotifications((prev) => {
        // If we've reached max notifications, remove the oldest one
        const updatedNotifications =
          prev.length >= maxNotifications
            ? [...prev.slice(1), newNotification]
            : [...prev, newNotification];
        return updatedNotifications;
      });

      // Auto-remove notification after duration
      if (newNotification.duration !== Infinity) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }
    },
    [maxNotifications]
  );

  // Remove a notification by ID
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Context value
  const value = {
    notifications,
    showNotification,
    removeNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  return context;
};

// Utility functions for different notification types
export const useNotificationService = () => {
  const { showNotification } = useNotification();

  return {
    success: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
      showNotification({ type: 'success', message, ...options });
    },
    error: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
      showNotification({ type: 'error', message, ...options });
    },
    warning: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
      showNotification({ type: 'warning', message, ...options });
    },
    info: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
      showNotification({ type: 'info', message, ...options });
    },
    custom: (
      message: string,
      options: Partial<Omit<Notification, 'id' | 'message'>> & { type: 'custom' }
    ) => {
      showNotification({ message, ...options });
    },
  };
};