// app/organization/components/OrganizationView.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Organization } from '@/types/organization';
import { 
  ArrowLeft, Edit, Building2, User, MapPin, Phone, 
  Users, Calendar, Tag, Image as ImageIcon, Download, 
  ExternalLink, CheckCircle, Clock
} from 'lucide-react';

interface OrganizationViewProps {
  organization: Organization;
}

export default function OrganizationView({ organization }: OrganizationViewProps) {
  const router = useRouter();

  const images = [
    organization.image1,
    organization.image2,
    organization.image3,
    organization.image4,
    organization.image5
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-3 transition-colors duration-200 text-sm font-light"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            ย้อนกลับ
          </button>

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-sm">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-light text-gray-900">
                  {organization.firstName} {organization.lastName}
                </h1>
                <p className="text-sm text-gray-500 font-light">
                  ข้อมูลส่งคืนจาก {organization.organizationCategory.name}
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  ส่งเมื่อ {new Date(organization.createdAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                href={`/organization/edit/${organization.id}`}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-150 flex items-center shadow-sm shadow-orange-200/50 text-sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                แก้ไขข้อมูล
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">ผู้ส่งข้อมูล</p>
                <p className="text-sm font-medium text-gray-900">
                  {organization.firstName} {organization.lastName}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <Building2 className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">องค์กร</p>
                <p className="text-sm font-medium text-gray-900">
                  {organization.organizationCategory.name}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">ผู้ลงนาม</p>
                <p className="text-sm font-medium text-gray-900">
                  {organization.numberOfSigners} คน
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                <ImageIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">รูปภาพ</p>
                <p className="text-sm font-medium text-gray-900">
                  {images.length}/5 รูป
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ข้อมูลองค์กร */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-500 rounded-lg flex items-center justify-center mr-3">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-light text-gray-900">ข้อมูลองค์กร</h2>
                  <p className="text-sm text-gray-500 font-light">รายละเอียดองค์กรที่ส่งข้อมูล</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Building2 className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">ชื่อองค์กร</p>
                  <p className="text-sm text-gray-900">{organization.organizationCategory.name}</p>
                  {organization.organizationCategory.shortName && (
                    <p className="text-xs text-gray-500">({organization.organizationCategory.shortName})</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Tag className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">ประเภทองค์กร</p>
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
                    {organization.organizationCategory.categoryType}
                  </div>
                </div>
              </div>

              {organization.organizationCategory.description && (
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-1">คำอธิบาย</p>
                    <p className="text-sm text-gray-900">{organization.organizationCategory.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ข้อมูลติดต่อ */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg flex items-center justify-center mr-3">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-light text-gray-900">ข้อมูลติดต่อ</h2>
                  <p className="text-sm text-gray-500 font-light">ข้อมูลการติดต่อและผู้ลงนาม</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">ผู้ส่งข้อมูล</p>
                  <p className="text-sm text-gray-900">{organization.firstName} {organization.lastName}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Phone className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">เบอร์โทรศัพท์</p>
                  <a 
                    href={`tel:${organization.phoneNumber}`}
                    className="text-sm text-orange-600 hover:text-orange-700 transition-colors duration-200"
                  >
                    {organization.phoneNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Users className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">จำนวนผู้ลงนาม</p>
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800">
                    {organization.numberOfSigners} คน
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Calendar className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">วันที่ส่งข้อมูล</p>
                  <p className="text-sm text-gray-900">
                    {new Date(organization.createdAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ที่อยู่ */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-light text-gray-900">ที่อยู่องค์กร</h2>
                <p className="text-sm text-gray-500 font-light">ที่อยู่ที่ตั้งขององค์กร</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">ที่อยู่</p>
                <p className="text-sm text-gray-900">{organization.addressLine1}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">ตำบล/แขวง</p>
                <p className="text-sm text-gray-900">{organization.type}{organization.district}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">อำเภอ/เขต</p>
                <p className="text-sm text-gray-900">อำเภอ{organization.amphoe}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">จังหวัด</p>
                <p className="text-sm text-gray-900">จังหวัด{organization.province}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <MapPin className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">รหัสไปรษณีย์</p>
                  <p className="text-sm text-gray-900">{organization.zipcode}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>ที่อยู่เต็ม:</strong> {organization.addressLine1} {organization.type}{organization.district} 
                อำเภอ{organization.amphoe} จังหวัด{organization.province} {organization.zipcode}
              </p>
            </div>
          </div>
        </div>

        {/* รูปภาพ */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-500 rounded-lg flex items-center justify-center mr-3">
                  <ImageIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-light text-gray-900">รูปภาพประกอบ</h2>
                  <p className="text-sm text-gray-500 font-light">รูปภาพที่ส่งมาพร้อมข้อมูล ({images.length}/5 รูป)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map((index) => {
                  const image = (organization as any)[`image${index}`];
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">รูปภาพที่ {index}</p>
                        {image && (
                          <div className="flex items-center space-x-2">
                            <div className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              มีรูปภาพ
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className={`relative w-full h-48 rounded-lg border-2 border-dashed ${
                        image ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
                      }`}>
                        {image ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <ImageIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                              <p className="text-sm text-green-700 font-medium">รูปภาพพร้อมแล้ว</p>
                              <button className="mt-2 inline-flex items-center px-3 py-1 text-xs text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors duration-200">
                                <Download className="h-3 w-3 mr-1" />
                                ดาวน์โหลด
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">ไม่มีรูปภาพ</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">ไม่มีรูปภาพ</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/organization/edit/${organization.id}`}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-700 transition-all duration-150 text-sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              แก้ไขข้อมูล
            </Link>
            
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center px-6 py-3 bg-white text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all duration-150 text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              พิมพ์ข้อมูล
            </button>
            
            <Link
              href="/organization"
              className="flex items-center justify-center px-6 py-3 bg-white text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all duration-150 text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปรายการ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}