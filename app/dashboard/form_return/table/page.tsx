'use client'
import React, { useState, useEffect } from 'react';
import { 
  FaDownload, 
  FaFileExcel, 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaBuilding,
  FaTable,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPhone,
  FaUsers,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import Link from 'next/link';
import { 
  getAllFormReturnTableData, 
  getFormReturnFilterOptions, 
  getFormReturnTableStats
} from './actions/GetTableData';
import EditModal from './components/EditModal';
import DeleteModal from './components/DeleteModal';

type FilterType = 'province' | 'organizationName' | 'type' | 'district' | 'amphoe';

interface Filters {
  province: string;
  organizationName: string;
  type: string;
  district: string;
  amphoe: string;
  name: string;
}

interface FormReturnItem {
  id: number;
  firstName: string;
  lastName: string;
  organizationName: string;
  addressLine1: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  type: string;
  phoneNumber: string;
  numberOfSigners: number;
  createdAt: Date;
}

interface FilterOptions {
  provinces: string[];
  organizationNames: string[]; // ใช้ organizationName จริงจาก Form_return
  types: string[];
  districts: string[];
  amphoes: string[];
  years: number[]; // รายการปีที่มีข้อมูล
}

interface TableStats {
  totalRecords: number;
  totalProvinces: number;
  totalOrganizations: number;
  recentSubmissions: number;
  totalSigners: number;
  avgSignersPerForm: number;
}

const FormReturnTable: React.FC = () => {
  const [data, setData] = useState<FormReturnItem[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [tableStats, setTableStats] = useState<TableStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get selected organization name for file export
  const getSelectedOrgFileName = () => {
    return selectedOrganizationName?.replace(/[^\w\s-]/gi, '') || 'organization';
  };

  // Helper function to create file name with year and organization
  const getFileName = (extension: string) => {
    const date = new Date().toISOString().split('T')[0];
    const parts = ['form_return'];
    
    if (selectedYear !== new Date().getFullYear()) {
      parts.push(`year_${selectedYear}`);
    }
    
    if (selectedOrganizationName) {
      parts.push(getSelectedOrgFileName());
    }
    
    parts.push(date);
    return `${parts.join('_')}.${extension}`;
  };
  const [filters, setFilters] = useState<Filters>({
    province: '',
    organizationName: '',
    type: '',
    district: '',
    amphoe: '',
    name: '',
  });
  
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrganizationName, setSelectedOrganizationName] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear()); // Default to current year
  const [organizationFilteredData, setOrganizationFilteredData] = useState<FormReturnItem[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FormReturnItem | null>(null);
  const pageSize = 20;

  useEffect(() => {
    fetchData();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dataResult, filterResult, statsResult] = await Promise.all([
        getAllFormReturnTableData(),
        getFormReturnFilterOptions(),
        getFormReturnTableStats()
      ]);

      if (dataResult.success && dataResult.data) {
        setData(dataResult.data);
      } else {
        throw new Error(dataResult.error || 'Failed to fetch data');
      }

      if (filterResult.success && filterResult.data) {
        setFilterOptions(filterResult.data);
      }

      if (statsResult.success && statsResult.data) {
        setTableStats(statsResult.data);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value: string, filterType: FilterType | 'name') => {
    setFilters(prevFilters => ({ ...prevFilters, [filterType]: value }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      province: '',
      organizationName: '',
      type: '',
      district: '',
      amphoe: '',
      name: '',
    });
    setSelectedOrganizationName('');
    // Note: ไม่รีเซ็ต selectedYear เพื่อให้ผู้ใช้เลือกปีได้
    setOrganizationFilteredData([]);
    setCurrentPage(1);
  };

  const handleOrganizationFilter = (organizationName: string) => {
    setSelectedOrganizationName(organizationName);
    if (organizationName === '') {
      setOrganizationFilteredData([]);
    } else {
      // กรองข้อมูลจาก data ที่โหลดมาแล้ว (รวมทั้งปี)
      const filtered = data.filter(item => {
        const itemYear = new Date(item.createdAt).getFullYear();
        return item.organizationName === organizationName && itemYear === selectedYear;
      });
      setOrganizationFilteredData(filtered);
    }
    setCurrentPage(1);
  };

  // Handle year selection
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setCurrentPage(1);
    
    // ตรวจสอบว่าองค์กรที่เลือกอยู่มีข้อมูลในปีใหม่หรือไม่
    const hasDataInNewYear = data.some(item => {
      const itemYear = new Date(item.createdAt).getFullYear();
      return item.organizationName === selectedOrganizationName && itemYear === year;
    });
    
    if (selectedOrganizationName && !hasDataInNewYear) {
      // ล้างการเลือกองค์กรถ้าไม่มีข้อมูลในปีใหม่
      setSelectedOrganizationName('');
      setOrganizationFilteredData([]);
    } else if (selectedOrganizationName && hasDataInNewYear) {
      // อัพเดต organization filter ด้วยปีใหม่
      const filtered = data.filter(item => {
        const itemYear = new Date(item.createdAt).getFullYear();
        return item.organizationName === selectedOrganizationName && itemYear === year;
      });
      setOrganizationFilteredData(filtered);
    }
  };

  // Get organizations that have data for the selected year
  const organizationsForSelectedYear = React.useMemo(() => {
    if (!filterOptions) return [];
    
    const yearFilteredData = data.filter(item => {
      const itemYear = new Date(item.createdAt).getFullYear();
      return itemYear === selectedYear;
    });
    
    const uniqueOrgs = [...new Set(yearFilteredData.map(item => item.organizationName))].filter(Boolean);
    return uniqueOrgs.sort();
  }, [data, selectedYear, filterOptions]);

  // ใช้ organizationFilteredData ถ้าเลือกองค์กรเฉพาะ ไม่งั้นใช้ data ปกติ
  const dataToFilter = selectedOrganizationName ? organizationFilteredData : data;
  
  const filteredData = dataToFilter.filter((item: FormReturnItem) => {
    const itemYear = new Date(item.createdAt).getFullYear();
    
    return (
      // กรองตามปีที่เลือก
      itemYear === selectedYear &&
      (!filters.province || item.province?.includes(filters.province)) &&
      (!filters.organizationName || item.organizationName?.toLowerCase().includes(filters.organizationName.toLowerCase())) &&
      (!filters.type || item.type?.includes(filters.type)) &&
      (!filters.district || item.district?.includes(filters.district)) &&
      (!filters.amphoe || item.amphoe?.includes(filters.amphoe)) &&
      (!filters.name || `${item.firstName || ''} ${item.lastName || ''}`.toLowerCase().includes(filters.name.toLowerCase()))
    );
  });

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const formatDate = (date: Date): string => {
    try {
      return new Date(date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '-';
    }
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

  const handleEdit = (record: FormReturnItem) => {
    setSelectedRecord(record);
    setEditModalOpen(true);
  };

  const handleDelete = (record: FormReturnItem) => {
    setSelectedRecord(record);
    setDeleteModalOpen(true);
  };

  const handleModalSuccess = () => {
    // Refresh data after successful edit/delete
    fetchData();
    setSelectedRows([]);
  };

  const handleExportCSV = () => {
    const dataToExport = selectedRows.length > 0 
      ? filteredData.filter(item => selectedRows.includes(item.id))
      : filteredData;

    const headers = [
      'ชื่อ-นามสกุล', 'องค์กร', 'ที่อยู่', 'ตำบล', 'อำเภอ', 'จังหวัด', 
      'รหัสไปรษณีย์', 'ประเภท', 'เบอร์โทรศัพท์', 'จำนวนผู้ลงชื่อ', 'วันที่บันทึก'
    ];

    const csvContent = [
      headers.join(','),
      ...dataToExport.map(item => [
        `"${(item.firstName || '') + ' ' + (item.lastName || '')}"`,
        `"${item.organizationName || ''}"`,
        `"${item.addressLine1 || ''}"`,
        `"${item.district || ''}"`,
        `"${item.amphoe || ''}"`,
        `"${item.province || ''}"`,
        `"${item.zipcode || ''}"`,
        `"${item.type || ''}"`,
        `"${item.phoneNumber || ''}"`,
        item.numberOfSigners || 0,
        `"${formatDate(item.createdAt)}"`
      ].join(','))
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fileName = getFileName('csv');
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
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
      'ชื่อ-นามสกุล': `${item.firstName || ''} ${item.lastName || ''}`,
      'องค์กร': item.organizationName || '',
      'ที่อยู่': item.addressLine1 || '',
      'ตำบล': item.district || '',
      'อำเภอ': item.amphoe || '',
      'จังหวัด': item.province || '',
      'รหัสไปรษณีย์': item.zipcode || '',
      'ประเภท': item.type || '',
      'เบอร์โทรศัพท์': item.phoneNumber || '',
      'จำนวนผู้ลงชื่อ': item.numberOfSigners || 0,
      'วันที่บันทึก': formatDate(item.createdAt)
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    
    // สร้างชื่อ worksheet และไฟล์
    const fileName = getFileName('xlsx');
    const worksheetName = selectedOrganizationName 
      ? `${selectedOrganizationName}_${selectedYear}`.substring(0, 30)
      : `Form_Return_${selectedYear}`.substring(0, 30);
    
    XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName); // Excel worksheet name limit
    XLSX.writeFile(workbook, fileName);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border border-gray-200 border-t-orange-400 mx-auto mb-3"></div>
          <p className="text-sm text-gray-500 font-light">กำลังโหลดข้อมูลการคืนฟอร์ม...</p>
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
        <div className="bg-white rounded-lg border border-orange-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center mb-2">
                <FaTable className="text-orange-400 mr-2 text-sm" />
                <h1 className="text-xl font-light text-orange-700">
                  ข้อมูลการคืนฟอร์มงดเหล้าเข้าพรรษา ปี {selectedYear + 543}
                </h1>
              </div>
              <p className="text-sm text-orange-600/70 font-light">
                ข้อมูลการคืนฟอร์มปี {selectedYear + 543} ({selectedYear}) - แสดง{" "}
                {filteredData.length.toLocaleString()} รายการ จากทั้งหมด {data.length.toLocaleString()} รายการ
              </p>
              {tableStats && (
                <div className="mt-2 text-xs text-orange-500/60 font-light">
                  ส่งใหม่ 7 วันล่าสุด:{" "}
                  {tableStats.recentSubmissions.toLocaleString()} รายการ
                </div>
              )}
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <Link href="/dashboard/form_return/2025">
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
                    : "bg-orange-100 text-orange-600 hover:bg-orange-200"
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

        {/* Year and Organization Selection */}
        <div className="bg-white rounded-lg border border-orange-200 p-6 mb-6">
          <div className="flex flex-col gap-6">
            {/* Year Selection */}
            <div>
              <h3 className="text-base font-light text-orange-600 flex items-center mb-2">
                <FaCalendarAlt className="mr-2 text-orange-400 text-sm" />
                เลือกปีที่ต้องการดู
              </h3>
              <div className="flex flex-wrap gap-3">
                <select
                  className="px-4 py-2 border border-orange-200 rounded-md text-sm font-light focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition-all"
                  value={selectedYear}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                >
                  {filterOptions?.years.map((year) => (
                    <option key={year} value={year}>
                      {year + 543} ({year}) {/* แสดงทั้งปี พ.ศ. และ ค.ศ. */}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-orange-500 flex items-center">
                  📊 แสดงข้อมูลปี {selectedYear + 543}
                </div>
              </div>
            </div>

            {/* Organization Selection */}
            <div>
              <h3 className="text-base font-light text-orange-600 flex items-center mb-2">
                <FaBuilding className="mr-2 text-orange-400 text-sm" />
                เลือกองค์กรเฉพาะ (ดาวน์โหลดเฉพาะองค์กร)
                <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                  {organizationsForSelectedYear.length} องค์กร
                </span>
              </h3>
              <div className="flex flex-wrap gap-3">
                <select
                  className="px-4 py-2 border border-orange-200 rounded-md text-sm font-light focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition-all min-w-60"
                  value={selectedOrganizationName}
                  onChange={(e) => handleOrganizationFilter(e.target.value)}
                >
                  <option value="">เลือกองค์กร (ปี {selectedYear + 543})...</option>
                  {organizationsForSelectedYear.map((orgName) => (
                    <option key={orgName} value={orgName}>
                      {orgName}
                    </option>
                  ))}
                </select>
                
                {selectedOrganizationName && (
                  <button
                    onClick={() => handleOrganizationFilter('')}
                    className="px-3 py-2 bg-orange-100 text-orange-600 text-sm font-light rounded-md hover:bg-orange-200 transition-colors"
                  >
                    <FaTimes className="mr-1 text-xs" />
                    ล้างการเลือก
                  </button>
                )}
              </div>
              
                {selectedOrganizationName && (
                  <div className="mt-2 p-2 bg-orange-50 rounded-md border border-orange-100">
                    <p className="text-xs text-orange-600">
                      ✅ แสดงข้อมูลเฉพาะองค์กร: <strong>
                        {selectedOrganizationName}
                      </strong> (ปี {selectedYear + 543})
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && filterOptions && (
          <div className="bg-white rounded-lg border border-orange-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-light text-orange-600 flex items-center">
                <FaFilter className="mr-2 text-orange-400 text-xs" />
                ตัวกรองข้อมูล
              </h3>
              <button
                onClick={clearAllFilters}
                className="text-orange-500 hover:text-orange-700 text-xs flex items-center transition-colors font-light"
              >
                <FaTimes className="mr-1 text-xs" />
                ล้างตัวกรองทั้งหมด
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Search by name */}
              <div>
                <label className="block text-xs font-light text-orange-600 mb-2">
                  ค้นหาด้วยชื่อ
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300 text-xs" />
                  <input
                    type="text"
                    placeholder="พิมพ์ชื่อ..."
                    className="pl-8 pr-3 py-2 w-full border border-orange-200 rounded-md text-sm font-light focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition-all"
                    value={filters.name}
                    onChange={(e) => handleFilterChange(e.target.value, "name")}
                  />
                </div>
              </div>

              {/* Province filter */}
              <div>
                <label className="block text-xs font-light text-orange-600 mb-2">
                  จังหวัด
                </label>
                <select
                  className="w-full px-3 py-2 border border-orange-200 rounded-md text-sm font-light focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition-all"
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

              {/* Organization filter */}
              <div>
                <label className="block text-xs font-light text-orange-600 mb-2">
                  องค์กร
                </label>
                <select
                  className="w-full px-3 py-2 border border-orange-200 rounded-md text-sm font-light focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition-all"
                  value={filters.organizationName}
                  onChange={(e) => handleFilterChange(e.target.value, "organizationName")}
                >
                  <option value="">
                    ทั้งหมด ({filterOptions.organizationNames.length} องค์กร)
                  </option>
                  {filterOptions.organizationNames.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type filter */}
              <div>
                <label className="block text-xs font-light text-orange-600 mb-2">
                  ประเภท
                </label>
                <select
                  className="w-full px-3 py-2 border border-orange-200 rounded-md text-sm font-light focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition-all"
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

              {/* District filter */}
              <div>
                <label className="block text-xs font-light text-orange-600 mb-2">
                  อำเภอ
                </label>
                <select
                  className="w-full px-3 py-2 border border-orange-200 rounded-md text-sm font-light focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition-all"
                  value={filters.amphoe}
                  onChange={(e) => handleFilterChange(e.target.value, "amphoe")}
                >
                  <option value="">
                    ทั้งหมด ({filterOptions.amphoes.length} อำเภอ)
                  </option>
                  {filterOptions.amphoes.map((amphoe) => (
                    <option key={amphoe} value={amphoe}>
                      {amphoe}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tambon filter */}
              <div>
                <label className="block text-xs font-light text-orange-600 mb-2">
                  ตำบล
                </label>
                <select
                  className="w-full px-3 py-2 border border-orange-200 rounded-md text-sm font-light focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition-all"
                  value={filters.district}
                  onChange={(e) => handleFilterChange(e.target.value, "district")}
                >
                  <option value="">
                    ทั้งหมด ({filterOptions.districts.length} ตำบล)
                  </option>
                  {filterOptions.districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filters display */}
            {Object.entries(filters).some(([_, value]) => value !== "") && (
              <div className="mt-4 p-3 bg-orange-50 rounded-md border border-orange-100">
                <div className="text-xs text-orange-600 mb-2 font-light">
                  ตัวกรองที่ใช้งาน:
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value) return null;
                    const labels: Record<string, string> = {
                      name: "ชื่อ",
                      province: "จังหวัด",
                      organizationName: "องค์กร",
                      type: "ประเภท",
                      district: "ตำบล",
                      amphoe: "อำเภอ",
                    };

                    return (
                      <span
                        key={key}
                        className="inline-flex items-center px-2 py-1 bg-orange-200 text-orange-700 text-xs font-light rounded border border-orange-300"
                      >
                        {labels[key] || key}: {value}
                        <button
                          onClick={() => handleFilterChange("", key as any)}
                          className="ml-2 text-orange-600 hover:text-orange-800"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Stats */}
        <div className="bg-white rounded-lg border border-orange-200 p-6 mb-6">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="badge badge-lg bg-blue-600 text-white">
              ปี {selectedYear + 543} ({selectedYear})
            </div>

            <div className="badge badge-lg bg-orange-600 text-white">
              {filteredData.length.toLocaleString()} รายการที่แสดง
            </div>

            <div className="badge badge-lg bg-orange-500 text-white">
              {selectedRows.length.toLocaleString()} รายการที่เลือก
            </div>

            {selectedOrganizationName ? (
              <div className="badge badge-lg bg-green-600 text-white">
                องค์กรที่เลือก: {selectedOrganizationName}
              </div>
            ) : (
              tableStats && (
                <>
                  <div className="badge badge-lg bg-orange-700 text-white">
                    {tableStats.totalProvinces} จังหวัด
                  </div>

                  <div className="badge badge-lg bg-orange-400 text-white">
                    {tableStats.totalOrganizations} องค์กร
                  </div>

                  <div className="badge badge-lg bg-orange-800 text-white">
                    รวม {tableStats.totalSigners.toLocaleString()} ผู้ลงชื่อ
                  </div>
                </>
              )
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="bg-white rounded-lg border border-orange-200 p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportCSV}
              disabled={filteredData.length === 0}
              className="flex items-center px-4 py-2 bg-orange-500 text-white text-sm font-light rounded-md hover:bg-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDownload className="mr-2 text-xs" />
              ดาวน์โหลด CSV{" "}
              {selectedRows.length > 0 
                ? `(${selectedRows.length} รายการ)` 
                : `(ปี ${selectedYear + 543}${selectedOrganizationName ? `, ${selectedOrganizationName}` : ''})`
              }
            </button>
            <button
              onClick={handleExportExcel}
              disabled={filteredData.length === 0}
              className="flex items-center px-4 py-2 bg-orange-500 text-white text-sm font-light rounded-md hover:bg-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaFileExcel className="mr-2 text-xs" />
              ดาวน์โหลด Excel{" "}
              {selectedRows.length > 0 
                ? `(${selectedRows.length} รายการ)` 
                : `(ปี ${selectedYear + 543}${selectedOrganizationName ? `, ${selectedOrganizationName}` : ''})`
              }
            </button>
            <button
              onClick={handleSelectAll}
              disabled={filteredData.length === 0}
              className="px-4 py-2 bg-orange-400 text-white text-sm font-light rounded-md hover:bg-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedRows.length === filteredData.length
                ? "ยกเลิกเลือกทั้งหมด"
                : "เลือกทั้งหมด"}
            </button>
            {selectedRows.length > 0 && (
              <button
                onClick={() => setSelectedRows([])}
                className="px-4 py-2 bg-orange-600 text-white text-sm font-light rounded-md hover:bg-orange-700 transition-all duration-300"
              >
                ยกเลิกการเลือก ({selectedRows.length})
              </button>
            )}
          </div>
        </div>

        {/* No data message */}
        {filteredData.length === 0 && (
          <div className="bg-white rounded-lg border border-orange-200 p-8 text-center">
            <div className="text-orange-400 text-4xl mb-4">🔍</div>
            <div className="text-orange-600 font-light mb-2 text-lg">
              ไม่พบข้อมูล
            </div>
            <div className="text-sm text-orange-500/60 font-light">
              {Object.values(filters).some((f) => f !== "")
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
                {paginatedData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-orange-200 p-4 border-l-4 border-l-orange-400"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-light text-gray-700 text-base mb-1">
                          {item.firstName} {item.lastName}
                        </h3>
                        <p className="text-xs text-orange-500 flex items-center font-light">
                          <FaPhone className="mr-1" />
                          {item.phoneNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                          title="แก้ไข"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                          title="ลบ"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item.id)}
                          onChange={() => handleSelectRow(item.id)}
                          className="h-4 w-4 text-orange-500 rounded border-orange-300 focus:ring-orange-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <strong className="text-orange-600 font-light flex items-center">
                          <FaBuilding className="mr-1" />
                          องค์กร:
                        </strong>
                        <div className="text-gray-600 font-light">
                          {item.organizationName}
                        </div>
                      </div>

                      <div>
                        <strong className="text-orange-600 font-light flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          ที่อยู่:
                        </strong>
                        <div className="text-gray-600 font-light">
                          {[item.addressLine1, item.district, item.amphoe, item.province]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <strong className="text-orange-600 font-light">
                            ประเภท:
                          </strong>
                          <div className="text-gray-600 font-light">
                            {item.type}
                          </div>
                        </div>
                        <div>
                          <strong className="text-orange-600 font-light flex items-center">
                            <FaUsers className="mr-1" />
                            ผู้ลงชื่อ:
                          </strong>
                          <div className="text-gray-600 font-light">
                            {item.numberOfSigners} คน
                          </div>
                        </div>
                      </div>

                      <div>
                        <strong className="text-orange-600 font-light flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          วันที่:
                        </strong>
                        <div className="text-gray-600 font-light">
                          {formatDate(item.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop Table View
              <div className="bg-white rounded-lg border border-orange-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-orange-200">
                    <thead className="bg-orange-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-light text-orange-600 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={
                              selectedRows.length === filteredData.length &&
                              filteredData.length > 0
                            }
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-orange-500 rounded border-orange-300"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-orange-600 uppercase tracking-wider">
                          ชื่อ-นามสกุล
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-orange-600 uppercase tracking-wider">
                          องค์กร
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-orange-600 uppercase tracking-wider">
                          จังหวัด/อำเภอ
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-orange-600 uppercase tracking-wider">
                          ประเภท
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-orange-600 uppercase tracking-wider">
                          จำนวนผู้ลงชื่อ
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-orange-600 uppercase tracking-wider">
                          วันที่บันทึก
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-light text-orange-600 uppercase tracking-wider">
                          จัดการ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-orange-100">
                      {paginatedData.map((item, index) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-orange-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-orange-25"
                          }`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(item.id)}
                              onChange={() => handleSelectRow(item.id)}
                              className="h-4 w-4 text-orange-500 rounded border-orange-300"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-light text-gray-700">
                              {item.firstName} {item.lastName}
                            </div>
                            <div className="text-xs text-orange-400 font-light">
                              {item.phoneNumber}
                            </div>
                            <div className="text-xs text-gray-400 font-light">
                              ID: {item.id}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div
                              className="text-sm font-light text-gray-700 max-w-32 truncate"
                              title={item.organizationName}
                            >
                              {item.organizationName}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            <div className="font-light">{item.province}</div>
                            <div className="text-xs text-gray-400 font-light">
                              {item.amphoe}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-light rounded-full bg-orange-100 text-orange-800">
                              {item.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="text-sm font-medium text-gray-900">
                              {item.numberOfSigners} คน
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-light">
                            {formatDate(item.createdAt)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                                title="แก้ไข"
                              >
                                <FaEdit className="text-sm" />
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                title="ลบ"
                              >
                                <FaTrash className="text-sm" />
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
              <div className="bg-white rounded-lg border border-orange-200 p-4 mt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-500 font-light">
                    แสดง {(currentPage - 1) * pageSize + 1} ถึง{" "}
                    {Math.min(currentPage * pageSize, filteredData.length)} จาก{" "}
                    {filteredData.length.toLocaleString()} รายการ
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-orange-200 rounded-md text-xs font-light text-orange-600 bg-white hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      หน้าแรก
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-orange-200 rounded-md text-xs font-light text-orange-600 bg-white hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ก่อนหน้า
                    </button>

                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNumber =
                        currentPage <= 3
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
                              : "border-orange-200 bg-white text-orange-600 hover:bg-orange-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-orange-200 rounded-md text-xs font-light text-orange-600 bg-white hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ถัดไป
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-orange-200 rounded-md text-xs font-light text-orange-600 bg-white hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      หน้าสุดท้าย
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Edit Modal */}
        <EditModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          recordId={selectedRecord?.id || null}
          onSuccess={handleModalSuccess}
        />

        {/* Delete Modal */}
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          record={selectedRecord}
          onSuccess={handleModalSuccess}
        />
      </div>
    </div>
  );
};

export default FormReturnTable;