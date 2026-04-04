'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import type { SupportedLanguage } from '@/i18n/messages';

const languageLabels: Record<SupportedLanguage, string> = {
  'zh-CN': '中文',
  'en-US': 'EN',
};

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    const nextLang: SupportedLanguage = language === 'zh-CN' ? 'en-US' : 'zh-CN';
    setLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
      aria-label="Switch language"
      title={language === 'zh-CN' ? 'Switch to English' : '切换到中文'}
    >
      <span className="text-base">🌐</span>
      <span>{languageLabels[language]}</span>
    </button>
  );
}
