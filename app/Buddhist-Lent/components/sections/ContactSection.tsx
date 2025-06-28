// app/Buddhist2025/components/sections/ContactSection.tsx
import { Buddhist2025FormData } from '@/types/buddhist';
import FormSection from '../ui/FormSection';
import { FormField, Input } from '../ui/FormField';
import { Phone } from 'lucide-react';

interface ContactSectionProps {
  formData: Buddhist2025FormData;
  validationErrors: Record<string, string>;
  onChange: (field: keyof Buddhist2025FormData, value: string | number | undefined) => void;
  disabled: boolean;
}

export default function ContactSection({ 
  formData, 
  validationErrors, 
  onChange, 
  disabled 
}: ContactSectionProps) {
  if (!formData) {
    return (
      <FormSection title="ข้อมูลติดต่อ" icon={<Phone className="h-4 w-4" />}>
        <div className="animate-pulse">
          <div className="max-w-sm">
            <div className="h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </FormSection>
    );
  }

  const handlePhoneChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    onChange('phone', numericValue || undefined);
  };

  return (
    <FormSection title="ข้อมูลติดต่อ" icon={<Phone className="h-4 w-4" />}>
      <div className="max-w-md">
        <FormField label="เบอร์โทรศัพท์ (ไม่บังคับ)" error={validationErrors?.phone}>
          <Input
            id="phone"
            type="tel"
            value={formData.phone || ''} 
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="กรอกเบอร์โทรศัพท์ 10 หลัก"
            disabled={disabled}
            error={!!validationErrors?.phone}
            icon={<Phone className="h-4 w-4" />}
            maxLength={10}
          />
          <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
            ตัวอย่าง: 0812345678
          </div>
        </FormField>
      </div>
    </FormSection>
  );
}