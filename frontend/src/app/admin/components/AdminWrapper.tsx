'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AdminWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const AdminWrapper: React.FC<AdminWrapperProps> = ({ children, title, description }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="lg:pl-64">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {(title || description) && (
              <div className="mb-6">
                {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
                {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminWrapper;
