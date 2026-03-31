'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-6xl mb-4">💬</div>
      <h1 className="text-2xl font-bold mb-2">功能开发中</h1>
      <p className="text-muted-foreground mb-6 text-center">
        消息功能正在紧锣密鼓地开发中，敬请期待！
      </p>
      <Link href="/">
        <Button className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Button>
      </Link>
    </div>
  );
}
