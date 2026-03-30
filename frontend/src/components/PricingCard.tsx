'use client';

import { useRouter } from 'next/navigation';

interface PricingCardProps {
  level: {
    id: string;
    name: string;
    price: number;
    period: string;
    features: string[];
    popular?: boolean;
  };
  isCurrent: boolean;
  onUpgrade: () => void;
}

export default function PricingCard({ level, isCurrent, onUpgrade }: PricingCardProps) {
  const router = useRouter();

  const getCardStyle = () => {
    if (level.popular) {
      return 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white transform md:-translate-y-4';
    }
    return 'bg-white text-gray-800';
  };

  const getButtonStyle = () => {
    if (isCurrent) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed';
    }
    if (level.popular) {
      return 'bg-white text-[#667eea] hover:bg-gray-100';
    }
    return 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:opacity-90';
  };

  return (
    <div className={`rounded-3xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl relative ${getCardStyle()}`}>
      {level.popular && (
        <div className="absolute top-4 right-4 bg-yellow-400 text-gray-800 px-4 py-1 rounded-full text-sm font-semibold transform rotate-12">
          最受欢迎
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{level.name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-bold">¥{level.price}</span>
          <span className={`text-sm ${level.popular ? 'text-white/80' : 'text-gray-500'}`}>
            /{level.period}
          </span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {level.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className={`text-lg ${level.popular ? 'text-green-300' : 'text-green-500'}`}>✓</span>
            <span className={level.popular ? 'text-white/90' : 'text-gray-600'}>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onUpgrade}
        disabled={isCurrent}
        className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${getButtonStyle()}`}
      >
        {isCurrent ? '当前等级' : '立即升级'}
      </button>

      {!isCurrent && level.popular && (
        <p className="text-center text-sm mt-4 text-white/80">
          限时优惠 · 7 天无理由退款
        </p>
      )}
    </div>
  );
}
