// app/dashboard/soberCheers/components/soberTable/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { FaDownload, FaFileExcel, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import * as XLSX from 'xlsx';

type FilterType = 'district' | 'amphoe' | 'province' | 'type' | 'region' | 'job' | 'drinkingFrequency' | 'intentPeriod';

interface Filters {
  district: string;
  amphoe: string;
  province: string;
  type: string;
  region: string;
  name: string;
  job: string;
  drinkingFrequency: string;
  intentPeriod: string;
}

interface SoberCheersItem {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  birthday: string;
  addressLine1: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  type: string;
  alcoholConsumption: string;
  healthImpact: string;
  phone: string;
  job: string;
  drinkingFrequency: string;
  intentPeriod: string;
  monthlyExpense: number | null;
  motivations: any;
}

const SoberCheersTable: React.FC = () => {
  const [data, setData] = useState<SoberCheersItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    district: '',
    amphoe: '',
    province: '',
    type: '',
    region: '',
    name: '',
    job: '',
    drinkingFrequency: '',
    intentPeriod: '',
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
     const response = await axios.get<{ soberCheers: SoberCheersItem[] }>('/api/soberCheersCharts');
     const rawData = response.data.soberCheers || [];
     
     // Clean and validate data
     const cleanedData = rawData.map(item => ({
       ...item,
       monthlyExpense: item.monthlyExpense != null ? Number(item.monthlyExpense) || 0 : 0,
       firstName: item.firstName || '',
       lastName: item.lastName || '',
       gender: item.gender || '',
       province: item.province || '',
       type: item.type || '',
       job: item.job || '',
       alcoholConsumption: item.alcoholConsumption || '',
       phone: item.phone || '',
       district: item.district || '',
       amphoe: item.amphoe || '',
       addressLine1: item.addressLine1 || '',
       zipcode: item.zipcode || '',
       drinkingFrequency: item.drinkingFrequency || '',
       intentPeriod: item.intentPeriod || '',
       healthImpact: item.healthImpact || '',
       birthday: item.birthday || new Date().toISOString()
     }));
     
     setData(cleanedData);
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
     district: '',
     amphoe: '',
     province: '',
     type: '',
     region: '',
     name: '',
     job: '',
     drinkingFrequency: '',
     intentPeriod: '',
   });
   setCurrentPage(1);
 };

 const filteredData = data.filter((item: SoberCheersItem) => {
   return (
     (!filters.district || (item.district && item.district.includes(filters.district))) &&
     (!filters.amphoe || (item.amphoe && item.amphoe.includes(filters.amphoe))) &&
     (!filters.province || (item.province && item.province.includes(filters.province))) &&
     (!filters.type || (item.type && item.type.includes(filters.type))) &&
     (!filters.name || `${item.firstName || ''} ${item.lastName || ''}`.toLowerCase().includes(filters.name.toLowerCase())) &&
     (!filters.job || (item.job && item.job.includes(filters.job))) &&
     (!filters.drinkingFrequency || (item.drinkingFrequency && item.drinkingFrequency.includes(filters.drinkingFrequency))) &&
     (!filters.intentPeriod || (item.intentPeriod && item.intentPeriod.includes(filters.intentPeriod)))
   );
 });

 const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
 const totalPages = Math.ceil(filteredData.length / pageSize);

 const calculateAge = (birthday: string): number => {
   if (!birthday) return 0;
   try {
     const ageDifMs = Date.now() - new Date(birthday).getTime();
     const ageDate = new Date(ageDifMs);
     const age = Math.abs(ageDate.getUTCFullYear() - 1970);
     return isNaN(age) ? 0 : age;
   } catch {
     return 0;
   }
 };

 const formatMonthlyExpense = (expense: number | null): string => {
   if (expense == null || isNaN(expense)) return '0';
   return expense.toLocaleString();
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

 const handleClearSelection = () => {
   setSelectedRows([]);
 };

 const parseMotivations = (motivations: string | null | undefined): string => {
   if (!motivations) return '-';
   if (typeof motivations === 'string') {
     try {
       const parsedMotivations = JSON.parse(motivations);
       if (Array.isArray(parsedMotivations)) {
         return parsedMotivations.join(', ');
       }
       return motivations;
     } catch (error) {
       return motivations;
     }
   }
   return String(motivations);
 };

 const handleExportCSV = () => {
   const dataToExport = selectedRows.length > 0 
     ? filteredData.filter(item => selectedRows.includes(item.id))
     : filteredData;
 
   const headers = [
     'ชื่อ-นามสกุล', 'เพศ', 'อายุ', 'ที่อยู่', 'ภาค', 'การดื่มแอลกอฮอล์',
     'ผลกระทบต่อสุขภาพ', 'เบอร์โทรศัพท์', 'อาชีพ', 'ความถี่ในการดื่ม',
     'ระยะเวลาตั้งใจเลิกดื่ม', 'ค่าใช้จ่ายต่อเดือน', 'แรงจูงใจในการเลิกดื่ม'
   ];

   const csvContent = [
     headers.join(','),
     ...dataToExport.map(item => [
       `"${(item.firstName || '') + ' ' + (item.lastName || '')}"`,
       `"${item.gender || ''}"`,
       calculateAge(item.birthday),
       `"${[item.addressLine1, item.district, item.amphoe, item.province, item.zipcode].filter(Boolean).join(', ')}"`,
       `"${item.type || ''}"`,
       `"${item.alcoholConsumption || ''}"`,
       `"${item.healthImpact || ''}"`,
       `"${item.phone || ''}"`,
       `"${item.job || ''}"`,
       `"${item.drinkingFrequency || ''}"`,
       `"${item.intentPeriod || ''}"`,
       formatMonthlyExpense(item.monthlyExpense),
       `"${parseMotivations(item.motivations)}"`
     ].join(','))
   ].join('\n');

   const BOM = '\uFEFF';
   const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
   const link = document.createElement('a');
   const url = URL.createObjectURL(blob);
   link.setAttribute('href', url);
   link.setAttribute('download', `sober_cheers_data_${new Date().toISOString().split('T')[0]}.csv`);
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
     'อายุ': `${calculateAge(item.birthday)} ปี`,
     'ที่อยู่': [item.addressLine1, item.district, item.amphoe, item.province, item.zipcode].filter(Boolean).join(', '),
     'ภาค': item.type || '',
     'การดื่มแอลกอฮอล์': item.alcoholConsumption || '',
     'ผลกระทบต่อสุขภาพ': item.healthImpact || '',
     'เบอร์โทรศัพท์': item.phone || '',
     'อาชีพ': item.job || '',
     'ความถี่ในการดื่ม': item.drinkingFrequency || '',
     'ระยะเวลาตั้งใจเลิกดื่ม': item.intentPeriod || '',
     'ค่าใช้จ่ายต่อเดือน (บาท)': item.monthlyExpense || 0,
     'แรงจูงใจในการเลิกดื่ม': parseMotivations(item.motivations)
   }));

   const worksheet = XLSX.utils.json_to_sheet(excelData);
   const workbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Sober Cheers Data");
   XLSX.writeFile(workbook, `sober_cheers_data_${new Date().toISOString().split('T')[0]}.xlsx`);
 };

 const getUniqueValues = (key: keyof SoberCheersItem) => {
   const values = data.map(item => item[key]).filter(value => value != null && value !== '');
   return Array.from(new Set(values)).sort();
 };

 if (loading) {
   return (
     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       <div className="text-center">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500 mx-auto mb-4"></div>
         <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
       </div>
     </div>
   );
 }

 if (error) {
   return (
     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       <div className="text-center">
         <div className="text-red-500 text-xl mb-4">❌ เกิดข้อผิดพลาด</div>
         <p className="text-gray-600 mb-4">{error}</p>
         <button
           onClick={fetchData}
           className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
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
       <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
           <div>
             <h1 className="text-2xl font-bold text-amber-600 mb-2">
               📊 ข้อมูล Sober Cheers
             </h1>
             <p className="text-gray-600">
               ข้อมูลผู้เข้าร่วมโครงการงดเหล้าเข้าพรรษา (รวม {data.length.toLocaleString()} รายการ)
             </p>
           </div>
           <div className="mt-4 md:mt-0 flex items-center space-x-2">
             <button
               onClick={() => setShowFilters(!showFilters)}
               className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                 showFilters 
                   ? 'bg-red-500 text-white hover:bg-red-600' 
                   : 'bg-amber-500 text-white hover:bg-amber-600'
               }`}
             >
               {showFilters ? <FaTimes className="mr-2" /> : <FaFilter className="mr-2" />}
               {showFilters ? 'ปิดตัวกรอง' : 'ตัวกรอง'}
             </button>
           </div>
         </div>
       </div>

       {/* Filters */}
       {showFilters && (
         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-medium text-gray-900">ตัวกรองข้อมูล</h3>
             <button
               onClick={clearAllFilters}
               className="text-red-600 hover:text-red-800 text-sm flex items-center"
             >
               <FaTimes className="mr-1" />
               ล้างตัวกรองทั้งหมด
             </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
             {/* Search by name */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">ค้นหาด้วยชื่อ</label>
               <div className="relative">
                 <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                 <input
                   type="text"
                   placeholder="พิมพ์ชื่อ..."
                   className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                   value={filters.name}
                   onChange={(e) => handleFilterChange(e.target.value, 'name')}
                 />
               </div>
             </div>

             {/* Province filter */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">จังหวัด</label>
               <select
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                 value={filters.province}
                 onChange={(e) => handleFilterChange(e.target.value, 'province')}
               >
                 <option value="">ทั้งหมด ({getUniqueValues('province').length} จังหวัด)</option>
                 {getUniqueValues('province').map(province => (
                   <option key={province} value={province}>{province}</option>
                 ))}
               </select>
             </div>

             {/* Type filter */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">ภาค</label>
               <select
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                 value={filters.type}
                 onChange={(e) => handleFilterChange(e.target.value, 'type')}
               >
                 <option value="">ทั้งหมด ({getUniqueValues('type').length} ภาค)</option>
                 {getUniqueValues('type').map(type => (
                   <option key={type} value={type}>{type}</option>
                 ))}
               </select>
             </div>

             {/* Job filter */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">อาชีพ</label>
               <select
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                 value={filters.job}
                 onChange={(e) => handleFilterChange(e.target.value, 'job')}
               >
                 <option value="">ทั้งหมด ({getUniqueValues('job').length} อาชีพ)</option>
                 {getUniqueValues('job').map(job => (
                   <option key={job} value={job}>{job}</option>
                 ))}
               </select>
             </div>
           </div>
           
           {/* Active filters display */}
           {Object.entries(filters).some(([_, value]) => value !== '') && (
             <div className="mt-4 p-3 bg-gray-50 rounded-lg">
               <div className="text-sm text-gray-600 mb-2">ตัวกรองที่ใช้งาน:</div>
               <div className="flex flex-wrap gap-2">
                 {Object.entries(filters).map(([key, value]) => {
                   if (!value) return null;
                   const labels: Record<string, string> = {
                     name: 'ชื่อ',
                     province: 'จังหวัด',
                     type: 'ภาค',
                     job: 'อาชีพ'
                   };
                   return (
                     <span key={key} className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                       {labels[key] || key}: {value}
                       <button
                         onClick={() => handleFilterChange('', key as any)}
                         className="ml-1 text-amber-600 hover:text-amber-800"
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

       {/* Stats */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
         <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-amber-500">
           <div className="text-2xl font-bold text-amber-600">{filteredData.length.toLocaleString()}</div>
           <div className="text-sm text-gray-600">รายการที่แสดง</div>
         </div>
         <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
           <div className="text-2xl font-bold text-blue-600">{selectedRows.length.toLocaleString()}</div>
           <div className="text-sm text-gray-600">รายการที่เลือก</div>
         </div>
         <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
           <div className="text-2xl font-bold text-green-600">{currentPage}</div>
           <div className="text-sm text-gray-600">หน้าปัจจุบัน</div>
         </div>
         <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
           <div className="text-2xl font-bold text-purple-600">{totalPages}</div>
           <div className="text-sm text-gray-600">หน้าทั้งหมด</div>
         </div>
       </div>

       {/* Action buttons */}
       <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
         <div className="flex flex-wrap gap-3">
           <button
             onClick={handleExportCSV}
             disabled={filteredData.length === 0}
             className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <FaDownload className="mr-2" />
             ดาวน์โหลด CSV {selectedRows.length > 0 && `(${selectedRows.length} รายการ)`}
           </button>
           <button
             onClick={handleExportExcel}
             disabled={filteredData.length === 0}
             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <FaFileExcel className="mr-2" />
             ดาวน์โหลด Excel {selectedRows.length > 0 && `(${selectedRows.length} รายการ)`}
           </button>
           <button
             onClick={handleSelectAll}
             disabled={filteredData.length === 0}
             className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {selectedRows.length === filteredData.length ? 'ยกเลิกเลือกทั้งหมด' : 'เลือกทั้งหมด'}
           </button>
           {selectedRows.length > 0 && (
             <button
               onClick={handleClearSelection}
               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
             >
               ยกเลิกการเลือก ({selectedRows.length})
             </button>
           )}
         </div>
       </div>

       {/* No data message */}
       {filteredData.length === 0 && (
         <div className="bg-white rounded-lg shadow-sm p-8 text-center">
           <div className="text-gray-500 text-xl mb-2">🔍</div>
           <div className="text-gray-700 font-medium mb-2">ไม่พบข้อมูล</div>
           <div className="text-gray-500 text-sm">
             {Object.values(filters).some(f => f !== '') 
               ? 'ลองปรับเปลี่ยนตัวกรองข้อมูล' 
               : 'ไม่มีข้อมูลในระบบ'
             }
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
                 <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-amber-500">
                   <div className="flex items-start justify-between mb-3">
                     <div className="flex-1">
                       <h3 className="font-medium text-amber-600 text-lg">
                         {item.firstName} {item.lastName}
                       </h3>
                       <p className="text-sm text-gray-600">{item.gender} • {calculateAge(item.birthday)} ปี</p>
                     </div>
                     <input
                       type="checkbox"
                       checked={selectedRows.includes(item.id)}
                       onChange={() => handleSelectRow(item.id)}
                       className="h-5 w-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                     />
                   </div>
                   
                   <div className="space-y-2 text-sm">
                     <div className="grid grid-cols-2 gap-2">
                       <div><strong>จังหวัด:</strong> {item.province}</div>
                       <div><strong>ภาค:</strong> {item.type}</div>
                     </div>
                     <div><strong>ที่อยู่:</strong> {[item.addressLine1, item.district, item.amphoe].filter(Boolean).join(', ')}</div>
                     <div className="grid grid-cols-2 gap-2">
                       <div><strong>อาชีพ:</strong> {item.job}</div>
                       <div><strong>เบอร์:</strong> {item.phone}</div>
                     </div>
                     <div><strong>การดื่ม:</strong> {item.alcoholConsumption}</div>
                     <div className="grid grid-cols-2 gap-2">
                       <div><strong>ค่าใช้จ่าย:</strong> {formatMonthlyExpense(item.monthlyExpense)} ฿/เดือน</div>
                       <div><strong>ความถี่:</strong> {item.drinkingFrequency}</div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             // Desktop Table View
             <div className="bg-white rounded-lg shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         <input
                           type="checkbox"
                           checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                           onChange={handleSelectAll}
                           className="h-4 w-4 text-amber-600 rounded border-gray-300"
                         />
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เพศ/อายุ</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จังหวัด</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ภาค</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อาชีพ</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การดื่ม</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ค่าใช้จ่าย</th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {paginatedData.map((item, index) => (
                       <tr key={item.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <input
                             type="checkbox"
                             checked={selectedRows.includes(item.id)}
                             onChange={() => handleSelectRow(item.id)}
                             className="h-4 w-4 text-amber-600 rounded border-gray-300"
                           />
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm font-medium text-gray-900">
                             {item.firstName} {item.lastName}
                           </div>
                           <div className="text-xs text-gray-500">{item.phone}</div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           <div>{item.gender}</div>
                           <div className="text-xs text-gray-500">{calculateAge(item.birthday)} ปี</div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           {item.province}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           {item.type}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           {item.job}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           <div className="max-w-32 truncate" title={item.alcoholConsumption}>
                             {item.alcoholConsumption}
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           {formatMonthlyExpense(item.monthlyExpense)} ฿
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
             <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div className="text-sm text-gray-700">
                   แสดง {((currentPage - 1) * pageSize) + 1} ถึง {Math.min(currentPage * pageSize, filteredData.length)} จาก {filteredData.length.toLocaleString()} รายการ
                 </div>
                 <div className="flex items-center space-x-2">
                   <button
                     onClick={() => setCurrentPage(1)}
                     disabled={currentPage === 1}
                     className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     หน้าแรก
                   </button>
                   <button
onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                     disabled={currentPage === 1}
                     className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                         className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                           currentPage === pageNumber
                             ? 'border-amber-500 bg-amber-500 text-white'
                             : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                         }`}
                       >
                         {pageNumber}
                       </button>
                     );
                   })}
                   
                   <button
                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                     disabled={currentPage === totalPages}
                     className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     ถัดไป
                   </button>
                   <button
                     onClick={() => setCurrentPage(totalPages)}
                     disabled={currentPage === totalPages}
                     className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default SoberCheersTable;