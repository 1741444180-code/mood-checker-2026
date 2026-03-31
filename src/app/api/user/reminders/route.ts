// src/app/api/user/reminders/route.ts
import { NextRequest } from 'next/server'

// 模拟用户提醒数据
const mockReminders = [
  {
    id: 1,
    userId: 'user1',
    title: '每日心情打卡',
    description: '记录今天的心情',
    schedule: 'daily',
    time: '21:00',
    timezone: 'Asia/Shanghai',
    enabled: true,
    lastTriggered: '2026-03-27T21:00:00Z',
    nextTrigger: '2026-03-28T21:00:00Z',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-20T15:30:00Z',
  },
  {
    id: 2,
    userId: 'user1',
    title: '周总结',
    description: '回顾本周的心情变化',
    schedule: 'weekly',
    time: '09:00',
    dayOfWeek: 1, // 周一
    timezone: 'Asia/Shanghai',
    enabled: true,
    lastTriggered: '2026-03-23T09:00:00Z',
    nextTrigger: '2026-03-30T09:00:00Z',
    createdAt: '2026-03-05T14:00:00Z',
    updatedAt: '2026-03-20T15:30:00Z',
  },
  {
    id: 3,
    userId: 'user1',
    title: '感恩时刻',
    description: '记录今天值得感恩的三件事',
    schedule: 'daily',
    time: '07:30',
    timezone: 'Asia/Shanghai',
    enabled: false,
    lastTriggered: null,
    nextTrigger: null,
    createdAt: '2026-03-10T16:00:00Z',
    updatedAt: '2026-03-15T10:20:00Z',
  },
];

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

    // 从查询参数获取过滤条件
    const enabled = request.nextUrl.searchParams.get('enabled'); // 'true', 'false', or undefined
    const schedule = request.nextUrl.searchParams.get('schedule'); // 'daily', 'weekly', 'monthly', or undefined

    // 过滤提醒
    let filteredReminders = mockReminders;
    
    if (enabled === 'true') {
      filteredReminders = filteredReminders.filter(reminder => reminder.enabled);
    } else if (enabled === 'false') {
      filteredReminders = filteredReminders.filter(reminder => !reminder.enabled);
    }
    
    if (schedule) {
      filteredReminders = filteredReminders.filter(reminder => reminder.schedule === schedule);
    }

    return Response.json({
      reminders: filteredReminders,
      total: filteredReminders.length,
      enabledCount: filteredReminders.filter(r => r.enabled).length,
      disabledCount: filteredReminders.filter(r => !r.enabled).length,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get reminders' },
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
    const { title, description, schedule, time, dayOfWeek, timezone, enabled } = data;

    // 简单验证
    if (!title || !schedule || !time) {
      return Response.json(
        { error: 'Title, schedule, and time are required' },
        { status: 400 }
      );
    }

    // 验证调度类型
    if (!['daily', 'weekly', 'monthly'].includes(schedule)) {
      return Response.json(
        { error: 'Schedule must be daily, weekly, or monthly' },
        { status: 400 }
      );
    }

    // 验证时间格式
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(time)) {
      return Response.json(
        { error: 'Time must be in HH:MM format' },
        { status: 400 }
      );
    }

    // 验证dayOfWeek（如果是weekly调度）
    if (schedule === 'weekly' && (dayOfWeek === undefined || dayOfWeek < 0 || dayOfWeek > 6)) {
      return Response.json(
        { error: 'dayOfWeek must be between 0 (Sunday) and 6 (Saturday) for weekly schedule' },
        { status: 400 }
      );
    }

    // 计算下次触发时间
    let nextTrigger = null;
    if (enabled !== false) { // 如果没有显式禁用，则启用
      // 在实际应用中，这里会计算下一个触发时间
      nextTrigger = new Date();
      nextTrigger.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]), 0, 0);
      if (nextTrigger <= new Date()) {
        nextTrigger.setDate(nextTrigger.getDate() + 1);
      }
    }

    // 创建新提醒
    const newReminder = {
      id: mockReminders.length + 1,
      userId: 'user1', // 从token获取的实际用户ID
      title,
      description: description || '',
      schedule,
      time,
      dayOfWeek: schedule === 'weekly' ? dayOfWeek : undefined,
      timezone: timezone || 'Asia/Shanghai',
      enabled: enabled !== false, // 默认启用
      lastTriggered: null,
      nextTrigger: nextTrigger ? nextTrigger.toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockReminders.push(newReminder);

    return Response.json(newReminder, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to create reminder' },
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
    const { reminderId, updates } = data;

    if (!reminderId || !updates) {
      return Response.json(
        { error: 'Reminder ID and updates are required' },
        { status: 400 }
      );
    }

    const reminderIndex = mockReminders.findIndex(r => r.id === parseInt(reminderId) && r.userId === 'user1');
    if (reminderIndex === -1) {
      return Response.json(
        { error: 'Reminder not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    // 更新提醒
    Object.keys(updates).forEach(key => {
      if (mockReminders[reminderIndex].hasOwnProperty(key) && 
          key !== 'id' && 
          key !== 'userId' && 
          key !== 'createdAt') { // 不允许修改这些字段
        (mockReminders[reminderIndex] as any)[key] = updates[key];
      }
    });

    mockReminders[reminderIndex].updatedAt = new Date().toISOString();

    // 如果启用了提醒且没有下一个触发时间，则计算
    if (mockReminders[reminderIndex].enabled && !mockReminders[reminderIndex].nextTrigger) {
      const nextTrigger = new Date();
      const [hours, minutes] = mockReminders[reminderIndex].time.split(':').map(Number);
      nextTrigger.setHours(hours, minutes, 0, 0);
      if (nextTrigger <= new Date()) {
        nextTrigger.setDate(nextTrigger.getDate() + 1);
      }
      mockReminders[reminderIndex].nextTrigger = nextTrigger.toISOString();
    }

    return Response.json({
      success: true,
      message: 'Reminder updated successfully',
      reminder: mockReminders[reminderIndex],
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to update reminder' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const reminderId = url.searchParams.get('reminderId');

    if (!reminderId) {
      return Response.json(
        { error: 'Reminder ID is required' },
        { status: 400 }
      );
    }

    const reminderIndex = mockReminders.findIndex(r => r.id === parseInt(reminderId) && r.userId === 'user1');
    if (reminderIndex === -1) {
      return Response.json(
        { error: 'Reminder not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    const deletedReminder = mockReminders.splice(reminderIndex, 1)[0];

    return Response.json({
      success: true,
      message: 'Reminder deleted successfully',
      reminder: deletedReminder,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to delete reminder' },
      { status: 500 }
    );
  }
}