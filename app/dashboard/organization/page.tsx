// app/dashboard/organization/page.tsx
// หน้ารายการองค์กรใน Dashboard แก้ไขสำหรับ Next.js 15 App Router
import React from 'react';
import Link from 'next/link';
import { Building2, Plus, Search, Eye, Edit, Phone, MapPin, Users, Calendar } from 'lucide-react';
import { getAllOrganizations } from '@/app/organization/actions/Get';
import { getActiveOrganizationCategories } from '@/app/dashboard/organization-category/actions/Get';
import type { Organization, OrganizationCategory } from '@/types/organization';

// ใน Next.js 15 App Router, searchParams เป็น Promise
interface Props {
  searchParams: Promise<{
    search?: string;
    organizationCategoryId?: string;
    province?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function OrganizationListPage({ searchParams }: Props) {
  // รอให้ searchParams resolve เพราะมันเป็น Promise ใน Next.js 15
  const resolvedSearchParams = await searchParams;
  
  const page = parseInt(resolvedSearchParams.page || '1');
  const limit = parseInt(resolvedSearchParams.limit || '10');
  const search = resolvedSearchParams.search || '';
  const organizationCategoryId = resolvedSearchParams.organizationCategoryId ? parseInt(resolvedSearchParams.organizationCategoryId) : undefined;
  const province = resolvedSearchParams.province || '';

  try {
    // ดึงข้อมูลองค์กรและหมวดหมู่
    const [organizationsResult, categoriesResult] = await Promise.all([
      getAllOrganizations({
        page,
        limit,
        search,
        organizationCategoryId,
        province,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }),
      getActiveOrganizationCategories()
    ]);

    const organizations = organizationsResult.data || [];
    const total = organizationsResult.total || 0;
    const totalPages = organizationsResult.totalPages || 1;
    const categories = categoriesResult || [];

    // สถิติแบบง่าย
    const stats = {
      total,
      publicCount: organizations.filter(org => org.type === 'PUBLIC').length,
      privateCount: organizations.filter(org => org.type === 'PRIVATE').length,
      todayCount: organizations.filter(org => {
        const today = new Date().toDateString();
        return new Date(org.createdAt).toDateString() === today;
      }).length
    };

    // ดึงจังหวัดที่ไม่ซ้ำ
    const provinces = Array.from(new Set(organizations.map(org => org.province))).filter(Boolean).sort();

    const formatPhoneNumber = (phone: string) => {
      if (phone.length === 10) {
        return `${phone.slice(0, 2)}-${phone.slice(2, 6)}-${phone.slice(6)}`;
      }
      return phone;
    };

    const getTypeLabel = (type: string) => {
      const labels: Record<string, string> = {
        'PUBLIC': 'ภาครัฐ',
        'PRIVATE': 'เอกชน',
        'NGO': 'NGO',
        'ACADEMIC': 'การศึกษา'
      };
      return labels[type] || type;
    };

    const getTypeColor = (type: string) => {
      return 'bg-gray-100 text-gray-800';
    };

    return (
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Building2 className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h1 className="text-xl font-light text-gray-900">
                รายการองค์กร
              </h1>
              <p className="text-sm font-light text-gray-600">
                จัดการข้อมูลองค์กรทั้งหมดในระบบ ({total.toLocaleString()} รายการ)
              </p>
            </div>
          </div>
          
          <Link
            href="/dashboard/organization/create"
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors text-sm font-light"
          >
            <Plus className="h-4 w-4" />
            <span>เพิ่มองค์กรใหม่</span>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Building2 className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-light text-gray-500">ทั้งหมด</p>
                <p className="text-lg font-light text-gray-900">{stats.total.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-light text-gray-500">ภาครัฐ</p>
                <p className="text-lg font-light text-gray-900">{stats.publicCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Building2 className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-light text-gray-500">เอกชน</p>
                <p className="text-lg font-light text-gray-900">{stats.privateCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-light text-gray-500">เพิ่มวันนี้</p>
                <p className="text-lg font-light text-gray-900">{stats.todayCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <form method="GET" className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="ค้นหาชื่อ นามสกุล หรือเบอร์โทรศัพท์..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm font-light"
                />
              </div>
              
              {/* Filters */}
              <div className="flex space-x-2">
                <select 
                  name="organizationCategoryId"
                  defaultValue={organizationCategoryId?.toString() || ''}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm font-light"
                >
                  <option value="">ทุกหมวดหมู่</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <select 
                  name="province"
                  defaultValue={province}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm font-light"
                >
                  <option value="">ทุกจังหวัด</option>
                  {provinces.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
                
                <button 
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors text-sm font-light"
                >
                  ค้นหา
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Organization Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-light text-gray-900">
                รายการองค์กร
              </h3>
              <div className="flex items-center space-x-2 text-sm font-light text-gray-500">
                <span>แสดง {((page - 1) * limit) + 1}-{Math.min(page * limit, total)} จาก {total.toLocaleString()} รายการ</span>
              </div>
            </div>
          </div>

          {organizations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                      ข้อมูลผู้ติดต่อ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                      องค์กร
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                      ที่อยู่
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                      ผู้ลงนาม
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                      วันที่สร้าง
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-light text-gray-500 uppercase tracking-wider">
                      การดำเนินการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {organizations.map((org) => (
                    <tr key={org.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-light text-gray-900">
                            {org.firstName} {org.lastName}
                          </div>
                          <div className="text-sm font-light text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {formatPhoneNumber(org.phoneNumber)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-light text-gray-900">{org.organizationCategory.name}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-light rounded-full ${getTypeColor(org.type)}`}>
                          {getTypeLabel(org.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-light text-gray-900 flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          {org.province}
                        </div>
                        <div className="text-sm font-light text-gray-500">
                          {org.district}, {org.amphoe}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-light bg-gray-100 text-gray-800">
                          {org.numberOfSigners} คน
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-light text-gray-900">
                        {new Date(org.createdAt).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <Link
                            href={`/dashboard/organization/view/${org.id}`}
                            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                            title="ดูข้อมูล"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/dashboard/organization/edit/${org.id}`}
                            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                            title="แก้ไข"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-light text-gray-900 mb-2">ไม่พบข้อมูลองค์กร</h3>
              <p className="text-gray-500 mb-4 font-light">
                {search || organizationCategoryId || province 
                  ? 'ไม่พบองค์กรที่ตรงกับเงื่อนไขการค้นหา' 
                  : 'ยังไม่มีข้อมูลองค์กรในระบบ'
                }
              </p>
              {!search && !organizationCategoryId && !province && (
                <Link
                  href="/dashboard/organization/create"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors text-sm font-light"
                >
                  <Plus className="h-4 w-4" />
                  <span>เพิ่มองค์กรใหม่</span>
                </Link>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm font-light text-gray-700">
                  แสดงหน้า <span className="font-normal">{page}</span> จาก{' '}
                  <span className="font-normal">{totalPages}</span> หน้า
                </div>
                <div className="flex items-center space-x-2">
                  {page > 1 && (
                    <Link
                      href={`/dashboard/organization?${new URLSearchParams({
                        ...resolvedSearchParams,
                        page: (page - 1).toString()
                      }).toString()}`}
                      className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors font-light"
                    >
                      ก่อนหน้า
                    </Link>
                  )}
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <Link
                        key={pageNum}
                        href={`/dashboard/organization?${new URLSearchParams({
                          ...resolvedSearchParams,
                          page: pageNum.toString()
                        }).toString()}`}
                        className={`px-3 py-1 text-sm border rounded transition-colors font-light ${
                          pageNum === page
                            ? 'border-gray-500 bg-gray-100 text-gray-900'
                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                  
                  {page < totalPages && (
                    <Link
                      href={`/dashboard/organization?${new URLSearchParams({
                        ...resolvedSearchParams,
                        page: (page + 1).toString()
                      }).toString()}`}
                      className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors font-light"
                    >
                      ถัดไป
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading organizations:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-light text-gray-900 mb-2">
            เกิดข้อผิดพลาด | Error Occurred
          </h1>
          <p className="text-sm font-light text-gray-500 mb-4">
            ไม่สามารถโหลดข้อมูลองค์กรได้ | Unable to load organization data
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors text-sm font-light"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }
}

export const metadata = {
  title: 'รายการองค์กร - Dashboard | Organization List - Dashboard',
  description: 'จัดการข้อมูลองค์กรทั้งหมดในระบบ | Manage all organization data in the system',
};
