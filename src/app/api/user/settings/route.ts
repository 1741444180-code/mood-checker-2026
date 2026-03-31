// src/app/api/user/settings/route.ts
import { NextRequest } from 'next/server'

// 模拟用户设置数据
const mockUserSettings = {
  userId: 'user1',
  reminderTime: '21:00',
  reminderEnabled: true,
  weeklyReport: false,
  publicProfile: false,
  theme: 'light',
  createdAt: '2026-03-01T10:00:00Z',
  updatedAt: '2026-03-28T10:00:00Z',
};

export async function GET(request: NextRequest) {
  try {
    // 从请求头获取用户信息（简化处理）
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 返回模拟的用户设置
    return Response.json(mockUserSettings);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get user settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // 更新设置（实际应用中会更新数据库）
    Object.assign(mockUserSettings, { 
      ...data, 
      updatedAt: new Date().toISOString() 
    });

    return Response.json(mockUserSettings);
  } catch (error) {
    return Response.json(
      { error: 'Failed to update user settings' },
      { status: 500 }
    );
  }
}