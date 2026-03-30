'use client';

import React from 'react';

export const Select: React.FC<{ children: React.ReactNode; defaultValue?: string; value?: string; onValueChange?: (value: string) => void }> = ({ children, defaultValue, value, onValueChange }) => {
  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { defaultValue, value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

export const SelectTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`px-3 py-2 border border-gray-300 rounded-md bg-white ${className}`}>
      {children}
    </div>
  );
};

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  return <span>{placeholder}</span>;
};

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">{children}</div>;
};

export const SelectItem: React.FC<{ children: React.ReactNode; value: string }> = ({ children, value }) => {
  return (
    <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer" data-value={value}>
      {children}
    </div>
  );
};
