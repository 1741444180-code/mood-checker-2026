'use client';

import React, { useState } from 'react';

interface TwoFactorAuthProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

type Step = 1 | 2 | 3;

export default function TwoFactorAuth({ onSuccess, onCancel }: TwoFactorAuthProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [useSms, setUseSms] = useState(false);

  const nextStep = (step: Step) => {
    setCurrentStep(step);
  };

  const prevStep = (step: Step) => {
    setCurrentStep(step);
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      alert('请输入 6 位验证码');
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch('/api/security/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setBackupCodes(data.backupCodes || []);
        nextStep(3);
      } else {
        alert('验证码错误，请重试');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      alert('验证失败，请重试');
    } finally {
      setVerifying(false);
    }
  };

  const enable2FA = async () => {
    try {
      const response = await fetch('/api/security/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        if (onSuccess) onSuccess();
        alert('✅ 双因素认证已启用！');
      }
    } catch (error) {
      console.error('Failed to enable 2FA:', error);
    }
  };

  const handleSmsSetup = async () => {
    setUseSms(true);
    alert('短信验证功能开发中...');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">双因素认证</h2>
        <p className="text-gray-600">为您的账号增加一层安全保障</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition ${
                currentStep === step
                  ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white'
                  : currentStep > step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {currentStep > step ? '✓' : step}
            </div>
            <span className={`text-xs mt-2 ${currentStep === step ? 'text-purple-600 font-semibold' : 'text-gray-400'}`}>
              {step === 1 ? '选择方式' : step === 2 ? '验证绑定' : '完成设置'}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Choose Method */}
      {currentStep === 1 && (
        <div className="animate-fadeIn">
          <div className="bg-blue-50 p-4 rounded-xl mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">📱 推荐使用认证器应用</h3>
            <p className="text-gray-600 text-sm mb-2">使用以下任意认证器应用扫描二维码：</p>
            <ul className="text-gray-600 text-sm list-disc list-inside space-y-1">
              <li>Google Authenticator</li>
              <li>Microsoft Authenticator</li>
              <li>Authy</li>
            </ul>
          </div>

          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6">
            <div className="text-center">
              <div className="text-6xl mb-4">📱</div>
              <p className="text-gray-600">扫描二维码</p>
              <p className="text-gray-400 text-sm mt-1">或手动输入密钥</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl mb-6">
            <p className="text-gray-700">
              <strong>密钥：</strong>
              <code className="ml-2 font-mono bg-white px-2 py-1 rounded">JBSWY3DPEHPK3PXP</code>
            </p>
          </div>

          <button
            onClick={() => nextStep(2)}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            我已扫描二维码
          </button>

          <button
            onClick={handleSmsSetup}
            className="w-full py-3 mt-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            使用短信验证
          </button>
        </div>
      )}

      {/* Step 2: Verify Code */}
      {currentStep === 2 && (
        <div className="animate-fadeIn">
          <div className="bg-blue-50 p-4 rounded-xl mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">🔢 输入验证码</h3>
            <p className="text-gray-600 text-sm">打开您的认证器应用，输入显示的 6 位验证码</p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">6 位验证码</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
              onKeyUp={(e) => verificationCode.length === 6 && verifyCode()}
              maxLength={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-2xl tracking-widest focus:outline-none focus:border-purple-500"
              placeholder="000000"
              inputMode="numeric"
            />
          </div>

          <button
            onClick={verifyCode}
            disabled={verifying || verificationCode.length !== 6}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verifying ? '验证中...' : '验证并继续'}
          </button>

          <button
            onClick={() => prevStep(1)}
            className="w-full py-3 mt-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            返回上一步
          </button>
        </div>
      )}

      {/* Step 3: Success */}
      {currentStep === 3 && (
        <div className="animate-fadeIn text-center">
          <div className="text-8xl mb-6 animate-bounce">✅</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">设置成功！</h3>
          <p className="text-gray-600 mb-6">您的账号已启用双因素认证</p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-yellow-800 mb-3 text-left">🔑 备份验证码（请妥善保管）</h4>
            <div className="grid grid-cols-2 gap-2 text-yellow-700 font-mono text-sm">
              {backupCodes.length > 0 ? (
                backupCodes.map((code, index) => (
                  <div key={index}>{code}</div>
                ))
              ) : (
                <>
                  <div>1234-5678</div>
                  <div>2345-6789</div>
                  <div>3456-7890</div>
                  <div>4567-8901</div>
                  <div>5678-9012</div>
                  <div>6789-0123</div>
                  <div>7890-1234</div>
                  <div>8901-2345</div>
                </>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-xl mb-6 text-left">
            <p className="text-yellow-800 text-sm">
              ⚠️ 请将备份验证码保存在安全的地方。如果您无法使用认证器，可以使用这些代码登录。
            </p>
          </div>

          <button
            onClick={enable2FA}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            完成
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
