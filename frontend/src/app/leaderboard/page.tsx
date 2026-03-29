'use client';

import React, { useState, useEffect } from 'react';
import LeaderboardComponent from './LeaderboardComponent';

interface User {
  id: string;
  name: string;
  avatar: string;
  score: number;
  rank: number;
  badgesCount: number;
  isFriend?: boolean;
}

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'friends' | 'global'>('global');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 模拟获取排行榜数据
  useEffect(() => {
    // 这里应该从API获取实际的排行榜数据
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Alex Johnson',
        avatar: 'AJ',
        score: 12500,
        rank: 1,
        badgesCount: 42,
        isFriend: false
      },
      {
        id: '2',
        name: 'Sam Chen',
        avatar: 'SC',
        score: 11800,
        rank: 2,
        badgesCount: 38,
        isFriend: true
      },
      {
        id: '3',
        name: 'Taylor Smith',
        avatar: 'TS',
        score: 10950,
        rank: 3,
        badgesCount: 35,
        isFriend: false
      },
      {
        id: '4',
        name: 'Jordan Williams',
        avatar: 'JW',
        score: 9800,
        rank: 4,
        badgesCount: 31,
        isFriend: true
      },
      {
        id: '5',
        name: 'Casey Brown',
        avatar: 'CB',
        score: 9200,
        rank: 5,
        badgesCount: 29,
        isFriend: false
      },
      {
        id: '6',
        name: 'Morgan Davis',
        avatar: 'MD',
        score: 8750,
        rank: 6,
        badgesCount: 27,
        isFriend: false
      },
      {
        id: '7',
        name: 'Riley Miller',
        avatar: 'RM',
        score: 8300,
        rank: 7,
        badgesCount: 25,
        isFriend: true
      },
      {
        id: '8',
        name: 'Quinn Wilson',
        avatar: 'QW',
        score: 7900,
        rank: 8,
        badgesCount: 23,
        isFriend: false
      },
      {
        id: '9',
        name: 'Avery Taylor',
        avatar: 'AT',
        score: 7500,
        rank: 9,
        badgesCount: 21,
        isFriend: false
      },
      {
        id: '10',
        name: 'Peyton Anderson',
        avatar: 'PA',
        score: 7100,
        rank: 10,
        badgesCount: 19,
        isFriend: false
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-lg text-gray-600">See how you rank against other users</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium text-sm rounded-t-lg ${
                activeTab === 'global'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('global')}
            >
              Global
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm rounded-t-lg ${
                activeTab === 'friends'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('friends')}
            >
              Friends
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm rounded-t-lg ${
                activeTab === 'personal'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('personal')}
            >
              Personal
            </button>
          </div>

          <LeaderboardComponent users={users} loading={loading} activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;