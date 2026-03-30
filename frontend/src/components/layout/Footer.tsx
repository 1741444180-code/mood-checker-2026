'use client';

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2026 心情打卡。All rights reserved.
          </p>
          <nav className="flex space-x-4">
            <Link href="/help" className="text-gray-500 hover:text-gray-700 text-sm">
              帮助中心
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">
              隐私政策
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
