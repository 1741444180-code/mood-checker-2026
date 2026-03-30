'use client';

interface RewardTier {
  icon: string;
  title: string;
  description: string;
  target: number;
}

interface RewardProgressProps {
  currentCount: number;
  tiers: RewardTier[];
}

export default function RewardProgress({ currentCount, tiers }: RewardProgressProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-6">🏆 邀请奖励</h3>
      
      <div className="space-y-4">
        {tiers.map((tier, index) => {
          const progress = Math.min((currentCount / tier.target) * 100, 100);
          const completed = currentCount >= tier.target;
          
          return (
            <div key={index} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              {/* Progress Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tier.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-800">{tier.title}</div>
                    <div className="text-sm text-gray-500">{tier.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-purple-600">
                    {currentCount} / {tier.target}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                    completed
                      ? 'bg-gradient-to-r from-green-400 to-green-500'
                      : 'bg-gradient-to-r from-purple-500 to-purple-600'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Status */}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {completed ? '已完成' : '进行中'}
                </div>
                {completed && (
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                    ✓ 已领取
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
