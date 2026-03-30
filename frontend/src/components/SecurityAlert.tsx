'use client';

import React, { useState, useEffect } from 'react';

interface SecurityAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  action?: string;
}

interface SecurityAlertProps {
  onAction?: (action: string) => void;
}

export default function SecurityAlert({ onAction }: SecurityAlertProps) {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info' | 'success'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAlerts();
    // Real-time updates every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/security/alerts');
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  const handleAction = async (alertId: string, action: string) => {
    if (onAction) {
      onAction(action);
    }
    
    try {
      await fetch('/api/security/alerts/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId, action }),
      });
    } catch (error) {
      console.error('Failed to handle alert action:', error);
    }
  };

  const clearAllAlerts = async () => {
    if (confirm('确定要清空所有安全提醒吗？')) {
      try {
        await fetch('/api/security/alerts/clear', {
          method: 'DELETE',
        });
        setAlerts([]);
      } catch (error) {
        console.error('Failed to clear alerts:', error);
      }
    }
  };

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' || alert.type === filter
  );

  const getAlertStyles = (type: string) => {
    const styles = {
      critical: {
        bg: 'bg-red-50',
        border: 'border-l-4 border-red-500',
        icon: '🚨',
        actionBg: 'bg-red-500 hover:bg-red-600',
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-l-4 border-yellow-500',
        icon: '⚠️',
        actionBg: 'bg-yellow-500 hover:bg-yellow-600',
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-l-4 border-blue-500',
        icon: 'ℹ️',
        actionBg: 'bg-blue-500 hover:bg-blue-600',
      },
      success: {
        bg: 'bg-green-50',
        border: 'border-l-4 border-green-500',
        icon: '✅',
        actionBg: 'bg-green-500 hover:bg-green-600',
      },
    };
    return styles[type as keyof typeof styles] || styles.info;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🔔 安全提醒</h2>
        <button
          onClick={fetchAlerts}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
        >
          🔄 {loading ? '刷新中...' : '刷新'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'critical', 'warning', 'info', 'success'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === type
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type === 'all' ? '全部' : type === 'critical' ? '严重' : type === 'warning' ? '警告' : type === 'info' ? '提示' : '成功'}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3 mb-6">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-lg">没有安全提醒</p>
            <p className="text-sm">您的账号很安全</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const styles = getAlertStyles(alert.type);
            return (
              <div
                key={alert.id}
                className={`${styles.bg} ${styles.border} rounded-lg p-4 flex gap-4 items-start animate-slideIn`}
              >
                <div className="text-2xl flex-shrink-0">{styles.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{alert.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{alert.message}</p>
                  <p className="text-gray-400 text-xs">{alert.time}</p>
                </div>
                {alert.action && (
                  <button
                    onClick={() => handleAction(alert.id, alert.action!)}
                    className={`px-4 py-2 ${styles.actionBg} text-white rounded-lg text-sm font-medium transition`}
                  >
                    立即查看
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Clear All */}
      {alerts.length > 0 && (
        <div className="text-right">
          <button
            onClick={clearAllAlerts}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
          >
            🗑️ 清空所有提醒
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
