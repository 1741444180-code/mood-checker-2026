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
                variant={isActive('/') ? 'secondary' : 'ghost'}
                asChild
                size="sm"
              >
                <Link href="/">首页</Link>
              </Button>
              
              <Button
                variant={isActive('/diary') ? 'secondary' : 'ghost'}
                asChild
                size="sm"
              >
                <Link href="/diary">日记</Link>
              </Button>
              
              <Button
                variant={isActive('/mood-tracker') ? 'secondary' : 'ghost'}
                asChild
                size="sm"
              >
                <Link href="/mood-tracker">心情追踪</Link>
              </Button>
              
              <Button
                variant={isActive('/community') ? 'secondary' : 'ghost'}
                asChild
                size="sm"
              >
                <Link href="/community">社区</Link>
              </Button>
              
              <Button
                variant={isActive('/calendar') ? 'secondary' : 'ghost'}
                asChild
                size="sm"
              >
                <Link href="/calendar">日历</Link>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={isActive('/settings') ? 'secondary' : 'ghost'}
              asChild
              size="sm"
            >
              <Link href="/settings">设置</Link>
            </Button>
            
            <Button
              variant={isActive('/privacy') ? 'secondary' : 'ghost'}
              asChild
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