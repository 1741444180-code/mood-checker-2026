'use client';

import { useState } from 'react';
import { createPayment } from '@/utils/payment';

interface PaymentFormProps {
  levelId: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

type PaymentMethod = 'wechat' | 'alipay' | 'bank';

export default function PaymentForm({ levelId, amount, onSuccess, onError }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wechat');
  const [phone, setPhone] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const result = await createPayment({
        levelId,
        amount,
        method: selectedMethod,
        phone,
      });

      if (result.success) {
        onSuccess?.();
      } else {
        onError?.(new Error(result.error || '支付失败'));
      }
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Methods */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">选择支付方式</h3>
        
        <div
          onClick={() => setSelectedMethod('wechat')}
          className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
            selectedMethod === 'wechat'
              ? 'border-[#667eea] bg-purple-50'
              : 'border-gray-200 hover:border-[#667eea]'
          }`}
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selectedMethod === 'wechat' ? 'border-[#667eea]' : 'border-gray-300'
          }`}>
            {selectedMethod === 'wechat' && <div className="w-2.5 h-2.5 rounded-full bg-[#667eea]" />}
          </div>
          <div className="text-2xl">💚</div>
          <div>
            <div className="font-semibold">微信支付</div>
            <div className="text-sm text-gray-500">推荐使用</div>
          </div>
        </div>

        <div
          onClick={() => setSelectedMethod('alipay')}
          className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
            selectedMethod === 'alipay'
              ? 'border-[#667eea] bg-purple-50'
              : 'border-gray-200 hover:border-[#667eea]'
          }`}
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selectedMethod === 'alipay' ? 'border-[#667eea]' : 'border-gray-300'
          }`}>
            {selectedMethod === 'alipay' && <div className="w-2.5 h-2.5 rounded-full bg-[#667eea]" />}
          </div>
          <div className="text-2xl">💙</div>
          <div>
            <div className="font-semibold">支付宝</div>
            <div className="text-sm text-gray-500">安全可靠</div>
          </div>
        </div>

        <div
          onClick={() => setSelectedMethod('bank')}
          className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
            selectedMethod === 'bank'
              ? 'border-[#667eea] bg-purple-50'
              : 'border-gray-200 hover:border-[#667eea]'
          }`}
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selectedMethod === 'bank' ? 'border-[#667eea]' : 'border-gray-300'
          }`}>
            {selectedMethod === 'bank' && <div className="w-2.5 h-2.5 rounded-full bg-[#667eea]" />}
          </div>
          <div className="text-2xl">💳</div>
          <div>
            <div className="font-semibold">银行卡</div>
            <div className="text-sm text-gray-500">支持主要银行</div>
          </div>
        </div>
      </div>

      {/* Phone Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          手机号码
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="用于接收支付凭证"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#667eea] focus:outline-none transition-colors"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={processing}
        className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
          processing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90'
        }`}
      >
        {processing ? '处理中...' : `立即支付 ¥${amount}`}
      </button>

      {/* Security Notice */}
      <p className="text-center text-sm text-gray-500">
        🔒 支付安全加密保护 · 7 天无理由退款
      </p>
    </form>
  );
}
