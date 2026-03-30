'use client';

import React from 'react';
import { NotificationItem } from '@/components/NotificationItem';

interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Welcome!',
    content: 'Welcome to our platform. We hope you enjoy your experience.',
    timestamp: '2023-05-15T10:30:00Z',
    read: false,
    type: 'info'
  },
  {
    id: '2',
    title: 'Update Available',
    content: 'A new version of the app is available for download.',
    timestamp: '2023-05-14T14:45:00Z',
    read: true,
    type: 'success'
  },
  {
    id: '3',
    title: 'Security Alert',
    content: 'We noticed unusual activity on your account.',
    timestamp: '2023-05-13T09:15:00Z',
    read: false,
    type: 'warning'
  }
];

export const NotificationList = () => {
  return (
    <div className="space-y-4">
      {mockNotifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};