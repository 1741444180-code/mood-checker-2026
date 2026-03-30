import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取用户自定义心情列表
export async function GET(request: NextRequest) {
  try {
    // 从请求头获取认证信息
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 在实际项目中，这里应该解析 JWT token 获取用户ID
    // 为了演示，我们暂时从查询参数获取 userId
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userIdNum = parseInt(userId as string, 10);
    if (isNaN(userIdNum)) {
      return Response.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    const customMoods = await prisma.customMood.findMany({
      where: {
        userId: userIdNum,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Response.json(customMoods);
  } catch (error) {
    console.error('Error fetching custom moods:', error);
    return Response.json(
      { error: 'Failed to fetch custom moods' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 创建自定义心情
export async function POST(request: NextRequest) {
  try {
    // 从请求头获取认证信息
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { userId, name, imageUrls } = body;

    // 验证必需字段
    if (!userId || !name || !imageUrls) {
      return Response.json(
        { error: 'Missing required fields: userId, name, imageUrls' },
        { status: 400 }
      );
    }

    // 验证 imageUrls 是数组且不超过 9 张图片
    if (!Array.isArray(imageUrls) || imageUrls.length < 1 || imageUrls.length > 9) {
      return Response.json(
        { error: 'imageUrls must be an array with 1-9 images' },
        { status: 400 }
      );
    }

    // 验证每张图片 URL 的格式
    for (const imageUrl of imageUrls) {
      try {
        new URL(imageUrl);
      } catch {
        return Response.json(
          { error: `Invalid image URL: ${imageUrl}` },
          { status: 400 }
        );
      }
    }

    const userIdNum = parseInt(userId as string, 10);
    if (isNaN(userIdNum)) {
      return Response.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    const newCustomMood = await prisma.customMood.create({
      data: {
        userId: userIdNum,
        name,
        imageUrls,
      },
    });

    return Response.json(newCustomMood, { status: 201 });
  } catch (error) {
    console.error('Error creating custom mood:', error);
    return Response.json(
      { error: 'Failed to create custom mood' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 更新自定义心情
export async function PUT(request: NextRequest) {
  try {
    // 从请求头获取认证信息
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    const idNum = parseInt(id as string, 10);
    if (isNaN(idNum)) {
      return Response.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, imageUrls } = body;

    // 验证字段
    if (!name && !imageUrls) {
      return Response.json(
        { error: 'At least one field (name or imageUrls) must be provided' },
        { status: 400 }
      );
    }

    // 如果提供了 imageUrls，验证其格式
    if (imageUrls) {
      if (!Array.isArray(imageUrls) || imageUrls.length < 1 || imageUrls.length > 9) {
        return Response.json(
          { error: 'imageUrls must be an array with 1-9 images' },
          { status: 400 }
        );
      }

      // 验证每张图片 URL 的格式
      for (const imageUrl of imageUrls) {
        try {
          new URL(imageUrl);
        } catch {
          return Response.json(
            { error: `Invalid image URL: ${imageUrl}` },
            { status: 400 }
          );
        }
      }
    }

    // 检查自定义心情是否存在并属于当前用户
    const existingMood = await prisma.customMood.findUnique({
      where: { id: idNum },
    });

    if (!existingMood) {
      return Response.json({ error: 'Custom mood not found' }, { status: 404 });
    }

    // 构建更新数据
    const updateData: any = {};
    if (name) updateData.name = name;
    if (imageUrls) updateData.imageUrls = imageUrls;
    updateData.updatedAt = new Date(); // 更新时间戳

    const updatedCustomMood = await prisma.customMood.update({
      where: { id: idNum },
      data: updateData,
    });

    return Response.json(updatedCustomMood);
  } catch (error) {
    console.error('Error updating custom mood:', error);
    return Response.json(
      { error: 'Failed to update custom mood' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 删除自定义心情
export async function DELETE(request: NextRequest) {
  try {
    // 从请求头获取认证信息
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    const idNum = parseInt(id as string, 10);
    if (isNaN(idNum)) {
      return Response.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // 检查自定义心情是否存在并属于当前用户
    const existingMood = await prisma.customMood.findUnique({
      where: { id: idNum },
    });

    if (!existingMood) {
      return Response.json({ error: 'Custom mood not found' }, { status: 404 });
    }

    await prisma.customMood.delete({
      where: { id: idNum },
    });

    return Response.json({ message: 'Custom mood deleted successfully' });
  } catch (error) {
    console.error('Error deleting custom mood:', error);
    return Response.json(
      { error: 'Failed to delete custom mood' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}