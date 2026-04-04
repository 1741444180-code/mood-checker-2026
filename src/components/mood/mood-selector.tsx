'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Chip } from '@mui/material';

interface MoodSelectorProps {
  onSubmit?: (data: { moodId: number; note?: string; tags?: string[] }) => void;
}

const MOODS = [
  { id: 1, emoji: '😄', label: '开心', color: '#FFD93D' },
  { id: 2, emoji: '😊', label: '愉快', color: '#6BCB77' },
  { id: 3, emoji: '😐', label: '一般', color: '#4D96FF' },
  { id: 4, emoji: '😔', label: '难过', color: '#9B59B6' },
  { id: 5, emoji: '😢', label: '伤心', color: '#6C5CE7' },
  { id: 6, emoji: '😠', label: '生气', color: '#FF6B6B' },
  { id: 7, emoji: '😰', label: '焦虑', color: '#F39C12' },
];

const TAGS = ['工作', '学习', '运动', '社交', '休息', '旅行', '家庭', '健康'];

export default function MoodSelector({ onSubmit }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (selectedMood === null) return;
    onSubmit?.({
      moodId: selectedMood,
      note: note || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    });
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedMood(null);
    setNote('');
    setSelectedTags([]);
    setSubmitted(false);
  };

  if (submitted) {
    const mood = MOODS.find((m) => m.id === selectedMood);
    return (
      <Box className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <Typography variant="h4" className="mb-2">
          {mood?.emoji}
        </Typography>
        <Typography variant="h6" className="font-bold mb-2">
          打卡成功！
        </Typography>
        <Typography className="text-gray-500 mb-4">
          今天的心情：{mood?.label}
        </Typography>
        <Button variant="outlined" onClick={handleReset} className="text-purple-600 border-purple-600">
          重新记录
        </Button>
      </Box>
    );
  }

  return (
    <Box className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' } }} className="font-bold mb-3 sm:mb-4">
        今天心情如何？
      </Typography>

      {/* 心情选择 */}
      <Box className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => setSelectedMood(mood.id)}
            className={`flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all cursor-pointer ${
              selectedMood === mood.id
                ? 'bg-purple-100 ring-2 ring-purple-500 scale-105'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <span className="text-2xl sm:text-3xl mb-1">{mood.emoji}</span>
            <span className="text-xs text-gray-600">{mood.label}</span>
          </button>
        ))}
      </Box>

      {/* 标签选择 */}
      <Typography className="text-sm font-medium text-gray-700 mb-2">
        相关标签（可选）
      </Typography>
      <Box className="flex flex-wrap gap-2 mb-4 sm:mb-6">
        {TAGS.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onClick={() => toggleTag(tag)}
            color={selectedTags.includes(tag) ? 'primary' : 'default'}
            variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
            size="small"
            className="cursor-pointer"
          />
        ))}
      </Box>

      {/* 备注 */}
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="写点什么吧...（可选）"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        variant="outlined"
        size="small"
        className="mb-4 sm:mb-6"
      />

      {/* 提交按钮 */}
      <Button
        fullWidth
        variant="contained"
        disabled={selectedMood === null}
        onClick={handleSubmit}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 py-2 sm:py-3"
        sx={{
          background: selectedMood !== null ? 'linear-gradient(to right, #9333ea, #4f46e5)' : undefined,
          '&:hover': {
            background: selectedMood !== null ? 'linear-gradient(to right, #7e22ce, #4338ca)' : undefined,
          },
        }}
      >
        {selectedMood !== null
          ? `记录心情：${MOODS.find((m) => m.id === selectedMood)?.emoji} ${MOODS.find((m) => m.id === selectedMood)?.label}`
          : '请先选择心情'}
      </Button>
    </Box>
  );
}
