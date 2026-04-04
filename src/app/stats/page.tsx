'use client';

import StatsChart from '@/components/stats/stats-chart';

// 模拟统计数据
const mockStats = {
  moodDistribution: {
    '开心': 12,
    '平静': 8,
    '焦虑': 5,
    '疲惫': 3,
    '兴奋': 2,
  },
  totalEntries: 30,
  checkInRate: '78%',
  consecutiveDays: 7,
};

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">数据统计</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">查看您的心情数据分析</p>
        </div>
        
        <StatsChart stats={mockStats} />
        
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">情绪趋势</h2>
            <p className="text-gray-600">
              根据您的打卡记录，最近一周您的心情以平静和开心为主，
              焦虑情绪有所减少。继续保持良好的心态！
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">打卡建议</h2>
            <p className="text-gray-600">
              您的连续打卡表现不错！建议继续保持每日打卡的习惯，
              这有助于更好地追踪情绪变化并形成积极的生活节奏。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}