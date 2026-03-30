'use client';

import React from 'react';

interface NotificationBadgeProps {
  count?: number;
  showDot?: boolean;
  maxCount?: number;
}

export const NotificationBadge = ({ 
  count = 0, 
  showDot = false, 
  maxCount = 99 
}: NotificationBadgeProps) => {
  const displayCount = count > maxCount ? `${maxCount}+` : count;

  return (
    <div className="relative inline-block">
      <div className="absolute -top-2 -right-2 transform translate-x-1/2 -translate-y-1/2">
        {showDot ? (
          <span className="absolute h-2 w-2 bg-red-500 rounded-full"></span>
        ) : count > 0 ? (
          <span className="flex items-center justify-center h-5 min-w-5 px-1 bg-red-500 text-white text-xs rounded-full">
            {displayCount}
          </span>
        ) : null}
      </div>
    </div>
  );
};