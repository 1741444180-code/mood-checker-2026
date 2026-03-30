import { NextRequest } from 'next/server';
import { uploadMultipleImages, isValidImageFormat, isValidImageSize } from '@/src/lib/image-upload';

export async function POST(request: NextRequest) {
  try {
    // 从请求头获取认证信息
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 从请求头中提取用户ID（实际项目中应该从 JWT token 解析）
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 解析 multipart/form-data 请求
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return Response.json({ error: 'No images provided' }, { status: 400 });
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
    const uploadedUrls = await uploadMultipleImages(processedFiles, userId);

    return Response.json(
      { 
        message: 'Images uploaded successfully', 
        urls: uploadedUrls,
        count: uploadedUrls.length 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading images:', error);
    
    if (error instanceof TypeError && error.message.includes('formData')) {
      return Response.json(
        { error: 'Invalid request format. Please send images as multipart/form-data.' },
        { status: 400 }
      );
    }
    
    return Response.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}

// 允许 FormData 解析
export const config = {
  api: {
    bodyParser: false,
  },
};