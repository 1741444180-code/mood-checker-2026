// src/app/api/user/friends/route.ts
import { NextRequest } from 'next/server'

// 模拟用户好友数据
const mockFriends = [
  { id: 'user2', username: 'Alice', avatar: null, status: 'online', lastActive: '2026-03-28T09:30:00Z' },
  { id: 'user3', username: 'Bob', avatar: null, status: 'offline', lastActive: '2026-03-27T15:45:00Z' },
  { id: 'user4', username: 'Charlie', avatar: null, status: 'away', lastActive: '2026-03-28T08:15:00Z' },
  { id: 'user5', username: 'Diana', avatar: null, status: 'online', lastActive: '2026-03-28T10:20:00Z' },
];

// 模拟好友请求数据
const mockFriendRequests = [
  { id: 1, fromUserId: 'user6', fromUsername: 'Eve', status: 'pending', createdAt: '2026-03-27T14:30:00Z' },
  { id: 2, fromUserId: 'user7', fromUsername: 'Frank', status: 'pending', createdAt: '2026-03-26T11:20:00Z' },
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

    // 从查询参数获取类型
    const type = request.nextUrl.searchParams.get('type'); // 'friends', 'requests', or undefined for both

    if (type === 'requests') {
      return Response.json({
        friendRequests: mockFriendRequests,
        totalRequests: mockFriendRequests.length,
      });
    } else if (type === 'friends') {
      return Response.json({
        friends: mockFriends,
        totalFriends: mockFriends.length,
      });
    } else {
      return Response.json({
        friends: mockFriends,
        totalFriends: mockFriends.length,
        friendRequests: mockFriendRequests,
        totalRequests: mockFriendRequests.length,
      });
    }
  } catch (error) {
    return Response.json(
      { error: 'Failed to get friends data' },
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
    const { action, targetUserId } = data;

    if (!action || !targetUserId) {
      return Response.json(
        { error: 'Action and target user ID are required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'add':
        // 添加好友请求逻辑
        const newRequest = {
          id: mockFriendRequests.length + 1,
          fromUserId: 'user1', // 当前用户
          fromUsername: 'testuser',
          toUserId: targetUserId,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        // 实际应用中会将请求保存到数据库
        return Response.json({
          success: true,
          message: 'Friend request sent',
          request: newRequest,
        });

      case 'accept':
        // 接受好友请求逻辑
        const requestToAccept = mockFriendRequests.find(req => req.id === data.requestId);
        if (!requestToAccept) {
          return Response.json(
            { error: 'Friend request not found' },
            { status: 404 }
          );
        }
        
        requestToAccept.status = 'accepted';
        
        // 将用户添加到好友列表
        const newFriend = {
          id: requestToAccept.fromUserId,
          username: requestToAccept.fromUsername,
          avatar: null,
          status: 'offline',
          lastActive: new Date().toISOString(),
        };
        
        mockFriends.push(newFriend);
        
        return Response.json({
          success: true,
          message: 'Friend request accepted',
          friend: newFriend,
        });

      case 'decline':
        // 拒绝好友请求逻辑
        const requestToDecline = mockFriendRequests.find(req => req.id === data.requestId);
        if (!requestToDecline) {
          return Response.json(
            { error: 'Friend request not found' },
            { status: 404 }
          );
        }
        
        requestToDecline.status = 'declined';
        
        return Response.json({
          success: true,
          message: 'Friend request declined',
        });

      default:
        return Response.json(
          { error: 'Invalid action. Use add, accept, or decline.' },
          { status: 400 }
        );
    }
  } catch (error) {
    return Response.json(
      { error: 'Failed to process friend request' },
      { status: 500 }
    );
  }
}