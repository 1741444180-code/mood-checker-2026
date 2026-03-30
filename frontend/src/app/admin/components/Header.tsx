'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const Header = ({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center">
        <button
          className="mr-4 text-gray-500 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-800">后台管理</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            ></path>
          </svg>
        </button>
        
        <div className="relative">
          <button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-800 font-medium text-sm">A</span>
            </div>
          </button>
          
          <div className="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                role="menuitem"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;