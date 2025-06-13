// app/Buddhist2025/components/sections/AlcoholSection.tsx
import { Buddhist2025FormData } from '@/types/buddhist';
import FormSection from '../ui/FormSection';
import { FormField, Input, RadioGroup } from '../ui/FormField';
import MotivationSelector from './MotivationSelector';
import { Shield, DollarSign, Info } from 'lucide-react';

interface AlcoholSectionProps {
  formData: Buddhist2025FormData;
  validationErrors: Record<string, string>;
  onChange: (field: keyof Buddhist2025FormData, value: string | number | undefined) => void;
  onMotivationChange: (motivation: string, checked: boolean) => void;
  disabled: boolean;
}

const alcoholConsumptionOptions = [
  { 
    value: 'ดื่ม (ย้อนหลังไป 1 ปี)', 
    label: 'ดื่มเครื่องดื่มแอลกอฮอล์ (ย้อนหลังไป 1 ปี)',
    description: 'ได้ดื่มเครื่องดื่มแอลกอฮอล์ในช่วง 12 เดือนที่ผ่านมา'
  },
  { 
    value: 'เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี', 
    label: 'เลิกดื่มมาแล้ว 1-3 ปี',
    description: 'เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี'
  },
  { 
    value: 'เลิกดื่มมาแล้วมากกว่า 3 ปี', 
    label: 'เลิกดื่มมาแล้วมากกว่า 3 ปี',
    description: 'หยุดดื่มเครื่องดื่มแอลกอฮอล์มาแล้วเป็นเวลานาน'
  },
  { 
    value: 'ไม่เคยดื่มเลยตลอดชีวิต', 
    label: 'ไม่เคยดื่มเลยตลอดชีวิต',
    description: 'ไม่เคยบริโภคเครื่องดื่มแอลกอฮอล์เลย'
  }
];

const drinkingFrequencyOptions = [
  { value: 'ทุกวัน (7 วัน/สัปดาห์)', label: 'ทุกวัน (7 วัน/สัปดาห์)' },
  { value: 'เกือบทุกวัน (3-5 วัน/สัปดาห์)', label: 'เกือบทุกวัน (3-5 วัน/สัปดาห์)' },
  { value: 'ทุกสัปดาห์ (1-2 วัน/สัปดาห์)', label: 'ทุกสัปดาห์ (1-2 วัน/สัปดาห์)' },
  { value: 'ทุกเดือน (1-3 วัน/เดือน)', label: 'ทุกเดือน (1-3 วัน/เดือน)' },
  { value: 'นาน ๆ ครั้ง (8-11 วัน/ปี)', label: 'นาน ๆ ครั้ง (8-11 วัน/ปี)' }
];

const intentPeriodOptions = [
  { value: '1 เดือน', label: '1 เดือน' },
  { value: '2 เดือน', label: '2 เดือน' },
  { value: '3 เดือน', label: '3 เดือน' },
  { value: 'ตลอดชีวิต', label: 'ตลอดชีวิต' },
  { value: 'ลดปริมาณการดื่ม', label: 'ลดปริมาณการดื่ม' }
];

const healthImpactOptions = [
  { value: 'ไม่มีผลกระทบ', label: 'ไม่มีผลกระทบ' },
  { value: 'มีผลกระทบแต่ไม่ต้องการช่วยเหลือ', label: 'มีผลกระทบแต่ไม่ต้องการช่วยเหลือ' },
  { value: 'มีผลกระทบและควรได้รับการช่วยเหลือจากแพทย์หรือผู้เชี่ยวชาญด้านการบำบัดสุรา', label: 'ต้องการความช่วยเหลือจากผู้เชี่ยวชาญ' }
];

// ✅ Simple Radio แก้สี - Orange Theme
function SimpleRadio({ options, name, value, onChange, disabled }: {
  options: { value: string; label: string }[];
  name: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label 
          key={option.value}
          className="flex items-center text-sm cursor-pointer hover:bg-orange-50 p-2 rounded transition-colors"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500 mr-3 flex-shrink-0"
          />
          <span className="text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

export default function AlcoholSection({ 
  formData, 
  validationErrors, 
  onChange, 
  onMotivationChange, 
  disabled 
}: AlcoholSectionProps) {
  const needsAdditionalInfo = [
    'ดื่ม (ย้อนหลังไป 1 ปี)',
    'เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี'
  ].includes(formData.alcoholConsumption || '');

  return (
    <FormSection title="ข้อมูลการดื่มแอลกอฮอล์" icon={<Shield className="h-5 w-5" />}>
      <div className="space-y-6">
        {/* สถานะการดื่ม */}
        <FormField 
          label="ท่านดื่มเครื่องดื่มแอลกอฮอล์หรือไม่" 
          required 
          error={validationErrors.alcoholConsumption}
        >
          <RadioGroup
            name="alcoholConsumption"
            options={alcoholConsumptionOptions}
            value={formData.alcoholConsumption}
            onChange={(value) => onChange('alcoholConsumption', value)}
            disabled={disabled}
            error={!!validationErrors.alcoholConsumption}
          />
        </FormField>

        {/* ข้อมูลเพิ่มเติมสำหรับผู้ที่ดื่ม - Orange Theme */}
        {needsAdditionalInfo && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center mb-3">
              <Info className="h-5 w-5 text-orange-600 mr-2" />
              <h3 className="text-base font-semibold text-orange-900">ข้อมูลเพิ่มเติม</h3>
            </div>

            {/* ความถี่ในการดื่ม */}
            <FormField 
              label="ความถี่ในการดื่ม" 
              required 
              error={validationErrors.drinkingFrequency}
            >
              <SimpleRadio
                options={drinkingFrequencyOptions}
                name="drinkingFrequency"
                value={formData.drinkingFrequency}
                onChange={(value) => onChange('drinkingFrequency', value)}
                disabled={disabled}
              />
            </FormField>

            {/* ค่าใช้จ่ายต่อเดือน */}
            <FormField 
              label="ค่าใช้จ่ายต่อเดือน (บาท)" 
              required 
              error={validationErrors.monthlyExpense}
            >
              <Input
                type="number"
                value={formData.monthlyExpense || ''}
                onChange={(e) => onChange('monthlyExpense', parseInt(e.target.value) || undefined)}
                placeholder="กรอกจำนวนเงิน"
                min="0"
                disabled={disabled}
                icon={<DollarSign className="h-4 w-4" />}
                error={!!validationErrors.monthlyExpense}
              />
            </FormField>

            {/* ระยะเวลาที่ตั้งใจงดดื่ม */}
            <FormField 
              label="ตั้งใจงดดื่มเป็นระยะเวลาเท่าไร" 
              required 
              error={validationErrors.intentPeriod}
            >
              <SimpleRadio
                options={intentPeriodOptions}
                name="intentPeriod"
                value={formData.intentPeriod}
                onChange={(value) => onChange('intentPeriod', value)}
                disabled={disabled}
              />
            </FormField>
          </div>
        )}

        {/* แรงจูงใจ */}
        <FormField label="แรงจูงใจในการงดเหล้า (เลือกได้หลายข้อ)">
          <MotivationSelector
            selectedMotivations={formData.motivations || []}
            onChange={onMotivationChange}
            disabled={disabled}
          />
        </FormField>

        {/* ผลกระทบต่อสุขภาพ */}
        <FormField 
          label="ผลกระทบต่อสุขภาพ" 
          required 
          error={validationErrors.healthImpact}
        >
          <select
            value={formData.healthImpact || 'ไม่มีผลกระทบ'}
            onChange={(e) => onChange('healthImpact', e.target.value)}
            disabled={disabled}
            className={`
              w-full px-4 py-3 bg-white border rounded-lg
              text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none
              transition-colors duration-200
              ${validationErrors.healthImpact ? 'border-red-400' : 'border-gray-300'}
            `}
          >
            {healthImpactOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        {/* แสดงคำแนะนำตามผลกระทบ - Orange Theme */}
        {formData.healthImpact === 'มีผลกระทบและควรได้รับการช่วยเหลือจากแพทย์หรือผู้เชี่ยวชาญด้านการบำบัดสุรา' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-800 mb-1">คำแนะนำ</h4>
                <p className="text-sm text-amber-700">
                  เราขอแนะนำให้ท่านปรึกษาแพทย์หรือผู้เชี่ยวชาญด้านการบำบัดสุราเพื่อการช่วยเหลือที่เหมาะสม 
                  โครงการของเราจะให้การสนับสนุนและติดตามดูแลอย่างใกล้ชิด
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
}