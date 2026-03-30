'use client';

import { useState, useEffect } from 'react';
import NotificationList from './components/NotificationList';
import NotificationBanner from './components/NotificationBanner';
import NotificationService from '../services/notificationService';
import { Notification } from '../types/notification';

export const metadata = {
  title: '通知',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerNotification, setBannerNotification] = useState<Notification | null>(null);

  useEffect(() => {
    // 加载通知列表
    const fetchNotifications = async () => {
      try {
        const data = await NotificationService.getList();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    
    fetchNotifications();
  }, []);

  // 处理通知标记为已读
  const markAsRead = (id: string) => {
    NotificationService.markAsRead(id);
  };

  // 标记所有为已读
  const markAllAsRead = () => {
    NotificationService.markAllAsRead();
  };

  // 显示横幅通知
  const showNotificationBanner = (notification: Notification) => {
    setBannerNotification(notification);
    setShowBanner(true);
    setTimeout(() => {
      setShowBanner(false);
    }, 5000); // 5秒后自动隐藏
  };

  // 模拟收到新通知
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% 概率显示新通知
        const newNotification: Notification = {
          id: `${Date.now()}`,
          title: '新通知',
          message: `这是一条新的通知消息，时间: ${new Date().toLocaleTimeString()}`,
          timestamp: new Date().toISOString(),
          isRead: false,
          type: 'system'
        };
        
        // 本地添加通知（模拟）
        setNotifications(prev => [newNotification, ...prev]);
        showNotificationBanner(newNotification);
      }
    }, 30000); // 每30秒检查一次
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">消息通知</h1>
          <p className="mt-2 text-gray-600">查看您的所有通知消息</p>
        </div>
        
        {/* 操作栏 */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div className="text-sm text-gray-500">
            共 {notifications.length} 条通知，{notifications.filter(n => !n.isRead).length} 条未读
          </div>
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm self-start sm:self-auto"
          >
            标记全部已读
          </button>
        </div>
        
        {/* 通知列表 */}
        <NotificationList 
          notifications={notifications} 
          onMarkAsRead={markAsRead} 
        />
      </div>
      
      {/* 通知横幅 */}
      {showBanner && bannerNotification && (
        <NotificationBanner 
          notification={bannerNotification} 
          onClose={() => setShowBanner(false)} 
        />
      )}
    </div>
  );
}