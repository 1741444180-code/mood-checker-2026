'use client'

import { useState } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6 sm:space-x-10">
          <Link href="/" className="text-lg sm:text-xl font-bold">
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
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/login">登录</Link>
          </Button>
          {/* 移动端汉堡菜单 */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="菜单"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>
      
      {/* 移动端展开菜单 */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-2 space-y-1 bg-background">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`block py-2.5 px-3 rounded-md text-sm ${
                pathname === item.href
                  ? 'text-primary font-medium bg-primary/5'
                  : 'text-muted-foreground'
              } hover:text-primary hover:bg-primary/5 transition-colors`}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="block py-2.5 px-3 rounded-md text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors sm:hidden"
          >
            登录
          </Link>
        </div>
      )}
    </header>
  )
}
