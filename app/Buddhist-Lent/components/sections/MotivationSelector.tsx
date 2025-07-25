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
             flex flex-col items-center p-3 rounded-lg border cursor-pointer
             transition-colors duration-150 min-h-[80px] relative
             ${isSelected 
               ? 'border-orange-500 bg-orange-50' 
               : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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
             flex items-center justify-center w-6 h-6 rounded mb-2
             ${isSelected ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}
           `}>
             <IconComponent className="h-3 w-3" />
           </div>
           
           <span className={`
             text-xs text-center leading-tight
             ${isSelected ? 'text-gray-900' : 'text-gray-700'}
           `}>
             {option.label}
           </span>
           
           {/* Minimal Checkmark */}
           {isSelected && (
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
               <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
             </div>
           )}
         </label>
       );
     })}
   </div>
 );
}