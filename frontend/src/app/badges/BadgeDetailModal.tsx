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

interface BadgeDetailModalProps {
  badge: Badge;
  onClose: () => void;
}

const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({ badge, onClose }) => {
  // 根据稀有度确定边框和背景色
  const getRarityColor = () => {
    switch (badge.rarity) {
      case 'common':
        return 'border-gray-300 bg-white';
      case 'rare':
        return 'border-blue-300 bg-blue-50';
      case 'epic':
        return 'border-purple-400 bg-purple-50';
      case 'legendary':
        return 'border-yellow-400 bg-yellow-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  // 获取稀有度显示名称
  const getRarityLabel = () => {
    switch (badge.rarity) {
      case 'common':
        return 'Common';
      case 'rare':
        return 'Rare';
      case 'epic':
        return 'Epic';
      case 'legendary':
        return 'Legendary';
      default:
        return '';
    }
  };

  // 获取稀有度颜色类
  const getRarityTextColor = () => {
    switch (badge.rarity) {
      case 'common':
        return 'text-gray-600';
      case 'rare':
        return 'text-blue-600';
      case 'epic':
        return 'text-purple-600';
      case 'legendary':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`relative rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${getRarityColor()}`}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10"
          aria-label="Close"
        >
          &times;
        </button>
        
        <div className="p-6 pt-8">
          <div className="flex flex-col items-center text-center">
            <div className="text-6xl mb-4">{badge.icon}</div>
            
            <div className="mb-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRarityTextColor()}`}>
                {getRarityLabel()}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{badge.name}</h2>
            
            <p className="text-gray-600 mb-6">{badge.description}</p>
            
            <div className="w-full mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${badge.unlocked ? 'text-green-600' : 'text-gray-500'}`}>
                  {badge.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
              
              {badge.unlocked && badge.unlockDate && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Date Earned:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(badge.unlockDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rarity:</span>
                <span className={`font-medium ${getRarityTextColor()}`}>
                  {getRarityLabel()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeDetailModal;