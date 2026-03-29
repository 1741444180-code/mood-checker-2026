import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">心情打卡应用</h1>
        <p className="text-gray-600 mb-8">
          记录您的每日心情，追踪情绪变化，培养积极心态
        </p>
        <div className="space-y-4">
          <Link 
            href="/login" 
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            登录
          </Link>
          <Link 
            href="/register" 
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-md transition-colors"
          >
            注册
          </Link>
          <div className="mt-6">
            <Link 
              href="/profile" 
              className="inline-block text-blue-600 hover:text-blue-800 font-medium"
            >
              进入个人中心预览 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}