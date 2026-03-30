'use client';

import React from 'react';
import Link from 'next/link';

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: '小李',
      avatar: '👨‍💼',
      role: '产品经理',
      content: '使用心情打卡 3 个月后，我更好地了解了自己的情绪波动，工作效率也提高了！',
      rating: 5
    },
    {
      name: '张女士',
      avatar: '👩‍🎨',
      role: '设计师',
      content: '界面设计很美观，操作简单。每天花 1 分钟记录心情，已经成为我的习惯了。',
      rating: 5
    },
    {
      name: '王同学',
      avatar: '👨‍🎓',
      role: '大学生',
      content: '数据分析功能很强大，能看到自己的情绪周期，对备考期间的心理调节很有帮助。',
      rating: 5
    },
    {
      name: '陈医生',
      avatar: '👩‍⚕️',
      role: '心理咨询师',
      content: '我推荐给我的来访者使用。记录心情是自我觉察的第一步，这个应用做得很好。',
      rating: 5
    },
    {
      name: '刘先生',
      avatar: '👨‍💻',
      role: '程序员',
      content: '作为一个长期加班的程序员，这个应用帮我发现了工作与心情的关系，现在更注重工作生活平衡了。',
      rating: 5
    },
    {
      name: '赵女士',
      avatar: '👩‍💼',
      role: 'HR 经理',
      content: '我们公司为员工购买了企业版，大家的心理健康意识都提高了，团队氛围更好了。',
      rating: 5
    }
  ];

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
          用户评价
        </h1>
        <p className="text-xl text-center text-gray-600 mb-16">
          听听使用心情打卡的用户怎么说
        </p>

        {/* 统计数据 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">10 万+</div>
            <div className="text-gray-600">活跃用户</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">500 万+</div>
            <div className="text-gray-600">心情记录</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">4.9</div>
            <div className="text-gray-600">用户评分</div>
          </div>
        </div>

        {/* 用户评价卡片 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">{item.avatar}</span>
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.role}</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-700 italic">"{item.content}"</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/auth/register"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-shadow"
          >
            加入 10 万 + 用户
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
