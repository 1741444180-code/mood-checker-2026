'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import BottomNav from '@/components/layout/BottomNav';

const mockFriends = [
  { id: 1, name: '小明', emoji: '😊', lastMood: '开心', online: true },
  { id: 2, name: '小红', emoji: '😐', lastMood: '一般', online: true },
  { id: 3, name: '阿伟', emoji: '😄', lastMood: '愉快', online: false },
  { id: 4, name: '小李', emoji: '😔', lastMood: '难过', online: false },
];

export default function FriendsPage() {
  const { t, language } = useTranslation();
  const isZh = language === 'zh-CN';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-20">
      <div className="container mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">{t('friends.title')}</h1>

        {/* 搜索框 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder={t('friends.searchFriend')}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* 好友列表 */}
        <div className="space-y-3">
          {mockFriends.map(friend => (
            <div key={friend.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-xl">
                    {friend.emoji}
                  </div>
                  {friend.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{friend.name}</p>
                  <p className="text-xs text-gray-500">
                    {isZh ? `最近心情: ${friend.lastMood}` : `Last mood: ${friend.lastMood}`}
                  </p>
                </div>
              </div>
              <button className="text-purple-600 text-sm hover:underline">
                {isZh ? '查看' : 'View'}
              </button>
            </div>
          ))}
        </div>

        {/* 添加好友按钮 */}
        <button className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition">
          + {t('friends.addFriend')}
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
