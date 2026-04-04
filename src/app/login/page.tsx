import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">登录</h1>
          <p className="mt-2 text-gray-600">
            输入您的信息以继续
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 md:p-8">
          <form className="space-y-6">
            <div>
              <Label htmlFor="email">邮箱</Label>
              <Input id="email" name="email" type="email" autoComplete="email" />
            </div>
            
            <div>
              <Label htmlFor="password">密码</Label>
              <Input id="password" name="password" type="password" autoComplete="current-password" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  记住我
                </Label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  忘记密码？
                </a>
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              登录
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              还没有账户？{' '}
              <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}