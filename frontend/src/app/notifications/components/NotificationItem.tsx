// frontend/src/app/notifications/components/NotificationItem.tsx

import React from 'react';
import { Notification } from '../../types/notification';
import { formatTimeAgo } from '../../utils/dateUtils';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const getTypeColor = (type: string): string => {
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
      return 'bg-purple-500';
    case 'alert':
      return 'bg-red-500';
    default:
      return 'bg-indigo-500';
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const timeAgo = formatTimeAgo(notification.timestamp);

  return (
    <li 
      className={`p-4 hover:bg-gray-50 transition-colors ${
        !notification.read ? 'bg-blue-25' : ''
      }`}
    >
      <div className="flex items-start">
        <div className={`w-3 h-3 rounded-full mt-1.5 ${getTypeColor(notification.type)} ${
          notification.read ? 'opacity-30' : ''
        }`}></div>
        
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={`font-medium truncate ${
              notification.read ? 'text-gray-700' : 'text-gray-900'
            }`}>
              {notification.title}
            </p>
            <span className="flex-shrink-0 text-xs text-gray-500 ml-2">
              {timeAgo}
            </span>
          </div>
          
          <p className="mt-1 text-sm text-gray-600 truncate">
            {notification.content}
          </p>
          
          <div className="mt-2 flex items-center">
            {!notification.read && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
              >
                标记为已读
              </button>
            )}
            {notification.read && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                已读
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default NotificationItem;