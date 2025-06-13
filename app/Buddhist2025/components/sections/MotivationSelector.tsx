// app/Buddhist2025/components/sections/MotivationSelector.tsx
import { Heart, Users, DollarSign, Award, Baby, Sparkles } from 'lucide-react';

interface MotivationSelectorProps {
  selectedMotivations: string[];
  onChange: (motivation: string, checked: boolean) => void;
  disabled: boolean;
}

const motivationOptions = [
  { value: 'เพื่อลูกและครอบครัว', label: 'เพื่อลูกและครอบครัว', icon: Baby },
  { value: 'เพื่อสุขภาพของตนเอง', label: 'เพื่อสุขภาพของตนเอง', icon: Heart },
  { value: 'ได้บุญ/รักษาศีล', label: 'ได้บุญ/รักษาศีล', icon: Sparkles },
  { value: 'ผู้นำชุมชนชักชวน', label: 'ผู้นำชุมชนชักชวน', icon: Users },
  { value: 'คนรักและเพื่อนชวน', label: 'คนรักและเพื่อนชวน', icon: Heart },
  { value: 'ประหยัดเงิน', label: 'ประหยัดเงิน', icon: DollarSign },
  { value: 'เพื่อเป็นแบบอย่างที่ดีให้กับคนอื่น', label: 'เป็นแบบอย่างที่ดี', icon: Award }
];

export default function MotivationSelector({ 
  selectedMotivations, 
  onChange, 
  disabled 
}: MotivationSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {motivationOptions.map((option) => {
        const isSelected = selectedMotivations.includes(option.value);
        const IconComponent = option.icon;
        
        return (
          <label 
            key={option.value}
            className={`
              flex flex-col items-center p-4 rounded-lg border cursor-pointer
              transition-colors duration-200 min-h-[100px] relative
              ${isSelected 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onChange(option.value, e.target.checked)}
              disabled={disabled}
              className="sr-only"
            />
            
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-lg mb-3
              ${isSelected ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}
            `}>
              <IconComponent className="h-4 w-4" />
            </div>
            
            <span className={`
              text-sm font-medium text-center leading-tight
              ${isSelected ? 'text-gray-900' : 'text-gray-700'}
            `}>
              {option.label}
            </span>
            
            {/* ✅ เปลี่ยนสี checkmark เป็น orange */}
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </label>
        );
      })}
    </div>
  );
}