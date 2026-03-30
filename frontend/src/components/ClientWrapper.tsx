'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import '../i18n/config'; // 引入i18n配置

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    // 在客户端初始化i18n
    import('../i18n/config');
    
    // 检查URL参数中的语言设置
    const langParam = searchParams?.get('lang');
    if (langParam && typeof window !== 'undefined') {
      const validLangs = ['zh-CN', 'en-US'];
      if (validLangs.includes(langParam)) {
        localStorage.setItem('language', langParam);
        window.location.search = window.location.search.replace(
          /[?&]lang=[^&]*/, 
          ''
        ).replace(/^&/, '?');
      }
    }
  }, [searchParams]);

  return <>{children}</>;
}