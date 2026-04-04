'use client';

import React from 'react';

export default function MoodCalendar() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const moodEmojis: Record<number, string> = {
    1: '😄', 3: '😊', 5: '😐', 7: '😄', 10: '😔',
    12: '😊', 15: '😄', 18: '😰', 20: '😊', 22: '😄',
    25: '😐', 27: '😊', 28: '😄', 30: '😊',
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-sm font-semibold mb-3">本月打卡日历</h3>
      <div className="grid grid-cols-7 gap-1">
        {['日', '一', '二', '三', '四', '五', '六'].map(d => (
          <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
        ))}
        {days.map(day => (
          <div
            key={day}
            className={`text-center py-1.5 rounded text-xs ${
              moodEmojis[day] ? 'bg-purple-50' : 'bg-gray-50'
            }`}
          >
            {moodEmojis[day] || day}
          </div>
        ))}
      </div>
    </div>
  );
}
