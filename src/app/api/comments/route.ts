// src/app/api/comments/route.ts
import { NextRequest } from 'next/server'

// 模拟评论数据
const mockComments = [
  { id: 1, moodRecordId: 1, userId: 'user2', content: '看到你开心我也很开心！', createdAt: '2026-03-28T10:30:00Z', status: 'approved' },
  { id: 2, moodRecordId: 1, userId: 'user3', content: '继续保持好心情！', createdAt: '2026-03-28T11:45:00Z', status: 'approved' },
  { id: 3, moodRecordId: 2, userId: 'user1', content: '读书是个好习惯', createdAt: '2026-03-27T14:20:00Z', status: 'approved' },
];

export async function GET(request: NextRequest) {
  try {
    // 从查询参数获取心情记录ID
    const moodRecordId = request.nextUrl.searchParams.get('moodRecordId');
    
    // 过滤评论数据
    let filteredComments = mockComments;
    if (moodRecordId) {
      filteredComments = filteredComments.filter(comment => comment.moodRecordId.toString() === moodRecordId);
    }
    
    // 只返回已批准的评论
    const approvedComments = filteredComments.filter(comment => comment.status === 'approved');
    
    return Response.json(approvedComments);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { moodRecordId, userId, content } = data;

    // 简单验证
    if (!moodRecordId || !content) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 创建新评论
    const newComment = {
      id: mockComments.length + 1,
      moodRecordId: parseInt(moodRecordId),
      userId: userId || null, // 用户ID可选（游客评论）
      content,
      createdAt: new Date().toISOString(),
      status: 'pending', // 新评论默认待审核
    };

    // 添加到模拟数据
    mockComments.push(newComment);

    return Response.json(newComment, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}