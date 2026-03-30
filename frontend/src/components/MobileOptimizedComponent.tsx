// MobileOptimizedComponent.tsx
'use client';

import { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface TouchEventProps {
  onTouchStart?: (e: TouchEvent) => void;
  onTouchMove?: (e: TouchEvent) => void;
  onTouchEnd?: (e: TouchEvent) => void;
}

const MobileOptimizedComponent: React.FC<TouchEventProps> = ({ 
  onTouchStart, 
  onTouchMove, 
  onTouchEnd 
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // 检测是否为触摸设备
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    // 根据屏幕大小设置状态
    setIsMobile(isSmallScreen);
    
    // 添加触摸事件监听器
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setTouchPosition({ x: touch.clientX, y: touch.clientY });
      onTouchStart?.(e);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      setTouchPosition({ x: touch.clientX, y: touch.clientY });
      onTouchMove?.(e);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      onTouchEnd?.(e);
    };

    if (isTouchDevice) {
      window.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (isTouchDevice) {
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isSmallScreen, isTouchDevice, onTouchStart, onTouchMove, onTouchEnd]);

  return (
    <div className={`mobile-optimized-component ${isMobile ? 'mobile-view' : 'desktop-view'}`}>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">移动端优化组件</h3>
        <p className="text-gray-600 mb-2">
          {isTouchDevice ? '检测到触摸设备' : '非触摸设备'}
        </p>
        <p className="text-gray-600">
          屏幕尺寸: {isMobile ? '移动端' : '桌面端'}
        </p>
        {isTouchDevice && (
          <div className="mt-2 text-sm text-gray-500">
            当前触摸位置: ({Math.round(touchPosition.x)}, {Math.round(touchPosition.y)})
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileOptimizedComponent;