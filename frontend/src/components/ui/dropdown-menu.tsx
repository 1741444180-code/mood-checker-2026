'use client';

import React, { useState } from 'react';

export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="relative inline-block text-left">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { open, setOpen });
        }
        return child;
      })}
    </div>
  );
};

export const DropdownMenuTrigger: React.FC<{ children: React.ReactNode; open?: boolean; setOpen?: (open: boolean) => void }> = ({ children, open, setOpen }) => {
  return (
    <button onClick={() => setOpen?.(!open)} className="focus:outline-none">
      {children}
    </button>
  );
};

export const DropdownMenuContent: React.FC<{ children: React.ReactNode; open?: boolean; align?: 'start' | 'end' | 'center' }> = ({ children, open, align = 'end' }) => {
  if (!open) return null;
  const alignClass = align === 'start' ? 'left-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'right-0';
  return (
    <div className={`absolute mt-2 w-48 bg-white rounded-md shadow-lg border z-50 ${alignClass}`}>
      {children}
    </div>
  );
};

export const DropdownMenuItem: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  return (
    <div onClick={onClick} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
      {children}
    </div>
  );
};

export const DropdownMenuSeparator: React.FC = () => {
  return <div className="border-t border-gray-200 my-1" />;
};
