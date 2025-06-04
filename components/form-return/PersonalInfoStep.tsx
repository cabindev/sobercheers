// components/form-return/PersonalInfoStep.tsx
'use client';

import { FormReturnData } from "@/types/form-return";

interface PersonalInfoStepProps {
  data: Partial<FormReturnData>;
  onUpdate: (data: Partial<FormReturnData>) => void;
  isEditing?: boolean;
}

export default function PersonalInfoStep({ data, onUpdate }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            ชื่อ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            value={data.firstName || ""}
            onChange={(e) => onUpdate({ firstName: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="กรอกชื่อ"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            นามสกุล <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            value={data.lastName || ""}
            onChange={(e) => onUpdate({ lastName: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="กรอกนามสกุล"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="organizationName"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          ชื่อองค์กร <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="organizationName"
          value={data.organizationName || ""}
          onChange={(e) => onUpdate({ organizationName: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="เช่น อ.ส.ม / ธ.ก.ส / บริษัท... / วัด... / โรงเรียน..."
        />
      </div>
    </div>
  );
}