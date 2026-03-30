import React from 'react';

interface User {
  id: string;
  name: string;
  avatar: string;
  score: number;
  rank: number;
  badgesCount: number;
  isFriend?: boolean;
}

interface LeaderboardComponentProps {
  users: User[];
  loading: boolean;
  activeTab: 'personal' | 'friends' | 'global';
}

const LeaderboardComponent: React.FC<LeaderboardComponentProps> = ({ users, loading, activeTab }) => {
  // 根据活动标签过滤用户
  const filteredUsers = activeTab === 'friends' 
    ? users.filter(user => user.isFriend) 
    : users;

  // 如果是个人模式，则找到当前用户的位置
  let currentUserIndex = -1;
  if (activeTab === 'personal') {
    // 模拟当前用户（这里假设当前用户是排名第4的用户）
    const currentUser = users.find(u => u.rank === 4);
    if (currentUser) {
      currentUserIndex = users.findIndex(u => u.id === currentUser.id);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badges</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                No users found
              </td>
            </tr>
          ) : (
            filteredUsers.map((user, index) => {
              // 在个人模式下，只显示当前用户及其前后各两名用户
              if (activeTab === 'personal' && Math.abs(index - currentUserIndex) > 2 && currentUserIndex !== -1) {
                if (index === currentUserIndex - 3) {
                  return (
                    <tr key="ellipsis-top" className="opacity-50">
                      <td colSpan={4} className="px-4 py-2 text-center text-gray-500">...</td>
                    </tr>
                  );
                }
                if (index === currentUserIndex + 3) {
                  return (
                    <tr key="ellipsis-bottom" className="opacity-50">
                      <td colSpan={4} className="px-4 py-2 text-center text-gray-500">...</td>
                    </tr>
                  );
                }
                
                // 跳过不在范围内的用户
                if (index < currentUserIndex - 2 || index > currentUserIndex + 2) {
                  return null;
                }
              }

              // 判断是否是当前用户
              const isCurrentUser = activeTab === 'personal' && index === currentUserIndex;
              
              return (
                <tr 
                  key={user.id} 
                  className={`${isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-lg font-semibold ${
                        user.rank === 1 ? 'text-yellow-500' : 
                        user.rank === 2 ? 'text-gray-400' : 
                        user.rank === 3 ? 'text-yellow-700' : 
                        'text-gray-700'
                      }`}>
                        {user.rank}
                      </span>
                      {user.rank <= 3 && (
                        <span className="ml-2">
                          {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-medium">
                        {user.avatar}
                      </div>
                      <div className="ml-4">
                        <div className={`text-sm font-medium ${isCurrentUser ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
                          {user.name}
                          {isCurrentUser && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>}
                        </div>
                        {user.isFriend && (
                          <div className="text-xs text-green-600">Friend</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.score.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.badgesCount}</div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      
      {activeTab === 'personal' && currentUserIndex === -1 && filteredUsers.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          You are not on this leaderboard
        </div>
      )}
    </div>
  );
};

export default LeaderboardComponent;