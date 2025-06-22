// app/organization/components/OrganizationList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Organization, OrganizationCategory } from '@/types/organization';
import { getAllOrganizations, OrganizationFilters } from '../actions/Get';
import { deleteOrganization } from '../actions/Delete';
import { getActiveOrganizationCategories } from '@/app/dashboard/organization-category/actions/Get';
import { 
  Edit, Trash2, Plus, Search, Building2, 
  X, Eye, BarChart3, Calendar, 
  Phone, MapPin, Users, Image as ImageIcon, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function OrganizationList() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationCategories, setOrganizationCategories] = useState<OrganizationCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<number | ''>('');
  const [filterProvince, setFilterProvince] = useState('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrganizations, setTotalOrganizations] = useState(0);
  const [sortBy, setSortBy] = useState<'firstName' | 'createdAt' | 'numberOfSigners'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [provinces, setProvinces] = useState<string[]>([]);

  useEffect(() => {
    loadOrganizationCategories();
  }, []);

  useEffect(() => {
    loadOrganizations();
  }, [searchTerm, filterCategory, filterProvince, currentPage, sortBy, sortOrder]);

  const loadOrganizationCategories = async () => {
    try {
      const categories = await getActiveOrganizationCategories();
      setOrganizationCategories(categories);
    } catch (error) {
      console.error('Error loading organization categories:', error);
    }
  };

  const loadOrganizations = async () => {
    try {
      setIsLoading(true);
      const filters: OrganizationFilters = {
        search: searchTerm || undefined,
        organizationCategoryId: filterCategory || undefined,
        province: filterProvince || undefined,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: 15
      };

      const result = await getAllOrganizations(filters);
      setOrganizations(result.data);
      setTotalPages(result.totalPages);
      setTotalOrganizations(result.total);

      // Extract unique provinces
      const uniqueProvinces = Array.from(
        new Set(result.data.map(org => org.province))
      ).filter(Boolean).sort();
      setProvinces(uniqueProvinces);

    } catch (error) {
      console.error('Error loading organizations:', error);
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`คุณต้องการลบข้อมูลของ "${name}" หรือไม่?\n\nการลบนี้ไม่สามารถย้อนกลับได้`)) return;

    try {
      setIsDeleting(id);
      const result = await deleteOrganization(id);
      
      if (result.success) {
        await loadOrganizations();
        alert('ลบข้อมูลเรียบร้อยแล้ว');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setIsDeleting(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="flex flex-col justify-center items-center min-h-96 space-y-4">
          <div className="relative">
            <div className="w-10 h-10 border-4 border-orange-200 rounded-full animate-spin border-t-orange-600"></div>
          </div>
          <div className="text-center">
            <h3 className="text-base font-light text-gray-900">กำลังโหลดข้อมูล</h3>
            <p className="text-sm text-gray-500 font-light">โปรดรอสักครู่...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-500 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-light text-gray-900">ข้อมูลส่งคืนองค์กร</h1>
                <p className="text-sm text-gray-500 font-light">จัดการข้อมูลที่ส่งคืนจากองค์กรต่างๆ</p>
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  ทั้งหมด {totalOrganizations} รายการ
                </div>
              </div>
            </div>
            
            <Link
              href="/organization/create"
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-light py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center shadow-sm text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มข้อมูลใหม่
            </Link>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, เบอร์โทร, ที่อยู่..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 w-full py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition-colors duration-200 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value ? parseInt(e.target.value) : '');
                  setCurrentPage(1);
                }}
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 text-sm min-w-[140px]"
              >
                <option value="">ทุกองค์กร</option>
                {organizationCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <select
                value={filterProvince}
                onChange={(e) => {
                  setFilterProvince(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 text-sm min-w-[120px]"
              >
                <option value="">ทุกจังหวัด</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy as typeof sortBy);
                  setSortOrder(newSortOrder as typeof sortOrder);
                  setCurrentPage(1);
                }}
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 text-sm min-w-[140px]"
              >
                <option value="createdAt-desc">วันที่ส่ง (ใหม่-เก่า)</option>
                <option value="createdAt-asc">วันที่ส่ง (เก่า-ใหม่)</option>
                <option value="firstName-asc">ชื่อ (ก-ฮ)</option>
                <option value="firstName-desc">ชื่อ (ฮ-ก)</option>
                <option value="numberOfSigners-desc">จำนวนผู้ลงนาม (มาก-น้อย)</option>
              </select>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              แสดง {organizations.length} จาก {totalOrganizations} รายการ
            </div>
            <div className="text-xs text-gray-400">
              หน้า {currentPage} จาก {totalPages}
            </div>
          </div>
        </div>

        {/* Content */}
        {organizations.length > 0 ? (
          <>
            {/* Cards Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {organizations.map((org) => (
                <div key={org.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg flex items-center justify-center mr-3">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {org.firstName} {org.lastName}
                          </h3>
                          <p className="text-xs text-gray-500">ID: {org.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Link
                          href={`/organization/view/${org.id}`}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors duration-200"
                          title="ดูรายละเอียด"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        
                        <Link
                          href={`/organization/edit/${org.id}`}
                          className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors duration-200"
                          title="แก้ไข"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(org.id, `${org.firstName} ${org.lastName}`)}
                          disabled={isDeleting === org.id}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors duration-200 disabled:opacity-50"
                          title="ลบ"
                        >
                          {isDeleting === org.id ? (
                            <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Organization */}
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {org.organizationCategory.name}
                      </p>
                      {org.organizationCategory.shortName && (
                        <p className="text-xs text-gray-500 mb-1">
                          ({org.organizationCategory.shortName})
                        </p>
                      )}
                      <div className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-800">
                        {org.organizationCategory.categoryType}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="mb-3">
                      <div className="flex items-start text-sm text-gray-600 mb-1">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="truncate">{org.addressLine1}</p>
                          <p className="text-xs text-gray-500">
                            {org.type}{org.district}, อ.{org.amphoe}, จ.{org.province} {org.zipcode}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-600 truncate">{org.phoneNumber}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-600">{org.numberOfSigners} คน</span>
                      </div>
                    </div>

                    {/* Images */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {[org.image1, org.image2, org.image3, org.image4, org.image5].map((image, index) => (
                            <div 
                              key={index} 
                              className={`w-5 h-5 rounded border flex items-center justify-center ${
                                image ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'
                              }`}
                            >
                              <ImageIcon className={`h-3 w-3 ${image ? 'text-green-600' : 'text-gray-400'}`} />
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {[org.image1, org.image2, org.image3, org.image4, org.image5].filter(Boolean).length}/5 รูป
                        </span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <Calendar className="h-3 w-3 mr-1" />
                      ส่งเมื่อ {new Date(org.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 font-light">
                    แสดง {((currentPage - 1) * 15) + 1} ถึง {Math.min(currentPage * 15, totalOrganizations)} จาก {totalOrganizations} รายการ
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-light"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      ก่อนหน้า
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 font-light ${
                              currentPage === pageNum
                                ? 'bg-orange-500 text-white'
                                : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-light"
                    >
                      ถัดไป
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-light text-gray-900 mb-2">ไม่พบข้อมูล</h3>
            <p className="text-sm text-gray-500 font-light mb-5">
              {searchTerm || filterCategory || filterProvince
                ? 'ลองปรับเปลี่ยนเงื่อนไขการค้นหา' 
                : 'ยังไม่มีข้อมูลส่งคืนจากองค์กร'
              }
            </p>
            {!searchTerm && !filterCategory && !filterProvince && (
              <Link
                href="/organization/create"
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-light rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-200 shadow-sm text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มข้อมูลใหม่
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}