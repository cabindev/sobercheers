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

// app/Buddhist2025/components/sections/ContactSection.tsx - เพิ่ม safety checks
export default function ContactSection({ 
  formData, 
  validationErrors, 
  onChange, 
  disabled 
}: ContactSectionProps) {
  // ✅ เพิ่ม safety check
  if (!formData) {
    return (
      <FormSection title="ข้อมูลติดต่อ" icon={<Phone className="h-5 w-5" />}>
        <div className="animate-pulse">
          <div className="max-w-sm">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </FormSection>
    );
  }

  const handlePhoneChange = (value: string) => {
    // Remove non-numeric characters and limit to 10 digits
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    onChange('phone', numericValue || undefined);
  };

  return (
    <FormSection title="ข้อมูลติดต่อ" icon={<Phone className="h-5 w-5" />}>
      <div className="max-w-sm">
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
          <div className="mt-1 text-xs text-gray-500">
            ตัวอย่าง: 0812345678
          </div>
        </FormField>
      </div>
    </FormSection>
  );
}