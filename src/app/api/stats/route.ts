// src/app/api/stats/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // 从查询参数获取用户 ID 和时间范围
    const userId = request.nextUrl.searchParams.get('userId')
    const timeRange = request.nextUrl.searchParams.get('range') || 'week'
    
    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 })
    }
    
    // 计算日期范围
    const startDate = getStartDate(timeRange)
    const now = new Date()
    
    // 查询用户的心情记录
    const moods = await prisma.moodRecord.findMany({
      where: {
        userId: parseInt(userId),
        date: {
          gte: startDate,
          lte: now
        }
      },
      orderBy: {
        date: 'desc'
      }
    })
    
    // 计算统计数据
    const totalEntries = moods.length
    
    // 计算心情分布
    const moodDistribution: Record<string, number> = {}
    moods.forEach(mood => {
      moodDistribution[mood.moodType] = (moodDistribution[mood.moodType] || 0) + 1
    })
    
    // 转换为饼图数据格式
    const moodData = Object.entries(moodDistribution).map(([name, value]) => ({
      name,
      value
    }))
    
    // 计算连续打卡天数
    const consecutiveDays = calculateConsecutiveDays(moods)
    
    // 计算平均心情分数
    const avgMoodLevel = moods.length > 0
      ? moods.reduce((sum, m) => sum + m.moodLevel, 0) / moods.length
      : 0
    
    // 找出主要心情
    const mainMood = moodData.length > 0
      ? moodData.reduce((a, b) => a.value > b.value ? a : b).name
      : '-'
    
    return Response.json({
      success: true,
      data: {
        totalEntries,
        moodData,
        consecutiveDays,
        avgMoodLevel: avgMoodLevel.toFixed(1),
        mainMood,
        timeRange
      }
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

// 计算日期范围
function getStartDate(range: string): Date {
  const now = new Date()
  switch (range) {
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case 'threeMonths':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    default:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }
}

// 计算连续打卡天数
function calculateConsecutiveDays(moods: any[]): number {
  if (moods.length === 0) return 0
  
  const sortedMoods = [...moods].sort((a: any, b: any) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  let consecutiveDays = 1
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // 检查今天是否已打卡
  const todayStr = today.toISOString().split('T')[0]
  const hasToday = sortedMoods.some(m => {
    const moodDate = new Date(m.date).toISOString().split('T')[0]
    return moodDate === todayStr
  })
  
  if (!hasToday && sortedMoods.length > 0) {
    // 检查昨天是否打卡
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    const hasYesterday = sortedMoods.some(m => {
      const moodDate = new Date(m.date).toISOString().split('T')[0]
      return moodDate === yesterdayStr
    })
    
    if (!hasYesterday) {
      return 0
    }
  }
  
  // 计算连续天数
  for (let i = 0; i < sortedMoods.length - 1; i++) {
    const currentDate = new Date(sortedMoods[i].date)
    currentDate.setHours(0, 0, 0, 0)
    const nextDate = new Date(sortedMoods[i + 1].date)
    nextDate.setHours(0, 0, 0, 0)
    
    const dayDiff = (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24)
    
    if (dayDiff === 1) {
      consecutiveDays++
    } else if (dayDiff > 1) {
      break
    }
  }
  
  return consecutiveDays
}
