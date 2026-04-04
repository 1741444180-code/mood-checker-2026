'use client';

import MoodSelector from '@/components/mood/mood-selector'

export default function HomePage() {
  const handleMoodSubmit = (moodData: { moodId: number; note?: string; tags?: string[] }) => {
    console.log('提交心情:', moodData)
    // TODO: 实现实际的心情提交逻辑
    alert(`心情打卡成功: ${moodData.moodId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">今日心情</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">记录您的每日心情，关注情绪变化</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <MoodSelector onSubmit={handleMoodSubmit} />
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">打卡提醒</h2>
              <p className="text-gray-600">
                每天花几分钟记录心情，有助于更好地了解自己的情绪变化。
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">今日统计</h2>
              <p className="text-gray-600">
                本月已打卡: <span className="font-bold">12天</span>
              </p>
              <p className="text-gray-600">
                连续打卡: <span className="font-bold">5天</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}