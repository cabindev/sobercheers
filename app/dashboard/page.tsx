// app/dashboard/page.tsx
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import authOptions from '../lib/configs/auth/authOptions';

import QuickActions from './components/QuickActions';
import { 
 Users, 
 TrendingUp, 
 Calendar,
 BarChart3,
 Sparkles,
 Clock
} from 'lucide-react';

// Loading Components
function StatsLoading() {
 return (
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
     {[...Array(4)].map((_, i) => (
       <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/50">
         <div className="animate-pulse">
           <div className="w-8 h-8 bg-slate-200 rounded-lg mb-3"></div>
           <div className="w-20 h-6 bg-slate-200 rounded mb-2"></div>
           <div className="w-24 h-4 bg-slate-200 rounded"></div>
         </div>
       </div>
     ))}
   </div>
 );
}

function ChartsLoading() {
 return (
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
     {[...Array(2)].map((_, i) => (
       <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/50">
         <div className="animate-pulse">
           <div className="w-32 h-6 bg-slate-200 rounded mb-4"></div>
           <div className="w-full h-64 bg-slate-200 rounded"></div>
         </div>
       </div>
     ))}
   </div>
 );
}

export default async function DashboardPage() {
 const session = await getServerSession(authOptions);

 if (!session?.user) {
   redirect('/auth/signin?callbackUrl=/dashboard');
 }

 const isAdmin = session.user.role === 'admin';
 const user = session.user;

 return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
     <div className="max-w-7xl mx-auto p-6 space-y-8">
       {/* Header Section */}
       <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-2xl">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-emerald-600/20"></div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
         
         <div className="relative z-10 flex items-center justify-between">
           <div>
             <div className="flex items-center mb-3">
               <Sparkles className="w-8 h-8 text-yellow-400 mr-3" />
               <span className="text-yellow-400 font-medium text-lg">SOBER CHEERs Dashboard</span>
             </div>
             <h1 className="text-4xl font-bold mb-3">
               ยินดีต้อนรับ, {user.firstName} {user.lastName}
             </h1>
             <p className="text-slate-300 text-lg">
               {isAdmin ? '🔧 แดชบอร์ดผู้ดูแลระบบ' : '👋 แดชบอร์ดผู้ใช้งาน'} - ระบบจัดการข้อมูลงดเหล้าเข้าพรรษา พ.ศ. 2568
             </p>
             
             {/* User Role Badge */}
             <div className="mt-4">
               <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                 isAdmin 
                   ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                   : 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white'
               }`}>
                 {isAdmin ? '👑 ผู้ดูแลระบบ' : '🌟 ผู้ใช้งาน'}
               </span>
             </div>
           </div>
           
           <div className="hidden lg:flex flex-col items-end space-y-3">
             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
               <div className="flex items-center text-white/90 mb-2">
                 <Calendar className="w-5 h-5 mr-2" />
                 <span className="font-medium">วันที่ปัจจุบัน</span>
               </div>
               <div className="text-xl font-bold">
                 {new Date().toLocaleDateString('th-TH', { 
                   year: 'numeric', 
                   month: 'long', 
                   day: 'numeric',
                   weekday: 'long'
                 })}
               </div>
             </div>
             
             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
               <div className="flex items-center text-white/90 mb-2">
                 <Clock className="w-5 h-5 mr-2" />
                 <span className="font-medium">เวลา</span>
               </div>
               <div className="text-lg font-semibold">
                 {new Date().toLocaleTimeString('th-TH', {
                   hour: '2-digit',
                   minute: '2-digit'
                 })} น.
               </div>
             </div>
           </div>
         </div>
       </div>

       {/* Quick Actions */}
       <QuickActions isAdmin={isAdmin} />

       {/* Stats Overview */}
       <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/50">
         <div className="flex items-center justify-between mb-8">
           <div>
             <h2 className="text-2xl font-bold text-slate-900 flex items-center">
               <BarChart3 className="w-7 h-7 mr-3 text-blue-600" />
               สถิติภาพรวมระบบ
             </h2>
             <p className="text-slate-600 mt-1">ข้อมูลสถิติการใช้งานทั้งหมด</p>
           </div>
           <div className="hidden md:flex items-center space-x-2 bg-slate-100 rounded-lg px-4 py-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-sm text-slate-600 font-medium">
               อัพเดทล่าสุด: {new Date().toLocaleTimeString('th-TH')}
             </span>
           </div>
         </div>
         
  
       </div>

       {/* Charts Section */}
       <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/50">
         <div className="mb-8">
           <h2 className="text-2xl font-bold text-slate-900 flex items-center">
             <TrendingUp className="w-7 h-7 mr-3 text-emerald-600" />
             กราฟและแผนภูมิเชิงสถิติ
           </h2>
           <p className="text-slate-600 mt-1">การวิเคราะห์ข้อมูลและแนวโน้ม</p>
         </div>
         

       </div>

       {/* Recent Activities */}
       <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/50">
         <div className="mb-8">
           <h2 className="text-2xl font-bold text-slate-900 flex items-center">
             <Users className="w-7 h-7 mr-3 text-violet-600" />
             กิจกรรมและการอัพเดทล่าสุด
           </h2>
           <p className="text-slate-600 mt-1">รายการกิจกรรมที่เกิดขึ้นในระบบ</p>
         </div>
         

       </div>

       {/* System Information (Admin Only) */}
       {isAdmin && (
         <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full -translate-x-32 translate-y-32"></div>
           
           <div className="relative z-10">
             <div className="flex items-center mb-6">
               <div className="p-3 bg-amber-500/20 rounded-xl mr-4">
                 <BarChart3 className="w-8 h-8 text-amber-400" />
               </div>
               <div>
                 <h2 className="text-2xl font-bold">ข้อมูลระบบ (เฉพาะผู้ดูแล)</h2>
                 <p className="text-slate-300">สถานะและข้อมูลเทคนิคของระบบ</p>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                 <h3 className="font-semibold text-lg mb-3 text-amber-300">🚀 เวอร์ชันระบบ</h3>
                 <p className="text-slate-300 text-lg">v2.0.0 - Buddhist Lent 2025</p>
                 <p className="text-slate-400 text-sm mt-2">อัพเดทล่าสุด: มิ.ย. 2025</p>
               </div>
               
               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                 <h3 className="font-semibold text-lg mb-3 text-green-300">🟢 สถานะเซิร์ฟเวอร์</h3>
                 <div className="flex items-center">
                   <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                   <p className="text-green-300 text-lg">ออนไลน์</p>
                 </div>
                 <p className="text-slate-400 text-sm mt-2">เวลาทำงาน: 99.9% uptime</p>
               </div>
               
               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                 <h3 className="font-semibold text-lg mb-3 text-blue-300">💾 การสำรองข้อมูล</h3>
                 <p className="text-slate-300 text-lg">ทำงานอัตโนมัติ</p>
                 <p className="text-slate-400 text-sm mt-2">สำรองล่าสุด: วันนี้ 03:00 น.</p>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Footer */}
       <div className="text-center py-6">
         <p className="text-slate-500 text-sm">
           © 2025 SOBER CHEERs - ระบบจัดการข้อมูลงดเหล้าเข้าพรรษา | พัฒนาด้วย ❤️ เพื่อสังคมไทย
         </p>
       </div>
     </div>
   </div>
 );
}