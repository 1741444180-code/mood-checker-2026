'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import BottomNav from '@/components/layout/BottomNav';

const mockMessages = [
  { id: 1, from: '小明', content: '今天心情怎么样？', time: '10:30', unread: true },
  { id: 2, from: '小红', content: '一起加油打卡！', time: '昨天', unread: false },
  { id: 3, from: '系统', content: '恭喜你连续打卡 7 天！🎉', time: '前天', unread: false },
  { id: 4, from: '阿伟', content: '周末一起运动吧', time: '3天前', unread: false },
];

export default function MessagesPage() {
  const { t, language } = useTranslation();
  const isZh = language === 'zh-CN';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-20">
      <div className="container mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">{t('messages.title')}</h1>

        {/* 消息列表 */}
        <div className="space-y-2">
          {mockMessages.map(msg => (
            <div
              key={msg.id}
              className={`bg-white rounded-xl shadow p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition ${
                msg.unread ? 'border-l-4 border-purple-500' : ''
              }`}
            >
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">
                {msg.from.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{msg.from}</p>
                  <span className="text-xs text-gray-400">{msg.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{msg.content}</p>
              </div>
              {msg.unread && (
                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {mockMessages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-4xl mb-2">💬</p>
            <p>{t('messages.noMessages')}</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
