'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createGroupCategory } from '../actions/Post';
import { updateGroupCategory } from '../actions/Update';
import { ArrowLeft, Save, X, AlertCircle, Users, CheckCircle, Sparkles } from 'lucide-react';

interface GroupCategoryFormData {
  id?: number;
  name: string;
  description?: string;
}

interface GroupCategoryFormProps {
  initialData?: GroupCategoryFormData;
  isEdit?: boolean;
}

export default function GroupCategoryForm({ initialData, isEdit = false }: GroupCategoryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'ชื่อหมวดหมู่เป็นข้อมูลที่จำเป็น';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'ชื่อหมวดหมู่ต้องไม่เกิน 100 ตัวอักษร';
    }

    if (formData.description && formData.description.trim().length > 500) {
      newErrors.description = 'คำอธิบายต้องไม่เกิน 500 ตัวอักษร';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      if (isEdit && initialData?.id) {
        await updateGroupCategory(initialData.id, {
          name: formData.name.trim(),
          description: formData.description?.trim() || undefined
        });
      } else {
        await createGroupCategory({
          name: formData.name.trim(),
          description: formData.description?.trim() || undefined
        });
      }
      
      router.push('/group-category');
      router.refresh();
    } catch (error) {
      console.error('Error saving group category:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'เกิดข้อผิดพลาด' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: 'name' | 'description', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header with Glass Effect */}
      <div className="bg-white/80 backdrop-blur-sm shadow-2xl border border-amber-200/50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-700 hover:text-gray-900 mb-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md bg-white/80 px-4 py-2 rounded-lg border border-gray-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            ย้อนกลับ
          </button>

          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-200">
              <Users className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isEdit ? 'แก้ไขหมวดหมู่องค์กร' : 'เพิ่มหมวดหมู่องค์กรใหม่'}
              </h1>
              <p className="text-gray-600 leading-relaxed">
                {isEdit ? 'แก้ไขข้อมูลหมวดหมู่สำหรับโครงการเข้าพรรษา 2568' : 'เพิ่มหมวดหมู่ใหม่สำหรับโครงการเข้าพรรษา 2568'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Error Alert */}
        {errors.submit && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-red-200/50 p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-200 mr-4">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    เกิดข้อผิดพลาด
                  </h3>
                  <p className="text-gray-600">{errors.submit}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-200/50 p-6">
            <div className="flex items-center justify-between text-sm mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-800 font-semibold">ขั้นตอนที่ 1</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-600">กรอกข้อมูลหมวดหมู่องค์กร</span>
              </div>
            </div>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full w-1/2 transition-all duration-500"></div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8 transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-200 w-16 h-16 rounded-full flex items-center justify-center mr-4 transition-all duration-300 hover:scale-110">
                <div className="text-white">
                  <Sparkles className="h-8 w-8" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ข้อมูลหมวดหมู่
                </h2>
                <div className="w-20 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* ชื่อหมวดหมู่ */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-3">
                  ชื่อหมวดหมู่ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    maxLength={100}
                    className="w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border-2 border-amber-200/20 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 placeholder:text-gray-400 shadow-sm hover:shadow-md"
                    placeholder="เช่น ชุมชน, โรงงาน, หน่วยงานราชการ, องค์กรปกครองส่วนท้องถิ่น"
                  />
                </div>
                {errors.name && (
                  <div className="mt-2 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-lg shadow-sm">
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      {errors.name}
                    </p>
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-500 flex items-center">
                  <span className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${formData.name.length > 80 ? 'bg-red-400' : formData.name.length > 60 ? 'bg-amber-400' : 'bg-green-400'}`}></span>
                    {formData.name.length}/100 ตัวอักษร
                  </span>
                </p>
              </div>

              {/* คำอธิบาย */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-3">
                  คำอธิบาย
                </label>
                <textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border-2 border-amber-200/20 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 placeholder:text-gray-400 shadow-sm hover:shadow-md resize-none"
                  placeholder="คำอธิบายเพิ่มเติมเกี่ยวกับหมวดหมู่นี้ เช่น ประเภทของกลุ่ม หรือลักษณะเฉพาะ"
                />
                {errors.description && (
                  <div className="mt-2 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-lg shadow-sm">
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      {errors.description}
                    </p>
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-500 flex items-center">
                  <span className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${(formData.description || '').length > 400 ? 'bg-red-400' : (formData.description || '').length > 300 ? 'bg-amber-400' : 'bg-green-400'}`}></span>
                    {(formData.description || '').length}/500 ตัวอักษร
                  </span>
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-6">
                  <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex items-center justify-center px-8 py-4 bg-white/90 text-gray-700 rounded-lg font-medium hover:bg-gray-50 border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <X className="h-5 w-5 mr-2" />
                      ยกเลิก
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 sm:ml-auto min-w-[200px]"
                    >
                      <div className="flex items-center">
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                            กำลังบันทึก...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            {isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มหมวดหมู่'}
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-200/50 p-8">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 mr-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  💡 คำแนะนำการสร้างหมวดหมู่
                </h4>
                <p className="text-gray-600">
                  เทิปสำหรับการสร้างหมวดหมู่ที่มีประสิทธิภาพ
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[
                  "ตั้งชื่อหมวดหมู่ให้สั้นและเข้าใจง่าย",
                  "เพิ่มคำอธิบายเพื่อให้ผู้สมัครเข้าใจประเภทของกลุ่ม",
                  "หมวดหมู่ที่สร้างแล้วจะใช้งานได้ทันที",
                  "สามารถแก้ไขข้อมูลหมวดหมู่ได้ภายหลัง"
                ].map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 rounded-lg bg-emerald-50/60"
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50/60 border border-blue-200/50 rounded-xl">
                  <h5 className="text-sm font-semibold text-blue-800 mb-2">ตัวอย่างหมวดหมู่</h5>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>• ชุมชน - กลุ่มคนในชุมชนเดียวกัน</p>
                    <p>• โรงงาน - พนักงานในสถานประกอบการ</p>
                    <p>• หน่วยงานราชการ - ข้าราชการและลูกจ้าง</p>
                    <p>• องค์กรปกครองส่วนท้องถิ่น - เทศบาล อบต.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}