'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BarChart3, User, Settings } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', icon: Home, label: '首页' },
    { href: '/stats', icon: BarChart3, label: '统计' },
    { href: '/profile', icon: User, label: '我的' },
    { href: '/settings', icon: Settings, label: '设置' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50 safe-area-bottom">
      <div className="grid grid-cols-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-3 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
