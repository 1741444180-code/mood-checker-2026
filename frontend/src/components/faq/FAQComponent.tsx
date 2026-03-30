'use client';

import React, { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

interface FAQComponentProps {
  faqs?: FAQItem[];
}

export const FAQComponent: React.FC<FAQComponentProps> = ({ faqs = [] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const defaultFAQs: FAQItem[] = [
    {
      id: 1,
      question: '如何记录心情？',
      answer: '在首页点击今日打卡卡片，选择您当前的心情状态，可以添加备注，然后点击提交即可。',
      category: '使用指南',
    },
    {
      id: 2,
      question: '可以修改已提交的心情记录吗？',
      answer: '可以的，在心情日历页面点击任意已记录的日期，可以查看和修改当天的心情记录。',
      category: '使用指南',
    },
    {
      id: 3,
      question: '如何查看我的心情趋势？',
      answer: '在统计页面可以查看心情趋势图表，包括周视图、月视图和年视图，帮助您了解心情变化规律。',
      category: '功能说明',
    },
    {
      id: 4,
      question: '数据会同步吗？',
      answer: '是的，所有数据都会云端同步，您可以在不同设备上登录同一账号查看您的心情记录。',
      category: '数据同步',
    },
    {
      id: 5,
      question: '如何删除账号？',
      answer: '在设置页面的隐私设置中，可以选择删除账号。删除后所有数据将被永久清除，此操作不可恢复。',
      category: '账号管理',
    },
  ];

  const FAQs = faqs.length > 0 ? faqs : defaultFAQs;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">常见问题</h2>
      </div>
      <div className="divide-y">
        {FAQs.map((faq, index) => (
          <div key={faq.id} className="p-4">
            <button
              className="w-full flex justify-between items-center text-left"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              <svg
                className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="mt-3 text-gray-600 text-sm">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQComponent;
