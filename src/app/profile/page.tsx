'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import BottomNav from '@/components/layout/BottomNav';

interface UserInfo {
  id: number;
  username: string;
  email: string;
}

interface Stats {
  totalCheckIns: number;
  consecutiveDays: number;
  avgMood: string;
  weekTrend: Array<{ date: string; moodLevel: number; moodEmoji: string }>;
}

export default function ProfilePage() {
  const { t, language } = useTranslation();
  const isZh = language === 'zh-CN';
  const [user, setUser] = useState<UserInfo | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    // 从 localStorage 获取用户信息
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}

    // 获取统计数据
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/stats', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setStats(data.stats); })
        .catch(console.error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-20">
      <div className="container mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">{t('profile.title')}</h1>

        {/* 用户卡片 */}
        <div className="bg-white rounded-xl shadow p-6 text-center mb-4">
          <div className="w-20 h-20 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
          <h2 className="text-xl font-bold">{user?.username || (isZh ? '未登录' : 'Not logged in')}</h2>
          <p className="text-gray-500 text-sm mt-1">{user?.email || ''}</p>
        </div>

        {/* 数据概览 */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-xl shadow p-3 text-center">
              <p className="text-xl font-bold text-purple-600">{stats.totalCheckIns}</p>
              <p className="text-xs text-gray-500">{isZh ? '总打卡' : 'Total'}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-3 text-center">
              <p className="text-xl font-bold text-green-600">{stats.consecutiveDays}</p>
              <p className="text-xs text-gray-500">{isZh ? '连续天数' : 'Streak'}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-3 text-center">
              <p className="text-xl font-bold text-indigo-600">{stats.avgMood}</p>
              <p className="text-xs text-gray-500">{isZh ? '平均心情' : 'Avg Mood'}</p>
            </div>
          </div>
        )}

        {/* 最近心情 */}
        {stats?.weekTrend && (
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <h3 className="text-sm font-semibold mb-3">{isZh ? '最近 7 天' : 'Last 7 Days'}</h3>
            <div className="flex justify-between">
              {stats.weekTrend.map(day => (
                <div key={day.date} className="text-center">
                  <span className="text-xl">{day.moodEmoji || '·'}</span>
                  <p className="text-xs text-gray-400 mt-1">{day.date.slice(-2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 快捷入口 */}
        <div className="bg-white rounded-xl shadow p-4 mb-4 space-y-3">
          <a href="/stats" className="flex items-center justify-between py-2 hover:bg-gray-50 rounded px-2">
            <span>📊 {t('nav.stats')}</span>
            <span className="text-gray-400">›</span>
          </a>
          <a href="/calendar" className="flex items-center justify-between py-2 hover:bg-gray-50 rounded px-2">
            <span>📅 {t('nav.calendar')}</span>
            <span className="text-gray-400">›</span>
          </a>
          <a href="/settings" className="flex items-center justify-between py-2 hover:bg-gray-50 rounded px-2">
            <span>⚙️ {t('nav.settings')}</span>
            <span className="text-gray-400">›</span>
          </a>
        </div>

        {/* 退出登录 */}
        {user && (
          <button
            onClick={handleLogout}
            className="w-full bg-white rounded-xl shadow p-4 text-red-500 font-medium hover:bg-red-50 transition"
          >
            {t('auth.logout')}
          </button>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
