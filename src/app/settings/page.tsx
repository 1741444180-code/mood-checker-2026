'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SettingsPage() {
  const { t, language } = useTranslation();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            {t('settings.backToHome')}
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">{t('settings.title')}</h1>

        {/* 语言设置 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.language')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t('settings.currentLanguage')}</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'zh-CN' ? '简体中文' : 'English'}
                </div>
              </div>
              <LanguageSwitcher />
            </div>
          </CardContent>
        </Card>
        
        {/* 通知设置 */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{t('settings.notification')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t('settings.dailyReminder')}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'zh-CN' ? '每天晚上 8 点提醒你打卡' : 'Remind you to check in at 8 PM daily'}
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* 隐私设置 */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{t('settings.privacy')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t('privacy.publicProfile')}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'zh-CN' ? '允许他人查看你的心情记录' : 'Allow others to view your mood records'}
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t('privacy.showStats')}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'zh-CN' ? '在个人主页显示你的统计信息' : 'Show your stats on your profile'}
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 退出登录 */}
        <Card className="mt-4">
          <CardContent className="pt-6">
            <button className="w-full py-2 text-red-500 hover:text-red-600 font-medium">
              {t('settings.logout')}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
