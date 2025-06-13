// app/Buddhist2025/components/sections/AddressSection.tsx
import { Buddhist2025FormData } from '@/types/buddhist';
import { LocationData } from '@/types/location';
import FormSection from '../ui/FormSection';
import { FormField, Input } from '../ui/FormField';
import TambonSearch from '../TambonSearch';
import { MapPin, Home } from 'lucide-react';

interface AddressSectionProps {
  formData: Buddhist2025FormData;
  validationErrors: Record<string, string>;
  onChange: (field: keyof Buddhist2025FormData, value: string | number | undefined) => void;
  onLocationSelect: (location: LocationData) => void;
  disabled: boolean;
}
// app/Buddhist2025/components/sections/AddressSection.tsx - เพิ่ม safety checks
export default function AddressSection({ 
  formData, 
  validationErrors, 
  onChange, 
  onLocationSelect, 
  disabled 
}: AddressSectionProps) {
  // ✅ เพิ่ม safety check
  if (!formData) {
    return (
      <FormSection title="ข้อมูลที่อยู่" icon={<MapPin className="h-5 w-5" />}>
        <div className="animate-pulse">
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </FormSection>
    );
  }

  const hasLocationError = validationErrors?.district || 
                          validationErrors?.amphoe || 
                          validationErrors?.province || 
                          validationErrors?.zipcode;

  return (
    <FormSection title="ข้อมูลที่อยู่" icon={<MapPin className="h-5 w-5" />}>
      <div className="space-y-4">
        {/* ที่อยู่ */}
        <FormField 
          label="ที่อยู่ (เลขที่/หมู่บ้าน)" 
          required 
          error={validationErrors?.addressLine1}
        >
          <Input
            id="addressLine1"
            type="text"
            value={formData.addressLine1 || ''} 
            onChange={(e) => onChange('addressLine1', e.target.value)}
            placeholder="เลขที่ ซอย ถนน หมู่บ้าน"
            disabled={disabled}
            error={!!validationErrors?.addressLine1}
            icon={<Home className="h-4 w-4" />}
          />
        </FormField>

        {/* ตำบล อำเภอ จังหวัด - ใช้ TambonSearch */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-2">
            ตำบล/แขวง อำเภอ/เขต จังหวัด <span className="text-red-500">*</span>
          </label>
          
          <TambonSearch
            onSelectLocation={onLocationSelect}
            initialLocation={formData.district ? {
              district: formData.district,
              amphoe: formData.amphoe,
              province: formData.province,
              type: formData.type || '',
              geocode: '',
              lat: 0,
              lng: 0,
              zipcode: formData.zipcode
            } : undefined}
            disabled={disabled}
          />
          
          {hasLocationError && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน
              </p>
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
}