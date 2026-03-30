'use client';

import React from 'react';
import Link from 'next/link';

export default function PricingPage() {
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
      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-4 text-gray-900">
          简单透明的定价
        </h1>
        <p className="text-xl text-center text-gray-600 mb-16">
          选择适合你的计划，开始心情管理之旅
        </p>

        {/* 定价卡片 */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* 免费版 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-2">免费版</h3>
            <p className="text-gray-600 mb-6">适合个人用户</p>
            <div className="mb-6">
              <span className="text-5xl font-bold">¥0</span>
              <span className="text-gray-600">/月</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">每日心情打卡</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">基础数据统计</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">心情日历查看</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">最多 30 条历史记录</span>
              </li>
            </ul>
            <Link
              href="/auth/register"
              className="block w-full bg-gray-100 text-gray-800 text-center py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >
              免费注册
            </Link>
          </div>

          {/* 专业版 */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 shadow-xl text-white relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
              最受欢迎
            </div>
            <h3 className="text-2xl font-bold mb-2">专业版</h3>
            <p className="text-purple-100 mb-6">适合深度用户</p>
            <div className="mb-6">
              <span className="text-5xl font-bold">¥19</span>
              <span className="text-purple-100">/月</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-yellow-300 mr-3">✓</span>
                <span>包含免费版所有功能</span>
              </li>
              <li className="flex items-center">
                <span className="text-yellow-300 mr-3">✓</span>
                <span>无限历史记录</span>
              </li>
              <li className="flex items-center">
                <span className="text-yellow-300 mr-3">✓</span>
                <span>高级数据分析</span>
              </li>
              <li className="flex items-center">
                <span className="text-yellow-300 mr-3">✓</span>
                <span>自定义心情上传</span>
              </li>
              <li className="flex items-center">
                <span className="text-yellow-300 mr-3">✓</span>
                <span>智能提醒功能</span>
              </li>
              <li className="flex items-center">
                <span className="text-yellow-300 mr-3">✓</span>
                <span>数据导出功能</span>
              </li>
            </ul>
            <Link
              href="/auth/register"
              className="block w-full bg-white text-purple-600 text-center py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              立即试用
            </Link>
          </div>

          {/* 企业版 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-2">企业版</h3>
            <p className="text-gray-600 mb-6">适合团队使用</p>
            <div className="mb-6">
              <span className="text-5xl font-bold">¥99</span>
              <span className="text-gray-600">/月</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">包含专业版所有功能</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">团队管理功能</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">API 访问权限</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">专属客服支持</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">定制化部署</span>
              </li>
            </ul>
            <Link
              href="/contact"
              className="block w-full bg-gray-100 text-gray-800 text-center py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >
              联系销售
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">常见问题</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="font-semibold mb-2">可以随时取消订阅吗？</h4>
              <p className="text-gray-600">当然可以！你可以随时取消订阅，已支付的费用不会退还，但你可以继续使用到当前周期结束。</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="font-semibold mb-2">支持退款吗？</h4>
              <p className="text-gray-600">我们提供 7 天无理由退款保证。如果你不满意，可以在购买后 7 天内申请全额退款。</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="font-semibold mb-2">学生有优惠吗？</h4>
              <p className="text-gray-600">是的！学生用户可以享受专业版 50% 的优惠。请联系客服验证学生身份。</p>
            </div>
          </div>
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
