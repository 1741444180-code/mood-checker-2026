// src/app/api/user/privacy/route.ts
import { NextRequest } from 'next/server'

// 模拟用户隐私设置数据
const mockPrivacySettings = {
  userId: 'user1',
  profileVisibility: 'private', // private, public, friends
  moodVisibility: 'private', // private, public, friends
  shareStatistics: false,
  allowComments: true,
  hideEmail: true,
  hideActivity: false,
  createdAt: '2026-03-01T10:00:00Z',
  updatedAt: '2026-03-15T09:20:00Z',
};

export async function GET(request: NextRequest) {
  try {
    // 从请求头获取认证信息
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return Response.json(mockPrivacySettings);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get privacy settings' },
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
    
    // 更新隐私设置
    Object.keys(data).forEach(key => {
      if (mockPrivacySettings.hasOwnProperty(key)) {
        (mockPrivacySettings as any)[key] = data[key];
      }
    });
    
    mockPrivacySettings.updatedAt = new Date().toISOString();

    return Response.json(mockPrivacySettings);
  } catch (error) {
    return Response.json(
      { error: 'Failed to update privacy settings' },
      { status: 500 }
    );
  }
}