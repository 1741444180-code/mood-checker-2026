// src/app/api/user/preferences/route.ts
import { NextRequest } from 'next/server'

// 模拟用户偏好设置
const mockPreferences = {
  userId: 'user1',
  notificationSettings: {
    moodReminder: {
      enabled: true,
      time: '21:00',
      timezone: 'Asia/Shanghai',
    },
    weeklySummary: {
      enabled: true,
      day: 'Sunday', // 'Monday', 'Tuesday', etc.
      time: '09:00',
    },
    commentNotifications: {
      enabled: true,
      notifyMention: true,
      notifyReply: true,
    },
  },
  privacySettings: {
    profileVisibility: 'friends', // 'public', 'friends', 'private'
    moodVisibility: 'friends', // 'public', 'friends', 'private'
    shareStatistics: false,
    allowComments: true,
    hideEmail: true,
  },
  displaySettings: {
    theme: 'auto', // 'light', 'dark', 'auto'
    language: 'zh-CN', // 'zh-CN', 'en-US', etc.
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h', // '12h', '24h'
    showAnimations: true,
  },
  accessibilitySettings: {
    fontSize: 'medium', // 'small', 'medium', 'large'
    highContrast: false,
    screenReaderFriendly: false,
  },
  dataSettings: {
    autoBackup: true,
    backupFrequency: 'weekly', // 'daily', 'weekly', 'monthly'
    exportFormat: 'json', // 'json', 'csv', 'pdf'
    deleteAccountAfter: null, // number of days, or null for never
  },
  createdAt: '2026-03-01T10:00:00Z',
  updatedAt: '2026-03-20T15:30:00Z',
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

    // 从查询参数获取特定设置类别
    const category = request.nextUrl.searchParams.get('category'); // notification, privacy, display, accessibility, data

    if (category) {
      if (!mockPreferences.hasOwnProperty(category + 'Settings')) {
        return Response.json(
          { error: 'Invalid preference category' },
          { status: 400 }
        );
      }
      
      const settingsKey = category + 'Settings' as keyof typeof mockPreferences;
      return Response.json({
        [settingsKey]: mockPreferences[settingsKey],
        category,
        userId: mockPreferences.userId,
      });
    }

    return Response.json(mockPreferences);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get preferences' },
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
    
    // 更新偏好设置
    Object.keys(data).forEach(key => {
      if (mockPreferences.hasOwnProperty(key)) {
        (mockPreferences as any)[key] = { ...mockPreferences[key as keyof typeof mockPreferences], ...data[key] };
      }
    });
    
    mockPreferences.updatedAt = new Date().toISOString();

    return Response.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: mockPreferences,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

// 专门用于更新单一设置的辅助方法
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { category, setting, value } = data;

    if (!category || !setting || value === undefined) {
      return Response.json(
        { error: 'Category, setting name, and value are required' },
        { status: 400 }
      );
    }

    const settingsKey = category + 'Settings' as keyof typeof mockPreferences;
    
    if (!mockPreferences[settingsKey]) {
      return Response.json(
        { error: 'Invalid preference category' },
        { status: 400 }
      );
    }

    // 更新特定设置
    (mockPreferences[settingsKey] as any)[setting] = value;
    mockPreferences.updatedAt = new Date().toISOString();

    return Response.json({
      success: true,
      message: 'Preference updated successfully',
      updatedSetting: {
        category,
        setting,
        value,
      },
      preferences: mockPreferences,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to update preference' },
      { status: 500 }
    );
  }
}