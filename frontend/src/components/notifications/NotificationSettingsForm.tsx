'use client';

import React, { useState } from 'react';

export const NotificationSettingsForm: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    dailyDigest: false,
    weeklyReport: true,
    friendRequests: true,
    systemUpdates: true,
  });

  const handleChange = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">通知设置</h2>
      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={() => handleChange('emailNotifications')}
            className="mr-2"
          />
          <span>邮件通知</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.pushNotifications}
            onChange={() => handleChange('pushNotifications')}
            className="mr-2"
          />
          <span>推送通知</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.dailyDigest}
            onChange={() => handleChange('dailyDigest')}
            className="mr-2"
          />
          <span>每日摘要</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.weeklyReport}
            onChange={() => handleChange('weeklyReport')}
            className="mr-2"
          />
          <span>每周报告</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.friendRequests}
            onChange={() => handleChange('friendRequests')}
            className="mr-2"
          />
          <span>好友请求通知</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.systemUpdates}
            onChange={() => handleChange('systemUpdates')}
            className="mr-2"
          />
          <span>系统更新通知</span>
        </label>
      </div>
      <div className="mt-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          保存设置
        </button>
      </div>
    </div>
  );
};

export default NotificationSettingsForm;
