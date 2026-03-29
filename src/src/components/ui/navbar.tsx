'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'

const navItems = [
  { name: '首页', href: '/' },
  { name: '心情日历', href: '/calendar' },
  { name: '数据统计', href: '/stats' },
  { name: '个人中心', href: '/profile' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-10">
          <Link href="/" className="text-xl font-bold">
            心情打卡
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                } hover:text-primary transition-colors`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="outline" asChild>
            <Link href="/login">登录</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}