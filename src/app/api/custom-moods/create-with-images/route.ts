import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { uploadMultipleImages, isValidImageFormat, isValidImageSize } from '@/lib/image-upload';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // 从请求头获取认证信息
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 从请求头中提取用户ID
    const userIdHeader = request.headers.get('x-user-id');
    if (!userIdHeader) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userId = parseInt(userIdHeader, 10);
    if (isNaN(userId)) {
      return Response.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    // 解析 multipart/form-data 请求
    const formData = await request.formData();
    
    // 获取心情名称
    const name = formData.get('name') as string;
    if (!name) {
      return Response.json({ error: 'Mood name is required' }, { status: 400 });
    }

    // 获取图片文件
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return Response.json({ error: 'At least one image is required' }, { status: 400 });
    }

    if (files.length > 9) {
      return Response.json({ error: 'Maximum 9 images allowed' }, { status: 400 });
    }

    // 验证并处理每个文件
    const processedFiles = [];
    for (const file of files) {
      if (!file) continue;

      // 转换 File 对象为 Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 验证图片格式
      if (!isValidImageFormat(buffer, file.name)) {
        return Response.json(
          { error: `Invalid image format: ${file.name}` },
          { status: 400 }
        );
      }

      // 验证图片大小（最大 5MB）
      if (!isValidImageSize(buffer)) {
        return Response.json(
          { error: `Image too large: ${file.name} (max 5MB)` },
          { status: 400 }
        );
      }

      processedFiles.push({
        buffer,
        fileName: file.name,
      });
    }

    if (processedFiles.length === 0) {
      return Response.json({ error: 'No valid images to upload' }, { status: 400 });
    }

    // 上传图片
    const uploadedUrls = await uploadMultipleImages(processedFiles, userIdHeader);

    // 创建自定义心情记录
    const newCustomMood = await prisma.customMood.create({
      data: {
        userId: userId,
        name: name,
        imageUrls: uploadedUrls,
      },
    });

    return Response.json(
      { 
        message: 'Custom mood created successfully', 
        customMood: newCustomMood
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating custom mood with images:', error);
    
    if (error instanceof TypeError && error.message.includes('formData')) {
      return Response.json(
        { error: 'Invalid request format. Please send data as multipart/form-data with name and images.' },
        { status: 400 }
      );
    }
    
    return Response.json(
      { error: 'Failed to create custom mood with images' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 允许 FormData 解析
// Next.js App Router 自动处理 FormData