'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className={`bg-white shadow-md fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-lg' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">{t('message_center')}</span>
            </Link>
          </div>

          {/* PC端导航 */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/mood-tracker" className={`${
              isActive('/mood-tracker') 
                ? 'text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-blue-500'
            } transition-colors`}>
              {t('mood_tracking')}
            </Link>
            <Link href="/diary" className={`${
              isActive('/diary') 
                ? 'text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-blue-500'
            } transition-colors`}>
              {t('mood_diary')}
            </Link>
            <Link href="/community" className={`${
              isActive('/community') 
                ? 'text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-blue-500'
            } transition-colors`}>
              {t('mood_community')}
            </Link>
            <Link href="/calendar" className={`${
              isActive('/calendar') 
                ? 'text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-blue-500'
            } transition-colors`}>
              {t('calendar')}
            </Link>
            <Link href="/analytics" className={`${
              isActive('/analytics') 
                ? 'text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-blue-500'
            } transition-colors`}>
              {t('analytics')}
            </Link>
            
            {/* 语言切换器 */}
            <div className="ml-4">
              <LanguageSwitcher />
            </div>
          </div>

          {/* 移动端菜单按钮和语言切换器 */}
          <div className="md:hidden flex items-center space-x-3">
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-500 focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-label="Toggle main menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-2 bg-white border-t">
            <Link href="/mood-tracker" 
              className={`block px-3 py-3 rounded-md text-base font-medium ${
                isActive('/mood-tracker')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('mood_tracking')}
            </Link>
            <Link href="/diary" 
              className={`block px-3 py-3 rounded-md text-base font-medium ${
                isActive('/diary')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('mood_diary')}
            </Link>
            <Link href="/community" 
              className={`block px-3 py-3 rounded-md text-base font-medium ${
                isActive('/community')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('mood_community')}
            </Link>
            <Link href="/calendar" 
              className={`block px-3 py-3 rounded-md text-base font-medium ${
                isActive('/calendar')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('calendar')}
            </Link>
            <Link href="/analytics" 
              className={`block px-3 py-3 rounded-md text-base font-medium ${
                isActive('/analytics')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('analytics')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;