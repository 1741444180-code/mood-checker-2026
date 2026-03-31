import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取特定自定义心情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 从请求头获取认证信息
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      return Response.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const customMood = await prisma.customMood.findUnique({
      where: { id: idNum },
    });

    if (!customMood) {
      return Response.json({ error: 'Custom mood not found' }, { status: 404 });
    }

    return Response.json(customMood);
  } catch (error) {
    console.error('Error fetching custom mood:', error);
    return Response.json(
      { error: 'Failed to fetch custom mood' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}