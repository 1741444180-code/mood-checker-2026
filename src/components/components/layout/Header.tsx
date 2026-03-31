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
          <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
            仪表板
          </Link>
          <Link href="/history" className="text-sm font-medium transition-colors hover:text-primary">
            历史记录
          </Link>
          <Link href="/analysis" className="text-sm font-medium transition-colors hover:text-primary">
            数据分析
          </Link>
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
                <Link href="/dashboard">仪表板</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/history">历史记录</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/analysis">数据分析</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}