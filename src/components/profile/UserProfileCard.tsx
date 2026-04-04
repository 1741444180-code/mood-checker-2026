'use client';

import React from 'react';

interface UserProfileCardProps {
  user?: {
    username?: string;
    email?: string;
    avatar?: string;
    bio?: string;
    joinDate?: string;
  };
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
        <span className="text-3xl">👤</span>
      </div>
      <h2 className="text-xl font-bold">{user?.username || '用户'}</h2>
      <p className="text-gray-500 text-sm mt-1">{user?.email || ''}</p>
      {user?.bio && <p className="text-gray-600 mt-2 text-sm">{user.bio}</p>}
      {user?.joinDate && (
        <p className="text-xs text-gray-400 mt-2">加入于 {user.joinDate}</p>
      )}
    </div>
  );
}
