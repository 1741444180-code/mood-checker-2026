import React from 'react';

export const Pagination = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <nav className={`flex items-center justify-center space-x-2 ${className}`}>{children}</nav>
);

export const PaginationContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <ul className={`flex items-center space-x-2 ${className}`}>{children}</ul>
);

export const PaginationItem = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <li className={className}>{children}</li>
);

export const PaginationLink = ({ children, href = '#', isActive = false, className = '', onClick }: { children: React.ReactNode; href?: string; isActive?: boolean; className?: string; onClick?: (e: React.MouseEvent) => void }) => (
  <a href={href} onClick={onClick} className={`px-3 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'} ${className}`}>
    {children}
  </a>
);

export const PaginationPrevious = ({ href = '#', className = '', onClick }: { href?: string; className?: string; onClick?: (e: React.MouseEvent) => void }) => (
  <PaginationLink href={href} className={className} onClick={onClick}>Previous</PaginationLink>
);

export const PaginationNext = ({ href = '#', className = '', onClick }: { href?: string; className?: string; onClick?: (e: React.MouseEvent) => void }) => (
  <PaginationLink href={href} className={className} onClick={onClick}>Next</PaginationLink>
);

export const PaginationEllipsis = ({ className = '' }: { className?: string }) => (
  <span className={`px-3 py-2 text-gray-500 ${className}`}>...</span>
);
