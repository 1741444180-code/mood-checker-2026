'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import BottomNav from '@/components/layout/BottomNav';

export default function PrivacyPage() {
  const { language } = useTranslation();
  const isZh = language === 'zh-CN';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 pb-20">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-lg font-bold text-purple-600">← {isZh ? '返回首页' : 'Back to Home'}</Link>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">{isZh ? '隐私政策' : 'Privacy Policy'}</h1>
        <div className="bg-white rounded-xl shadow p-6 space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">{isZh ? '数据收集' : 'Data Collection'}</h2>
            <p>{isZh ? '我们仅收集您主动提供的心情记录数据，包括心情类型、备注文字和标签信息。' : 'We only collect mood data you actively provide, including mood type, notes, and tags.'}</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">{isZh ? '数据存储' : 'Data Storage'}</h2>
            <p>{isZh ? '所有数据采用加密存储，我们不会将您的个人数据出售或分享给第三方。' : 'All data is encrypted. We never sell or share your personal data with third parties.'}</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">{isZh ? '数据删除' : 'Data Deletion'}</h2>
            <p>{isZh ? '您可以随时在设置中删除您的账号和所有相关数据。删除操作不可恢复。' : 'You can delete your account and all data anytime in Settings. This action is irreversible.'}</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">{isZh ? '联系我们' : 'Contact Us'}</h2>
            <p>{isZh ? '如有任何隐私相关问题，请通过帮助中心联系我们。' : 'For any privacy concerns, please reach out via the Help Center.'}</p>
          </section>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
