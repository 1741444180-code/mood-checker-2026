import { Message } from '@/app/messages/page';

interface MessageListProps {
  messages: Message[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const MessageList = ({ messages, onMarkAsRead, onDelete }: MessageListProps) => {
  return (
    <div className="divide-y divide-gray-200">
      {messages.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          暂无消息
        </div>
      ) : (
        messages.map((message) => (
          <div 
            key={message.id} 
            className={`p-6 hover:bg-gray-50 transition-colors ${
              !message.isRead ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start">
              {message.avatar && (
                <img 
                  src={message.avatar} 
                  alt={message.sender} 
                  className="w-10 h-10 rounded-full mr-4"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${
                    !message.isRead ? 'text-blue-700' : 'text-gray-800'
                  }`}>
                    {message.sender}
                  </h3>
                  <span className="text-sm text-gray-500">{message.timestamp}</span>
                </div>
                <p className={`mt-1 text-gray-700 ${
                  !message.isRead ? 'font-medium' : ''
                }`}>
                  {message.content}
                </p>
              </div>
              <div className="ml-4 flex space-x-2">
                {!message.isRead && (
                  <button
                    onClick={() => onMarkAsRead(message.id)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
                  >
                    标为已读
                  </button>
                )}
                <button
                  onClick={() => onDelete(message.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;