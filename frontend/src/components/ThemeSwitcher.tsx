import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

// 图标组件 - 太阳图标
const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

// 图标组件 - 月亮图标
const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
  </svg>
);

// 图标组件 - 系统图标
const SystemIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="3" width="20" height="14" rx="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

// 主题选项类型
type ThemeOption = {
  value: 'light' | 'dark' | 'auto';
  label: string;
  icon: React.FC<{ className?: string }>;
};

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // 主题选项配置
  const themeOptions: ThemeOption[] = [
    { value: 'light', label: '浅色模式', icon: SunIcon },
    { value: 'dark', label: '深色模式', icon: MoonIcon },
    { value: 'auto', label: '跟随系统', icon: SystemIcon },
  ];

  // 切换主题
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
  };

  return (
    <div className="theme-switcher flex items-center gap-2">
      <span className="text-sm">主题:</span>
      <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
        {themeOptions.map((option) => {
          const IconComponent = option.icon;
          const isSelected = theme === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => handleThemeChange(option.value)}
              className={`flex items-center justify-center p-2 rounded-md transition-colors ${
                isSelected
                  ? 'bg-white dark:bg-gray-600 shadow'
                  : 'hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              aria-label={option.label}
              title={option.label}
            >
              <IconComponent 
                className={`w-4 h-4 ${
                  isSelected 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300'
                }`} 
              />
            </button>
          );
        })}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
        当前: {resolvedTheme === 'dark' ? '深色' : '浅色'}
      </span>
    </div>
  );
};

export default ThemeSwitcher;