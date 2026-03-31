'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">设置</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>通知设置</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">每日提醒</div>
                  <div className="text-sm text-muted-foreground">
                    每天晚上 8 点提醒你打卡
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">心情周报</div>
                  <div className="text-sm text-muted-foreground">
                    每周日发送你的心情周报
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>隐私设置</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">公开心情</div>
                  <div className="text-sm text-muted-foreground">
                    允许他人查看你的心情记录
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">显示统计</div>
                  <div className="text-sm text-muted-foreground">
                    在个人主页显示你的统计信息
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>💡 更多设置功能开发中，敬请期待</p>
        </div>
      </div>
    </div>
  );
}
