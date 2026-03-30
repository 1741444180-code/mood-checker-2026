// frontend/src/app/notifications/components/NotificationBanner.tsx

import React, { useEffect } from 'react';
import { Notification } from '../../types/notification';
import { formatTimeAgo } from '../../utils/dateUtils';

interface NotificationBannerProps {
  notification: Notification;
  onClose: () => void;
}

const getTypeBgColor = (type: string): string => {
  switch (type) {
    case 'order':
      return 'bg-blue-500';
    case 'system':
      return 'bg-gray-500';
    case 'inventory':
      return 'bg-yellow-500';
    case 'payment':
      return 'bg-green-500';
    case 'promotion':
      return 'bg-mood-purple'; // 使用心情打卡紫色主题
    case 'alert':
      return 'bg-red-500';
    default:
      return 'bg-mood-purple'; // 使用心情打卡紫色主题
  }
};

const NotificationBanner: React.FC<NotificationBannerProps> = ({ 
  notification, 
  onClose 
}) => {
  const bgColor = getTypeBgColor(notification.type);
  
  // 设置定时器自动关闭
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className={`rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out`}>
        <div className={`${bgColor} text-white p-4`}>
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold">{notification.title}</h4>
              <p className="mt-1 text-sm opacity-90">{notification.content}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 focus:outline-none"
              aria-label="关闭"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="mt-2 text-xs opacity-80">
            {formatTimeAgo(notification.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;