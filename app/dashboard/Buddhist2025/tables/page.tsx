// app/dashboard/Buddhist2025/table/page.tsx
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
 FaArrowLeft
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import Link from 'next/link';
import { 
 getAllBuddhist2025Data, 
 getBuddhist2025FilterOptions, 
 getBuddhist2025TableStats 
} from '../actions/GetTableData';

type FilterType = 'province' | 'type' | 'gender' | 'groupCategoryId' | 'alcoholConsumption' | 'drinkingFrequency' | 'intentPeriod' | 'healthImpact';

interface Filters {
 province: string;
 type: string;
 gender: string;
 groupCategoryId: string;
 alcoholConsumption: string;
 drinkingFrequency: string;
 intentPeriod: string;
 healthImpact: string;
 name: string;
}

interface Buddhist2025Item {
 id: number;
 firstName: string;
 lastName: string;
 gender: string | null;
 age: number | null;
 phone: string | null;
 province: string;
 district: string;
 amphoe: string;
 zipcode: string;
 addressLine1: string;
 type: string | null;
 groupCategoryId: number;
 alcoholConsumption: string;
 drinkingFrequency: string | null;
 intentPeriod: string | null;
 monthlyExpense: number | null;
 healthImpact: string;
 motivations: any;
 createdAt: Date;
 groupCategory: {
   id: number;
   name: string;
 };
}

interface GroupCategory {
 id: number;
 name: string;
}

interface FilterOptions {
 provinces: string[];
 types: string[];
 genders: string[];
 alcoholConsumptions: string[];
 drinkingFrequencies: string[];
 intentPeriods: string[];
 healthImpacts: string[];
 groupCategories: Array<{ id: number; name: string }>;
}

interface TableStats {
 totalRecords: number;
 totalProvinces: number;
 totalGroupCategories: number;
 recentRegistrations: number;
 avgMonthlyExpense: number;
 totalMaleParticipants: number;
 totalFemaleParticipants: number;
 avgAge: number;
}

const BuddhistTable: React.FC = () => {
 const [data, setData] = useState<Buddhist2025Item[]>([]);
 const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
 const [tableStats, setTableStats] = useState<TableStats | null>(null);
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);
 const [filters, setFilters] = useState<Filters>({
   province: '',
   type: '',
   gender: '',
   groupCategoryId: '',
   alcoholConsumption: '',
   drinkingFrequency: '',
   intentPeriod: '',
   healthImpact: '',
   name: '',
 });
 
 const [isMobile, setIsMobile] = useState<boolean>(false);
 const [selectedRows, setSelectedRows] = useState<number[]>([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [showFilters, setShowFilters] = useState(false);
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
       getAllBuddhist2025Data(),
       getBuddhist2025FilterOptions(),
       getBuddhist2025TableStats()
     ]);

     if (dataResult.success && dataResult.data) {
       setData(dataResult.data.buddhist2025);
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
     type: '',
     gender: '',
     groupCategoryId: '',
     alcoholConsumption: '',
     drinkingFrequency: '',
     intentPeriod: '',
     healthImpact: '',
     name: '',
   });
   setCurrentPage(1);
 };

 const filteredData = data.filter((item: Buddhist2025Item) => {
   return (
     (!filters.province || item.province?.includes(filters.province)) &&
     (!filters.type || item.type?.includes(filters.type)) &&
     (!filters.gender || item.gender?.includes(filters.gender)) &&
     (!filters.groupCategoryId || item.groupCategoryId?.toString() === filters.groupCategoryId) &&
     (!filters.alcoholConsumption || item.alcoholConsumption?.includes(filters.alcoholConsumption)) &&
     (!filters.drinkingFrequency || item.drinkingFrequency?.includes(filters.drinkingFrequency)) &&
     (!filters.intentPeriod || item.intentPeriod?.includes(filters.intentPeriod)) &&
     (!filters.healthImpact || item.healthImpact?.includes(filters.healthImpact)) &&
     (!filters.name || `${item.firstName || ''} ${item.lastName || ''}`.toLowerCase().includes(filters.name.toLowerCase()))
   );
 });

 const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
 const totalPages = Math.ceil(filteredData.length / pageSize);

 const formatAge = (age: number | null): string => {
   return age ? `${age} ปี` : '-';
 };

 const formatMonthlyExpense = (expense: number | null): string => {
   if (expense == null || isNaN(expense)) return '0';
   return expense.toLocaleString();
 };

 const formatDate = (date: Date): string => {
   try {
     return new Date(date).toLocaleDateString('th-TH');
   } catch {
     return '-';
   }
 };

 const getGroupCategoryName = (groupCategoryId: number): string => {
   if (!filterOptions) return 'ไม่ระบุ';
   const category = filterOptions.groupCategories.find(cat => cat.id === groupCategoryId);
   return category?.name || 'ไม่ระบุ';
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

 const parseMotivations = (motivations: any): string => {
   if (!motivations) return '-';
   
   try {
     let motivationsArray: string[] = [];
     
     if (Array.isArray(motivations)) {
       motivationsArray = motivations as string[];
     } else if (typeof motivations === 'string') {
       const parsed = JSON.parse(motivations);
       if (Array.isArray(parsed)) {
         motivationsArray = parsed as string[];
       } else {
         return motivations;
       }
     } else if (typeof motivations === 'object') {
       motivationsArray = Object.values(motivations).filter(v => typeof v === 'string') as string[];
     }
     
     return motivationsArray.join(', ');
   } catch (error) {
     return String(motivations);
   }
 };

 const handleExportCSV = () => {
   const dataToExport = selectedRows.length > 0 
     ? filteredData.filter(item => selectedRows.includes(item.id))
     : filteredData;

   const headers = [
     'ชื่อ-นามสกุล', 'เพศ', 'อายุ', 'เบอร์โทรศัพท์', 'ที่อยู่', 'ภาค',
     'กลุ่ม/องค์กร', 'การดื่มแอลกอฮอล์', 'ความถี่ในการดื่ม', 'ระยะเวลาตั้งใจเลิกดื่ม',
     'ค่าใช้จ่ายต่อเดือน', 'ผลกระทบต่อสุขภาพ', 'แรงจูงใจ', 'วันที่ลงทะเบียน'
   ];

   const csvContent = [
     headers.join(','),
     ...dataToExport.map(item => [
       `"${(item.firstName || '') + ' ' + (item.lastName || '')}"`,
       `"${item.gender || ''}"`,
       formatAge(item.age),
       `"${item.phone || ''}"`,
       `"${[item.addressLine1, item.district, item.amphoe, item.province, item.zipcode].filter(Boolean).join(', ')}"`,
       `"${item.type || ''}"`,
       `"${getGroupCategoryName(item.groupCategoryId)}"`,
       `"${item.alcoholConsumption || ''}"`,
       `"${item.drinkingFrequency || ''}"`,
       `"${item.intentPeriod || ''}"`,
       formatMonthlyExpense(item.monthlyExpense),
       `"${item.healthImpact || ''}"`,
       `"${parseMotivations(item.motivations)}"`,
       `"${formatDate(item.createdAt)}"`
     ].join(','))
   ].join('\n');

   const BOM = '\uFEFF';
   const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
   const link = document.createElement('a');
   const url = URL.createObjectURL(blob);
   link.setAttribute('href', url);
   link.setAttribute('download', `buddhist_2025_data_${new Date().toISOString().split('T')[0]}.csv`);
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
     'เพศ': item.gender || '',
     'อายุ': formatAge(item.age),
     'เบอร์โทรศัพท์': item.phone || '',
     'ที่อยู่': [item.addressLine1, item.district, item.amphoe, item.province, item.zipcode].filter(Boolean).join(', '),
     'ภาค': item.type || '',
     'กลุ่ม/องค์กร': getGroupCategoryName(item.groupCategoryId),
     'การดื่มแอลกอฮอล์': item.alcoholConsumption || '',
     'ความถี่ในการดื่ม': item.drinkingFrequency || '',
     'ระยะเวลาตั้งใจเลิกดื่ม': item.intentPeriod || '',
     'ค่าใช้จ่ายต่อเดือน (บาท)': item.monthlyExpense || 0,
     'ผลกระทบต่อสุขภาพ': item.healthImpact || '',
     'แรงจูงใจ': parseMotivations(item.motivations),
     'วันที่ลงทะเบียน': formatDate(item.createdAt)
   }));

   const worksheet = XLSX.utils.json_to_sheet(excelData);
   const workbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Buddhist 2025 Data");
   XLSX.writeFile(workbook, `buddhist_2025_data_${new Date().toISOString().split('T')[0]}.xlsx`);
 };

 if (loading) {
   return (
     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       <div className="text-center">
         <div className="animate-spin rounded-full h-8 w-8 border border-gray-200 border-t-gray-400 mx-auto mb-3"></div>
         <p className="text-sm text-gray-500 font-light">กำลังโหลดข้อมูลเข้าพรรษา...</p>
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
           className="px-4 py-2 bg-gray-500 text-white text-sm font-light rounded-md hover:bg-gray-600 transition-colors"
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
               <FaTable className="text-gray-400 mr-2 text-sm" />
               <h1 className="text-xl font-light text-gray-700">
                 ข้อมูลผู้เข้าร่วมเข้าพรรษา 2568
               </h1>
             </div>
             <p className="text-sm text-gray-500 font-light">
               ข้อมูลผู้ลงทะเบียนเข้าร่วมกิจกรรมงดเหล้าเข้าพรรษา (รวม{" "}
               {data.length.toLocaleString()} รายการ)
             </p>
             {tableStats && (
               <div className="mt-2 text-xs text-gray-400 font-light">
                 ลงทะเบียนใหม่ 7 วันล่าสุด:{" "}
                 {tableStats.recentRegistrations.toLocaleString()} รายการ
               </div>
             )}
           </div>

           <div className="mt-4 md:mt-0 flex items-center space-x-2">
             <Link href="/dashboard/Buddhist2025">
               <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 text-sm font-light rounded-md hover:bg-gray-200 transition-colors">
                 <FaArrowLeft className="mr-2 text-xs" />
                 กลับสู่ Dashboard
               </button>
             </Link>
             <button
               onClick={() => setShowFilters(!showFilters)}
               className={`flex items-center px-3 py-2 text-sm font-light rounded-md transition-colors ${
                 showFilters
                   ? "bg-gray-600 text-white hover:bg-gray-700"
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
               <FaFilter className="mr-2 text-gray-400 text-xs" />
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
                   placeholder="พิมพ์ชื่อ..."
                   className="pl-8 pr-3 py-2 w-full border border-gray-200 rounded-md text-sm font-light focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all"
                   value={filters.name}
                   onChange={(e) => handleFilterChange(e.target.value, "name")}
                 />
               </div>
             </div>

             {/* Province filter */}
             <div>
               <label className="block text-xs font-light text-gray-600 mb-2">
                 จังหวัด
               </label>
               <select
                 className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-light focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all"
                 value={filters.province}
                 onChange={(e) =>
                   handleFilterChange(e.target.value, "province")
                 }
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

             {/* Type filter */}
             <div>
               <label className="block text-xs font-light text-gray-600 mb-2">
                 ภาค
               </label>
               <select
                 className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-light focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all"
                 value={filters.type}
                 onChange={(e) => handleFilterChange(e.target.value, "type")}
               >
                 <option value="">
                   ทั้งหมด ({filterOptions.types.length} ภาค)
                 </option>
                 {filterOptions.types.map((type) => (
                   <option key={type} value={type}>
                     {type}
                   </option>
                 ))}
               </select>
             </div>

             {/* Gender filter */}
             <div>
               <label className="block text-xs font-light text-gray-600 mb-2">
                 เพศ
               </label>
               <select
                 className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-light focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all"
                 value={filters.gender}
                 onChange={(e) => handleFilterChange(e.target.value, "gender")}
               >
                 <option value="">ทั้งหมด</option>
                 {filterOptions.genders.map((gender) => (
                   <option key={gender} value={gender}>
                     {gender}
                   </option>
                 ))}
               </select>
             </div>

             {/* Group Category filter */}
             <div>
               <label className="block text-xs font-light text-gray-600 mb-2">
                 กลุ่ม/องค์กร
               </label>
               <select
                 className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-light focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all"
                 value={filters.groupCategoryId}
                 onChange={(e) =>
                   handleFilterChange(e.target.value, "groupCategoryId")
                 }
               >
                 <option value="">
                   ทั้งหมด ({filterOptions.groupCategories.length} กลุ่ม)
                 </option>
                 {filterOptions.groupCategories.map((category) => (
                   <option key={category.id} value={category.id.toString()}>
                     {category.name}
                   </option>
                 ))}
               </select>
             </div>

             {/* Alcohol Consumption filter */}
             <div>
               <label className="block text-xs font-light text-gray-600 mb-2">
                 การดื่มแอลกอฮอล์
               </label>
               <select
                 className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-light focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all"
                 value={filters.alcoholConsumption}
                 onChange={(e) =>
                   handleFilterChange(e.target.value, "alcoholConsumption")
                 }
               >
                 <option value="">ทั้งหมด</option>
                 {filterOptions.alcoholConsumptions.map((alcohol) => (
                   <option key={alcohol} value={alcohol}>
                     {alcohol}
                   </option>
                 ))}
               </select>
             </div>

             {/* Intent Period filter */}
             <div>
               <label className="block text-xs font-light text-gray-600 mb-2">
                 ระยะเวลาตั้งใจ
               </label>
               <select
                 className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-light focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all"
                 value={filters.intentPeriod}
                 onChange={(e) =>
                   handleFilterChange(e.target.value, "intentPeriod")
                 }
               >
                 <option value="">ทั้งหมด</option>
                 {filterOptions.intentPeriods.map((period) => (
                   <option key={period} value={period}>
                     {period}
                   </option>
                 ))}
               </select>
             </div>

             {/* Health Impact filter */}
             <div>
               <label className="block text-xs font-light text-gray-600 mb-2">
                 ผลกระทบต่อสุขภาพ
               </label>
               <select
                 className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-light focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all"
                 value={filters.healthImpact}
                 onChange={(e) =>
                   handleFilterChange(e.target.value, "healthImpact")
                 }
               >
                 <option value="">ทั้งหมด</option>
                 {filterOptions.healthImpacts.map((health) => (
                   <option key={health} value={health}>
                     {health}
                   </option>
                 ))}
               </select>
             </div>
           </div>

           {/* Active filters display */}
           {Object.entries(filters).some(([_, value]) => value !== "") && (
             <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100">
               <div className="text-xs text-gray-500 mb-2 font-light">
                 ตัวกรองที่ใช้งาน:
               </div>
               <div className="flex flex-wrap gap-2">
                 {Object.entries(filters).map(([key, value]) => {
                   if (!value) return null;
                   const labels: Record<string, string> = {
                     name: "ชื่อ",
                     province: "จังหวัด",
                     type: "ภาค",
                     gender: "เพศ",
                     groupCategoryId: "กลุ่ม",
                     alcoholConsumption: "การดื่ม",
                     drinkingFrequency: "ความถี่",
                     intentPeriod: "ระยะเวลา",
                     healthImpact: "ผลกระทบ",
                   };

                   let displayValue = value;
                   if (key === "groupCategoryId" && filterOptions) {
                     const category = filterOptions.groupCategories.find(
                       (cat) => cat.id.toString() === value
                     );
                     displayValue = category?.name || value;
                   }

                   return (
                     <span
                       key={key}
                       className="inline-flex items-center px-2 py-1 bg-gray-200 text-gray-600 text-xs font-light rounded border border-gray-300"
                     >
                       {labels[key] || key}: {displayValue}
                       <button
                         onClick={() => handleFilterChange("", key as any)}
                         className="ml-2 text-gray-500 hover:text-gray-700"
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

       {/* Enhanced Stats - Minimal */}
       <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
         <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
           <div className="text-center">
             <div className="text-2xl font-light text-gray-600 mb-1">
               {filteredData.length.toLocaleString()}
             </div>
             <div className="text-xs text-gray-400 flex items-center justify-center font-light">
               <FaUsers className="mr-1 text-xs" />
               รายการที่แสดง
             </div>
           </div>

           <div className="text-center">
             <div className="text-2xl font-light text-gray-600 mb-1">
               {selectedRows.length.toLocaleString()}
             </div>
             <div className="text-xs text-gray-400 flex items-center justify-center font-light">
               <FaBuilding className="mr-1 text-xs" />
               รายการที่เลือก
             </div>
           </div>

           {tableStats && (
             <>
               <div className="text-center">
                 <div className="text-2xl font-light text-gray-600 mb-1">
                   {tableStats.totalProvinces}
                 </div>
                 <div className="text-xs text-gray-400 flex items-center justify-center font-light">
                   <FaMapMarkerAlt className="mr-1 text-xs" />
                   จังหวัด
                 </div>
               </div>

               <div className="text-center">
                 <div className="text-2xl font-light text-gray-600 mb-1">
                   {tableStats.recentRegistrations}
                 </div>
                 <div className="text-xs text-gray-400 flex items-center justify-center font-light">
                   <FaCalendarAlt className="mr-1 text-xs" />
                   ลงทะเบียนใหม่
                 </div>
               </div>

               <div className="text-center">
                 <div className="text-xl font-light text-gray-600 mb-1">
                   {tableStats.avgMonthlyExpense.toLocaleString()}฿
                 </div>
                 <div className="text-xs text-gray-400 flex items-center justify-center font-light">
                   💰 ค่าใช้จ่ายเฉลี่ย
                 </div>
               </div>
             </>
           )}
         </div>
       </div>

       {/* Action buttons */}
       <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
         <div className="flex flex-wrap gap-3">
           {/* ✅ เพิ่มปุ่มนี้ด้านบน */}
           <Link href="/dashboard/Buddhist2025/create">
             <button className="flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-all duration-300">
               <FaUsers className="mr-2 text-xs" />
               เพิ่มผู้สมัครใหม่
             </button>
           </Link>

           <button
             onClick={handleExportCSV}
             disabled={filteredData.length === 0}
             className="flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-light rounded-md hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <FaDownload className="mr-2 text-xs" />
             ดาวน์โหลด CSV{" "}
             {selectedRows.length > 0 && `(${selectedRows.length} รายการ)`}
           </button>
           <button
             onClick={handleExportExcel}
             disabled={filteredData.length === 0}
             className="flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-light rounded-md hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <FaFileExcel className="mr-2 text-xs" />
             ดาวน์โหลด Excel{" "}
             {selectedRows.length > 0 && `(${selectedRows.length} รายการ)`}
           </button>
           <button
             onClick={handleSelectAll}
             disabled={filteredData.length === 0}
             className="px-4 py-2 bg-gray-400 text-white text-sm font-light rounded-md hover:bg-gray-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {selectedRows.length === filteredData.length
               ? "ยกเลิกเลือกทั้งหมด"
               : "เลือกทั้งหมด"}
           </button>
           {selectedRows.length > 0 && (
             <button
               onClick={() => setSelectedRows([])}
               className="px-4 py-2 bg-gray-600 text-white text-sm font-light rounded-md hover:bg-gray-700 transition-all duration-300"
             >
               ยกเลิกการเลือก ({selectedRows.length})
             </button>
           )}
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
                   className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-gray-400"
                 >
                   <div className="flex items-start justify-between mb-3">
                     <div className="flex-1">
                       <h3 className="font-light text-gray-700 text-base mb-1">
                         {item.firstName} {item.lastName}
                       </h3>
                       <p className="text-xs text-gray-500 flex items-center font-light">
                         <span className="mr-2">{item.gender}</span>
                         <span className="mx-2">•</span>
                         <span>{formatAge(item.age)}</span>
                       </p>
                     </div>
                     <input
                       type="checkbox"
                       checked={selectedRows.includes(item.id)}
                       onChange={() => handleSelectRow(item.id)}
                       className="h-4 w-4 text-gray-500 rounded border-gray-300 focus:ring-gray-400"
                     />
                   </div>

                   <div className="space-y-2 text-xs">
                     <div className="grid grid-cols-2 gap-3">
                       <div>
                         <strong className="text-gray-600 font-light">
                           จังหวัด:
                         </strong>
                         <div className="text-gray-500 font-light">
                           {item.province}
                         </div>
                       </div>
                       <div>
                         <strong className="text-gray-600 font-light">
                           ภาค:
                         </strong>
                         <div className="text-gray-500 font-light">
                           {item.type}
                         </div>
                       </div>
                     </div>

                     <div>
                       <strong className="text-gray-600 font-light">
                         ที่อยู่:
                       </strong>
                       <div className="text-gray-500 font-light">
                         {[item.addressLine1, item.district, item.amphoe]
                           .filter(Boolean)
                           .join(", ")}
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                       <div>
                         <strong className="text-gray-600 font-light">
                           เบอร์:
                         </strong>
                         <div className="text-gray-500 font-light">
                           {item.phone}
                         </div>
                       </div>
                       <div>
                         <strong className="text-gray-600 font-light">
                           ID:
                         </strong>
                         <div className="text-gray-500 font-light">
                           {item.id}
                         </div>
                       </div>
                     </div>

                     <div>
                       <strong className="text-gray-600 font-light">
                         กลุ่ม/องค์กร:
                       </strong>
                       <div className="text-gray-500 font-light">
                         {getGroupCategoryName(item.groupCategoryId)}
                       </div>
                     </div>

                     <div>
                       <strong className="text-gray-600 font-light">
                         การดื่มแอลกอฮอล์:
                       </strong>
                       <div className="text-gray-500 font-light">
                         {item.alcoholConsumption}
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                       <div>
                         <strong className="text-gray-600 font-light">
                           ค่าใช้จ่าย:
                         </strong>
                         <div className="text-gray-500 font-light">
                           {formatMonthlyExpense(item.monthlyExpense)} ฿/เดือน
                         </div>
                       </div>
                       <div>
                         <strong className="text-gray-600 font-light">
                           ระยะเวลา:
                         </strong>
                         <div className="text-gray-500 font-light">
                           {item.intentPeriod}
                         </div>
                       </div>
                     </div>

                     <div>
                       <strong className="text-gray-600 font-light">
                         ลงทะเบียน:
                       </strong>
                       <div className="text-gray-500 font-light">
                         {formatDate(item.createdAt)}
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
                           checked={
                             selectedRows.length === filteredData.length &&
                             filteredData.length > 0
                           }
                           onChange={handleSelectAll}
                           className="h-4 w-4 text-gray-500 rounded border-gray-300"
                         />
                       </th>
                       <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                         ชื่อ-นามสกุล
                       </th>
                       <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                         เพศ/อายุ
                       </th>
                       <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                         จังหวัด/ภาค
                       </th>
                       <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                         กลุ่ม/องค์กร
                       </th>
                       <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                         การดื่มแอลกอฮอล์
                       </th>
                       <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                         ค่าใช้จ่าย/เดือน
                       </th>
                       <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                         วันที่ลงทะเบียน
                       </th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-100">
                     {paginatedData.map((item, index) => (
                       <tr
                         key={item.id}
                         className={`hover:bg-gray-50 transition-colors ${
                           index % 2 === 0 ? "bg-white" : "bg-gray-25"
                         }`}
                       >
                         <td className="px-4 py-3 whitespace-nowrap">
                           <input
                             type="checkbox"
                             checked={selectedRows.includes(item.id)}
                             onChange={() => handleSelectRow(item.id)}
                             className="h-4 w-4 text-gray-500 rounded border-gray-300"
                           />
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap">
                           <div className="text-sm font-light text-gray-700">
                             {item.firstName} {item.lastName}
                           </div>
                           <div className="text-xs text-gray-400 font-light">
                             {item.phone}
                           </div>
                           <div className="text-xs text-gray-400 font-light">
                             ID: {item.id}
                           </div>
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                           <div className="font-light">{item.gender}</div>
                           <div className="text-xs text-gray-400 font-light">
                             {formatAge(item.age)}
                           </div>
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                           <div className="font-light">{item.province}</div>
                           <div className="text-xs text-gray-400 font-light">
                             {item.type}
                           </div>
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                           <div
                             className="max-w-32 truncate font-light"
                             title={getGroupCategoryName(item.groupCategoryId)}
                           >
                             {getGroupCategoryName(item.groupCategoryId)}
                           </div>
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                           <div
                             className="max-w-32 truncate font-light"
                             title={item.alcoholConsumption}
                           >
                             {item.alcoholConsumption}
                           </div>
                           <div className="text-xs text-gray-400 font-light">
                             {item.drinkingFrequency}
                           </div>
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                           <div className="font-light">
                             {formatMonthlyExpense(item.monthlyExpense)} ฿
                           </div>
                           <div className="text-xs text-gray-400 font-light">
                             {item.intentPeriod}
                           </div>
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-light">
                           {formatDate(item.createdAt)}
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
                   แสดง {(currentPage - 1) * pageSize + 1} ถึง{" "}
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
                     onClick={() =>
                       setCurrentPage((prev) => Math.max(prev - 1, 1))
                     }
                     disabled={currentPage === 1}
                     className="px-3 py-2 border border-gray-200 rounded-md text-xs font-light text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                             ? "border-gray-400 bg-gray-500 text-white"
                             : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
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

export default BuddhistTable;