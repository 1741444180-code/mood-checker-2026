// src/app/api/user/mood-types/route.ts
import { NextRequest } from 'next/server'

// 模拟用户心情类型数据
const mockUserMoodTypes = [
  { id: 1, name: '开心', emoji: '😄', color: '#FFD700', isSystem: true, sortOrder: 1 },
  { id: 2, name: '平静', emoji: '😊', color: '#90EE90', isSystem: true, sortOrder: 2 },
  { id: 3, name: '低落', emoji: '😔', color: '#87CEEB', isSystem: true, sortOrder: 3 },
  { id: 4, name: '生气', emoji: '😠', color: '#FF6B6B', isSystem: true, sortOrder: 4 },
  { id: 5, name: '焦虑', emoji: '😰', color: '#DDA0DD', isSystem: true, sortOrder: 5 },
  { id: 6, name: '疲惫', emoji: '😴', color: '#D3D3D3', isSystem: true, sortOrder: 6 },
  { id: 7, name: '兴奋', emoji: '🤩', color: '#FF69B4', isSystem: true, sortOrder: 7 },
  // 自定义心情类型示例
  { id: 8, name: '专注', emoji: '😌', color: '#9370DB', isSystem: false, userId: 'user1', sortOrder: 8 },
  { id: 9, name: '无聊', emoji: '😑', color: '#A9A9A9', isSystem: false, userId: 'user1', sortOrder: 9 },
];

export async function GET(request: NextRequest) {
  try {
    // 从查询参数获取用户ID
    const userId = request.nextUrl.searchParams.get('userId');
    
    // 过滤属于该用户的心情类型
    let filteredMoodTypes = mockUserMoodTypes;
    if (userId) {
      filteredMoodTypes = mockUserMoodTypes.filter(type => 
        type.isSystem || type.userId === userId
      );
    }
    
    // 按排序顺序排列
    filteredMoodTypes.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
    
    return Response.json(filteredMoodTypes);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get user mood types' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { name, color, emoji } = data;

    // 简单验证
    if (!name || !color || !emoji) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 实际应用中，这里会将自定义心情类型保存到数据库
    // 模拟返回新创建的心情类型
    const newMoodType = {
      id: mockUserMoodTypes.length + 1,
      name,
      color,
      emoji,
      isSystem: false,
      userId: 'user1', // 从token中解析的实际用户ID
      sortOrder: mockUserMoodTypes.length + 1,
    };

    // 添加到数组
    mockUserMoodTypes.push(newMoodType);

    return Response.json(newMoodType, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to create mood type' },
      { status: 500 }
    );
  }
}