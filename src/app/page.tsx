'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const features = [
  { icon: '😊', title: '每日心情记录', titleEn: 'Daily Mood Tracking', desc: '7 种标准心情 + 自定义心情，简单快捷记录每天的情绪状态', descEn: '7 standard moods + custom moods, quick and easy daily tracking', color: 'from-purple-100 to-purple-200' },
  { icon: '📈', title: '数据分析', titleEn: 'Data Analysis', desc: '可视化图表展示心情趋势，发现情绪变化的规律和周期', descEn: 'Visualize mood trends and discover emotional patterns', color: 'from-indigo-100 to-indigo-200' },
  { icon: '📅', title: '心情日历', titleEn: 'Mood Calendar', desc: '以日历形式查看历史心情，快速回顾过去的情绪状态', descEn: 'Calendar view of mood history for quick review', color: 'from-pink-100 to-pink-200' },
  { icon: '👥', title: '好友互动', titleEn: 'Social Features', desc: '添加好友、分享心情，与朋友一起关注心理健康', descEn: 'Add friends, share moods, care about mental health together', color: 'from-purple-100 to-purple-200' },
  { icon: '🏆', title: '徽章系统', titleEn: 'Badge System', desc: '完成成就解锁专属徽章，让心情管理更有趣味性', descEn: 'Unlock badges by completing achievements', color: 'from-indigo-100 to-indigo-200' },
  { icon: '💡', title: '智能洞察', titleEn: 'Smart Insights', desc: 'AI 分析心情数据，提供个性化的心理健康建议', descEn: 'AI-powered mood analysis with personalized suggestions', color: 'from-pink-100 to-pink-200' },
];

export default function HomePage() {
  const { language } = useTranslation();
  const isZh = language === 'zh-CN';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
      {/* 导航栏 */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">😊</span>
              <span className="text-purple-600 font-bold text-lg sm:text-xl">{isZh ? '心情打卡' : 'Mood Check-in'}</span>
            </Link>
            <div className="hidden sm:flex items-center space-x-4">
              <Link href="/help" className="text-gray-600 hover:text-purple-600 transition-colors">
                {isZh ? '帮助中心' : 'Help'}
              </Link>
              <LanguageSwitcher />
              <Link href="/auth/login" className="text-gray-600 hover:text-purple-600 transition-colors">
                {isZh ? '登录' : 'Log In'}
              </Link>
              <Link href="/auth/register" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105">
                {isZh ? '免费注册' : 'Sign Up Free'}
              </Link>
            </div>
            <div className="flex sm:hidden items-center space-x-2">
              <LanguageSwitcher />
              <Link href="/auth/login" className="text-purple-600 text-sm font-medium">{isZh ? '登录' : 'Log In'}</Link>
              <Link href="/auth/register" className="bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-medium">{isZh ? '注册' : 'Sign Up'}</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            {isZh ? '记录每一天的心情' : 'Track Your Daily Mood'}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-10">
            {isZh ? '追踪情绪变化，发现内心规律，成为更好的自己' : 'Discover emotional patterns and become a better you'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link href="/auth/register" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 sm:px-10 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:shadow-xl transition-all hover:scale-105 text-center">
              {isZh ? '开始记录心情' : 'Start Tracking'}
            </Link>
            <Link href="/auth/login" className="bg-white text-purple-600 px-6 py-3 sm:px-10 sm:py-4 rounded-full text-base sm:text-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-all text-center">
              {isZh ? '立即登录' : 'Log In'}
            </Link>
          </div>
        </div>
      </section>

      {/* 功能介绍 */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 text-gray-900">
            {isZh ? '为什么选择心情打卡？' : 'Why Mood Check-in?'}
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12">
            {isZh ? '全方位的情绪管理工具，帮助您更好地了解自己' : 'A comprehensive emotional management tool'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-6 sm:p-8 text-center rounded-2xl shadow hover:shadow-xl transition-all hover:-translate-y-1">
                <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">{f.icon}</span>
                </div>
                <h3 className="font-semibold mb-2">{isZh ? f.title : f.titleEn}</h3>
                <p className="text-gray-600 text-sm">{isZh ? f.desc : f.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-16 md:py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-3xl mx-auto text-center text-white px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            {isZh ? '开始您的心情管理之旅' : 'Start Your Mood Journey'}
          </h2>
          <p className="mb-6 sm:mb-10 text-purple-100">
            {isZh ? '加入 10 万+ 用户，一起关注心理健康' : 'Join 100K+ users caring about mental health'}
          </p>
          <Link href="/auth/register" className="inline-block bg-white text-purple-600 px-8 py-3 sm:px-12 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:shadow-xl transition-all hover:scale-105">
            {isZh ? '免费开始使用' : 'Get Started Free'}
          </Link>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-white font-semibold mb-3">{isZh ? '心情打卡' : 'Mood Check-in'}</h4>
              <p className="text-sm">{isZh ? '记录每一天的心情，成为更好的自己' : 'Track your mood, become a better you'}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">{isZh ? '功能' : 'Features'}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/stats" className="hover:text-white transition-colors">{isZh ? '数据统计' : 'Statistics'}</Link></li>
                <li><Link href="/calendar" className="hover:text-white transition-colors">{isZh ? '心情日历' : 'Calendar'}</Link></li>
                <li><Link href="/friends" className="hover:text-white transition-colors">{isZh ? '好友' : 'Friends'}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">{isZh ? '支持' : 'Support'}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="hover:text-white transition-colors">{isZh ? '帮助中心' : 'Help Center'}</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">{isZh ? '隐私政策' : 'Privacy'}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">{isZh ? '账户' : 'Account'}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/auth/login" className="hover:text-white transition-colors">{isZh ? '登录' : 'Log In'}</Link></li>
                <li><Link href="/auth/register" className="hover:text-white transition-colors">{isZh ? '注册' : 'Sign Up'}</Link></li>
                <li><Link href="/settings" className="hover:text-white transition-colors">{isZh ? '设置' : 'Settings'}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2026 {isZh ? '心情打卡' : 'Mood Check-in'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
