import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';

// 初始化 S3 客户端（使用模拟配置，实际项目中需要替换为真实配置）
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'fake-key-id',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'fake-secret-key',
  },
});

/**
 * 上传单张图片到云存储
 * @param fileBuffer 图片文件的 buffer
 * @param fileName 文件名
 * @param userId 用户 ID
 * @returns 上传后的图片 URL
 */
export async function uploadImage(fileBuffer: Buffer, fileName: string, userId: string): Promise<string> {
  try {
    // 生成唯一的文件名
    const uniqueFileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 10)}${path.extname(fileName)}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME || 'mood-checker-images',
      Key: uniqueFileName,
      Body: fileBuffer,
      ContentType: getContentType(path.extname(fileName)),
    });

    await s3Client.send(command);
    
    // 返回完整的 URL
    const imageUrl = `https://${process.env.S3_BUCKET_NAME || 'mood-checker-images'}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${uniqueFileName}`;
    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error}`);
  }
}

/**
 * 批量上传多张图片
 * @param files 图片文件数组
 * @param userId 用户 ID
 * @returns 上传后的图片 URL 数组
 */
export async function uploadMultipleImages(files: Array<{ buffer: Buffer; fileName: string }>, userId: string): Promise<string[]> {
  if (files.length < 1 || files.length > 9) {
    throw new Error('Number of images must be between 1 and 9');
  }

  const uploadPromises = files.map(file => 
    uploadImage(file.buffer, file.fileName, userId)
  );

  const urls = await Promise.all(uploadPromises);
  return urls;
}

/**
 * 验证图片格式
 * @param fileBuffer 文件 buffer
 * @param fileName 文件名
 * @returns 是否为有效图片格式
 */
export function isValidImageFormat(fileBuffer: Buffer, fileName: string): boolean {
  const ext = path.extname(fileName).toLowerCase();
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  if (!validExtensions.includes(ext)) {
    return false;
  }

  // 简单的文件头检查
  if (ext === '.jpg' || ext === '.jpeg') {
    return fileBuffer.slice(0, 4).equals(Buffer.from([0xFF, 0xD8, 0xFF]));
  } else if (ext === '.png') {
    return fileBuffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]));
  } else if (ext === '.gif') {
    return fileBuffer.slice(0, 3).equals(Buffer.from([0x47, 0x49, 0x46]));
  } else if (ext === '.webp') {
    return fileBuffer.slice(0, 4).equals(Buffer.from([0x52, 0x49, 0x46, 0x46])) &&
           fileBuffer.slice(8, 12).equals(Buffer.from([0x57, 0x45, 0x42, 0x50]));
  }

  return false;
}

/**
 * 获取文件的 MIME 类型
 * @param ext 文件扩展名
 * @returns MIME 类型
 */
function getContentType(ext: string): string {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}

/**
 * 验证图片大小
 * @param fileBuffer 文件 buffer
 * @param maxSizeInBytes 最大大小（字节），默认为 5MB
 * @returns 是否小于最大大小
 */
export function isValidImageSize(fileBuffer: Buffer, maxSizeInBytes: number = 5 * 1024 * 1024): boolean {
  return fileBuffer.length <= maxSizeInBytes;
}