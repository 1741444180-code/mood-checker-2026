'use client';

import React, { useState, useEffect } from 'react';
import BadgeWall from './BadgeWall';
import BadgeDetailModal from './BadgeDetailModal';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const BadgesPage = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [loading, setLoading] = useState(true);

  // 模拟获取徽章数据
  useEffect(() => {
    // 这里应该从API获取实际的徽章数据
    const mockBadges: Badge[] = [
      {
        id: '1',
        name: 'First Steps',
        description: 'Complete your first task',
        icon: '👣',
        unlocked: true,
        unlockDate: '2023-01-15',
        rarity: 'common'
      },
      {
        id: '2',
        name: 'Quick Learner',
        description: 'Complete 10 tasks in a week',
        icon: '📚',
        unlocked: true,
        unlockDate: '2023-02-20',
        rarity: 'rare'
      },
      {
        id: '3',
        name: 'Marathon Runner',
        description: 'Complete 100 consecutive days',
        icon: '🏃‍♂️',
        unlocked: false,
        rarity: 'epic'
      },
      {
        id: '4',
        name: 'Social Butterfly',
        description: 'Connect with 50 friends',
        icon: '🦋',
        unlocked: false,
        rarity: 'rare'
      },
      {
        id: '5',
        name: 'Night Owl',
        description: 'Complete 20 tasks after midnight',
        icon: '🦉',
        unlocked: true,
        unlockDate: '2023-03-05',
        rarity: 'common'
      },
      {
        id: '6',
        name: 'Early Bird',
        description: 'Complete 20 tasks before 6 AM',
        icon: '🐦',
        unlocked: false,
        rarity: 'common'
      },
      {
        id: '7',
        name: 'Perfect Streak',
        description: 'Maintain a 30-day streak',
        icon: '🔥',
        unlocked: true,
        unlockDate: '2023-04-10',
        rarity: 'epic'
      },
      {
        id: '8',
        name: 'Helper',
        description: 'Assist other users 100 times',
        icon: '🤝',
        unlocked: false,
        rarity: 'legendary'
      }
    ];

    setTimeout(() => {
      setBadges(mockBadges);
      setLoading(false);
    }, 500);
  }, []);

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
  };

  const closeModal = () => {
    setSelectedBadge(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Achievement Badges</h1>
          <p className="text-lg text-gray-600">Showcase your accomplishments and progress</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <BadgeWall badges={badges} onBadgeClick={handleBadgeClick} />
        )}

        {selectedBadge && (
          <BadgeDetailModal badge={selectedBadge} onClose={closeModal} />
        )}
      </div>
    </div>
  );
};

export default BadgesPage;