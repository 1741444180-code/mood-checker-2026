'use client';

import React from 'react';
import BadgeCard from './BadgeCard';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface BadgeWallProps {
  badges: Badge[];
  onBadgeClick: (badge: Badge) => void;
}

const BadgeWall: React.FC<BadgeWallProps> = ({ badges, onBadgeClick }) => {
  // 根据解锁状态对徽章进行分组
  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);

  return (
    <div className="space-y-12">
      {/* 已解锁徽章部分 */}
      {unlockedBadges.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">🏆</span> Unlocked Badges
            <span className="ml-2 text-sm font-normal bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {unlockedBadges.length} completed
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {unlockedBadges.map((badge) => (
              <BadgeCard 
                key={badge.id} 
                badge={badge} 
                onClick={() => onBadgeClick(badge)} 
              />
            ))}
          </div>
        </section>
      )}

      {/* 锁定徽章部分 */}
      {lockedBadges.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">🔒</span> Locked Badges
            <span className="ml-2 text-sm font-normal bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
              {lockedBadges.length} to unlock
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {lockedBadges.map((badge) => (
              <BadgeCard 
                key={badge.id} 
                badge={badge} 
                onClick={() => onBadgeClick(badge)} 
              />
            ))}
          </div>
        </section>
      )}

      {/* 如果没有徽章 */}
      {badges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🏅</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No badges yet</h3>
          <p className="text-gray-500">Complete challenges to earn your first badge!</p>
        </div>
      )}
    </div>
  );
};

export default BadgeWall;