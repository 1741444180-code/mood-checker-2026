'use client';

import React from 'react';

export default function StatsChart() {
  const data = [
    { label: '开心', count: 12, color: 'bg-yellow-400' },
    { label: '愉快', count: 8, color: 'bg-green-400' },
    { label: '一般', count: 5, color: 'bg-blue-400' },
    { label: '难过', count: 3, color: 'bg-purple-400' },
    { label: '生气', count: 2, color: 'bg-red-400' },
  ];

  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-sm font-semibold mb-4">心情分布</h3>
      <div className="space-y-3">
        {data.map(item => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-sm w-10 text-gray-600">{item.label}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all`}
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 w-6 text-right">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
