'use client';

import React from 'react';

interface CalendarViewProps {
  events?: any[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">日历视图</h2>
      <div className="text-center text-gray-500 py-12">
        日历功能开发中...
      </div>
    </div>
  );
};

export default CalendarView;
