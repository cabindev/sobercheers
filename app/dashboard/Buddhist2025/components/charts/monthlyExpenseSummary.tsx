// app/dashboard/Buddhist2025/components/charts/monthlyExpenseSummary.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { getMonthlyExpenseSummaryData } from '../../actions/GetChartData';
import { 
 FaMoneyBillWave, 
 FaChartLine, 
 FaUsers, 
 FaPiggyBank,
 FaCalendarAlt,
 FaStar,
 FaArrowUp,
 FaLeaf
} from 'react-icons/fa';

interface ExpenseSummary {
 total: number;
 average: number;
 participantCount: number;
}

const MonthlyExpenseSummary: React.FC = () => {
 const [summary, setSummary] = useState<ExpenseSummary | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   const fetchData = async () => {
     try {
       setLoading(true);
       const result = await getMonthlyExpenseSummaryData();
       if (result.success && result.data) {
         setSummary(result.data);
       }
     } catch (error) {
       console.error('Error fetching monthly expense summary:', error);
     } finally {
       setLoading(false);
     }
   };

   fetchData();
 }, []);

 if (loading) {
   return (
     <div className="max-w-5xl mx-auto space-y-6">
       {/* Elegant skeleton */}
       <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-pulse">
         <div className="h-8 bg-gray-200 rounded-2xl w-80 mx-auto mb-8"></div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           {[...Array(3)].map((_, index) => (
             <div key={index} className="bg-gray-100 rounded-2xl p-6">
               <div className="h-6 bg-gray-200 rounded-xl mb-4"></div>
               <div className="h-10 bg-gray-200 rounded-xl mb-2"></div>
               <div className="h-4 bg-gray-200 rounded-xl w-20"></div>
             </div>
           ))}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {[...Array(2)].map((_, index) => (
             <div key={index} className="bg-gray-100 rounded-2xl p-6">
               <div className="h-24 bg-gray-200 rounded-xl"></div>
             </div>
           ))}
         </div>
       </div>
     </div>
   );
 }

 if (!summary) {
   return (
     <div className="max-w-5xl mx-auto">
       <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
         <div className="text-red-500 font-medium">ไม่พบข้อมูลค่าใช้จ่ายรายเดือน</div>
       </div>
     </div>
   );
 }

 const formatCurrency = (amount: number) => {
   return new Intl.NumberFormat('th-TH', { 
     style: 'currency', 
     currency: 'THB',
     minimumFractionDigits: 0,
     maximumFractionDigits: 0
   }).format(amount);
 };

 const campaignSavings = summary.total * 3;
 const annualSavings = summary.total * 12;

 return (
   <div className="max-w-5xl mx-auto">
     <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
       {/* Header */}
       <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-8 py-6 border-b border-gray-100">
         <div className="flex items-center justify-center">
           <div className="bg-emerald-100 p-3 rounded-2xl mr-4">
             <FaMoneyBillWave className="text-emerald-600 text-xl" />
           </div>
           <div className="text-center">
             <h2 className="text-2xl font-bold text-gray-800">ภาพรวมค่าใช้จ่าย</h2>
             <p className="text-gray-600 text-sm mt-1">การวิเคราะห์รายจ่ายเหล้ารายเดือน</p>
           </div>
         </div>
       </div>

       <div className="p-8">
         {/* Main Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           {/* Total Amount */}
           <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
             <div className="flex items-center justify-between mb-4">
               <div className="bg-purple-500 p-3 rounded-xl">
                 <FaMoneyBillWave className="text-white text-lg" />
               </div>
               <div className="text-purple-600 text-xs font-semibold bg-purple-200 px-3 py-1 rounded-full">
                 รวม
               </div>
             </div>
             <div className="text-2xl font-bold text-purple-900 mb-1">
               {formatCurrency(summary.total)}
             </div>
             <div className="text-purple-600 text-sm font-medium">ต่อเดือน</div>
           </div>

           {/* Average */}
           <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 border border-cyan-200">
             <div className="flex items-center justify-between mb-4">
               <div className="bg-cyan-500 p-3 rounded-xl">
                 <FaChartLine className="text-white text-lg" />
               </div>
               <div className="text-cyan-600 text-xs font-semibold bg-cyan-200 px-3 py-1 rounded-full">
                 เฉลี่ย
               </div>
             </div>
             <div className="text-2xl font-bold text-cyan-900 mb-1">
               {formatCurrency(summary.average)}
             </div>
             <div className="text-cyan-600 text-sm font-medium">ต่อคน/เดือน</div>
           </div>

           {/* Participants */}
           <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-6 border border-emerald-200">
             <div className="flex items-center justify-between mb-4">
               <div className="bg-emerald-500 p-3 rounded-xl">
                 <FaUsers className="text-white text-lg" />
               </div>
               <div className="text-emerald-600 text-xs font-semibold bg-emerald-200 px-3 py-1 rounded-full">
                 คน
               </div>
             </div>
             <div className="text-2xl font-bold text-emerald-900 mb-1">
               {summary.participantCount.toLocaleString()}
             </div>
             <div className="text-emerald-600 text-sm font-medium">ผู้ให้ข้อมูล</div>
           </div>
         </div>

         {/* Savings Projection */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* 3 Months */}
           <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 border border-orange-200 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200 rounded-full opacity-20 -translate-y-6 translate-x-6"></div>
             <div className="relative">
               <div className="flex items-center mb-4">
                 <div className="bg-orange-500 p-3 rounded-xl mr-4">
                   <FaCalendarAlt className="text-white text-lg" />
                 </div>
                 <div>
                   <h3 className="font-bold text-orange-900">ช่วงเข้าพรรษา</h3>
                   <p className="text-orange-700 text-sm">3 เดือน</p>
                 </div>
               </div>
               <div className="bg-white rounded-xl p-4 border border-orange-200">
                 <div className="text-center">
                   <div className="text-2xl font-bold text-orange-600 mb-1">
                     {formatCurrency(campaignSavings)}
                   </div>
                   <div className="text-orange-700 text-sm flex items-center justify-center">
                     <FaArrowUp className="mr-1" />
                     ประหยัดได้
                   </div>
                 </div>
               </div>
             </div>
           </div>

           {/* 12 Months */}
           <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-6 border border-emerald-200 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-200 rounded-full opacity-20 -translate-y-6 translate-x-6"></div>
             <div className="relative">
               <div className="flex items-center mb-4">
                 <div className="bg-emerald-500 p-3 rounded-xl mr-4">
                   <FaStar className="text-white text-lg" />
                 </div>
                 <div>
                   <h3 className="font-bold text-emerald-900">ตลอดปี</h3>
                   <p className="text-emerald-700 text-sm">12 เดือน</p>
                 </div>
               </div>
               <div className="bg-white rounded-xl p-4 border border-emerald-200">
                 <div className="text-center">
                   <div className="text-2xl font-bold text-emerald-600 mb-1">
                     {formatCurrency(annualSavings)}
                   </div>
                   <div className="text-emerald-700 text-sm flex items-center justify-center">
                     <FaArrowUp className="mr-1" />
                     ประหยัดได้
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>

         {/* Benefits */}
         <div className="mt-8 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-200">
           <div className="flex items-center mb-4">
             <div className="bg-indigo-500 p-3 rounded-xl mr-4">
               <FaLeaf className="text-white text-lg" />
             </div>
             <h3 className="font-bold text-gray-800">ประโยชน์เพิ่มเติม</h3>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { icon: "🏥", text: "สุขภาพดีขึ้น" },
               { icon: "👨‍👩‍👧‍👦", text: "ครอบครัวอบอุ่น" },
               { icon: "🧠", text: "จิตใจแจ่มใส" },
               { icon: "💼", text: "ทำงานมีประสิทธิภาพ" }
             ].map((benefit, index) => (
               <div key={index} className="bg-white rounded-xl p-4 text-center border border-gray-200 hover:shadow-sm transition-shadow">
                 <div className="text-2xl mb-2">{benefit.icon}</div>
                 <div className="text-gray-700 text-sm font-medium">{benefit.text}</div>
               </div>
             ))}
           </div>
         </div>
       </div>

       {/* Footer */}
       <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4">
         <div className="text-center text-white">
           <p className="font-semibold">🙏 เริ่มต้นเปลี่ยนแปลงชีวิตวันนี้</p>
         </div>
       </div>
     </div>
   </div>
 );
};

export default MonthlyExpenseSummary;