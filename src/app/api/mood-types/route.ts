// src/app/api/mood-types/route.ts
import { NextRequest } from 'next/server'

// 模拟心情类型数据
const moodTypes = [
  { id: 1, name: '开心', emoji: '😄', color: '#FFD700', isSystem: true },
  { id: 2, name: '平静', emoji: '😊', color: '#90EE90', isSystem: true },
  { id: 3, name: '低落', emoji: '😔', color: '#87CEEB', isSystem: true },
  { id: 4, name: '生气', emoji: '😠', color: '#FF6B6B', isSystem: true },
  { id: 5, name: '焦虑', emoji: '😰', color: '#DDA0DD', isSystem: true },
  { id: 6, name: '疲惫', emoji: '😴', color: '#D3D3D3', isSystem: true },
  { id: 7, name: '兴奋', emoji: '🤩', color: '#FF69B4', isSystem: true },
]

export async function GET(request: NextRequest) {
  try {
    // 从查询参数获取用户ID（如果有）
    const userId = request.nextUrl.searchParams.get('userId')
    
    // 如果指定了用户ID，可以返回用户的自定义心情类型
    // 这里简化处理，返回系统默认心情类型
    return Response.json(moodTypes)
  } catch (error) {
    return Response.json(
      { error: 'Failed to get mood types' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { userId, name, color, emoji } = data

    // 简单验证
    if (!userId || !name || !color || !emoji) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 实际应用中，这里会将自定义心情类型保存到数据库
    // 模拟返回新创建的心情类型
    const newMoodType = {
      id: moodTypes.length + 1,
      name,
      color,
      emoji,
      isSystem: false,
      userId, // 属于特定用户
    }

    return Response.json(newMoodType, { status: 201 })
  } catch (error) {
    return Response.json(
      { error: 'Failed to create mood type' },
      { status: 500 }
    )
  }
}