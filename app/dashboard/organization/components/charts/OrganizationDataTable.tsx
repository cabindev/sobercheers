// app/dashboard/organization/components/OrganizationDataTable.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  ChevronLeft,
  ChevronRight,
  Phone,
  MapPin,
  Users,
  Image as ImageIcon,
  Calendar,
  Building2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { deleteOrganization } from '@/app/organization/actions/Delete';

interface Organization {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  addressLine1: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  type: string;
  numberOfSigners: number;
  image1: string;
  image2: string;
  image3: string | null;
  image4: string | null;
  image5: string | null;
  createdAt: Date;
  updatedAt: Date;
  organizationCategoryId: number;
  organizationCategory: {
    id: number;
    name: string;
    shortName: string | null;
  };
}

interface OrganizationCategory {
  id: number;
  name: string;
  shortName: string | null;
}

interface OrganizationDataTableProps {
  initialData: Organization[];
  organizationCategories: OrganizationCategory[];
}

export default function OrganizationDataTable({ 
  initialData, 
  organizationCategories 
}: OrganizationDataTableProps) {
  const [organizations, setOrganizations] = useState<Organization[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // ดึงข้อมูลที่ไม่ซ้ำสำหรับ filter options
  const filterOptions = useMemo(() => {
    const provinces = Array.from(new Set(
      organizations.map(org => org.province).filter(Boolean)
    )).sort();
    
    const types = Array.from(new Set(
      organizations.map(org => org.type).filter(Boolean)
    )).sort();

    return { provinces, types };
  }, [organizations]);

  // กรองข้อมูลตามเงื่อนไข
  const filteredData = useMemo(() => {
    return organizations.filter(org => {
      const matchesSearch = 
        org.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.phoneNumber.includes(searchTerm) ||
        org.organizationCategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.province.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProvince = !selectedProvince || org.province === selectedProvince;
      const matchesCategory = !selectedCategory || org.organizationCategoryId === parseInt(selectedCategory);
      const matchesType = !selectedType || org.type === selectedType;

      return matchesSearch && matchesProvince && matchesCategory && matchesType;
    });
  }, [organizations, searchTerm, selectedProvince, selectedCategory, selectedType]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedProvince, selectedCategory, selectedType, itemsPerPage]);

  // ฟังก์ชันลบข้อมูล
  const handleDelete = async (id: number, name: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบข้อมูลองค์กร "${name}"?\n\nการลบนี้ไม่สามารถย้อนกลับได้`)) {
      try {
        setIsLoading(true);
        const result = await deleteOrganization(id);
        if (result.success) {
          setOrganizations(prev => prev.filter(org => org.id !== id));
          alert('ลบข้อมูลสำเร็จ');
        } else {
          alert(result.message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
        }
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ฟังก์ชันตรวจสอบความครบถ้วนของรูปภาพ
  const getImageCompleteness = (org: Organization) => {
    const images = [org.image1, org.image2, org.image3, org.image4, org.image5];
    const validImages = images.filter(img => img !== null && img !== '').length;
    return { validImages, isComplete: validImages >= 2 };
  };

  // ฟังก์ชันแปลงประเภทองค์กร
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'PUBLIC': 'ภาครัฐ',
      'PRIVATE': 'เอกชน',
      'NGO': 'NGO',
      'ACADEMIC': 'การศึกษา'
    };
    return labels[type] || type;
  };

  // ฟังก์ชัน Export CSV
  const exportToCSV = () => {
    const csvData = filteredData.map(org => ({
      'ลำดับ': org.id,
      'ชื่อ-นามสกุล': `${org.firstName} ${org.lastName}`,
      'องค์กร': org.organizationCategory.name,
      'ประเภท': getTypeLabel(org.type),
      'จังหวัด': org.province,
      'เบอร์โทร': org.phoneNumber,
      'ผู้ลงนาม': org.numberOfSigners,
      'วันที่ลงทะเบียน': new Date(org.createdAt).toLocaleDateString('th-TH')
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `organization_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, เบอร์โทร, องค์กร, จังหวัด..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Province Filter */}
          <div>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">ทุกจังหวัด</option>
              {filterOptions.provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">ทุกหมวดหมู่</option>
              {organizationCategories.map(category => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">ทุกประเภท</option>
              {filterOptions.types.map(type => (
                <option key={type} value={type}>{getTypeLabel(type)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results info and actions */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            แสดง {startIndex + 1}-{Math.min(endIndex, filteredData.length)} จาก {filteredData.length.toLocaleString()} รายการ
            {filteredData.length !== organizations.length && (
              <span className=" text-amber-600"> (กรองจากทั้งหมด {organizations.length.toLocaleString()} รายการ)</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value={10}>10 รายการ</option>
              <option value={25}>25 รายการ</option>
              <option value={50}>50 รายการ</option>
              <option value={100}>100 รายการ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ลำดับ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ข้อมูลผู้ส่ง
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                องค์กร
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ที่อยู่
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ผู้ลงนาม
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                รูปภาพ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                วันที่
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((org) => {
              const { validImages, isComplete } = getImageCompleteness(org);
              
              return (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{org.id}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {org.firstName} {org.lastName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {org.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {org.organizationCategory.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        {getTypeLabel(org.type)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {org.province}
                    </div>
                    <div className="text-sm text-gray-500">
                      {org.type}{org.district}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {org.numberOfSigners.toLocaleString()} คน
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {isComplete ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${isComplete ? 'text-green-600' : 'text-red-600'}`}>
                        {validImages}/5
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(org.createdAt).toLocaleDateString('th-TH')}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/organization/view/${org.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="ดูข้อมูล"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      
                      <Link
                        href={`/dashboard/organization/edit/${org.id}`}
                        className="text-amber-600 hover:text-amber-900 p-1 rounded hover:bg-amber-50"
                        title="แก้ไข"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(org.id, `${org.firstName} ${org.lastName}`)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                        title="ลบ"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty state */}
        {currentData.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบข้อมูล</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filteredData.length === 0 
                ? "ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา" 
                : "ไม่มีข้อมูลในหน้านี้"
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-700">
            หน้า {currentPage} จาก {totalPages}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? 'bg-amber-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ถัดไป
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}