import Image from 'next/image';

interface UserData {
  id: number;
  name: string;
  username: string;
  avatar: string;
  email: string;
  joinDate: string;
  bio?: string;
  location?: string;
}

interface UserProfileCardProps {
  userData: UserData;
  onEdit?: () => void;
}

export default function UserProfileCard({ userData, onEdit }: UserProfileCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="md:flex">
        {/* Avatar section */}
        <div className="md:w-1/3 p-8 flex flex-col items-center">
          <div className="relative">
            {userData.avatar ? (
              <Image 
                src={userData.avatar} 
                alt="头像" 
                width={120}
                height={120}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {userData.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-2 border-4 border-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">{userData.name}</h2>
          <p className="text-gray-600">@{userData.username}</p>
          <p className="text-gray-500 text-sm mt-1">加入于 {new Date(userData.joinDate).toLocaleDateString('zh-CN')}</p>
          
          {onEdit && (
            <button 
              onClick={onEdit}
              className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              编辑资料
            </button>
          )}
        </div>
        
        {/* Profile details section */}
        <div className="md:w-2/3 p-8 border-t md:border-t-0 md:border-l border-gray-200">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">邮箱</h3>
              <p className="text-gray-600">{userData.email}</p>
            </div>
            
            {userData.bio && (
              <div>
                <h3 className="font-medium text-gray-900">个人简介</h3>
                <p className="text-gray-600">{userData.bio}</p>
              </div>
            )}
            
            {userData.location && (
              <div className="flex items-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{userData.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}