'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import BottomNav from '@/components/layout/BottomNav';

interface MoodRecord {
  id: number;
  date: string;
  moodLevel: number;
  moodEmoji: string;
  moodLabel: string;
  note: string | null;
}

export default function CalendarPage() {
  const { t, language } = useTranslation();
  const isZh = language === 'zh-CN';
  const [records, setRecords] = useState<MoodRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRecord, setSelectedRecord] = useState<MoodRecord | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/api/moods?days=90', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => { if (data.success) setRecords(data.records); })
      .catch(console.error);
  }, []);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getRecordForDay = (day: number): MoodRecord | undefined => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return records.find(r => r.date.startsWith(dateStr));
  };

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const weekDays = isZh ? ['日', '一', '二', '三', '四', '五', '六'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthName = isZh
    ? `${year}年${month + 1}月`
    : currentMonth.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-20">
      <div className="container mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">{t('calendar.title')}</h1>

        {/* 月份导航 */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">◀</button>
            <h2 className="text-lg font-semibold">{monthName}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">▶</button>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(d => (
              <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
            ))}
          </div>

          {/* 日期格子 */}
          <div className="grid grid-cols-7 gap-1">
            {/* 填充前面的空白 */}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}
            {/* 日期 */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const record = getRecordForDay(day);
              const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

              return (
                <button
                  key={day}
                  onClick={() => record && setSelectedRecord(record)}
                  className={`h-10 rounded-lg text-sm flex items-center justify-center transition ${
                    isToday ? 'ring-2 ring-purple-500' : ''
                  } ${record ? 'bg-purple-50 hover:bg-purple-100 cursor-pointer' : 'bg-gray-50'}`}
                >
                  {record ? <span className="text-lg">{record.moodEmoji}</span> : <span className="text-gray-400">{day}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 选中的记录详情 */}
        {selectedRecord && (
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedRecord.moodEmoji}</span>
                <span className="font-semibold">{selectedRecord.moodLabel}</span>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <p className="text-xs text-gray-400 mb-2">{new Date(selectedRecord.date).toLocaleDateString()}</p>
            {selectedRecord.note && <p className="text-sm text-gray-600">{selectedRecord.note}</p>}
          </div>
        )}

        {/* 统计 */}
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">
            {isZh ? `本月打卡 ` : `This month: `}
            <span className="font-bold text-purple-600">
              {Array.from({ length: daysInMonth }, (_, i) => getRecordForDay(i + 1)).filter(Boolean).length}
            </span>
            {isZh ? ` / ${daysInMonth} 天` : ` / ${daysInMonth} days`}
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
