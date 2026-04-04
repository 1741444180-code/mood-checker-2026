'use client';

import React from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-sm dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            {t('checkin.title')}
          </Link>
          <div className="flex items-center space-x-4">
            <nav className="hidden sm:flex space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                {t('nav.checkin')}
              </Link>
              <Link href="/calendar" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                {t('nav.calendar')}
              </Link>
              <Link href="/stats" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                {t('nav.stats')}
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                {t('nav.profile')}
              </Link>
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
