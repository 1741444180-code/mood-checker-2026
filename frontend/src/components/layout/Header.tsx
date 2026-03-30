'use client';

import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            心情打卡
          </Link>
          <nav className="flex space-x-4">
            <Link href="/checkin" className="text-gray-600 hover:text-gray-900">
              打卡
            </Link>
            <Link href="/calendar" className="text-gray-600 hover:text-gray-900">
              日历
            </Link>
            <Link href="/stats" className="text-gray-600 hover:text-gray-900">
              统计
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">
              我的
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
