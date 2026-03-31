import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-8 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">心情打卡</h3>
            <p className="text-sm text-muted-foreground">
              记录每日心情，追踪情绪变化，更好地了解自己。
            </p>
          </div>
          
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide">产品</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block py-1">首页</Link></li>
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block py-1">仪表板</Link></li>
              <li><Link href="/history" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block py-1">历史记录</Link></li>
              <li><Link href="/analysis" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block py-1">数据分析</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide">支持</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block py-1">帮助中心</Link></li>
              <li><Link href="/feedback" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block py-1">反馈</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block py-1">隐私政策</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block py-1">服务条款</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide">关注我们</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block py-1">微博</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block py-1">微信</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block py-1">知乎</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} 心情打卡网站. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
}