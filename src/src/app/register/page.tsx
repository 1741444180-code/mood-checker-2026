import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">注册</h1>
          <p className="mt-2 text-gray-600">
            创建您的账户
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-8">
          <form className="space-y-6">
            <div>
              <Label htmlFor="username">用户名</Label>
              <Input id="username" name="username" type="text" />
            </div>
            
            <div>
              <Label htmlFor="email">邮箱</Label>
              <Input id="email" name="email" type="email" autoComplete="email" />
            </div>
            
            <div>
              <Label htmlFor="password">密码</Label>
              <Input id="password" name="password" type="password" autoComplete="new-password" />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" />
            </div>
            
            <Button type="submit" className="w-full">
              注册
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              已有账户？{' '}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}