import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification as NotificationInterface } from '@/context/notification-context';

interface NotificationProps {
  notification: NotificationInterface;
  onClose: (id: string) => void;
}

export function Notification({ notification, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Animation effect
  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(showTimer);
  }, []);

  // Handle close animation
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(notification.id), 300); // Wait for animation to complete
  };

  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      case 'custom':
        return notification.customIcon || <Info className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  // Get background color based on notification type
  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900 text-green-800 dark:text-green-300';
      case 'error':
        return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-800 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900 text-yellow-800 dark:text-yellow-300';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300';
      case 'custom':
        return notification.customColor || 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  // Get icon color based on notification type
  const getIconColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-500 dark:text-green-400';
      case 'error':
        return 'text-red-500 dark:text-red-400';
      case 'warning':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'info':
        return 'text-blue-500 dark:text-blue-400';
      case 'custom':
        return 'text-gray-500 dark:text-gray-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all duration-300 ease-in-out',
        getStyles(),
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className={getIconColor()}>{getIcon()}</span>
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {notification.title && (
              <p className="text-sm font-medium">{notification.title}</p>
            )}
            <p className="mt-1 text-sm">{notification.message}</p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className={cn(
                'inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                'text-gray-400 hover:text-gray-500 focus:ring-gray-500'
              )}
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}