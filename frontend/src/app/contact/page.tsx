'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('感谢您的留言！我们会尽快回复您。');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

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
          联系我们
        </h1>
        <p className="text-xl text-center text-gray-600 mb-16">
          有任何问题或建议？我们随时为您服务
        </p>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* 联系信息 */}
          <div>
            <h2 className="text-2xl font-bold mb-6">联系方式</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <span className="text-3xl mr-4">📧</span>
                <div>
                  <h4 className="font-semibold mb-1">电子邮件</h4>
                  <p className="text-gray-600">support@moodchecker.com</p>
                  <p className="text-sm text-gray-500">工作日 24 小时内回复</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">💬</span>
                <div>
                  <h4 className="font-semibold mb-1">在线客服</h4>
                  <p className="text-gray-600">周一至周五 9:00-18:00</p>
                  <p className="text-sm text-gray-500">点击右下角气泡开始聊天</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">📱</span>
                <div>
                  <h4 className="font-semibold mb-1">微信公众号</h4>
                  <p className="text-gray-600">心情打卡官方</p>
                  <p className="text-sm text-gray-500">关注获取最新资讯</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">🏢</span>
                <div>
                  <h4 className="font-semibold mb-1">公司地址</h4>
                  <p className="text-gray-600">上海市浦东新区张江高科技园区</p>
                  <p className="text-sm text-gray-500">欢迎预约参观</p>
                </div>
              </div>
            </div>

            {/* FAQ 链接 */}
            <div className="mt-8 p-6 bg-white rounded-xl shadow">
              <h3 className="font-semibold mb-3">常见问题？</h3>
              <p className="text-gray-600 mb-4">大部分问题可以在 FAQ 页面找到答案</p>
              <Link href="/faq" className="text-purple-600 hover:underline">
                查看 FAQ →
              </Link>
            </div>
          </div>

          {/* 联系表单 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">发送消息</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="您的姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱 *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  主题
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">请选择主题</option>
                  <option value="product">产品咨询</option>
                  <option value="tech">技术支持</option>
                  <option value="billing">账单问题</option>
                  <option value="feedback">意见反馈</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  消息 *
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="请详细描述您的问题或建议..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-shadow"
              >
                发送消息
              </button>
            </form>
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
