import React from 'react';

interface Log {
  id: number;
  timestamp: string;
  level: string;
  message?: string;
  source?: string;
  user?: string;
  action?: string;
  ip?: string;
  details?: string;
}

interface LogTableProps {
  logs: Log[];
  onSearchChange?: (term: string) => void;
  onLevelChange?: (level: string) => void;
}

const LogTable: React.FC<LogTableProps> = ({ logs, onSearchChange, onLevelChange }) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return 'text-red-600';
      case 'warn': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      case 'debug': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">级别</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">详情</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getLevelColor(log.level)}`}>{log.level}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.user || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{log.action || log.message || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{log.details || log.source || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;
