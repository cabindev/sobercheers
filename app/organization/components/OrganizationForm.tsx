
// app/organization/components/OrganizationForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X, AlertCircle, Building2, CheckCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { OrganizationCategory } from '@/types/organization';
import { LocationData } from '@/types/location';
import OrganizationSelector from './OrganizationSelector';
import TambonSearch from '../../Buddhist2025/components/TambonSearch';

interface OrganizationFormData {
  firstName: string;
  lastName: string;
  organizationCategoryId?: number;
  organizationCategory?: OrganizationCategory;
  addressLine1: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  type: string;
  phoneNumber: string;
  numberOfSigners: number;
  image1?: File | string;
  image2?: File | string;
  image3?: File | string;
  image4?: File | string;
  image5?: File | string;
}

export default function OrganizationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<OrganizationFormData>({
    firstName: '',
    lastName: '',
    addressLine1: '',
    district: '',
    amphoe: '',
    province: '',
    zipcode: '',
    type: '',
    phoneNumber: '',
    numberOfSigners: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOrganizationSelect = (organizationCategoryId: number, organizationCategory: OrganizationCategory) => {
    setFormData(prev => ({
      ...prev,
      organizationCategoryId,
      organizationCategory
    }));
    if (errors.organizationCategoryId) {
      setErrors(prev => ({ ...prev, organizationCategoryId: '' }));
    }
  };

  const handleLocationSelect = (location: LocationData) => {
    setFormData(prev => ({
      ...prev,
      district: location.district,
      amphoe: location.amphoe,
      province: location.province,
      zipcode: location.zipcode || '',
      type: location.type
    }));
    // Clear location-related errors
    ['district', 'amphoe', 'province', 'zipcode'].forEach(field => {
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    });
  };

  const handleInputChange = (field: keyof OrganizationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (index: number, file: File) => {
    const imageField = `image${index}` as keyof OrganizationFormData;
    setFormData(prev => ({ ...prev, [imageField]: file }));
    if (errors[imageField]) {
      setErrors(prev => ({ ...prev, [imageField]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'ชื่อเป็นข้อมูลที่จำเป็น';
    if (!formData.lastName.trim()) newErrors.lastName = 'นามสกุลเป็นข้อมูลที่จำเป็น';
    if (!formData.organizationCategoryId) newErrors.organizationCategoryId = 'องค์กรเป็นข้อมูลที่จำเป็น';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'ที่อยู่เป็นข้อมูลที่จำเป็น';
    if (!formData.district.trim()) newErrors.district = 'ตำบล/แขวงเป็นข้อมูลที่จำเป็น';
    if (!formData.amphoe.trim()) newErrors.amphoe = 'อำเภอ/เขตเป็นข้อมูลที่จำเป็น';
    if (!formData.province.trim()) newErrors.province = 'จังหวัดเป็นข้อมูลที่จำเป็น';
    if (!formData.zipcode.trim()) newErrors.zipcode = 'รหัสไปรษณีย์เป็นข้อมูลที่จำเป็น';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'เบอร์โทรศัพท์เป็นข้อมูลที่จำเป็น';
    if (!formData.image1) newErrors.image1 = 'รูปภาพที่ 1 เป็นข้อมูลที่จำเป็น';
    if (!formData.image2) newErrors.image2 = 'รูปภาพที่ 2 เป็นข้อมูลที่จำเป็น';

    // Phone number validation
    if (formData.phoneNumber && !/^[0-9]{10}$/.test(formData.phoneNumber.replace(/[-\s]/g, ''))) {
      newErrors.phoneNumber = 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก';
    }

    // Zipcode validation
    if (formData.zipcode && !/^[0-9]{5}$/.test(formData.zipcode)) {
      newErrors.zipcode = 'รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก';
    }

    // Number of signers validation
    if (formData.numberOfSigners < 1) {
      newErrors.numberOfSigners = 'จำนวนผู้ลงนามต้องมากกว่า 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Handle form submission here
      console.log('Form data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      router.push('/organization');
      router.refresh();
    } catch (error) {
      console.error('Error saving organization:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'เกิดข้อผิดพลาด' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border border-orange-200/30">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm bg-white/70 px-3 py-2 rounded-lg border border-gray-200/50 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            ย้อนกลับ
          </button>

          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-200/50">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-light text-gray-900 mb-1">
                ส่งคืนข้อมูลองค์กร
              </h1>
              <p className="text-sm text-gray-500 font-light">
                กรอกข้อมูลองค์กรและรูปภาพเพื่อส่งคืนข้อมูล
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {errors.submit && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-red-200/50 p-4">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shadow-sm shadow-red-200/50 mr-3">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    เกิดข้อผิดพลาด
                  </h3>
                  <p className="text-sm text-gray-600">{errors.submit}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ข้อมูลผู้ส่ง */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/30 p-6">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-emerald-400 to-green-500 shadow-sm shadow-emerald-200/50 w-12 h-12 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-light text-gray-900 mb-1">
                  ข้อมูลผู้ส่ง
                </h2>
                <div className="w-16 h-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อ <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-orange-200/30 rounded-lg focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition-all duration-150 placeholder:text-gray-400 shadow-sm hover:shadow-md text-sm"
                  placeholder="กรอกชื่อ"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-orange-200/30 rounded-lg focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition-all duration-150 placeholder:text-gray-400 shadow-sm hover:shadow-md text-sm"
                  placeholder="กรอกนามสกุล"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* เลือกองค์กร */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/30 p-6">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-orange-400 to-amber-500 shadow-sm shadow-orange-200/50 w-12 h-12 rounded-lg flex items-center justify-center mr-3">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-light text-gray-900 mb-1">
                  องค์กร
                </h2>
                <div className="w-16 h-0.5 rounded-full bg-gradient-to-r from-orange-400 to-amber-500"></div>
              </div>
            </div>

            <OrganizationSelector
              value={formData.organizationCategoryId}
              onChange={handleOrganizationSelect}
              error={errors.organizationCategoryId}
              disabled={isSubmitting}
            />
          </div>

          {/* ที่อยู่ */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/30 p-6">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-400 to-indigo-500 shadow-sm shadow-purple-200/50 w-12 h-12 rounded-lg flex items-center justify-center mr-3">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-light text-gray-900 mb-1">
                  ที่อยู่องค์กร
                </h2>
                <div className="w-16 h-0.5 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500"></div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-2">
                  ที่อยู่ <span className="text-red-500">*</span>
                </label>
                <input
                  id="addressLine1"
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-orange-200/30 rounded-lg focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition-all duration-150 placeholder:text-gray-400 shadow-sm hover:shadow-md text-sm"
                  placeholder="เช่น 123 หมู่ 1"
                />
                {errors.addressLine1 && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.addressLine1}
                  </p>
                )}
              </div>

              <TambonSearch
                onSelectLocation={handleLocationSelect}
                initialLocation={{
                  district: formData.district,
                  amphoe: formData.amphoe,
                  province: formData.province,
                  zipcode: formData.zipcode,
                  type: formData.type,
                  geocode: '',
                  lat: 0,
                  lng: 0
                }}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* ข้อมูลติดต่อ */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/30 p-6">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-amber-400 to-yellow-500 shadow-sm shadow-amber-200/50 w-12 h-12 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-light text-gray-900 mb-1">
                  ข้อมูลติดต่อ
                </h2>
                <div className="w-16 h-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-orange-200/30 rounded-lg focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition-all duration-150 placeholder:text-gray-400 shadow-sm hover:shadow-md text-sm"
                  placeholder="0812345678"
                  maxLength={10}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="numberOfSigners" className="block text-sm font-medium text-gray-700 mb-2">
                  จำนวนผู้ลงนาม <span className="text-red-500">*</span>
                </label>
                <input
                  id="numberOfSigners"
                  type="number"
                  min="1"
                  value={formData.numberOfSigners}
                  onChange={(e) => handleInputChange('numberOfSigners', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-orange-200/30 rounded-lg focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition-all duration-150 placeholder:text-gray-400 shadow-sm hover:shadow-md text-sm"
                  placeholder="1"
                />
                {errors.numberOfSigners && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.numberOfSigners}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* รูปภาพ */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/30 p-6">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-pink-400 to-rose-500 shadow-sm shadow-pink-200/50 w-12 h-12 rounded-lg flex items-center justify-center mr-3">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-light text-gray-900 mb-1">
                  รูปภาพประกอบ
                </h2>
                <div className="w-16 h-0.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-500"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    รูปภาพที่ {index} {index <= 2 && <span className="text-red-500">*</span>}
                  </label>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(index, file);
                      }}
                      className="hidden"
                      id={`image-${index}`}
                    />
                    
                    <label
                      htmlFor={`image-${index}`}
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-6 h-6 mb-2 text-gray-400" />
                        <p className="text-xs text-gray-500">
                          {index <= 2 ? 'เลือกรูปภาพ (บังคับ)' : 'เลือกรูปภาพ (ไม่บังคับ)'}
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  {errors[`image${index}`] && (
                    <p className="text-xs text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors[`image${index}`]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-amber-50/50 border border-amber-200/30 rounded-lg">
              <p className="text-xs text-amber-700">
                💡 <strong>คำแนะนำ:</strong> อัปโลดรูปภาพที่มีความละเอียดดี ไฟล์ไม่เกิน 5MB ต่อรูป รองรับไฟล์ JPG, PNG
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/30 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center justify-center px-6 py-3 bg-white/90 text-gray-600 rounded-lg font-medium hover:bg-gray-50 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 text-sm"
              >
                <X className="h-4 w-4 mr-2" />
                ยกเลิก
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-700 shadow-sm shadow-orange-200/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 sm:ml-auto min-w-[200px] text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    กำลังส่งข้อมูล...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    ส่งข้อมูล
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}