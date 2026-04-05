'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import BottomNav from '@/components/layout/BottomNav';

interface Stats {
  totalCheckIns: number;
  consecutiveDays: number;
  avgMood: string;
  distribution: Record<string, number>;
  weekTrend: Array<{ date: string; moodLevel: number; moodEmoji: string }>;
}

export default function StatsPage() {
  const { t, language } = useTranslation();
  const isZh = language === 'zh-CN';
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }

    fetch('/api/stats', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => { if (data.success) setStats(data.stats); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 pb-20">
        <p className="text-gray-500 mb-4">{isZh ? '请先登录查看统计' : 'Please log in to view stats'}</p>
        <a href="/auth/login" className="text-purple-600 font-medium">{t('auth.login')}</a>
        <BottomNav />
      </div>
    );
  }

  const maxDist = Math.max(...Object.values(stats.distribution), 1);
  const dayLabels = isZh ? ['一', '二', '三', '四', '五', '六', '日'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-20">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">{t('stats.title')}</h1>

        {/* 概览卡片 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.totalCheckIns}</p>
            <p className="text-xs text-gray-500 mt-1">{t('stats.totalCheckIns')}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.consecutiveDays}</p>
            <p className="text-xs text-gray-500 mt-1">{t('stats.consecutiveDays')}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">{stats.avgMood}</p>
            <p className="text-xs text-gray-500 mt-1">{t('stats.averageMood')}</p>
          </div>
        </div>

        {/* 本周趋势 */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h2 className="text-sm font-semibold mb-3">{t('stats.weeklyTrend')}</h2>
          <div className="flex items-end justify-between h-32 gap-1">
            {stats.weekTrend.map((day, i) => (
              <div key={day.date} className="flex flex-col items-center flex-1">
                <span className="text-lg mb-1">{day.moodEmoji || '·'}</span>
                <div
                  className="w-full bg-purple-400 rounded-t min-h-[4px] transition-all"
                  style={{ height: day.moodLevel ? `${(day.moodLevel / 7) * 100}%` : '4px', opacity: day.moodLevel ? 1 : 0.2 }}
                />
                <span className="text-xs text-gray-500 mt-1">{dayLabels[i] || day.date.slice(-2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 心情分布 */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h2 className="text-sm font-semibold mb-3">{t('stats.moodDistribution')}</h2>
          {Object.entries(stats.distribution).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.distribution)
                .sort((a, b) => b[1] - a[1])
                .map(([mood, count]) => (
                  <div key={mood} className="flex items-center gap-3">
                    <span className="text-sm w-20 truncate">{mood}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full bg-purple-400 rounded-full transition-all"
                        style={{ width: `${(count / maxDist) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-6 text-right">{count}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">{t('common.noData')}</p>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
