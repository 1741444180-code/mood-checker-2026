'use client';

import { useState, useEffect } from 'react';

export const metadata = {
  title: '好友列表',
};
import FriendList from '@/components/FriendList';
import { friendAPI } from '@/utils/api';

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message?: string;
  timestamp: string;
}

const FriendsPage = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');

  // 获取好友和请求数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [friendsData, requestsData] = await Promise.all([
          friendAPI.getFriends(),
          friendAPI.getFriendRequests()
        ]);
        
        setFriends(friendsData);
        setRequests(requestsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await friendAPI.acceptFriendRequest(requestId);
      
      // 找到被接受的请求
      const request = requests.find(req => req.id === requestId);
      if (request) {
        // 将请求者添加为好友
        const newFriend: Friend = {
          id: request.senderId,
          name: request.senderName,
          status: 'offline', // 新好友默认离线
          avatar: request.senderAvatar
        };
        
        setFriends([...friends, newFriend]);
        // 从请求列表中移除
        setRequests(requests.filter(req => req.id !== requestId));
      }
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await friendAPI.rejectFriendRequest(requestId);
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Failed to reject friend request:', error);
    }
  };

  const handleAddFriend = () => {
    // 这里可以实现添加好友的功能
    alert('添加好友功能待实现');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">好友列表</h1>
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`py-2 px-1 text-sm sm:text-base ${
                  activeTab === 'friends'
                    ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('friends')}
              >
                好友 ({friends.length})
              </button>
              <button
                className={`py-2 px-1 text-sm sm:text-base relative ${
                  activeTab === 'requests'
                    ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('requests')}
              >
                好友请求 ({requests.length})
                {requests.length > 0 && (
                  <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {requests.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'friends' ? (
            loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">加载中...</p>
              </div>
            ) : (
              <>
                <div className="mb-4 sm:mb-6">
                  <button
                    onClick={handleAddFriend}
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base"
                  >
                    添加好友
                  </button>
                </div>
                <FriendList 
                  friends={friends} 
                  type="friends" 
                />
              </>
            )
          ) : (
            loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">加载中...</p>
              </div>
            ) : (
              <FriendList 
                friendRequests={requests}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
                type="requests" 
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;