'use client';

import React from 'react';
import Link from 'next/link';

export default function TosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              心情打卡
            </Link>
            <div className="flex space-x-6">
              <Link href="/features" className="text-gray-700 hover:text-purple-600">功能</Link>
              <Link href="/pricing" className="text-gray-700 hover:text-purple-600">定价</Link>
              <Link href="/help" className="text-gray-700 hover:text-purple-600">帮助</Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-purple-600">登录</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">服务条款</h1>
        <p className="text-gray-600 mb-8">最后更新日期：2026 年 3 月 31 日</p>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. 接受条款</h2>
              <p className="text-gray-700 mb-4">
                欢迎使用心情打卡服务。通过访问或使用本网站，您同意受这些服务条款的约束。如果您不同意这些条款，请不要使用我们的服务。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. 服务说明</h2>
              <p className="text-gray-700 mb-4">
                心情打卡是一个帮助用户记录和管理日常心情的在线平台。我们提供以下服务：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>每日心情记录功能</li>
                <li>心情数据统计和可视化</li>
                <li>心情日历查看</li>
                <li>自定义心情上传</li>
                <li>社交互动功能</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. 用户账户</h2>
              <p className="text-gray-700 mb-4">
                3.1 您需要注册账户才能使用部分功能。注册时，您应提供真实、准确的信息。
              </p>
              <p className="text-gray-700 mb-4">
                3.2 您有责任保护账户安全，不得将账户借给他人使用。
              </p>
              <p className="text-gray-700 mb-4">
                3.3 如发现账户被盗用，请立即联系我们。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. 用户行为规范</h2>
              <p className="text-gray-700 mb-4">
                您同意不从事以下行为：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>上传违法、色情、暴力或侵权内容</li>
                <li>干扰或破坏服务正常运行</li>
                <li>尝试未经授权访问系统</li>
                <li>使用自动化程序访问服务</li>
                <li>侵犯他人隐私或知识产权</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. 隐私保护</h2>
              <p className="text-gray-700 mb-4">
                我们重视您的隐私。关于我们如何收集、使用和保护您的个人信息，请参阅我们的
                <Link href="/privacy" className="text-purple-600 hover:underline"> 隐私政策</Link>。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. 知识产权</h2>
              <p className="text-gray-700 mb-4">
                本网站的所有内容（包括但不限于文字、图像、代码、设计）均归心情打卡所有，受著作权法保护。未经授权，不得转载或使用。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. 免责声明</h2>
              <p className="text-gray-700 mb-4">
                7.1 本服务按"现状"提供，不保证完全无错误或中断。
              </p>
              <p className="text-gray-700 mb-4">
                7.2 心情打卡提供的信息仅供参考，不构成专业心理建议。如有心理健康问题，请咨询专业人士。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. 服务修改和终止</h2>
              <p className="text-gray-700 mb-4">
                我们保留随时修改或终止服务的权利，无需提前通知。对于因服务变更或终止造成的损失，我们不承担责任。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. 条款变更</h2>
              <p className="text-gray-700 mb-4">
                我们可能会不时更新这些条款。更新后的条款将在本网站发布，继续使用服务即表示您接受新条款。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">10. 联系我们</h2>
              <p className="text-gray-700 mb-4">
                如对这些条款有任何疑问，请通过以下方式联系我们：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>邮箱：support@moodchecker.com</li>
                <li>地址：上海市浦东新区张江高科技园区</li>
              </ul>
            </section>
          </div>
        </div>

        {/* 同意按钮 */}
        <div className="mt-8 text-center">
          <Link
            href="/auth/register"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow"
          >
            我同意并接受条款
          </Link>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white">功能</Link></li>
                <li><Link href="/pricing" className="hover:text-white">定价</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">支持</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">帮助中心</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">法律</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">隐私政策</Link></li>
                <li><Link href="/tos" className="hover:text-white">服务条款</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">联系</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white">联系我们</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 心情打卡。All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
