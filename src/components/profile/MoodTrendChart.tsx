'use client';

import React from 'react';

export default function MoodTrendChart() {
  const mockData = [
    { day: '周一', mood: 4 },
    { day: '周二', mood: 3 },
    { day: '周三', mood: 5 },
    { day: '周四', mood: 2 },
    { day: '周五', mood: 4 },
    { day: '周六', mood: 5 },
    { day: '周日', mood: 3 },
  ];

  const maxMood = 5;

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-sm font-semibold mb-3">本周心情趋势</h3>
      <div className="flex items-end justify-between h-32 gap-1">
        {mockData.map((item) => (
          <div key={item.day} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-purple-400 rounded-t-sm min-h-[4px] transition-all"
              style={{ height: `${(item.mood / maxMood) * 100}%` }}
            />
            <span className="text-xs text-gray-500 mt-1">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
