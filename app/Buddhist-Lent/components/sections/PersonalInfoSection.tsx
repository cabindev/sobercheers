// app/Buddhist2025/components/sections/PersonalInfoSection.tsx
import { Buddhist2025FormData } from '@/types/buddhist';
import FormSection from '../ui/FormSection';
import { FormField, Input } from '../ui/FormField';
import { User, Calendar } from 'lucide-react';

interface PersonalInfoSectionProps {
  formData: Buddhist2025FormData;
  validationErrors: Record<string, string>;
  onChange: (field: keyof Buddhist2025FormData, value: string | number | undefined) => void;
  disabled: boolean;
}

const genderOptions = [
  { value: 'ชาย', label: 'ชาย' },
  { value: 'หญิง', label: 'หญิง' },
  { value: 'LGBTQ', label: 'LGBTQ+' }
];

export default function PersonalInfoSection({ 
  formData, 
  validationErrors, 
  onChange, 
  disabled 
}: PersonalInfoSectionProps) {
  if (!formData) {
    return (
      <FormSection title="ข้อมูลส่วนตัว" icon={<User className="h-4 w-4" />}>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 rounded-lg"></div>
            <div className="h-10 bg-gray-200 rounded-lg"></div>
            <div className="h-10 bg-gray-200 rounded-lg"></div>
            <div className="h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </FormSection>
    );
  }

  return (
    <FormSection title="ข้อมูลส่วนตัว" icon={<User className="h-4 w-4" />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ชื่อ */}
        <FormField label="ชื่อ" required error={validationErrors?.firstName}>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName || ''}
            onChange={(e) => onChange('firstName', e.target.value)}
            placeholder="กรอกชื่อ"
            disabled={disabled}
            error={!!validationErrors?.firstName}
          />
        </FormField>

        {/* นามสกุล */}
        <FormField label="นามสกุล" required error={validationErrors?.lastName}>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName || ''}
            onChange={(e) => onChange('lastName', e.target.value)}
            placeholder="กรอกนามสกุล"
            disabled={disabled}
            error={!!validationErrors?.lastName}
          />
        </FormField>

        {/* อายุ */}
        <FormField label="อายุ" required error={validationErrors?.age}>
          <Input
            id="age"
            type="number"
            min="18"
            max="120"
            value={formData.age ? formData.age.toString() : ''}
            onChange={(e) => onChange('age', parseInt(e.target.value) || undefined)}
            placeholder="กรอกอายุ"
            disabled={disabled}
            error={!!validationErrors?.age}
            icon={<Calendar className="h-4 w-4" />}
          />
        </FormField>

        {/* เพศ - Minimal Style */}
        <FormField label="เพศ (ไม่บังคับ)">
          <div className="flex gap-2">
            {genderOptions.map((option) => (
              <label 
                key={option.value}
                className={`
                  flex items-center justify-center px-3 py-3 text-sm rounded-lg border cursor-pointer
                  transition-colors duration-150
                  ${(formData.gender || '') === option.value 
                    ? 'border-orange-500 bg-orange-50 text-orange-700' 
                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-600'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <input
                  type="radio"
                  name="gender"
                  value={option.value}
                  checked={(formData.gender || '') === option.value}
                  onChange={(e) => onChange('gender', e.target.value)}
                  disabled={disabled}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </FormField>
      </div>
    </FormSection>
  );
}