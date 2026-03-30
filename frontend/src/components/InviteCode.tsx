'use client';

import { useState } from 'react';

interface InviteCodeProps {
  code: string;
  onCopy: () => void;
  onShare: () => void;
}

export default function InviteCode({ code, onCopy, onShare }: InviteCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 mb-6 shadow-xl">
      <h2 className="text-xl font-bold text-white text-center mb-4">你的专属邀请码</h2>
      
      {/* Code Display */}
      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-4">
        <div className="text-4xl font-bold text-white text-center tracking-wider font-mono mb-2">
          {code || '------'}
        </div>
        <div className="text-purple-100 text-sm text-center">
          点击下方按钮复制邀请码
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleCopy}
          className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>{copied ? '✓' : '📋'}</span>
          <span>{copied ? '已复制' : '复制邀请码'}</span>
        </button>

        <button
          onClick={onShare}
          className="w-full bg-white hover:bg-purple-50 text-purple-600 font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
        >
          <span>🚀</span>
          <span>立即分享</span>
        </button>
      </div>
    </div>
  );
}
