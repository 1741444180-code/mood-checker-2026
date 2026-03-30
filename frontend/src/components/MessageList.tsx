'use client';

import React from 'react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
}

interface MessageListProps {
  messages?: Message[];
  onMarkAsRead?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages = [], onMarkAsRead, onDelete }) => {
  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">消息列表</h2>
        <div className="text-center text-gray-500 py-8">
          暂无消息
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">消息列表</h2>
      </div>
      <ul className="divide-y">
        {messages.map((message) => (
          <li
            key={message.id}
            className={`p-4 hover:bg-gray-50 ${!message.isRead ? 'bg-blue-50' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-grow" onClick={() => onMarkAsRead?.(message.id)}>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                  {message.avatar ? (
                    <img src={message.avatar} alt={message.sender} className="w-10 h-10 rounded-full" />
                  ) : (
                    <span className="text-gray-500">{message.sender[0]}</span>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <p className={`font-medium ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {message.sender}
                    </p>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{message.content}</p>
                </div>
              </div>
              {onDelete && (
                <button
                  onClick={() => onDelete(message.id)}
                  className="ml-4 text-gray-400 hover:text-red-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
