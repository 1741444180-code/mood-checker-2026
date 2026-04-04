'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import BottomNav from '@/components/layout/BottomNav';

const faqsZh = [
  { q: '如何注册账号？', a: '点击首页右上角的"免费注册"按钮，填写用户名、邮箱和密码即可完成注册。' },
  { q: '如何记录心情？', a: '登录后在首页选择当前心情，填写备注后点击提交即可完成打卡。' },
  { q: '如何查看历史数据？', a: '在个人中心可以查看心情日历和统计数据。' },
  { q: '如何添加好友？', a: '进入好友页面，搜索用户名即可发送好友请求。' },
  { q: '数据安全吗？', a: '我们采用加密存储，您的心情数据只有您自己可以查看。' },
];

const faqsEn = [
  { q: 'How to sign up?', a: 'Click the "Sign Up" button on the homepage, fill in username, email, and password.' },
  { q: 'How to record mood?', a: 'After login, select your mood on the homepage, add notes, and submit.' },
  { q: 'How to view history?', a: 'Go to your profile to see the mood calendar and statistics.' },
  { q: 'How to add friends?', a: 'Go to Friends page and search by username to send a friend request.' },
  { q: 'Is my data safe?', a: 'We use encrypted storage. Your mood data is only visible to you.' },
];

export default function HelpPage() {
  const { t, language } = useTranslation();
  const faqs = language === 'zh-CN' ? faqsZh : faqsEn;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 pb-20">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-lg font-bold text-purple-600">← {t('settings.backToHome')}</Link>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">{t('help.title')}</h1>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="font-medium">{faq.q}</span>
                <span className={`transform transition ${openIndex === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4 text-gray-600 text-sm">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
