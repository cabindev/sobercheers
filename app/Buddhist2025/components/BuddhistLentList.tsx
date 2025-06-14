// app/Buddhist2025/components/BuddhistLentList.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Buddhist2025 } from '@/types/buddhist';
import { GroupCategory } from '@/types/group';
import { getAllBuddhist2025, getBuddhist2025Count } from '../actions/Get';
import { deleteBuddhist2025 } from '../actions/Delete';
import { getActiveGroupCategories } from '@/app/dashboard/group-category/actions/Get';
import { showSuccessToast, showErrorToast, ToastContainer } from './ui/Toast';
import { 
  Edit, Trash2, Plus, Search, User, MapPin, Phone, Calendar, 
  Filter, X, Users, BarChart3, ChevronLeft, ChevronRight, Eye,
  ChevronsLeft, ChevronsRight
} from 'lucide-react';

export default function BuddhistLentList() {
  const { data: session } = useSession();
  
  const [buddhists, setBuddhists] = useState<Buddhist2025[]>([]);
  const [groupCategories, setGroupCategories] = useState<GroupCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupCategory, setSelectedGroupCategory] = useState<number | null>(null);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50); // ✅ เพิ่ม state สำหรับจำนวนรายการ

  const isAdmin = session?.user?.role === 'admin';

  // ✅ ตัวเลือกจำนวนรายการต่อหน้า
  const itemsPerPageOptions = [20, 50, 100, 200];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadBuddhists();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedGroupCategory, selectedProvince, currentPage, itemsPerPage]); // ✅ เพิ่ม itemsPerPage

  const loadInitialData = async () => {
    try {
      const categoriesResult = await getActiveGroupCategories();
      setGroupCategories(Array.isArray(categoriesResult) ? categoriesResult : []);
      await loadBuddhists();
    } catch (error) {
      showErrorToast('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
  };

  const loadBuddhists = async () => {
    try {
      setIsLoading(true);
      
      const filters = {
        search: searchTerm.trim() || undefined,
        groupCategoryId: selectedGroupCategory || undefined,
        province: selectedProvince || undefined,
        page: currentPage,
        limit: itemsPerPage,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const
      };

      const [dataResult, countResult] = await Promise.all([
        getAllBuddhist2025(filters),
        getBuddhist2025Count(filters)
      ]);

      if (dataResult.success && dataResult.data) {
        setBuddhists(dataResult.data);
      } else {
        setBuddhists([]);
        if (dataResult.error) showErrorToast(dataResult.error);
      }

      if (countResult.success && countResult.data !== undefined) {
        setTotalCount(countResult.data);
      } else {
        setTotalCount(0);
      }

    } catch (error) {
      setBuddhists([]);
      setTotalCount(0);
      showErrorToast('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!isAdmin) {
      showErrorToast('คุณไม่มีสิทธิ์ในการลบข้อมูล');
      return;
    }

    if (!confirm(`คุณต้องการลบข้อมูล "${name}" หรือไม่?\n\nการลบนี้ไม่สามารถย้อนกลับได้`)) return;

    try {
      setIsDeleting(id);
      const result = await deleteBuddhist2025(id);
      
      if (result.success) {
        await loadBuddhists();
        showSuccessToast('ลบข้อมูลเรียบร้อยแล้ว');
      } else {
        showErrorToast(result.message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    } catch (error) {
      showErrorToast('เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setIsDeleting(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGroupCategory(null);
    setSelectedProvince('');
    setCurrentPage(1);
  };

  // ✅ เพิ่มฟังก์ชันเปลี่ยนจำนวนรายการต่อหน้า
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // รีเซ็ตไปหน้าแรก
  };

  // ✅ ปรับปรุง pagination logic
  const filteredData = useMemo(() => {
    const hasActiveFilters = searchTerm || selectedGroupCategory || selectedProvince;
    const provinces = Array.from(new Set(buddhists.map(b => b.province))).sort();
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    
    // สร้าง pagination numbers ที่ดีขึ้น
    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      const maxVisiblePages = 7;
      
      if (totalPages <= maxVisiblePages) {
        // แสดงทุกหน้าถ้าไม่เกิน 7 หน้า
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // แสดงหน้าแรก
        pages.push(1);
        
        let startPage = Math.max(2, currentPage - 2);
        let endPage = Math.min(totalPages - 1, currentPage + 2);
        
        // ปรับช่วงให้แสดง 5 หน้าตรงกลาง
        if (currentPage <= 3) {
          endPage = 5;
        } else if (currentPage >= totalPages - 2) {
          startPage = totalPages - 4;
        }
        
        // เพิ่ม ... ถ้าจำเป็น
        if (startPage > 2) {
          pages.push('...');
        }
        
        // เพิ่มหน้าตรงกลาง
        for (let i = startPage; i <= endPage; i++) {
          if (i > 1 && i < totalPages) {
            pages.push(i);
          }
        }
        
        // เพิ่ม ... ถ้าจำเป็น
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        
        // แสดงหน้าสุดท้าย
        if (totalPages > 1) {
          pages.push(totalPages);
        }
      }
      
      return pages;
    };
    
    return {
      hasActiveFilters,
      provinces,
      totalPages,
      pageNumbers: getPageNumbers()
    };
  }, [searchTerm, selectedGroupCategory, selectedProvince, buddhists, totalCount, itemsPerPage, currentPage]);

  // Loading screen
  if (isLoading && buddhists.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50/30">
        <ToastContainer />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border shadow-sm p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-orange-500 rounded-full animate-spin border-t-transparent mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">กำลังโหลดข้อมูล</h3>
              <p className="text-gray-600 text-sm">โปรดรอสักครู่...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/30">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        
        {/* Header */}
        <div className="bg-white rounded-lg border shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ผู้สมัครเข้าพรรษา 2568</h1>
                <div className="flex items-center text-sm text-gray-600">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  ทั้งหมด {totalCount} คน
                  {session && (
                    <span className="ml-3 px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                      {isAdmin ? 'ผู้ดูแล' : 'สมาชิก'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <Link
              href="/Buddhist2025/create"
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มผู้สมัคร
            </Link>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ นามสกุล เบอร์โทร..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-10 w-full py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
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
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors ${
                filteredData.hasActiveFilters || showFilters
                  ? 'bg-orange-100 text-orange-700 border border-orange-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              ตัวกรอง
              {filteredData.hasActiveFilters && (
                <span className="ml-2 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {[searchTerm, selectedGroupCategory, selectedProvince].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="border-t pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <select
                  value={selectedGroupCategory || ''}
                  onChange={(e) => {
                    setSelectedGroupCategory(e.target.value ? parseInt(e.target.value) : null);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">ทุกหมวดหมู่</option>
                  {groupCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">ทุกจังหวัด</option>
                  {filteredData.provinces.map(province => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>

                {/* ✅ เพิ่มตัวเลือกจำนวนรายการต่อหน้า */}
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {itemsPerPageOptions.map(option => (
                    <option key={option} value={option}>
                      {option} รายการ/หน้า
                    </option>
                  ))}
                </select>

                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center px-3 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  ล้างตัวกรอง
                </button>

                <div className="flex items-center justify-center px-3 py-2.5 text-sm text-gray-600 bg-gray-50 rounded-lg">
                  <Eye className="h-4 w-4 mr-1" />
                  แสดง {buddhists.length} จาก {totalCount} รายการ
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content - Table + Card Responsive */}
        {buddhists.length > 0 ? (
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            
            {/* Table View - Desktop */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">ชื่อ-นามสกุล</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">อายุ/เพศ</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">องค์กร</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">ที่อยู่</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">เบอร์โทร</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">วันที่สมัคร</th>
                      {isAdmin && (
                        <th className="text-center py-3 px-4 font-medium text-gray-700">จัดการ</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {buddhists.map((buddhist) => (
                      <tr key={buddhist.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-500 rounded-lg flex items-center justify-center mr-3">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {buddhist.firstName} {buddhist.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          <div>{buddhist.age} ปี</div>
                          <div className="text-xs text-gray-500">{buddhist.gender}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          <div className="max-w-[150px] truncate">
                            {buddhist.groupCategory?.name || 'ไม่ระบุ'}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          <div className="max-w-[200px]">
                            <div>ต.{buddhist.district}</div>
                            <div className="text-xs text-gray-500">จ.{buddhist.province}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {buddhist.phone || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(buddhist.createdAt).toLocaleDateString('th-TH', {
                            year: '2-digit',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        {isAdmin && (
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                href={`/Buddhist2025/edit/${buddhist.id}`}
                                className="bg-orange-100 hover:bg-orange-200 text-orange-700 p-1.5 rounded transition-colors"
                              >
                                <Edit className="h-3 w-3" />
                              </Link>
                              <button
                                onClick={() => handleDelete(buddhist.id, `${buddhist.firstName} ${buddhist.lastName}`)}
                                disabled={isDeleting === buddhist.id}
                                className="bg-red-100 hover:bg-red-200 text-red-700 p-1.5 rounded transition-colors disabled:opacity-50"
                              >
                                {isDeleting === buddhist.id ? (
                                  <div className="animate-spin h-3 w-3 border border-red-600 border-t-transparent rounded-full"></div>
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card View - Mobile & Tablet */}
            <div className="lg:hidden divide-y divide-gray-200">
              {buddhists.map((buddhist) => (
                <div key={buddhist.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-500 rounded-lg flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {buddhist.firstName} {buddhist.lastName}
                        </h3>
                        <div className="text-sm text-gray-500">
                          {buddhist.gender} • อายุ {buddhist.age} ปี
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-3">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-emerald-500" />
                      <span className="truncate">{buddhist.groupCategory?.name || 'ไม่ระบุ'}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                      <span>ต.{buddhist.district} จ.{buddhist.province}</span>
                    </div>

                    {buddhist.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-purple-500" />
                        <span>{buddhist.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(buddhist.createdAt).toLocaleDateString('th-TH', {
                          year: '2-digit',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex gap-2 pt-3 border-t">
                      <Link
                        href={`/Buddhist2025/edit/${buddhist.id}`}
                        className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-700 py-2 px-3 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        แก้ไข
                      </Link>
                      <button
                        onClick={() => handleDelete(buddhist.id, `${buddhist.firstName} ${buddhist.lastName}`)}
                        disabled={isDeleting === buddhist.id}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-3 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
                      >
                        {isDeleting === buddhist.id ? (
                          <div className="animate-spin h-4 w-4 border border-red-600 border-t-transparent rounded-full"></div>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-1" />
                            ลบ
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อมูลผู้สมัคร</h3>
            <p className="text-gray-600 mb-4 text-sm">
              {filteredData.hasActiveFilters ? 'ลองปรับเปลี่ยนคำค้นหาหรือตัวกรอง' : 'เริ่มต้นด้วยการเพิ่มผู้สมัครใหม่'}
            </p>
            {!filteredData.hasActiveFilters && isAdmin && (
              <Link
                href="/Buddhist2025/create"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-amber-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มผู้สมัครใหม่
              </Link>
            )}
          </div>
        )}

        {/* ✅ Enhanced Pagination */}
        {filteredData.totalPages > 1 && (
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600">
                แสดง <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> ถึง{' '}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalCount)}</span> จาก{' '}
                <span className="font-medium">{totalCount}</span> รายการ
                <span className="text-gray-500 ml-2">
                  (หน้า {currentPage} จาก {filteredData.totalPages} หน้า)
                </span>
              </div>
              
              <div className="flex items-center justify-center sm:justify-end space-x-1">
                {/* First Page */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="หน้าแรก"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                
                {/* Previous Page */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="หน้าก่อนหน้า"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {filteredData.pageNumbers.map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && setCurrentPage(page)}
                      disabled={typeof page === 'string'}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        page === currentPage
                          ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm'
                          : typeof page === 'string'
                          ? 'text-gray-400 cursor-default'
: 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                     }`}
                   >
                     {page}
                   </button>
                 ))}
               </div>
               
               {/* Next Page */}
               <button
                 onClick={() => setCurrentPage(Math.min(filteredData.totalPages, currentPage + 1))}
                 disabled={currentPage === filteredData.totalPages}
                 className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 title="หน้าถัดไป"
               >
                 <ChevronRight className="h-4 w-4" />
               </button>
               
               {/* Last Page */}
               <button
                 onClick={() => setCurrentPage(filteredData.totalPages)}
                 disabled={currentPage === filteredData.totalPages}
                 className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 title="หน้าสุดท้าย"
               >
                 <ChevronsRight className="h-4 w-4" />
               </button>
             </div>
           </div>
           
           {/* ✅ Quick Page Jump - สำหรับข้อมูลเยอะๆ */}
           {filteredData.totalPages > 10 && (
             <div className="mt-4 pt-4 border-t flex items-center justify-center">
               <div className="flex items-center gap-2 text-sm">
                 <span className="text-gray-600">ไปที่หน้า:</span>
                 <input
                   type="number"
                   min="1"
                   max={filteredData.totalPages}
                   value={currentPage}
                   onChange={(e) => {
                     const page = parseInt(e.target.value);
                     if (page >= 1 && page <= filteredData.totalPages) {
                       setCurrentPage(page);
                     }
                   }}
                   className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                 />
                 <span className="text-gray-600">/ {filteredData.totalPages}</span>
               </div>
             </div>
           )}
         </div>
       )}

       {/* Loading Overlay */}
       {isLoading && buddhists.length > 0 && (
         <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-4 shadow-lg">
             <div className="flex items-center space-x-3">
               <div className="w-5 h-5 border-2 border-orange-500 rounded-full animate-spin border-t-transparent"></div>
               <span className="text-sm font-medium text-gray-700">กำลังโหลด...</span>
             </div>
           </div>
         </div>
       )}
     </div>
   </div>
 );
}