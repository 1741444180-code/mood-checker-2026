'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              心情打卡
            </Link>
            
            <div className="flex space-x-1">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => window.location.href = '/'}
              >
                首页
              </Button>
              
              <Button
                variant={isActive('/stats') ? 'default' : 'ghost'}
                size="sm"
              >
                <Link href="/stats">数据统计</Link>
              </Button>
              
              <Button
                variant={isActive('/calendar') ? 'default' : 'ghost'}
                size="sm"
              >
                <Link href="/calendar">心情日历</Link>
              </Button>
              
              <Button
                variant={isActive('/friends') ? 'default' : 'ghost'}
                size="sm"
              >
                <Link href="/friends">好友列表</Link>
              </Button>
              
              <Button
                variant={isActive('/badges') ? 'default' : 'ghost'}
                size="sm"
              >
                <Link href="/badges">徽章系统</Link>
              </Button>
              
              <Button
                variant={isActive('/leaderboard') ? 'default' : 'ghost'}
                size="sm"
              >
                <Link href="/leaderboard">排行榜</Link>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={isActive('/settings') ? 'default' : 'ghost'}
              size="sm"
            >
              <Link href="/settings">设置</Link>
            </Button>
            
            <Button
              variant={isActive('/privacy') ? 'default' : 'ghost'}
              size="sm"
            >
              <Link href="/privacy">隐私</Link>
            </Button>
            
            <Button variant="outline" size="sm">
              登出
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}