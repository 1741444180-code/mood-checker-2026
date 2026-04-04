'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MoodRecord {
  date: string;
  moodType: string;
  note?: string;
}

interface MoodCalendarProps {
  moodRecords: MoodRecord[];
}

// 简单的心情颜色映射
const moodColors: Record<string, string> = {
  '开心': '#FFD700',     // 金黄
  '平静': '#90EE90',     // 浅绿
  '低落': '#87CEEB',     // 天蓝
  '生气': '#FF6B6B',     // 红色
  '焦虑': '#DDA0DD',     // 紫红
  '疲惫': '#D3D3D3',     // 灰色
  '兴奋': '#FF69B4',     // 粉红
  default: '#E0E0E0',    // 未打卡的默认颜色
};

export function MoodCalendar({ moodRecords }: MoodCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 获取当月第一天
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  // 获取当月最后一天
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  // 获取当月第一天是星期几
  const firstDayWeekday = firstDayOfMonth.getDay();
  // 获取当月天数
  const daysInMonth = lastDayOfMonth.getDate();

  // 生成日历格子
  const calendarDays: any[] = [];
  
  // 添加上个月的尾部天数
  const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    calendarDays.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day),
      isCurrentMonth: false,
      mood: null,
    });
  }

  // 添加当月天数
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const mood = moodRecords.find(record => record.date === dateStr);
    
    calendarDays.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
      isCurrentMonth: true,
      mood,
    });
  }

  // 添加下个月的开头天数（补满6行）
  const totalCells = 42; // 6行 x 7列
  const remainingCells = totalCells - calendarDays.length;
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day),
      isCurrentMonth: false,
      mood: null,
    });
  }

  // 月份导航
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
          &lt;
        </Button>
        <CardTitle>
          {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
        </CardTitle>
        <Button variant="outline" size="sm" onClick={goToNextMonth}>
          &gt;
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const moodType = day.mood?.moodType;
            const bgColor = moodType ? moodColors[moodType] : moodColors.default;
            const isToday = day.date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`
                  h-12 flex items-center justify-center rounded
                  ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                `}
                style={{ backgroundColor: bgColor }}
                title={day.mood?.note || (day.isCurrentMonth ? '' : '非当月日期')}
              >
                <span className="text-xs">
                  {day.date.getDate()}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-sm">
          <p className="mb-2"><strong>打卡统计:</strong></p>
          <p>当月已打卡: {moodRecords.length} 天</p>
          <p>打卡率: {Math.round((moodRecords.length / daysInMonth) * 100)}%</p>
        </div>
      </CardContent>
    </Card>
  );
}