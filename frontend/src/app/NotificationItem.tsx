'use client';

import React from 'react';

interface NotificationProps {
  notification: {
    id: string;
    title: string;
    content: string;
    timestamp: string;
    read: boolean;
    type: 'info' | 'warning' | 'error' | 'success';
  };
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'info':
      return 'border-blue-500 bg-blue-50';
    case 'warning':
      return 'border-yellow-500 bg-yellow-50';
    case 'error':
      return 'border-red-500 bg-red-50';
    case 'success':
      return 'border-green-500 bg-green-50';
    default:
      return 'border-gray-500 bg-gray-50';
  }
};

export const NotificationItem = ({ notification }: NotificationProps) => {
  const { title, content, timestamp, read, type } = notification;

  // Format the timestamp
  const formattedTime = new Date(timestamp).toLocaleString();

  return (
    <div className={`p-4 rounded-lg border-l-4 ${getTypeColor(type)} ${read ? 'opacity-70' : 'opacity-100'}`}>
      <div className="flex justify-between items-start">
        <h3 className={`font-semibold ${read ? 'text-gray-600' : 'text-gray-900'}`}>{title}</h3>
        <span className="text-xs text-gray-500 ml-2">{formattedTime}</span>
      </div>
      <p className="mt-2 text-gray-700">{content}</p>
      {!read && (
        <div className="mt-3 flex justify-end">
          <button className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
            Mark as Read
          </button>
        </div>
      )}
    </div>
  );
};