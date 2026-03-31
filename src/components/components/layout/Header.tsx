'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Menu, LogOut } from 'lucide-react';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    // 清除本地存储
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // 跳转到登录页
    router.push('/auth/login');
  };

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold">
            心情打卡
          </Link>
        </div>

        {/* 桌面导航 */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            首页
          </Link>
          <Link href="/stats" className="text-sm font-medium transition-colors hover:text-primary">
            统计
          </Link>
          <Link href="/profile" className="text-sm font-medium transition-colors hover:text-primary">
            我的
          </Link>
          <Link href="/settings" className="text-sm font-medium transition-colors hover:text-primary">
            设置
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            退出登录
          </Button>
        </nav>

        {/* 移动端菜单 */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">打开菜单</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/">首页</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/stats">统计</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">我的</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">设置</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}