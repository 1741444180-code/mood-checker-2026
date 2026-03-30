import { Friend, FriendRequest } from '@/app/friends/page';

interface FriendListProps {
  friends?: Friend[];
  friendRequests?: FriendRequest[];
  type: 'friends' | 'requests';
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

const FriendList = ({ 
  friends, 
  friendRequests, 
  type, 
  onAccept, 
  onReject 
}: FriendListProps) => {
  if (type === 'friends') {
    if (!friends || friends.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          暂无好友
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {friends.map((friend) => (
          <div 
            key={friend.id} 
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {friend.avatar && (
              <img 
                src={friend.avatar} 
                alt={friend.name} 
                className="w-12 h-12 rounded-full mr-4"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-medium text-gray-800">{friend.name}</h3>
                <span className={`ml-2 inline-block w-3 h-3 rounded-full ${
                  friend.status === 'online' 
                    ? 'bg-green-500' 
                    : friend.status === 'away' 
                      ? 'bg-yellow-500' 
                      : 'bg-gray-400'
                }`}></span>
              </div>
              {friend.lastSeen && (
                <p className="text-sm text-gray-500">最后在线: {friend.lastSeen}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    if (!friendRequests || friendRequests.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          暂无好友请求
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {friendRequests.map((request) => (
          <div 
            key={request.id} 
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {request.senderAvatar && (
              <img 
                src={request.senderAvatar} 
                alt={request.senderName} 
                className="w-12 h-12 rounded-full mr-4"
              />
            )}
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{request.senderName}</h3>
              {request.message && (
                <p className="text-sm text-gray-600 mt-1">{request.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">{request.timestamp}</p>
            </div>
            <div className="flex space-x-2 ml-4">
              {onAccept && (
                <button
                  onClick={() => onAccept(request.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors"
                >
                  接受
                </button>
              )}
              {onReject && (
                <button
                  onClick={() => onReject(request.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
                >
                  拒绝
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default FriendList;