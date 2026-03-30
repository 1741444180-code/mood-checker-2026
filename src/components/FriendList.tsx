'use client';

import React from 'react';

interface Friend {
  id: number | string;
  name: string;
  avatar?: string;
  status?: string;
}

interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message?: string;
  timestamp: string;
}

interface FriendListProps {
  friends?: Friend[];
  friendRequests?: FriendRequest[];
  onAccept?: (requestId: string) => Promise<void>;
  onReject?: (requestId: string) => Promise<void>;
  type?: 'friends' | 'requests';
}

const FriendList: React.FC<FriendListProps> = ({ friends = [], friendRequests = [], onAccept, onReject, type = 'friends' }) => {
  // 好友请求列表
  if (type === 'requests') {
    if (friendRequests.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">好友请求</h2>
          <div className="text-center text-gray-500 py-8">
            暂无好友请求
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">好友请求</h2>
        </div>
        <ul className="divide-y">
          {friendRequests.map((request) => (
            <li key={request.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    {request.senderAvatar ? (
                      <img src={request.senderAvatar} alt={request.senderName} className="w-10 h-10 rounded-full" />
                    ) : (
                      <span className="text-gray-500">{request.senderName[0]}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{request.senderName}</p>
                    {request.message && <p className="text-sm text-gray-500">{request.message}</p>}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onAccept?.(request.id)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    接受
                  </button>
                  <button
                    onClick={() => onReject?.(request.id)}
                    className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    拒绝
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // 好友列表
  if (friends.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">好友列表</h2>
        <div className="text-center text-gray-500 py-8">
          暂无好友
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">好友列表</h2>
      </div>
      <ul className="divide-y">
        {friends.map((friend) => (
          <li key={friend.id} className="p-4 hover:bg-gray-50 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              {friend.avatar ? (
                <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full" />
              ) : (
                <span className="text-gray-500">{friend.name[0]}</span>
              )}
            </div>
            <div>
              <p className="font-medium">{friend.name}</p>
              {friend.status && <p className="text-sm text-gray-500">{friend.status}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
