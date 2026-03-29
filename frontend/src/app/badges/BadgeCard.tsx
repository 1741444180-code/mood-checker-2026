import React from 'react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface BadgeCardProps {
  badge: Badge;
  onClick: () => void;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onClick }) => {
  // 根据稀有度确定边框颜色
  const getRarityColor = () => {
    switch (badge.rarity) {
      case 'common':
        return 'border-gray-300';
      case 'rare':
        return 'border-blue-300';
      case 'epic':
        return 'border-purple-400';
      case 'legendary':
        return 'border-yellow-400';
      default:
        return 'border-gray-300';
    }
  };

  // 根据稀有度确定背景色
  const getRarityBg = () => {
    switch (badge.rarity) {
      case 'common':
        return 'bg-white';
      case 'rare':
        return 'bg-blue-50';
      case 'epic':
        return 'bg-purple-50';
      case 'legendary':
        return 'bg-yellow-50';
      default:
        return 'bg-white';
    }
  };

  return (
    <div 
      className={`rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg ${getRarityBg()} ${getRarityColor()} border-2 ${
        badge.unlocked ? '' : 'opacity-60 grayscale'
      }`}
      onClick={onClick}
    >
      <div className="p-4 flex flex-col items-center">
        <div className="text-4xl mb-2">{badge.icon}</div>
        <h3 className="font-semibold text-center text-gray-800 truncate w-full">{badge.name}</h3>
        {!badge.unlocked && (
          <div className="mt-2 text-xs text-gray-500 italic">Locked</div>
        )}
        {badge.unlocked && badge.unlockDate && (
          <div className="mt-1 text-xs text-gray-500">
            {new Date(badge.unlockDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;