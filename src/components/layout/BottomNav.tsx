'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BarChart3, User, Settings } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: '/', icon: Home, label: t('nav.home') },
    { href: '/stats', icon: BarChart3, label: t('nav.stats') },
    { href: '/profile', icon: User, label: t('nav.profile') },
    { href: '/settings', icon: Settings, label: t('nav.settings') },
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
