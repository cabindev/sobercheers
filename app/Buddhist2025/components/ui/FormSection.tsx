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
    <div className={`bg-white rounded-lg border shadow-sm p-5 ${className}`}>
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-r from-orange-400 to-amber-500 rounded-lg mr-2.5">
          <div className="text-white">
            {icon}
          </div>
        </div>
        <h2 className="text-base font-semibold text-gray-900">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}