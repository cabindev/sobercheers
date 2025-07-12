// app/dashboard/organization/tables/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { 
  FaDownload, 
  FaFileExcel, 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaBuilding,
  FaTable,
  FaArrowLeft,
  FaEye,
  FaEdit,
  FaTrash,
  FaImage,
  FaPhone,
  FaCheck
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import Link from 'next/link';
import Image from 'next/image';
import { getAllOrganizations, OrganizationFilters } from '@/app/organization/actions/Get';
import { getActiveOrganizationCategories } from '@/app/dashboard/organization-category/actions/Get';
import { deleteOrganization } from '@/app/organization/actions/Delete';
import { Organization, OrganizationCategory } from '@/types/organization';

interface ExtendedFilters extends OrganizationFilters {
  name: string;
  categoryId: string;
  type: string;
}

interface FilterOptions {
  provinces: string[];
  types: string[];
  organizationCategories: OrganizationCategory[];
}

interface TableStats {
  totalRecords: number;
  totalProvinces: number;
  totalCategories: number;
  recentOrganizations: number;
  avgSignersPerOrganization: number;
  organizationsWithImages: number;
}

const OrganizationTablePage: React.FC = () => {
  const [data, setData] = useState<Organization[]>([]);
  const [organizationCategories, setOrganizationCategories] = useState<OrganizationCategory[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [tableStats, setTableStats] = useState<TableStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExtendedFilters>({
    search: '',
    organizationCategoryId: undefined,
    province: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20,
    name: '',
    categoryId: '',
    type: ''
  });
  
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const pageSize = 20;

  useEffect(() => {
    fetchData();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Client-side filtering like Buddhist2025/tables
  const filteredData = data.filter((item: Organization) => {
    return (
      (!filters.search || 
        `${item.firstName} ${item.lastName}`.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.phoneNumber?.toLowerCase().includes(filters.search.toLowerCase())
      ) &&
      (!filters.province || item.province?.includes(filters.province)) &&
      (!filters.organizationCategoryId || item.organizationCategoryId?.toString() === filters.organizationCategoryId?.toString()) &&
      (!filters.type || item.type?.includes(filters.type))
    );
  });

  // Pagination
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch organization categories
      const categoriesResult = await getActiveOrganizationCategories();
      if (categoriesResult) {
        setOrganizationCategories(categoriesResult);
      }

      await fetchOrganizations();
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      // Fetch all data for client-side filtering (like Buddhist2025/tables)
      const orgFilters: OrganizationFilters = {
        search: undefined,
        organizationCategoryId: undefined,
        province: undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page: 1,
        limit: 10000 // Get all records
      };

      const result = await getAllOrganizations(orgFilters);
      setData(result.data);

      // Calculate stats from all data
      const uniqueProvinces = Array.from(new Set(result.data.map(org => org.province))).length;
      const totalSigners = result.data.reduce((sum, org) => sum + org.numberOfSigners, 0);
      const avgSigners = result.data.length > 0 ? Math.round(totalSigners / result.data.length) : 0;
      const orgsWithImages = result.data.filter(org => org.image1 || org.image2).length;

      setTableStats({
        totalRecords: result.data.length, // Use actual data length
        totalProvinces: uniqueProvinces,
        totalCategories: organizationCategories.length,
        recentOrganizations: 0, // This would need to be calculated based on date range
        avgSignersPerOrganization: avgSigners,
        organizationsWithImages: orgsWithImages
      });

      // Extract filter options
      const provinces = Array.from(new Set(result.data.map(org => org.province))).filter(Boolean).sort();
      const types = Array.from(new Set(result.data.map(org => org.type))).filter(Boolean).sort();
      
      setFilterOptions({
        provinces,
        types,
        organizationCategories
      });

    } catch (error) {
      console.error('Error fetching organizations:', error);
      setError('ไม่สามารถโหลดข้อมูลองค์กรได้');
    }
  };

  const handleFilterChange = (value: string, filterType: keyof ExtendedFilters) => {
    setFilters(prevFilters => ({ 
      ...prevFilters, 
      [filterType]: filterType === 'organizationCategoryId' && value ? parseInt(value) : value 
    }));
    setCurrentPage(1);
  };


  const handleSelectRow = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };



  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map(item => item.id));
    }
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      organizationCategoryId: undefined,
      province: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 20,
      name: '',
      categoryId: '',
      type: ''
    });
    setCurrentPage(1);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`คุณต้องการลบข้อมูลของ "${name}" หรือไม่?\n\nการลบนี้ไม่สามารถย้อนกลับได้`)) return;

    try {
      setIsDeleting(id);
      const result = await deleteOrganization(id);
      
      if (result.success) {
        await fetchOrganizations();
        alert('ลบข้อมูลเรียบร้อยแล้ว');
        setSelectedRows(prev => prev.filter(rowId => rowId !== id));
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

  const formatDate = (date: Date): string => {
    try {
      return new Date(date).toLocaleDateString('th-TH');
    } catch {
      return '-';
    }
  };

  const getImageCount = (org: Organization): number => {
    return [org.image1, org.image2, org.image3, org.image4, org.image5].filter(Boolean).length;
  };

  const handleExportCSV = () => {
    const dataToExport = selectedRows.length > 0 
      ? filteredData.filter(item => selectedRows.includes(item.id))
      : filteredData;

    const headers = [
      'ชื่อ-นามสกุล', 'เบอร์โทรศัพท์', 'องค์กร', 'หมวดหมู่องค์กร', 'ภูมิภาค',
      'ที่อยู่เต็ม', 'จังหวัด', 'จำนวนผู้ลงนาม', 'จำนวนรูปภาพ', 'วันที่ลงทะเบียน'
    ];

    const csvContent = [
      headers.join(','),
      ...dataToExport.map(item => [
        `"${item.firstName} ${item.lastName}"`,
        `"${item.phoneNumber}"`,
        `"${item.organizationCategory?.name || '-'}"`,
        `"${item.organizationCategory?.categoryType || '-'}"`,
        `"${item.type}"`,
        `"${[item.addressLine1, item.district, item.amphoe, item.province, item.zipcode].filter(Boolean).join(', ')}"`,
        `"${item.province}"`,
        item.numberOfSigners,
        getImageCount(item),
        `"${formatDate(item.createdAt)}"`
      ].join(','))
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `organization_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    const dataToExport = selectedRows.length > 0 
      ? filteredData.filter(item => selectedRows.includes(item.id))
      : filteredData;

    const excelData = dataToExport.map(item => ({
      'ชื่อ-นามสกุล': `${item.firstName} ${item.lastName}`,
      'เบอร์โทรศัพท์': item.phoneNumber,
      'องค์กร': item.organizationCategory?.name || '-',
      'หมวดหมู่องค์กร': item.organizationCategory?.categoryType || '-',
      'ภูมิภาค': item.type,
      'ที่อยู่เต็ม': [item.addressLine1, item.district, item.amphoe, item.province, item.zipcode].filter(Boolean).join(', '),
      'จังหวัด': item.province,
      'จำนวนผู้ลงนาม': item.numberOfSigners,
      'จำนวนรูปภาพ': getImageCount(item),
      'วันที่ลงทะเบียน': formatDate(item.createdAt)
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Organization Data");
    XLSX.writeFile(workbook, `organization_data_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border border-gray-200 border-t-orange-500 mx-auto mb-3"></div>
          <p className="text-sm text-gray-500 font-light">กำลังโหลดข้อมูลองค์กร...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-3 font-light">❌ เกิดข้อผิดพลาด</div>
          <p className="text-sm text-gray-500 mb-4 font-light">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-orange-500 text-white text-sm font-light rounded-md hover:bg-orange-600 transition-colors"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center mb-2">
                <FaTable className="text-orange-500 mr-2 text-sm" />
                <h1 className="text-xl font-light text-gray-700">
                  ข้อมูลองค์กรส่งคืน 2025
                </h1>
              </div>
              <p className="text-sm text-gray-500 font-light">
                ข้อมูลองค์กรที่ส่งคืนเข้าร่วมระบบ (รวม{" "}
                {data.length.toLocaleString()} รายการ)
              </p>
              {tableStats && (
                <div className="mt-2 text-xs text-gray-400 font-light">
                  กระจายใน {tableStats.totalProvinces} จังหวัด •{" "}
                  เฉลี่ย {tableStats.avgSignersPerOrganization} ผู้ลงนาม/องค์กร
                </div>
              )}
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <Link href="/dashboard/organization">
                <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 text-sm font-light rounded-md hover:bg-gray-200 transition-colors">
                  <FaArrowLeft className="mr-2 text-xs" />
                  กลับสู่ Dashboard
                </button>
              </Link>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-3 py-2 text-sm font-light rounded-md transition-colors ${
                  showFilters
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {showFilters ? (
                  <FaTimes className="mr-2 text-xs" />
                ) : (
                  <FaFilter className="mr-2 text-xs" />
                )}
                {showFilters ? "ปิดตัวกรอง" : "ตัวกรอง"}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && filterOptions && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-light text-gray-600 flex items-center">
                <FaFilter className="mr-2 text-orange-500 text-xs" />
                ตัวกรองข้อมูล
              </h3>
              <button
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700 text-xs flex items-center transition-colors font-light"
              >
                <FaTimes className="mr-1 text-xs" />
                ล้างตัวกรองทั้งหมด
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Search by name */}
              <div>
                <label className="block text-xs font-light text-gray-600 mb-2">
                  ค้นหาด้วยชื่อ
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-xs" />
                  <input
                    type="text"
                    placeholder="พิมพ์ชื่อ, เบอร์โทร..."
                    className="pl-8 pr-3 py-2 w-full border border-gray-200 rounded-md text-sm font-light focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    value={filters.search}
                    onChange={(e) => handleFilterChange(e.target.value, "search")}
                  />
                </div>
              </div>

              {/* Province filter */}
              <div>
                <label className="block text-xs font-light text-gray-600 mb-2">
                  จังหวัด
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-light focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  value={filters.province}
                  onChange={(e) => handleFilterChange(e.target.value, "province")}
                >
                  <option value="">
                    ทั้งหมด ({filterOptions.provinces.length} จังหวัด)
                  </option>
                  {filterOptions.provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              {/* Organization Category filter */}
              <div>
                <label className="block text-xs font-light text-gray-600 mb-2">
                  หมวดหมู่องค์กร
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-light focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  value={filters.organizationCategoryId || ''}
                  onChange={(e) => handleFilterChange(e.target.value, "organizationCategoryId")}
                >
                  <option value="">
                    ทั้งหมด ({filterOptions.organizationCategories.length} หมวดหมู่)
                  </option>
                  {filterOptions.organizationCategories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type filter */}
              <div>
                <label className="block text-xs font-light text-gray-600 mb-2">
                  ประเภทพื้นที่
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-light focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  value={filters.type}
                  onChange={(e) => handleFilterChange(e.target.value, "type")}
                >
                  <option value="">
                    ทั้งหมด ({filterOptions.types.length} ประเภท)
                  </option>
                  {filterOptions.types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Summary with DaisyUI Badges */}
        {tableStats && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex flex-wrap justify-center gap-4">
              <div className="badge badge-lg bg-gray-600 text-white">
                {data.length.toLocaleString()} รายการที่แสดง
              </div>

              <div className="badge badge-lg bg-gray-500 text-white">
                {selectedRows.length.toLocaleString()} รายการที่เลือก
              </div>

              <div className="badge badge-lg bg-gray-700 text-white">
                {tableStats.totalProvinces} จังหวัด
              </div>

              <div className="badge badge-lg bg-gray-400 text-white">
                เฉลี่ย {tableStats.avgSignersPerOrganization} ผู้ลงนาม
              </div>

              <div className="badge badge-lg bg-gray-800 text-white">
                {tableStats.organizationsWithImages} มีรูปภาพ
              </div>
            </div>
          </div>
        )}


        {/* Action buttons */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center justify-start">
            {/* Add new organization */}
            <Link href="/organization/create" className="inline-block">
              <button
          type="button"
          title="เพิ่มองค์กรใหม่"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200"
              >
          <FaUsers className="text-orange-500 text-lg" />
              </button>
            </Link>

            {/* Download CSV */}
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={data.length === 0}
              title={`ดาวน์โหลด CSV (${selectedRows.length > 0 ? selectedRows.length : data.length} รายการ)`}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDownload className="text-emerald-500 text-lg" />
            </button>

            {/* Download Excel */}
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={data.length === 0}
              title={`ดาวน์โหลด Excel (${selectedRows.length > 0 ? selectedRows.length : data.length} รายการ)`}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaFileExcel className="text-blue-500 text-lg" />
            </button>

            {/* Select/Unselect All */}
            <button
              type="button"
              onClick={handleSelectAll}
              disabled={data.length === 0}
              title={selectedRows.length === data.length ? "ยกเลิกเลือกทั้งหมด" : "เลือกทั้งหมด"}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaCheck className="text-gray-500 text-lg" />
            </button>

            {/* Unselect selected items - only show when items are selected */}
            {selectedRows.length > 0 && (
              <button
          type="button"
          onClick={() => setSelectedRows([])}
          title={`ยกเลิกการเลือก (${selectedRows.length})`}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200"
              >
          <FaTimes className="text-red-500 text-lg" />
              </button>
            )}

            {/* Summary counts */}
            <div className="flex items-center gap-2 ml-4">
              <span className="flex items-center text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
          <FaUsers className="mr-1 text-orange-500" />
          {filteredData.length.toLocaleString()} รายการ
              </span>
              <span className="flex items-center text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
          <FaCheck className="mr-1 text-blue-500" />
          {selectedRows.length} เลือกแล้ว
              </span>
            </div>
          </div>
        </div>

        {/* No data message */}
        {filteredData.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">🔍</div>
            <div className="text-gray-600 font-light mb-2 text-lg">
              ไม่พบข้อมูล
            </div>
            <div className="text-sm text-gray-400 font-light">
              {filters.search || filters.province || filters.organizationCategoryId
                ? "ลองปรับเปลี่ยนตัวกรองข้อมูล"
                : "ไม่มีข้อมูลในระบบ"}
            </div>
          </div>
        )}

        {/* Data Table/Cards */}
        {filteredData.length > 0 && (
          <>
            {isMobile ? (
              // Mobile Card View
              <div className="space-y-4">
                {paginatedData.map((org) => (
                  <div
                    key={org.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-orange-400"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-light text-gray-700 text-base mb-1">
                          {org.firstName} {org.lastName}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center font-light">
                          <FaPhone className="mr-1" />
                          {org.phoneNumber}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(org.id)}
                        onChange={() => handleSelectRow(org.id)}
                        className="h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400"
                      />
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <strong className="text-gray-600 font-light">องค์กร:</strong>
                          <div className="text-gray-500 font-light">
                            {org.organizationCategory?.name || '-'}
                          </div>
                        </div>
                        <div>
                          <strong className="text-gray-600 font-light">หมวดหมู่:</strong>
                          <div className="text-gray-500 font-light">
                            {org.organizationCategory?.categoryType || '-'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <strong className="text-gray-600 font-light">จังหวัด:</strong>
                          <div className="text-gray-500 font-light">{org.province}</div>
                        </div>
                        <div>
                          <strong className="text-gray-600 font-light">ประเภท:</strong>
                          <div className="text-gray-500 font-light">{org.type}</div>
                        </div>
                      </div>

                      <div>
                        <strong className="text-gray-600 font-light">ที่อยู่:</strong>
                        <div className="text-gray-500 font-light">
                          {[org.addressLine1, org.district, org.amphoe].filter(Boolean).join(', ')}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <strong className="text-gray-600 font-light">ผู้ลงนาม:</strong>
                          <div className="text-gray-500 font-light">{org.numberOfSigners} คน</div>
                        </div>
                        <div>
                          <strong className="text-gray-600 font-light">รูปภาพ:</strong>
                          <div className="text-gray-500 font-light">{getImageCount(org)}/5 รูป</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-400">
                          <FaCalendarAlt className="inline mr-1" />
                          {formatDate(org.createdAt)}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Link href={`/organization/view/${org.id}`}>
                            <button className="p-1 text-orange-600 hover:bg-orange-50 rounded">
                              <FaEye className="h-3 w-3" />
                            </button>
                          </Link>
                          <Link href={`/organization/edit/${org.id}`}>
                            <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                              <FaEdit className="h-3 w-3" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(org.id, `${org.firstName} ${org.lastName}`)}
                            disabled={isDeleting === org.id}
                            className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                          >
                            {isDeleting === org.id ? (
                              <div className="animate-spin h-3 w-3 border border-red-600 border-t-transparent rounded-full"></div>
                            ) : (
                              <FaTrash className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop Table View
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedRows.length === data.length && data.length > 0}
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-orange-500 rounded border-gray-300"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                          ผู้ติดต่อ
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                          องค์กร
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                          หมวดหมู่
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                          ภูมิภาค
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                          สถานที่
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                          ผู้ลงนาม
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                          รูปภาพ
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                          วันที่
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-light text-gray-600 uppercase tracking-wider">
                          การจัดการ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {paginatedData.map((org, index) => (
                        <tr
                          key={org.id}
                          className={`hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-25"
                          }`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(org.id)}
                              onChange={() => handleSelectRow(org.id)}
                              className="h-4 w-4 text-orange-500 rounded border-gray-300"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center mr-2">
                                <FaUsers className="h-3 w-3 text-orange-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {org.firstName} {org.lastName}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center">
                                  <FaPhone className="h-3 w-3 mr-1" />
                                  {org.phoneNumber}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{org.organizationCategory?.name || '-'}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{org.organizationCategory?.categoryType || '-'}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{org.type}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900 flex items-center">
                              <FaMapMarkerAlt className="h-3 w-3 mr-1 text-gray-400" />
                              {org.province}
                            </div>
                            <div className="text-xs text-gray-500">
                              {org.district}, {org.amphoe}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                              {org.numberOfSigners} คน
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              {[org.image1, org.image2, org.image3, org.image4, org.image5].map((image, index) => (
                                <div 
                                  key={index} 
                                  className={`w-3 h-3 rounded border ${
                                    image ? 'bg-green-500 border-green-600' : 'bg-gray-200 border-gray-300'
                                  }`}
                                  title={image ? 'Has image' : 'No image'}
                                >
                                  {image && <FaCheck className="h-2 w-2 text-white m-0.5" />}
                                </div>
                              ))}
                              <span className="text-xs text-gray-500 ml-1">
                                {getImageCount(org)}/5
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-xs text-gray-500 flex items-center">
                              <FaCalendarAlt className="h-3 w-3 mr-1" />
                              {new Date(org.createdAt).toLocaleDateString('th-TH', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <Link href={`/organization/view/${org.id}`}>
                                <button className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors duration-200" title="View">
                                  <FaEye className="h-3 w-3" />
                                </button>
                              </Link>
                              
                              <Link href={`/organization/edit/${org.id}`}>
                                <button className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200" title="Edit">
                                  <FaEdit className="h-3 w-3" />
                                </button>
                              </Link>
                              
                              <button
                                onClick={() => handleDelete(org.id, `${org.firstName} ${org.lastName}`)}
                                disabled={isDeleting === org.id}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200 disabled:opacity-50"
                                title="Delete"
                              >
                                {isDeleting === org.id ? (
                                  <div className="animate-spin h-3 w-3 border border-red-600 border-t-transparent rounded-full"></div>
                                ) : (
                                  <FaTrash className="h-3 w-3" />
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
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-500 font-light">
                    แสดง {((currentPage - 1) * pageSize) + 1} ถึง{" "}
                    {Math.min(currentPage * pageSize, filteredData.length)} จาก{" "}
                    {filteredData.length.toLocaleString()} รายการ
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-200 rounded-md text-xs font-light text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      หน้าแรก
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-200 rounded-md text-xs font-light text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ก่อนหน้า
                    </button>

                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNumber = currentPage <= 3
                        ? i + 1
                        : currentPage >= totalPages - 2
                        ? totalPages - 4 + i
                        : currentPage - 2 + i;

                      if (pageNumber < 1 || pageNumber > totalPages) return null;

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-3 py-2 border rounded-md text-xs font-light transition-all ${
                            currentPage === pageNumber
                              ? "border-orange-400 bg-orange-500 text-white"
                              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-200 rounded-md text-xs font-light text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ถัดไป
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-200 rounded-md text-xs font-light text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      หน้าสุดท้าย
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrganizationTablePage;