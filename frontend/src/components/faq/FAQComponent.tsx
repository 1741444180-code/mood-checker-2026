'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filteredFAQs, setFilteredFAQs] = useState<FAQItem[]>([]);
  
  // Mock FAQ data
  const faqs: FAQItem[] = [
    {
      id: 1,
      question: '如何注册账户？',
      answer: '点击登录页面的“注册”按钮，输入您的邮箱和密码，然后按照提示完成验证即可。',
      category: 'account'
    },
    {
      id: 2,
      question: '忘记密码怎么办？',
      answer: '在登录页面点击“忘记密码”，输入您的邮箱地址，系统将发送重置密码的链接到您的邮箱。',
      category: 'account'
    },
    {
      id: 3,
      question: '如何更改个人资料？',
      answer: '登录后点击右上角的头像，选择“个人资料”，然后点击“编辑”按钮进行修改。',
      category: 'account'
    },
    {
      id: 4,
      question: '如何添加好友？',
      answer: '在好友页面点击“添加好友”，可以通过用户名或邮箱搜索并发送好友请求。',
      category: 'features'
    },
    {
      id: 5,
      question: '如何使用日历功能？',
      answer: '在日历页面可以查看、添加、编辑和删除事件。点击日期可以添加新的事件。',
      category: 'features'
    },
    {
      id: 6,
      question: '如何设置隐私权限？',
      answer: '进入设置页面，选择“隐私设置”，您可以控制谁可以看到您的信息和活动。',
      category: 'privacy'
    },
    {
      id: 7,
      question: '如何导出我的数据？',
      answer: '在设置页面的“账户”部分，点击“数据管理”，然后选择“导出数据”。系统将为您准备一个包含所有数据的文件。',
      category: 'account'
    },
    {
      id: 8,
      question: '为什么我无法接收通知？',
      answer: '请检查您的浏览器通知设置以及应用内的通知偏好设置。如果问题仍然存在，请尝试清除缓存并重新登录。',
      category: 'troubleshooting'
    },
    {
      id: 9,
      question: '如何取消订阅服务？',
      answer: '进入账户设置页面，找到“订阅管理”部分，点击“取消订阅”并按照提示完成操作。',
      category: 'billing'
    },
    {
      id: 10,
      question: '支持哪些支付方式？',
      answer: '我们支持信用卡、借记卡、PayPal以及各种常见的电子支付方式。具体可用的支付方式可能因地区而异。',
      category: 'billing'
    }
  ];

  // Filter FAQs based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFAQs(faqs);
    } else {
      const filtered = faqs.filter(
        faq =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFAQs(filtered);
    }
  }, [searchTerm]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索常见问题..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq) => (
            <div 
              key={faq.id} 
              className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleExpand(faq.id)}
                className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-expanded={expandedId === faq.id}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <span className="ml-4 flex-shrink-0">
                  {expandedId === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h5 w-5 text-gray-500" />
                  )}
                </span>
              </button>
              
              {expandedId === faq.id && (
                <div className="p-5 bg-gray-50 border-t border-gray-200 animate-fadeIn">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">未找到相关问题</h3>
            <p className="mt-2 text-gray-500">
              我们找不到与您的搜索条件匹配的问题。请尝试其他关键词。
            </p>
          </div>
        )}
      </div>

      {/* Category Filters */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">按类别浏览</h3>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(faqs.map(faq => faq.category))).map((category) => (
            <button
              key={category}
              onClick={() => {
                setSearchTerm(category);
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-full transition-colors"
            >
              {category === 'account' && '账户'}
              {category === 'features' && '功能'}
              {category === 'privacy' && '隐私'}
              {category === 'troubleshooting' && '故障排除'}
              {category === 'billing' && '账单'}
              {category !== 'account' && 
               category !== 'features' && 
               category !== 'privacy' && 
               category !== 'troubleshooting' && 
               category !== 'billing' && category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQComponent;