// src/app/api/user/templates/route.ts
import { NextRequest } from 'next/server'

// 模拟心情模板数据
const mockTemplates = [
  {
    id: 1,
    name: '早晨例行公事',
    description: '记录早上的心情和计划',
    moodType: '平静',
    defaultNote: '新的一天开始了，充满期待！今天计划：',
    defaultTags: ['生活', '计划'],
    userId: 'system',
    isPublic: true,
  },
  {
    id: 2,
    name: '工作日结束',
    description: '记录工作日的感受',
    moodType: '疲惫',
    defaultNote: '今天的工作结束了，感觉...',
    defaultTags: ['工作', '反思'],
    userId: 'system',
    isPublic: true,
  },
  {
    id: 3,
    name: '周末放松',
    description: '记录周末的休闲时光',
    moodType: '开心',
    defaultNote: '美好的周末，享受了...',
    defaultTags: ['生活', '休闲'],
    userId: 'system',
    isPublic: true,
  },
  {
    id: 4,
    name: '运动后',
    description: '记录运动后的感觉',
    moodType: '开心',
    defaultNote: '刚完成了今天的运动，感觉精力充沛！',
    defaultTags: ['健康', '运动'],
    userId: 'user1', // 用户自定义模板
    isPublic: false,
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
    const isPublic = request.nextUrl.searchParams.get('public'); // 'true', 'false', or undefined
    const userId = request.nextUrl.searchParams.get('userId'); // 获取特定用户的模板
    const moodType = request.nextUrl.searchParams.get('moodType');

    // 过滤模板
    let filteredTemplates = mockTemplates;
    
    if (isPublic === 'true') {
      filteredTemplates = filteredTemplates.filter(template => template.isPublic);
    } else if (isPublic === 'false') {
      // 只返回当前用户自己的模板（在实际应用中，会从token解析用户ID）
      filteredTemplates = filteredTemplates.filter(template => template.userId === 'user1');
    }
    
    if (userId) {
      filteredTemplates = filteredTemplates.filter(template => template.userId === userId);
    }
    
    if (moodType) {
      filteredTemplates = filteredTemplates.filter(template => template.moodType === moodType);
    }

    return Response.json({
      templates: filteredTemplates,
      total: filteredTemplates.length,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get templates' },
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
    const { name, description, moodType, defaultNote, defaultTags } = data;

    // 简单验证
    if (!name || !moodType) {
      return Response.json(
        { error: 'Name and mood type are required' },
        { status: 400 }
      );
    }

    // 创建新模板
    const newTemplate = {
      id: mockTemplates.length + 1,
      name,
      description: description || '',
      moodType,
      defaultNote: defaultNote || '',
      defaultTags: defaultTags || [],
      userId: 'user1', // 从token获取的实际用户ID
      isPublic: false, // 用户创建的模板默认不公开
      createdAt: new Date().toISOString(),
    };

    mockTemplates.push(newTemplate);

    return Response.json(newTemplate, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to create template' },
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
    const { templateId, updates } = data;

    if (!templateId || !updates) {
      return Response.json(
        { error: 'Template ID and updates are required' },
        { status: 400 }
      );
    }

    const templateIndex = mockTemplates.findIndex(t => t.id === parseInt(templateId) && t.userId === 'user1');
    if (templateIndex === -1) {
      return Response.json(
        { error: 'Template not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    // 更新模板
    Object.keys(updates).forEach(key => {
      if (mockTemplates[templateIndex].hasOwnProperty(key) && 
          key !== 'id' && 
          key !== 'userId' && 
          key !== 'isPublic' && 
          key !== 'createdAt') { // 不允许修改这些字段
        (mockTemplates[templateIndex] as any)[key] = updates[key];
      }
    });

    return Response.json({
      success: true,
      message: 'Template updated successfully',
      template: mockTemplates[templateIndex],
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to update template' },
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
    const templateId = url.searchParams.get('templateId');

    if (!templateId) {
      return Response.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    const templateIndex = mockTemplates.findIndex(t => t.id === parseInt(templateId) && t.userId === 'user1');
    if (templateIndex === -1) {
      return Response.json(
        { error: 'Template not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    const deletedTemplate = mockTemplates.splice(templateIndex, 1)[0];

    return Response.json({
      success: true,
      message: 'Template deleted successfully',
      template: deletedTemplate,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}