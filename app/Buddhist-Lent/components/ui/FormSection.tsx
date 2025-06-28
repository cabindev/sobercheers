// app/Buddhist2025/components/ui/FormSection.tsx
import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function FormSection({ 
  title, 
  icon, 
  children, 
  className = ""
}: FormSectionProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-5 ${className}`}>
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-lg mr-3">
          <div className="text-white">
            {icon}
          </div>
        </div>
        <h2 className="text-base text-gray-900">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}