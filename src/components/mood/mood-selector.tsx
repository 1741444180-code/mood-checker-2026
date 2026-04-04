'use client';

import React, { useState } from 'react';

interface MoodSelectorProps {
  onSubmit?: (data: { moodId: number; note?: string; tags?: string[] }) => void;
}

const MOODS = [
  { id: 1, emoji: '😄', label: '开心' },
  { id: 2, emoji: '😊', label: '愉快' },
  { id: 3, emoji: '😐', label: '一般' },
  { id: 4, emoji: '😔', label: '难过' },
  { id: 5, emoji: '😢', label: '伤心' },
  { id: 6, emoji: '😠', label: '生气' },
  { id: 7, emoji: '😰', label: '焦虑' },
];

const TAGS = ['工作', '学习', '运动', '社交', '休息', '旅行', '家庭', '健康'];

export default function MoodSelector({ onSubmit }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (selectedMood === null) return;
    onSubmit?.({ moodId: selectedMood, note: note || undefined, tags: selectedTags.length > 0 ? selectedTags : undefined });
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
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <div className="text-5xl mb-3">{mood?.emoji}</div>
        <h3 className="text-lg font-bold mb-2">打卡成功！</h3>
        <p className="text-gray-500 mb-4">今天的心情：{mood?.label}</p>
        <button onClick={handleReset} className="px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 transition">
          重新记录
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">今天心情如何？</h3>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {MOODS.map(mood => (
          <button
            key={mood.id}
            onClick={() => setSelectedMood(mood.id)}
            className={`flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all ${
              selectedMood === mood.id ? 'bg-purple-100 ring-2 ring-purple-500 scale-105' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <span className="text-2xl sm:text-3xl mb-1">{mood.emoji}</span>
            <span className="text-xs text-gray-600">{mood.label}</span>
          </button>
        ))}
      </div>

      <p className="text-sm font-medium text-gray-700 mb-2">相关标签（可选）</p>
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
        {TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 text-sm rounded-full border transition ${
              selectedTags.includes(tag) ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <textarea
        placeholder="写点什么吧...（可选）"
        value={note}
        onChange={e => setNote(e.target.value)}
        rows={3}
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 sm:mb-6"
      />

      <button
        disabled={selectedMood === null}
        onClick={handleSubmit}
        className={`w-full py-3 rounded-lg text-white font-medium transition ${
          selectedMood !== null ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {selectedMood !== null
          ? `记录心情：${MOODS.find(m => m.id === selectedMood)?.emoji} ${MOODS.find(m => m.id === selectedMood)?.label}`
          : '请先选择心情'}
      </button>
    </div>
  );
}
