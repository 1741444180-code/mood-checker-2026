import React from 'react';

export const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }: { children: React.ReactNode; variant?: 'default' | 'outline' | 'ghost'; size?: 'default' | 'sm' | 'lg'; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };
  
  const sizes = {
    default: 'px-4 py-2',
    sm: 'px-3 py-1.5 text-sm',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button className={`inline-flex items-center justify-center rounded-md font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};
