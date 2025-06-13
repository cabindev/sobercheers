// app/Buddhist2025/components/BuddhistLentForm.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Buddhist2025FormData } from '@/types/buddhist';
import { GroupCategory } from '@/types/group';
import { LocationData } from '@/types/location';
import { createBuddhist2025 } from '../actions/Post';
import { updateBuddhist2025 } from '../actions/Update';

// Import sections
import PersonalInfoSection from './sections/PersonalInfoSection';
import AddressSection from './sections/AddressSection';
import ContactSection from './sections/ContactSection';
import AlcoholSection from './sections/AlcoholSection';

// Import UI components
import FormSection from './ui/FormSection';
import SuccessScreen from './SuccessScreen';
import GroupSelector from './GroupSelector';
import { ToastContainer, showErrorToast, showPhoneDuplicateToast } from './ui/Toast';

import { ArrowLeft, Save, X, Users, CheckCircle2 } from 'lucide-react';

interface BuddhistLentFormProps {
  initialData?: Buddhist2025FormData;
  isEdit?: boolean;
}

export default function BuddhistLentForm({ initialData, isEdit = false }: BuddhistLentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // ✅ เอา loading state ออก เพื่อความเร็ว
  const [formData, setFormData] = useState<Buddhist2025FormData>({
    id: initialData?.id,
    gender: initialData?.gender || '',
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    age: initialData?.age || undefined,
    addressLine1: initialData?.addressLine1 || '',
    district: initialData?.district || '',
    amphoe: initialData?.amphoe || '',
    province: initialData?.province || '',
    zipcode: initialData?.zipcode || '',
    type: initialData?.type || '',
    phone: initialData?.phone || '',
    alcoholConsumption: initialData?.alcoholConsumption || '',
    drinkingFrequency: initialData?.drinkingFrequency || undefined,
    intentPeriod: initialData?.intentPeriod || undefined,
    monthlyExpense: initialData?.monthlyExpense || undefined,
    motivations: initialData?.motivations || [],
    healthImpact: initialData?.healthImpact || 'ไม่มีผลกระทบ',
    groupCategoryId: initialData?.groupCategoryId || 0,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ✅ ปรับปรุง validation ให้เร็วขึ้น
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.firstName?.trim()) newErrors.firstName = 'กรุณากรอกชื่อ';
    if (!formData.lastName?.trim()) newErrors.lastName = 'กรุณากรอกนามสกุล';
    
    if (!formData.age) {
      newErrors.age = 'กรุณากรอกอายุ';
    } else if (formData.age < 18) {
      newErrors.age = 'อายุต้องมากกว่า 18 ปี';
    } else if (formData.age > 120) {
      newErrors.age = 'กรุณาตรวจสอบอายุอีกครั้ง';
    }

    if (!formData.addressLine1?.trim()) newErrors.addressLine1 = 'กรุณากรอกที่อยู่';
    if (!formData.district?.trim()) newErrors.district = 'กรุณากรอกตำบล/แขวง';
    if (!formData.amphoe?.trim()) newErrors.amphoe = 'กรุณากรอกอำเภอ/เขต';
    if (!formData.province?.trim()) newErrors.province = 'กรุณากรอกจังหวัด';
    if (!formData.zipcode?.trim()) newErrors.zipcode = 'กรุณากรอกรหัสไปรษณีย์';
    
    if (formData.zipcode && !/^\d{5}$/.test(formData.zipcode.trim())) {
      newErrors.zipcode = 'รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก';
    }

    if (!formData.alcoholConsumption) newErrors.alcoholConsumption = 'กรุณาเลือกสถานะการดื่ม';
    if (!formData.healthImpact) newErrors.healthImpact = 'กรุณาเลือกผลกระทบต่อสุขภาพ';
    if (!formData.groupCategoryId) newErrors.groupCategoryId = 'กรุณาเลือกหมวดหมู่กลุ่ม';

    // Conditional validation for drinking history
    const needsAdditionalInfo = [
      'ดื่ม (ย้อนหลังไป 1 ปี)',
      'เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี'
    ].includes(formData.alcoholConsumption || '');

    if (needsAdditionalInfo) {
      if (!formData.drinkingFrequency) newErrors.drinkingFrequency = 'กรุณาเลือกความถี่ในการดื่ม';
      if (!formData.intentPeriod) newErrors.intentPeriod = 'กรุณาเลือกระยะเวลาที่ตั้งใจงดดื่ม';
      if (!formData.monthlyExpense || formData.monthlyExpense <= 0) newErrors.monthlyExpense = 'กรุณากรอกค่าใช้จ่ายต่อเดือน';
    }

    // Phone validation (optional field)
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก';
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // ✅ ปรับปรุงการ scroll ไป error
      const firstErrorField = document.querySelector('[class*="border-red"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const submitData = {
      gender: formData.gender || undefined,
      firstName: formData.firstName?.trim() || '',
      lastName: formData.lastName?.trim() || '',
      age: formData.age!,
      addressLine1: formData.addressLine1?.trim() || '',
      district: formData.district?.trim() || '',
      amphoe: formData.amphoe?.trim() || '',
      province: formData.province?.trim() || '',
      zipcode: formData.zipcode?.trim() || '',
      type: formData.type || undefined,
      phone: formData.phone?.trim() || undefined,
      alcoholConsumption: formData.alcoholConsumption || '',
      drinkingFrequency: formData.drinkingFrequency || undefined,
      intentPeriod: formData.intentPeriod || undefined,
      monthlyExpense: formData.monthlyExpense || undefined,
      motivations: formData.motivations || [],
      healthImpact: formData.healthImpact || 'ไม่มีผลกระทบ',
      groupCategoryId: formData.groupCategoryId || 0,
    };

    startTransition(async () => {
      try {
        let result;
        
        if (isEdit && formData.id) {
          result = await updateBuddhist2025(formData.id, submitData);
        } else {
          result = await createBuddhist2025(submitData);
        }

        if (result.success) {
          setSubmitSuccess(true);
          setTimeout(() => {
            router.push('/Buddhist2025');
            router.refresh();
          }, 1500);
        } else {
          if (result.error?.includes('เบอร์โทรศัพท์') && result.error?.includes('ถูกใช้แล้ว')) {
            showPhoneDuplicateToast(formData.phone || '');
          } else {
            showErrorToast(result.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
          }
        }
      } catch (error) {
        showErrorToast('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
      }
    });
  };

  // ✅ ปรับปรุง input change handler
  const handleInputChange = (field: keyof Buddhist2025FormData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error immediately
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLocationSelect = (location: LocationData) => {
    setFormData(prev => ({
      ...prev,
      district: location.district,
      amphoe: location.amphoe,
      province: location.province,
      zipcode: location.zipcode || '',
      type: location.type,
    }));
    
    // Clear all location-related errors
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      ['district', 'amphoe', 'province', 'zipcode'].forEach(field => {
        delete newErrors[field];
      });
      return newErrors;
    });
  };

  const handleGroupSelect = (groupCategoryId: number, groupCategory: GroupCategory) => {
    setFormData(prev => ({ ...prev, groupCategoryId }));
    if (validationErrors.groupCategoryId) {
      setValidationErrors(prev => ({ ...prev, groupCategoryId: '' }));
    }
  };

  const handleMotivationChange = (motivation: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      motivations: checked
        ? [...(prev.motivations || []), motivation]
        : (prev.motivations || []).filter(m => m !== motivation)
    }));
  };

  if (submitSuccess) {
    return <SuccessScreen isEdit={isEdit} />;
  }

  return (
    <div className="min-h-screen bg-amber-50/30">
      <ToastContainer />

      {/* ✅ Header - ใหม่ เรียบง่าย */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-orange-600 mr-4 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">ย้อนกลับ</span>
            </button>
            
            <div className="flex items-center flex-1">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-500 rounded-lg flex items-center justify-center mr-3">
                <img src="/x-right.png" alt="Logo" className="h-6 w-6 object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {isEdit ? "แก้ไขข้อมูล" : "ลงทะเบียนเข้าพรรษา 2568"}
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  {isEdit ? "แก้ไขข้อมูลผู้สมัคร" : "กรอกข้อมูลเพื่อลงทะเบียน"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Progress Bar - ใหม่ */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="flex items-center text-sm">
            <CheckCircle2 className="h-4 w-4 text-orange-500 mr-2" />
            <span className="text-gray-600">กรอกข้อมูลสมัครสมาชิก</span>
            <div className="flex-1 mx-4 h-1 bg-gray-200 rounded-full">
              <div className="h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full w-1/3"></div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Form Content - เรียบง่าย */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Personal Info */}
          <PersonalInfoSection
            formData={formData}
            validationErrors={validationErrors}
            onChange={handleInputChange}
            disabled={isPending}
          />

          {/* Address */}
          <AddressSection
            formData={formData}
            validationErrors={validationErrors}
            onChange={handleInputChange}
            onLocationSelect={handleLocationSelect}
            disabled={isPending}
          />

          {/* Contact */}
          <ContactSection
            formData={formData}
            validationErrors={validationErrors}
            onChange={handleInputChange}
            disabled={isPending}
          />

          {/* Group */}
          <FormSection title="สังกัดองค์กร" icon={<Users className="h-4 w-4" />}>
            <GroupSelector
              value={formData.groupCategoryId}
              onChange={handleGroupSelect}
              error={validationErrors.groupCategoryId}
              disabled={isPending}
            />
          </FormSection>

          {/* Alcohol */}
          <AlcoholSection
            formData={formData}
            validationErrors={validationErrors}
            onChange={handleInputChange}
            onMotivationChange={handleMotivationChange}
            disabled={isPending}
          />

          {/* ✅ Submit Buttons - ใหม่ เรียบง่าย */}
          <div className="bg-white rounded-lg border shadow-sm p-4 sticky bottom-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              
              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isPending}
                className="w-full sm:w-auto px-6 py-2.5 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 border border-gray-300 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center"
              >
                <X className="h-4 w-4 mr-2" />
                ยกเลิก
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto sm:ml-auto px-8 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center min-w-[160px]"
              >
                {isPending ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEdit ? "บันทึก" : "ลงทะเบียน"}
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

        {/* ✅ Help Section - เล็กลง */}
        <div className="bg-white rounded-lg border shadow-sm p-4 mt-4">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-amber-500 rounded-md flex items-center justify-center mr-2">
              <span className="text-white text-xs font-bold">?</span>
            </div>
            <h3 className="text-base font-semibold text-gray-900">ต้องการความช่วยเหลือ?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">คำแนะนำ</h4>
              <p className="text-gray-600">กรอกข้อมูลให้ครบถ้วน อายุขั้นต่ำ 18 ปี</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">ติดต่อสอบถาม</h4>
              <p className="text-gray-600">
                โทร: <a href="tel:0859387714" className="text-orange-600 hover:underline font-medium">085-938-7714</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}