import Image from 'next/image';

interface UserData {
  id: number;
  name: string;
  avatar: string;
  email: string;
  joinDate: string;
}

interface UserProfileCardProps {
  userData: UserData;
}

export default function UserProfileCard({ userData }: UserProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="mb-4 md:mb-0 md:mr-6">
            {userData.avatar ? (
              <Image 
                src={userData.avatar} 
                alt="头像" 
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-2xl">
                  {userData.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
            <p className="text-gray-600 mt-1">{userData.email}</p>
            <p className="text-gray-500 text-sm mt-2">
              加入日期: {new Date(userData.joinDate).toLocaleDateString('zh-CN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}