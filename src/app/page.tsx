'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">心情打卡应用</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        欢迎使用心情打卡应用，记录您的每日心情，追踪情绪变化
      </p>
      <button
        onClick={() => router.push('/profile')}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
      >
        进入个人中心
      </button>
    </div>
  );
}