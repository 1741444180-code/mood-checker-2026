'use client';

import React from 'react';
import Link from 'next/link';

export default function FeaturesPage() {
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
          功能特性
        </h1>
        <p className="text-xl text-center text-gray-600 mb-16">
          全方位的心情管理和数据分析工具
        </p>

        {/* 功能卡片 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 功能 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">每日心情打卡</h3>
            <p className="text-gray-600">
              简单快捷记录每天的心情状态，支持 7 种标准心情和自定义心情。
            </p>
          </div>

          {/* 功能 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-3xl">📈</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">数据统计分析</h3>
            <p className="text-gray-600">
              可视化图表展示心情趋势，帮助你更好地了解情绪变化规律。
            </p>
          </div>

          {/* 功能 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-3xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">心情日历</h3>
            <p className="text-gray-600">
              以日历形式查看历史心情记录，快速回顾过去的情绪状态。
            </p>
          </div>

          {/* 功能 4 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-3xl">🏆</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">徽章系统</h3>
            <p className="text-gray-600">
              完成特定成就解锁专属徽章，让心情管理更有趣味性。
            </p>
          </div>

          {/* 功能 5 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">社交互动</h3>
            <p className="text-gray-600">
              添加好友、分享心情，与朋友一起关注心理健康。
            </p>
          </div>

          {/* 功能 6 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-3xl">🔔</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">智能提醒</h3>
            <p className="text-gray-600">
              自定义提醒时间，帮助你养成每天记录心情的好习惯。
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/auth/register"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-shadow"
          >
            立即开始使用
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
