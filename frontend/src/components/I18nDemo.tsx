// 示例组件：展示如何在组件中使用国际化
'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function I18nDemo() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t('internationalization_demo')}</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('language_switching')}</h2>
        <div className="flex space-x-2">
          <Button onClick={() => changeLanguage('zh-CN')}>
            {t('chinese')}
          </Button>
          <Button onClick={() => changeLanguage('en-US')}>
            {t('english')}
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('common_translations')}</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t('welcome')} - {t('welcome')}</li>
          <li>{t('home')} - {t('home')}</li>
          <li>{t('about')} - {t('about')}</li>
          <li>{t('contact')} - {t('contact')}</li>
          <li>{t('settings')} - {t('settings')}</li>
        </ul>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">{t('navigation_example')}</h2>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/">{t('home')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/about">{t('about')}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/contact">{t('contact')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}