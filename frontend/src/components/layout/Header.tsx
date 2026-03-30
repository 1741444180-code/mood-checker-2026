'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';

export default function Header() {
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
            数据统计
          </Link>
          <Link href="/calendar" className="text-sm font-medium transition-colors hover:text-primary">
            心情日历
          </Link>
          <Link href="/friends" className="text-sm font-medium transition-colors hover:text-primary">
            好友列表
          </Link>
          <Link href="/badges" className="text-sm font-medium transition-colors hover:text-primary">
            徽章系统
          </Link>
          <Link href="/leaderboard" className="text-sm font-medium transition-colors hover:text-primary">
            排行榜
          </Link>
        </nav>

        {/* 移动端菜单 */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">打开菜单</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/">首页</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/stats">数据统计</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/calendar">心情日历</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/friends">好友列表</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/badges">徽章系统</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/leaderboard">排行榜</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}