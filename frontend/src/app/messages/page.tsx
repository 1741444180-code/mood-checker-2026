'use client';

import { useState, useEffect } from 'react';

export const metadata = {
  title: '消息中心',
};
import MessageList from '@/components/MessageList';
import { messageAPI } from '@/utils/api';

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
}

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取消息数据
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await messageAPI.getMessages();
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await messageAPI.markAsRead(id);
      setMessages(messages.map(msg => 
        msg.id === id ? {...msg, isRead: true} : msg
      ));
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await messageAPI.deleteMessage(id);
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await messageAPI.markAllAsRead();
      setMessages(messages.map(msg => ({...msg, isRead: true})));
    } catch (error) {
      console.error('Failed to mark all messages as read:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">消息中心</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2">
            <p className="text-gray-600 text-sm sm:text-base">
              共 {messages.length} 条消息
              {messages.filter(m => !m.isRead).length > 0 && 
                `, ${messages.filter(m => !m.isRead).length} 条未读`}
            </p>
            <button
              onClick={handleMarkAllAsRead}
              disabled={loading}
              className={`px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              全部标为已读
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">加载中...</p>
          </div>
        ) : (
          <MessageList 
            messages={messages} 
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default MessagesPage;