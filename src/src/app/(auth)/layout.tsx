import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 箮单的头部，包含主题切换 */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">心情打卡</h1>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
    </div>
  )
}