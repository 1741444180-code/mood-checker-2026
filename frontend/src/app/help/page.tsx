'use client';

import { useState, useEffect } from 'react';
import { Search, Home, Info, HelpCircle, Settings, ChevronRight } from 'lucide-react';
import FAQComponent from '@/components/faq/FAQComponent';

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Mock data for help articles
  const helpCategories = [
    { id: 'all', name: '全部', count: 12 },
    { id: 'getting-started', name: '新手入门', count: 4 },
    { id: 'account', name: '账户设置', count: 3 },
    { id: 'features', name: '功能说明', count: 3 },
    { id: 'troubleshooting', name: '故障排除', count: 2 },
  ];

  const helpArticles = [
    {
      id: 1,
      title: '如何注册账户',
      category: 'getting-started',
      excerpt: '了解如何创建和激活您的账户',
      path: '/help/getting-started/account-setup',
    },
    {
      id: 2,
      title: '个人资料设置',
      category: 'account',
      excerpt: '管理您的个人资料和隐私设置',
      path: '/help/account/profile-management',
    },
    {
      id: 3,
      title: '添加好友',
      category: 'features',
      excerpt: '学习如何添加和管理好友',
      path: '/help/features/friend-connections',
    },
    {
      id: 4,
      title: '日历功能使用指南',
      category: 'features',
      excerpt: '充分利用日历功能安排活动',
      path: '/help/features/calendar-guide',
    },
    {
      id: 5,
      title: '权限设置',
      category: 'account',
      excerpt: '配置应用权限和通知设置',
      path: '/help/account/permissions',
    },
    {
      id: 6,
      title: '常见问题解答',
      category: 'troubleshooting',
      excerpt: '解决常见问题和错误',
      path: '/help/troubleshooting/common-issues',
    },
    {
      id: 7,
      title: '导出数据',
      category: 'features',
      excerpt: '如何导出您的个人数据',
      path: '/help/features/data-export',
    },
    {
      id: 8,
      title: '隐私政策',
      category: 'account',
      excerpt: '了解我们的隐私保护措施',
      path: '/help/legal/privacy-policy',
    },
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">帮助中心</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            找不到您要的答案？在这里搜索我们的知识库或浏览常见问题解答。
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className={`relative rounded-xl shadow-lg transition-all duration-300 ${isSearchFocused ? 'shadow-xl' : ''}`}>
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="搜索帮助文章..."
              className="block w-full pl-12 pr-5 py-5 text-lg border border-transparent rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">分类导航</h2>
              <nav>
                <ul className="space-y-2">
                  {helpCategories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-left transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-900 mb-4">快速链接</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <Home className="mr-3 flex-shrink-0" />
                      <span>首页</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <Info className="mr-3 flex-shrink-0" />
                      <span>关于我们</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <HelpCircle className="mr-3 flex-shrink-0" />
                      <span>联系支持</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <Settings className="mr-3 flex-shrink-0" />
                      <span>反馈</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Help Articles */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? '所有文章' : helpCategories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-gray-500">{filteredArticles.length} 篇文章</span>
              </div>

              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredArticles.map((article) => (
                    <a
                      key={article.id}
                      href={article.path}
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                          <p className="text-gray-600 text-sm">{article.excerpt}</p>
                        </div>
                        <ChevronRight className="text-gray-400 flex-shrink-0 ml-2 mt-1" />
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <Search className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">未找到相关文章</h3>
                  <p className="mt-2 text-gray-500">
                    我们找不到与您的搜索条件匹配的文章。请尝试其他关键词。
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">常见问题</h2>
              <FAQComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;