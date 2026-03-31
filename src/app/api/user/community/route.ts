// src/app/api/user/community/route.ts
import { NextRequest } from 'next/server'

// 模拟社区数据
const mockCommunityPosts = [
  {
    id: 1,
    userId: 'user2',
    username: 'Alice',
    moodType: '开心',
    content: '今天终于完成了那个困难的项目，感觉特别有成就感！',
    tags: ['工作', '成就'],
    likes: 12,
    comments: 3,
    createdAt: '2026-03-28T09:30:00Z',
    privacy: 'public',
  },
  {
    id: 2,
    userId: 'user3',
    username: 'Bob',
    moodType: '平静',
    content: '早上做了冥想练习，整个上午都很专注和平静。',
    tags: ['冥想', '专注'],
    likes: 8,
    comments: 1,
    createdAt: '2026-03-28T08:15:00Z',
    privacy: 'friends',
  },
  {
    id: 3,
    userId: 'user4',
    username: 'Charlie',
    moodType: '焦虑',
    content: '明天有个重要会议，有点紧张，但也在努力准备。',
    tags: ['工作', '紧张'],
    likes: 5,
    comments: 7,
    createdAt: '2026-03-27T20:45:00Z',
    privacy: 'public',
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
    const moodType = request.nextUrl.searchParams.get('moodType');
    const tag = request.nextUrl.searchParams.get('tag');
    const userId = request.nextUrl.searchParams.get('userId');
    const privacy = request.nextUrl.searchParams.get('privacy') || 'public,friends'; // public, friends, private
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    // 过滤帖子
    let filteredPosts = mockCommunityPosts;
    
    if (moodType) {
      filteredPosts = filteredPosts.filter(post => post.moodType === moodType);
    }
    
    if (tag) {
      filteredPosts = filteredPosts.filter(post => post.tags.includes(tag));
    }
    
    if (userId) {
      filteredPosts = filteredPosts.filter(post => post.userId === userId);
    }
    
    // 只显示公共和朋友可见的帖子（对于非作者）
    // 在实际应用中，这里还需要检查用户间的好友关系
    filteredPosts = filteredPosts.filter(post => 
      post.privacy === 'public' || 
      (post.privacy === 'friends' && post.userId !== 'user1') // 简化处理
    );

    // 排序（按时间倒序）
    filteredPosts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // 分页
    const paginatedPosts = filteredPosts.slice(offset, offset + limit);

    return Response.json({
      posts: paginatedPosts,
      total: filteredPosts.length,
      hasNext: offset + limit < filteredPosts.length,
      nextOffset: offset + limit < filteredPosts.length ? offset + limit : null,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get community posts' },
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
    const { moodType, content, tags, privacy } = data;

    // 简单验证
    if (!moodType || !content) {
      return Response.json(
        { error: 'Mood type and content are required' },
        { status: 400 }
      );
    }

    // 创建新帖子
    const newPost = {
      id: mockCommunityPosts.length + 1,
      userId: 'user1', // 从token中获取的实际用户ID
      username: 'testuser',
      moodType,
      content,
      tags: tags || [],
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      privacy: privacy || 'public',
    };

    mockCommunityPosts.unshift(newPost); // 添加到开头

    return Response.json(newPost, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to create community post' },
      { status: 500 }
    );
  }
}