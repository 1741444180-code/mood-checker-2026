'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserProfileCard from '@/components/UserProfileCard';
import StatCard from '@/components/StatCard';
import MoodTrendChart from '@/components/MoodTrendChart';

// Mock user data
const mockUserData = {
  id: 1,
  name: '小明',
  avatar: '/api/placeholder/100/100',
  email: 'xiaoming@example.com',
  joinDate: '2024-01-15',
  totalCheckins: 42,
  streak: 7,
  weeklyCompletion: 85,
  moodTrend: '稳定',
};

// Mock chart data for mood trends
const mockChartData = [
  { date: '2024-03-22', mood: 4 },
  { date: '2024-03-23', mood: 5 },
  { date: '2024-03-24', mood: 3 },
  { date: '2024-03-25', mood: 4 },
  { date: '2024-03-26', mood: 5 },
  { date: '2024-03-27', mood: 4 },
  { date: '2024-03-28', mood: 4 },
];

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState(mockUserData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">个人中心</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <UserProfileCard userData={userData} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <StatCard 
            title="总打卡天数" 
            value={userData.totalCheckins} 
            color="blue"
          />
          
          <StatCard 
            title="连续打卡" 
            value={`${userData.streak} 天`} 
            color="green"
          />
          
          <StatCard 
            title="本周完成率" 
            value={`${userData.weeklyCompletion}%`} 
            color="purple"
          />
          
          <StatCard 
            title="心情趋势" 
            value={userData.moodTrend} 
            color="yellow"
          />
        </div>

        {/* Mood Chart */}
        <div className="mt-8">
          <MoodTrendChart data={mockChartData} />
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">账户设置</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => router.push('/settings')}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              修改个人信息
            </button>
            <button 
              onClick={() => router.push('/stats')}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              查看详细统计
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}