// frontend/src/app/notifications/components/NotificationList.tsx

import React from 'react';
import { Notification } from '../../types/notification';
import NotificationItem from './NotificationItem';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  onMarkAsRead 
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {unreadCount > 0 && (
        <div className="bg-blue-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
          <span className="text-sm font-medium text-blue-700">
            {unreadCount} 条未读
          </span>
        </div>
      )}
      
      <ul className="divide-y divide-gray-200">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        ) : (
          <li className="py-12 text-center">
            <div className="text-gray-400 text-lg">暂无通知</div>
            <p className="text-gray-500 mt-1">您当前没有新的通知消息</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default NotificationList;