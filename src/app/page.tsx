"use client";

import { useState } from "react";

interface Mood {
  id: string;
  emoji: string;
  name: string;
  color: string;
  gradient: string;
}

const moods: Mood[] = [
  { id: 'happy', emoji: '😄', name: '开心', color: '#FFD700', gradient: 'from-[#FFD700] to-[#FFEC8B]' },
  { id: 'calm', emoji: '😊', name: '平静', color: '#90EE90', gradient: 'from-[#90EE90] to-[#C1FFC1]' },
  { id: 'sad', emoji: '😔', name: '低落', color: '#87CEEB', gradient: 'from-[#87CEEB] to-[#B0E0F6]' },
  { id: 'angry', emoji: '😠', name: '生气', color: '#FF6B6B', gradient: 'from-[#FF6B6B] to-[#FF8E8E]' },
  { id: 'anxious', emoji: '😰', name: '焦虑', color: '#DDA0DD', gradient: 'from-[#DDA0DD] to-[#E8C4E8]' },
  { id: 'tired', emoji: '😴', name: '疲惫', color: '#D3D3D3', gradient: 'from-[#D3D3D3] to-[#E8E8E8]' },
  { id: 'excited', emoji: '🤩', name: '兴奋', color: '#FF69B4', gradient: 'from-[#FF69B4] to-[#FF8ECA]' },
  { id: 'custom', emoji: '➕', name: '自定义', color: '#6366F1', gradient: 'bg-indigo-50 border-dashed border-indigo-300' },
];

const tags = ['工作', '生活', '健康', '学习', '家庭', '朋友', '其他'];

export default function HomePage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    // 提交打卡逻辑
    console.log("提交打卡:", {
      mood: selectedMood,
      note,
      tags: selectedTags,
    });
    
    setHasCheckedIn(true);
    setShowSuccess(true);
    
    // 3 秒后关闭成功弹窗
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // 获取当前时间的问候语
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return '早上好';
    if (hour >= 11 && hour < 14) return '中午好';
    if (hour >= 14 && hour < 18) return '下午好';
    if (hour >= 18 && hour < 23) return '晚上好';
    return '夜深了';
  };

  // 获取当前日期
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    return `${year} 年 ${month} 月 ${day} 日 ${weekday}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <span className="text-xl font-semibold text-gray-800">心情打卡</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-gray-800 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                建
              </div>
              <span className="text-sm font-medium text-gray-700">建权</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 欢迎区域 */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 mx-4 mt-6 rounded-2xl p-8 md:p-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">👋</span>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{getTimeGreeting()}，建权！</h1>
        </div>
        <p className="text-white/85 text-base">今天感觉怎么样？选个心情打卡吧~</p>
      </div>

      {/* 打卡卡片 */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          {/* 日期 */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <span className="text-indigo-500">📍</span>
            <span className="text-gray-700 font-medium">{getCurrentDate()}</span>
          </div>

          {!hasCheckedIn ? (
            <>
              {/* 心情选择 */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">选择你今天的心情：</h2>
                <div className="grid grid-cols-4 gap-4">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => {
                        if (mood.id === 'custom') {
                          setShowCustomModal(true);
                        } else {
                          setSelectedMood(mood.id);
                        }
                      }}
                      className={`
                        relative p-3 rounded-xl border-2 transition-all duration-300 touch-target
                        ${selectedMood === mood.id 
                          ? mood.id === 'custom' 
                            ? `bg-gradient-to-br ${mood.gradient} border-[${mood.color}] shadow-lg scale-105` 
                            : `bg-gradient-to-br ${mood.gradient} border-[${mood.color}] shadow-lg scale-105`
                          : mood.id === 'custom'
                            ? 'bg-indigo-50 border-2 border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-100'
                            : 'bg-white border-gray-200 hover:border-indigo-400 hover:shadow-md hover:-translate-y-1'
                        }
                      `}
                      style={{
                        aspectRatio: '1',
                        borderColor: selectedMood === mood.id && mood.id !== 'custom' ? mood.color : undefined,
                      }}
                    >
                      <div className={`text-3xl mb-1 ${selectedMood === mood.id ? 'text-white' : mood.id === 'custom' ? 'text-indigo-600' : 'text-gray-600'}`}>
                        {mood.emoji}
                      </div>
                      <div className={`text-xs font-medium ${selectedMood === mood.id ? 'text-white' : mood.id === 'custom' ? 'text-indigo-600' : 'text-gray-600'}`}>
                        {mood.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 备注输入 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  今天发生了什么？（可选）
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="记录一下今天的心情故事..."
                  className="w-full min-h-[80px] p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
                  maxLength={500}
                />
                <div className="text-right text-xs text-gray-400 mt-1">
                  {note.length}/500
                </div>
              </div>

              {/* 标签选择 */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  添加标签（可选）：
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 touch-target
                        ${selectedTags.includes(tag)
                          ? 'bg-indigo-500 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* 提交按钮 */}
              <button
                onClick={handleSubmit}
                disabled={!selectedMood}
                className="w-full h-14 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md"
              >
                提交打卡
              </button>
            </>
          ) : (
            /* 已打卡状态 */
            <div className="text-center py-8">
              <div className="text-green-500 font-semibold text-lg mb-6">✅ 已完成今日打卡</div>
              
              <div className="bg-gradient-to-br from-[#FFD700] to-[#FFEC8B] rounded-2xl p-8 mb-6 shadow-mood">
                <div className="text-6xl mb-4">😄</div>
                <div className="text-2xl font-bold text-white mb-2">开心</div>
                <div className="text-white/80 text-sm mb-4">2026 年 3 月 28 日 10:30</div>
                <div className="text-white/95 mb-4">今天工作顺利，完成了重要项目！开心~</div>
                
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/25 text-white">工作</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/25 text-white">生活</span>
                </div>
              </div>
              
              <button className="w-full h-12 bg-white border-2 border-gray-200 text-gray-600 font-medium rounded-lg hover:border-indigo-500 hover:text-indigo-500 transition-all">
                编辑打卡
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-orange-500 font-semibold">
                <span>🔥</span>
                <span>连续打卡：7 天</span>
              </div>
            </div>
          )}
        </div>

        {/* 快捷导航 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <a href="/calendar" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
              📅
            </div>
            <span className="text-sm font-medium text-gray-700">心情日历</span>
          </a>
          <a href="/stats" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
              📊
            </div>
            <span className="text-sm font-medium text-gray-700">数据统计</span>
          </a>
          <a href="/profile" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
              👤
            </div>
            <span className="text-sm font-medium text-gray-700">个人中心</span>
          </a>
          <a href="/settings" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
              ⚙️
            </div>
            <span className="text-sm font-medium text-gray-700">设置</span>
          </a>
        </div>
      </div>

      {/* 成功弹窗 */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-sm w-full text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-500 mb-2">打卡成功！</h3>
            <p className="text-gray-600 mb-6">今天也是美好的一天~</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              太棒了
            </button>
          </div>
        </div>
      )}

      {/* 自定义心情弹窗 */}
      {showCustomModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-2xl w-full max-h-[85vh] overflow-y-auto">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-800">自定义心情</h3>
              <button 
                onClick={() => setShowCustomModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors touch-target"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-4">
              {/* 图片上传区域 - 1-9 张图片 */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  上传图片（1-9 张）
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* 已上传图片 1 */}
                  <div className="relative aspect-square rounded-xl border-2 border-indigo-400 overflow-hidden bg-gray-100">
                    <div className="w-full h-full flex items-center justify-center text-2xl bg-pink-100">😄</div>
                    <button className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">×</button>
                  </div>
                  {/* 已上传图片 2 */}
                  <div className="relative aspect-square rounded-xl border-2 border-indigo-400 overflow-hidden bg-gray-100">
                    <div className="w-full h-full flex items-center justify-center text-2xl bg-blue-100">🌟</div>
                    <button className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">×</button>
                  </div>
                  {/* 添加图片按钮 */}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all touch-target">
                    <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span className="text-xs text-gray-500">添加</span>
                    <input type="file" accept="image/*" multiple className="hidden" />
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-2">已选择 2/9 张图片</p>
              </div>

              {/* 表情选择 */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  选择表情符号
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {['😄', '😊', '🥰', '😎', '🤗', '😇', '🤩', '😋', '🥳', '😌', '😏', '😍', '🤑', '😇', '🦄', '🌈'].map((emoji) => (
                    <button 
                      key={emoji}
                      className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-indigo-100 text-xl flex items-center justify-center transition-all touch-target"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* 心情名称 */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  心情名称
                </label>
                <input
                  type="text"
                  placeholder="给这个心情起个名字..."
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none touch-target"
                  maxLength="20"
                />
              </div>

              {/* 颜色选择 */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择颜色
                </label>
                <div className="flex flex-wrap gap-3">
                  <button className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 border-2 border-white shadow-md hover:scale-110 transition-transform touch-target"></button>
                  <button className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 border-2 border-white shadow-md hover:scale-110 transition-transform touch-target"></button>
                  <button className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 border-2 border-white shadow-md hover:scale-110 transition-transform touch-target"></button>
                  <button className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-500 border-2 border-white shadow-md hover:scale-110 transition-transform touch-target"></button>
                  <button className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 border-2 border-white shadow-md hover:scale-110 transition-transform touch-target"></button>
                  <button className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-500 border-2 border-indigo-300 shadow-md scale-110 touch-target"></button>
                  <button className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 border-2 border-white shadow-md hover:scale-110 transition-transform touch-target"></button>
                </div>
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="flex gap-3 p-4 border-t border-gray-100 sticky bottom-0 bg-white">
              <button 
                onClick={() => setShowCustomModal(false)}
                className="flex-1 h-11 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all touch-target"
              >
                取消
              </button>
              <button className="flex-1 h-11 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all touch-target">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}