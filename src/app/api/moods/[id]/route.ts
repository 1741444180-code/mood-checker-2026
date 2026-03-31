// src/app/api/moods/[id]/route.ts
import { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

// 模拟心情记录数据
let mockMoodRecords = [
  { id: 1, userId: 'user1', date: '2026-03-28', moodType: '开心', note: '今天天气很好', tags: ['生活'], createdAt: '2026-03-28T08:30:00Z' },
  { id: 2, userId: 'user1', date: '2026-03-27', moodType: '平静', note: '看了一本书', tags: ['生活'], createdAt: '2026-03-27T21:15:00Z' },
  { id: 3, userId: 'user1', date: '2026-03-26', moodType: '开心', note: '完成了工作', tags: ['工作'], createdAt: '2026-03-26T20:45:00Z' },
];

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    // 查找心情记录
    const moodRecord = mockMoodRecords.find(record => record.id === id);
    
    if (!moodRecord) {
      return Response.json(
        { error: 'Mood record not found' },
        { status: 404 }
      );
    }

    return Response.json(moodRecord);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get mood record' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 查找心情记录
    const index = mockMoodRecords.findIndex(record => record.id === id);
    
    if (index === -1) {
      return Response.json(
        { error: 'Mood record not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const { moodType, note, tags } = data;

    // 更新心情记录
    mockMoodRecords[index] = {
      ...mockMoodRecords[index],
      moodType: moodType || mockMoodRecords[index].moodType,
      note: note || mockMoodRecords[index].note,
      tags: tags || mockMoodRecords[index].tags,
      updatedAt: new Date().toISOString(),
    };

    // 重新验证缓存
    revalidateTag('mood-records');

    return Response.json(mockMoodRecords[index]);
  } catch (error) {
    return Response.json(
      { error: 'Failed to update mood record' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 查找心情记录
    const index = mockMoodRecords.findIndex(record => record.id === id);
    
    if (index === -1) {
      return Response.json(
        { error: 'Mood record not found' },
        { status: 404 }
      );
    }

    // 删除心情记录
    const deletedRecord = mockMoodRecords.splice(index, 1)[0];

    // 重新验证缓存
    revalidateTag('mood-records');

    return Response.json(deletedRecord);
  } catch (error) {
    return Response.json(
      { error: 'Failed to delete mood record' },
      { status: 500 }
    );
  }
}