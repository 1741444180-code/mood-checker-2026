'use client';

import React, { useState } from 'react';

export const PrivacySettings: React.FC = () => {
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    showMoodHistory: true,
    allowFriendRequests: true,
    dataSharing: false,
    analytics: true,
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">隐私设置</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">个人资料可见性</label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="public">公开</option>
              <option value="friends">仅好友</option>
              <option value="private">私密</option>
            </select>
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.showMoodHistory}
              onChange={(e) => setSettings({ ...settings, showMoodHistory: e.target.checked })}
              className="mr-2"
            />
            <span>显示心情历史</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.allowFriendRequests}
              onChange={(e) => setSettings({ ...settings, allowFriendRequests: e.target.checked })}
              className="mr-2"
            />
            <span>允许好友请求</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.dataSharing}
              onChange={(e) => setSettings({ ...settings, dataSharing: e.target.checked })}
              className="mr-2"
            />
            <span>数据共享</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.analytics}
              onChange={(e) => setSettings({ ...settings, analytics: e.target.checked })}
              className="mr-2"
            />
            <span>分析数据收集</span>
          </label>
        </div>
        <div className="mt-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            保存设置
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">数据管理</h3>
        <div className="space-y-4">
          <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
            导出我的数据
          </button>
          <button className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            删除账号
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
