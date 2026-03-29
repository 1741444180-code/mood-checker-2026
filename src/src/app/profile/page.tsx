'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserProfileCard from '@/components/profile/UserProfileCard';
import StatCard from '@/components/profile/StatCard';
import MoodTrendChart from '@/components/profile/MoodTrendChart';

// Mock user data
const mockUserData = {
  id: 1,
  name: '小明',
  username: 'xiaoming',
  avatar: '/api/placeholder/100/100',
  email: 'xiaoming@example.com',
  joinDate: '2024-01-15',
  bio: '热爱生活，积极向上的人',
  location: '北京',
  totalCheckins: 42,
  streak: 7,
  weeklyCompletion: 85,
  moodTrend: '稳定',
  badges: ['坚持之星', '早起鸟', '开心果'],
};

// Mock chart data for mood trends
const mockChartData = [
  { date: '周一', mood: 4 },
  { date: '周二', mood: 5 },
  { date: '周三', mood: 3 },
  { date: '周四', mood: 4 },
  { date: '周五', mood: 5 },
  { date: '周六', mood: 4 },
  { date: '周日', mood: 4 },
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
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">个人中心</h1>
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                  仪表盘
                </Link>
              </li>
              <li>
                <Link href="/stats" className="text-gray-600 hover:text-blue-600">
                  统计
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="text-gray-600 hover:text-blue-600">
                  日历
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <UserProfileCard 
          userData={userData} 
          onEdit={() => router.push('/settings')}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <StatCard 
            title="总打卡" 
            value={userData.totalCheckins} 
            color="blue"
          />
          
          <StatCard 
            title="连续打卡" 
            value={userData.streak} 
            subtitle="天"
            color="green"
          />
          
          <StatCard 
            title="本周完成" 
            value={`${userData.weeklyCompletion}%`} 
            color="purple"
          />
          
          <StatCard 
            title="心情趋势" 
            value={userData.moodTrend} 
            color="yellow"
          />
        </div>

        {/* Badges Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">获得徽章</h3>
          <div className="flex flex-wrap gap-3">
            {userData.badges.map((badge, index) => (
              <div key={index} className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-4 py-2 text-white text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* Mood Trend Chart */}
        <MoodTrendChart 
          data={mockChartData} 
          title="本周心情趋势"
        />

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">快速操作</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <button 
              onClick={() => router.push('/settings')}
              className="border border-gray-200 hover:bg-gray-50 text-gray-800 py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              账户设置
            </button>
            <button 
              onClick={() => router.push('/stats')}
              className="border border-gray-200 hover:bg-gray-50 text-gray-800 py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              详细统计
            </button>
            <button 
              onClick={() => router.push('/calendar')}
              className="border border-gray-200 hover:bg-gray-50 text-gray-800 py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              心情日历
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}