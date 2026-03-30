// src/app/api/stats/trend/route.ts
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
    
    // 查询用户的心情记录，按日期分组
    const moods = await prisma.moodRecord.findMany({
      where: {
        userId: parseInt(userId),
        date: {
          gte: startDate,
          lte: now
        }
      },
      orderBy: {
        date: 'asc'
      }
    })
    
    // 按日期分组计算每天的平均心情分数
    const moodByDate: Record<string, { total: number; count: number }> = {}
    
    moods.forEach(mood => {
      const dateStr = new Date(mood.date).toISOString().split('T')[0]
      if (!moodByDate[dateStr]) {
        moodByDate[dateStr] = { total: 0, count: 0 }
      }
      moodByDate[dateStr].total += mood.moodLevel
      moodByDate[dateStr].count += 1
    })
    
    // 转换为图表数据格式
    const trendData = Object.entries(moodByDate).map(([date, data]) => ({
      date: formatDisplayDate(date),
      moodScore: parseFloat((data.total / data.count).toFixed(2)),
      count: data.count
    }))
    
    // 计算平均心情分数
    const averageMoodScore = moods.length > 0
      ? moods.reduce((sum, m) => sum + m.moodLevel, 0) / moods.length
      : 0
    
    // 计算趋势（上升/下降/平稳）
    const trend = calculateTrend(trendData)
    
    return Response.json({
      success: true,
      data: {
        trendData,
        averageMoodScore: parseFloat(averageMoodScore.toFixed(2)),
        period: getTimeRangeLabel(timeRange),
        trend,
        totalDays: trendData.length
      }
    })
  } catch (error) {
    console.error('Trend API error:', error)
    return Response.json({ error: 'Failed to fetch trend data' }, { status: 500 })
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

// 格式化显示日期
function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// 获取时间范围标签
function getTimeRangeLabel(range: string): string {
  switch (range) {
    case 'week': return '近一周'
    case 'month': return '近一月'
    case 'threeMonths': return '近三月'
    default: return '近一周'
  }
}

// 计算趋势
function calculateTrend(data: any[]): string {
  if (data.length < 2) return '平稳'
  
  const firstHalf = data.slice(0, Math.floor(data.length / 2))
  const secondHalf = data.slice(Math.floor(data.length / 2))
  
  const firstAvg = firstHalf.reduce((sum, d) => sum + d.moodScore, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, d) => sum + d.moodScore, 0) / secondHalf.length
  
  const diff = secondAvg - firstAvg
  
  if (diff > 0.3) return '上升'
  if (diff < -0.3) return '下降'
  return '平稳'
}
