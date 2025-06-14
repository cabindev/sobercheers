'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GroupCategory } from '@/types/group';
import { getAllGroupCategories } from '../actions/Get';
import { deleteGroupCategory } from '../actions/Delete';
import { 
  Edit, Trash2, Plus, Search, AlertCircle, Users, 
  X, Eye, Filter, BarChart3, Calendar, CheckCircle 
} from 'lucide-react';

export default function GroupCategoryList() {
  const router = useRouter();
  const [categories, setCategories] = useState<GroupCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<GroupCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, searchTerm]);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getAllGroupCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = categories;

    // กรองตามการค้นหา
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        category =>
          category.name.toLowerCase().includes(searchLower) ||
          (category.description && category.description.toLowerCase().includes(searchLower))
      );
    }

    setFilteredCategories(filtered);
  };

  const handleDelete = async (id: number, name: string) => {
    // ตรวจสอบจำนวนผู้สมัครก่อน
    const category = categories.find(c => c.id === id);
    const participantCount = category?._count?.buddhist2025 || 0;
    
    if (participantCount > 0) {
      alert(`ไม่สามารถลบหมวดหมู่ "${name}" ได้ เนื่องจากมีผู้สมัครอยู่ ${participantCount} คน`);
      return;
    }

    if (!confirm(`คุณต้องการลบหมวดหมู่ "${name}" หรือไม่?\n\nการลบนี้ไม่สามารถย้อนกลับได้`)) return;

    try {
      setIsDeleting(id);
      const result = await deleteGroupCategory(id);
      
      if (result.success) {
        await loadCategories();
        alert('ลบหมวดหมู่เรียบร้อยแล้ว');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="flex flex-col justify-center items-center min-h-96 space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-spin border-t-amber-600"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-amber-300"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">กำลังโหลดข้อมูล</h3>
            <p className="text-gray-600">โปรดรอสักครู่...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-200">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">จัดการหมวดหมู่องค์กร</h1>
                <p className="text-gray-600 mt-1">จัดการหมวดหมู่สำหรับโครงการเข้าพรรษา 2568</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  ทั้งหมด {categories.length} หมวดหมู่
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                href="/group-category/create"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center shadow-lg shadow-amber-200 hover:shadow-xl hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                เพิ่มหมวดหมู่ใหม่
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อหมวดหมู่หรือคำอธิบาย..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 w-full py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            แสดง {filteredCategories.length} จาก {categories.length} รายการ
          </div>
        </div>

        {/* Content */}
        {filteredCategories.length > 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      หมวดหมู่
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      คำอธิบาย
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จำนวนผู้สมัคร
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่สร้าง
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/40 divide-y divide-gray-200">
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-amber-50/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs">
                          <div className="truncate" title={category.description || ''}>
                            {category.description || '-'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            (category._count?.buddhist2025 || 0) > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <Users className="h-3 w-3 mr-1" />
                            {category._count?.buddhist2025 || 0} คน
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(category.createdAt).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-2">
                          <Link
                            href={`/group-category/edit/${category.id}`}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-700 p-2 rounded-lg transition-colors duration-200"
                            title="แก้ไข"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(category.id, category.name)}
                            disabled={isDeleting === category.id || (category._count?.buddhist2025 || 0) > 0}
                            className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={
                              (category._count?.buddhist2025 || 0) > 0 
                                ? `ไม่สามารถลบได้ เนื่องจากมีผู้สมัคร ${category._count?.buddhist2025} คน`
                                : 'ลบ'
                            }
                          >
                            {isDeleting === category.id ? (
                              <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">ไม่พบข้อมูลหมวดหมู่</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'ลองปรับเปลี่ยนคำค้นหา' 
                : 'เริ่มต้นด้วยการเพิ่มหมวดหมู่ใหม่'
              }
            </p>
            {!searchTerm && (
              <Link
                href="/group-category/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-lg shadow-amber-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                เพิ่มหมวดหมู่ใหม่
              </Link>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-200/50 p-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 mr-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                ข้อมูลการใช้งาน
              </h4>
              <p className="text-gray-600">
                สถิติและข้อมูลการใช้งานหมวดหมู่องค์กร
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {categories.length}
              </div>
              <div className="text-sm text-blue-700">หมวดหมู่ทั้งหมด</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {categories.filter(c => (c._count?.buddhist2025 || 0) > 0).length}
              </div>
              <div className="text-sm text-green-700">หมวดหมู่ที่มีผู้สมัคร</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/50">
              <div className="text-2xl font-bold text-amber-600 mb-1">
                {categories.reduce((sum, c) => sum + (c._count?.buddhist2025 || 0), 0)}
              </div>
              <div className="text-sm text-amber-700">ผู้สมัครทั้งหมด</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-gray-900">📋 การจัดการหมวดหมู่</h5>
              {[
                "แก้ไขข้อมูลหมวดหมู่ได้ตลอดเวลา",
                "ลบได้เฉพาะหมวดหมู่ที่ไม่มีผู้สมัคร",
                "หมวดหมู่ใหม่จะใช้งานได้ทันที",
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
              <h5 className="text-lg font-semibold text-gray-900">💡 คำแนะนำ</h5>
              {[
                "ตั้งชื่อหมวดหมู่ให้ชัดเจนและเข้าใจง่าย",
                "เพิ่มคำอธิบายเพื่อช่วยผู้สมัครเลือก",
                "ตรวจสอบจำนวนผู้สมัครในแต่ละหมวดหมู่",
              ].map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start p-3 rounded-lg bg-blue-50/60"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}