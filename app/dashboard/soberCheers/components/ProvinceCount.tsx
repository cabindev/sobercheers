import React, { useEffect, useState } from 'react';
import Table from '@/components/ui/Table';

interface ProvinceData {
 id: number;
 province: string;
 count: number;
}

interface ApiResponse {
 provinces: Omit<ProvinceData, 'id'>[];
}

const ProvinceCount: React.FC = () => {
 const [provinceData, setProvinceData] = useState<ProvinceData[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [showAllCards, setShowAllCards] = useState(false);

 useEffect(() => {
   const fetchProvinceData = async () => {
     try {
       setIsLoading(true);
       const response = await fetch('/api/soberCheers/provinces');
       const data: ApiResponse = await response.json();
       const sortedData = data.provinces
         .sort((a, b) => b.count - a.count)
         .map((item, index) => ({
           id: index + 1,
           ...item
         }));
       setProvinceData(sortedData);
     } catch (error) {
       console.error('Error fetching province data:', error);
     } finally {
       setIsLoading(false);
     }
   };

   fetchProvinceData();
 }, []);

 const getCardColor = (rank: number) => {
   if (rank === 1) return 'bg-yellow-300 text-yellow-800 border-yellow-400';
   if (rank === 2) return 'bg-gray-300 text-gray-800 border-gray-400';
   if (rank === 3) return 'bg-yellow-600 text-yellow-100 border-yellow-700';
   if (rank === 4 || rank === 5) return 'bg-blue-100 text-blue-800 border-blue-200';
   return 'bg-white text-gray-800 border-gray-200';
 };

 const getRankIcon = (rank: number) => {
   if (rank === 1) return '🥇';
   if (rank === 2) return '🥈';
   if (rank === 3) return '🥉';
   return '';
 };

 const columns = [
   {
     key: 'id',
     label: 'อันดับ',
     width: 'w-20',
     sortable: true,
     render: (value: number) => (
       <div className="flex items-center space-x-2">
         <span className={`font-bold text-lg ${
           value <= 3 ? 'text-amber-600' : 'text-gray-700'
         }`}>
           {value}
         </span>
         {getRankIcon(value) && (
           <span className="text-xl">{getRankIcon(value)}</span>
         )}
       </div>
     )
   },
   {
     key: 'province',
     label: 'จังหวัด',
     sortable: true,
     render: (value: string, row: ProvinceData) => (
       <span className={`font-medium ${
         row.id <= 3 ? 'text-amber-800 font-bold' : 'text-gray-900'
       }`}>
         {value}
       </span>
     )
   },
   {
     key: 'count',
     label: 'จำนวนผู้ลงทะเบียน',
     sortable: true,
     render: (value: number, row: ProvinceData) => (
       <div className="flex items-center">
         <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
           row.id === 1 ? 'bg-yellow-100 text-yellow-800' :
           row.id === 2 ? 'bg-gray-100 text-gray-800' :
           row.id === 3 ? 'bg-orange-100 text-orange-800' :
           row.id <= 5 ? 'bg-blue-100 text-blue-800' :
           'bg-green-100 text-green-800'
         }`}>
           {value.toLocaleString()} คน
         </span>
       </div>
     )
   }
 ];

 if (isLoading) {
   return (
     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
       <div className="mb-6">
         <div className="h-6 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
         <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
       </div>
       <div className="flex justify-center items-center h-64">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
         <span className="ml-3 text-gray-600">กำลังโหลดข้อมูล...</span>
       </div>
     </div>
   );
 }

 const displayedProvinces = showAllCards ? provinceData : provinceData.slice(0, 10);

 return (
   <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
     <div className="mb-6">
       <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
         🏆 อันดับจังหวัดที่มีผู้ลงทะเบียนมากที่สุด
       </h3>
       <p className="text-sm text-gray-600">
         สถิติการลงทะเบียนงดเหล้าเข้าพรรษาจากทุกจังหวัดในประเทศไทย เรียงลำดับจากมากไปน้อย
       </p>
     </div>

     {/* Card view for mobile */}
     <div className="lg:hidden">
       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
         {displayedProvinces.map((province) => (
           <div 
             key={province.id} 
             className={`p-4 rounded-lg shadow-md border-2 transition-all duration-200 hover:shadow-lg ${getCardColor(province.id)}`}
           >
             <div className="flex items-center justify-between mb-2">
               <div className="flex items-center space-x-2">
                 <span className="font-bold text-lg">#{province.id}</span>
                 {getRankIcon(province.id) && (
                   <span className="text-xl">{getRankIcon(province.id)}</span>
                 )}
               </div>
               {province.id <= 3 && (
                 <div className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs font-medium">
                   TOP {province.id}
                 </div>
               )}
             </div>
             <div className="font-bold text-lg mb-1">{province.province}</div>
             <div className="text-xl font-semibold">
               {province.count.toLocaleString()} คน
             </div>
           </div>
         ))}
       </div>
       
       {!showAllCards && provinceData.length > 10 && (
         <div className="mt-6 text-center">
           <button 
             onClick={() => setShowAllCards(true)}
             className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
           >
             ดูทุกจังหวัด ({provinceData.length - 10} จังหวัดที่เหลือ)
           </button>
         </div>
       )}
       
       {showAllCards && (
         <div className="mt-6 text-center">
           <button 
             onClick={() => setShowAllCards(false)}
             className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
           >
             ย่อกลับ
           </button>
         </div>
       )}
     </div>

     {/* Table view for desktop */}
     <div className="hidden lg:block">
       <Table
         columns={columns}
         data={provinceData}
         loading={false}
         pagination={true}
         pageSize={10}
       />
     </div>

     {/* Summary Stats */}
     {!isLoading && provinceData.length > 0 && (
       <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
         <h4 className="text-sm font-semibold text-amber-800 mb-3 flex items-center">
           📊 สรุปข้อมูลภาพรวม
         </h4>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
           <div className="bg-white p-3 rounded-lg border border-amber-100">
             <div className="text-amber-700 font-medium">จำนวนจังหวัดทั้งหมด</div>
             <div className="text-lg font-bold text-amber-900">{provinceData.length} จังหวัด</div>
           </div>
           <div className="bg-white p-3 rounded-lg border border-amber-100">
             <div className="text-amber-700 font-medium">ผู้ลงทะเบียนรวม</div>
             <div className="text-lg font-bold text-amber-900">
               {provinceData.reduce((sum, item) => sum + item.count, 0).toLocaleString()} คน
             </div>
           </div>
           <div className="bg-white p-3 rounded-lg border border-amber-100">
             <div className="text-amber-700 font-medium">จังหวัดอันดับ 1</div>
             <div className="text-lg font-bold text-amber-900">
               🥇 {provinceData.length > 0 ? provinceData[0].province : '-'}
             </div>
           </div>
           <div className="bg-white p-3 rounded-lg border border-amber-100">
             <div className="text-amber-700 font-medium">ค่าเฉลี่ยต่อจังหวัด</div>
             <div className="text-lg font-bold text-amber-900">
               {provinceData.length > 0 
                 ? Math.round(provinceData.reduce((sum, item) => sum + item.count, 0) / provinceData.length).toLocaleString()
                 : 0
               } คน
             </div>
           </div>
         </div>
       </div>
     )}
   </div>
 );
};

export default ProvinceCount;