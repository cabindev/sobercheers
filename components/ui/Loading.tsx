// app/components/ui/Loading.tsx
import React from 'react';

interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ text = 'กำลังโหลด...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center space-x-3">
        <div className={`${sizeClasses[size]} border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin`}></div>
        <span className="text-gray-600">{text}</span>
      </div>
    </div>
  );
}