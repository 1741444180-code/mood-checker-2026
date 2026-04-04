'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import BottomNav from '@/components/layout/BottomNav';

const MOODS = [
  { id: 1, emoji: '😄', label: '开心', labelEn: 'Happy', color: 'bg-yellow-100' },
  { id: 2, emoji: '😊', label: '愉快', labelEn: 'Pleased', color: 'bg-green-100' },
  { id: 3, emoji: '😐', label: '一般', labelEn: 'Neutral', color: 'bg-blue-100' },
  { id: 4, emoji: '😔', label: '难过', labelEn: 'Sad', color: 'bg-purple-100' },
  { id: 5, emoji: '😢', label: '伤心', labelEn: 'Crying', color: 'bg-indigo-100' },
  { id: 6, emoji: '😠', label: '生气', labelEn: 'Angry', color: 'bg-red-100' },
  { id: 7, emoji: '😰', label: '焦虑', labelEn: 'Anxious', color: 'bg-orange-100' },
];

const TAGS = ['工作', '学习', '运动', '社交', '休息', '旅行', '家庭', '健康'];
const TAGS_EN = ['Work', 'Study', 'Exercise', 'Social', 'Rest', 'Travel', 'Family', 'Health'];

export default function DashboardPage() {
  const { t, language } = useTranslation();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const tags = language === 'zh-CN' ? TAGS : TAGS_EN;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (selectedMood === null) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedMood(null);
    setNote('');
    setSelectedTags([]);
    setSubmitted(false);
  };

  if (submitted) {
    const mood = MOODS.find(m => m.id === selectedMood);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-20">
        <div className="container mx-auto max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center mt-10">
            <div className="text-6xl mb-4">{mood?.emoji}</div>
            <h2 className="text-xl font-bold mb-2">{t('checkin.success')}</h2>
            <p className="text-gray-500 mb-6">
              {t('checkin.todayMood')}：{language === 'zh-CN' ? mood?.label : mood?.labelEn}
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 transition"
            >
              {language === 'zh-CN' ? '重新记录' : 'Record Again'}
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-20">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('checkin.todayMood')}</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {language === 'zh-CN' ? '记录您的每日心情，关注情绪变化' : 'Record your daily mood, track emotional changes'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            {/* 心情选择器 */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg font-bold mb-4">
                {language === 'zh-CN' ? '今天心情如何？' : 'How are you feeling today?'}
              </h2>

              {/* 心情选择 */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3 mb-6">
                {MOODS.map(mood => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all ${
                      selectedMood === mood.id
                        ? 'bg-purple-100 ring-2 ring-purple-500 scale-105'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1">{mood.emoji}</span>
                    <span className="text-xs text-gray-600">
                      {language === 'zh-CN' ? mood.label : mood.labelEn}
                    </span>
                  </button>
                ))}
              </div>

              {/* 标签选择 */}
              <p className="text-sm font-medium text-gray-700 mb-2">
                {language === 'zh-CN' ? '相关标签（可选）' : 'Tags (optional)'}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag, i) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-sm rounded-full border transition ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* 备注 */}
              <textarea
                placeholder={t('checkin.addNote')}
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6"
              />

              {/* 提交按钮 */}
              <button
                disabled={selectedMood === null}
                onClick={handleSubmit}
                className={`w-full py-3 rounded-lg text-white font-medium transition ${
                  selectedMood !== null
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {selectedMood !== null
                  ? `${language === 'zh-CN' ? '记录心情' : 'Record Mood'}：${MOODS.find(m => m.id === selectedMood)?.emoji} ${language === 'zh-CN' ? MOODS.find(m => m.id === selectedMood)?.label : MOODS.find(m => m.id === selectedMood)?.labelEn}`
                  : (language === 'zh-CN' ? '请先选择心情' : 'Select a mood first')}
              </button>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-3">
                {language === 'zh-CN' ? '打卡提醒' : 'Check-in Reminder'}
              </h2>
              <p className="text-gray-600 text-sm">
                {language === 'zh-CN'
                  ? '每天花几分钟记录心情，有助于更好地了解自己的情绪变化。'
                  : 'Spend a few minutes each day recording your mood to better understand your emotional changes.'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-3">
                {language === 'zh-CN' ? '快捷操作' : 'Quick Actions'}
              </h2>
              <div className="space-y-2">
                <Link href="/stats" className="block text-purple-600 hover:underline text-sm">
                  📊 {t('nav.stats')}
                </Link>
                <Link href="/calendar" className="block text-purple-600 hover:underline text-sm">
                  📅 {t('nav.calendar')}
                </Link>
                <Link href="/friends" className="block text-purple-600 hover:underline text-sm">
                  👥 {t('nav.friends')}
                </Link>
                <Link href="/settings" className="block text-purple-600 hover:underline text-sm">
                  ⚙️ {t('nav.settings')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
