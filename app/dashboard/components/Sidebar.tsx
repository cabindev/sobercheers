// app/dashboard/components/Sidebar.tsx
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useDashboard } from '../context/DashboardContext';
import { cn } from '@/lib/utils';
import { 
 LayoutDashboard, 
 BarChart3,
 FileText,
 PlusCircle,
 User,
 LogOut,
 ChevronDown,
 Menu,
 PanelLeft,
 X,
 Wine,
 ClipboardList,
 UserCheck,
 Database,
 Church
} from 'lucide-react';

interface SidebarProps {
 user: any;
}

export default function Sidebar({ user }: SidebarProps) {
 const pathname = usePathname();
 const { sidebarCollapsed, toggleSidebar, isMobileSidebarOpen, toggleMobileSidebar } = useDashboard();
 const [isSoberMenuOpen, setIsSoberMenuOpen] = useState(false);
 const [isFormReturnMenuOpen, setIsFormReturnMenuOpen] = useState(false);
 const [isBuddhistLentMenuOpen, setIsBuddhistLentMenuOpen] = useState(false);

 // เปิดเมนูอัตโนมัติตามหน้าที่กำลังเปิดอยู่
 useEffect(() => {
   if (pathname?.startsWith('/dashboard/soberCheers') || pathname?.startsWith('/soberCheers')) {
     setIsSoberMenuOpen(true);
   }
   if (pathname?.startsWith('/dashboard/formReturn') || pathname?.startsWith('/form_return')) {
     setIsFormReturnMenuOpen(true);
   }
   if (pathname?.startsWith('/dashboard/Buddhist2025')) {
     setIsBuddhistLentMenuOpen(true);
   }
 }, [pathname]);

 // ปิด sidebar บนมือถือเมื่อเปลี่ยนหน้า
 useEffect(() => {
   if (isMobileSidebarOpen) {
     toggleMobileSidebar(false);
   }
 }, [pathname]);

 // Buddhist Lent 2025 menu (ย้ายขึ้นมาบนสุด)
 const buddhistLentMenu = {
   name: 'Buddhist Lent 2025',
   href: '/dashboard/Buddhist2025',
   icon: Church,
   description: 'จัดการข้อมูลเข้าพรรษา พ.ศ. 2568',
   subMenus: [
     {
       name: 'Dashboard',
       href: '/dashboard/Buddhist2025',
       icon: BarChart3,
       requireAdmin: true,
       description: 'แดชบอร์ดข้อมูลเข้าพรรษา'
     },
     {
       name: 'ข้อมูลผู้เข้าร่วมเข้าพรรษา',
       href: '/dashboard/Buddhist2025/tables',
       icon: Database,
       requireAdmin: true,
       description: 'ตารางข้อมูลผู้เข้าร่วม'
     },
     {
       name: 'เพิ่มข้อมูลผู้เข้าร่วม',
       href: '/Buddhist2025/create',
       icon: PlusCircle,
       requireAdmin: false,
       description: 'เพิ่มข้อมูลผู้เข้าร่วมใหม่'
     }
   ]
 };

 // เมนูสำหรับ SoberCheers 2024
 const soberCheersMenu = {
   name: 'SOBER CHEERs 2024',
   href: '/dashboard/soberCheers',
   icon: Wine,
   description: 'จัดการข้อมูลงดเหล้าเข้าพรรษา',
   subMenus: [
     {
       name: 'Dashboard',
       href: '/dashboard/soberCheers',
       icon: BarChart3,
       requireAdmin: true,
       description: 'แดชบอร์ดข้อมูลงดเหล้า'
     },
     {
       name: 'ข้อมูลงดเหล้าเข้าพรรษา 2567',
       href: '/dashboard/soberCheers/components/soberTable',
       icon: Database,
       requireAdmin: true,
       description: 'ตารางข้อมูลผู้งดเหล้า'
     },
     {
       name: 'เพิ่มข้อมูล SoberCheers',
       href: '/soberCheers',
       icon: PlusCircle,
       requireAdmin: false,
       description: 'เพิ่มข้อมูลผู้งดเหล้าใหม่'
     },
     {
       name: 'Admin Panel',
       href: '/dashboard/member/components/admin',
       icon: UserCheck,
       requireAdmin: true,
       description: 'จัดการผู้ดูแลระบบ'
     }
   ]
 };

 // เมนูสำหรับ Form Return
 const formReturnMenu = {
   name: 'Form Return Management',
   href: '/dashboard/formReturn',
   icon: ClipboardList,
   description: 'จัดการคืนข้อมูลงดเหล้าเข้าพรรษา',
   subMenus: [
     {
       name: 'คืนข้อมูลงดเหล้าเข้าพรรษา',
       href: '/dashboard/formReturn',
       icon: FileText,
       requireAdmin: true,
       description: 'รายการคืนข้อมูล'
     },
     {
       name: 'เพิ่มข้อมูลงดเหล้าเข้าพรรษา',
       href: '/form_return/create',
       icon: PlusCircle,
       requireAdmin: false,
       description: 'สร้างฟอร์มคืนข้อมูลใหม่'
     }
   ]
 };
 
 const isAdmin = user?.role === 'admin';

 return (
   <>
     {/* Overlay สำหรับกดปิด sidebar บนมือถือ */}
     {isMobileSidebarOpen && (
       <div
         className="fixed inset-0 bg-slate-900/80 z-10 lg:hidden backdrop-blur-sm"
         onClick={() => toggleMobileSidebar(false)}
         aria-hidden="true"
       />
     )}

     <aside
       className={cn(
         "fixed inset-y-0 left-0 z-40 flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 transition-all duration-300 shadow-2xl border-r border-slate-700/50",
         sidebarCollapsed ? "w-20" : "w-72",
         "lg:translate-x-0",
         isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
       )}
     >
       {/* Sidebar header */}
       <div className="flex h-16 items-center justify-between border-b border-slate-700/50 px-4 bg-slate-800/50 backdrop-blur-sm">
         {!sidebarCollapsed ? (
           <div className="flex items-center">
             <Link href="/dashboard/Buddhist2025">
               <img
                 src="/x-right.png"
                 alt="SoberCheers Logo"
                 className="h-9 w-auto drop-shadow-lg"
               />
             </Link>
             <Link href="/" className="ml-3">
               <span className="text-slate-100 font-bold text-lg bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
                 BUDDHIST LENT 
               </span>
             </Link>
           </div>
         ) : (
           <Link href="/dashboard/Buddhist2025" className="mx-auto">
             <img
               src="/x-left.png"
               alt="SoberCheers Logo"
               className="h-10 w-auto drop-shadow-lg"
             />
           </Link>
         )}

         {/* ปุ่มปิดบนมือถือ */}
         <button
           onClick={() => toggleMobileSidebar(false)}
           className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 lg:hidden transition-all duration-200"
           aria-label="ปิดเมนู"
         >
           <X className="h-5 w-5" />
         </button>

         {/* ปุ่มย่อ/ขยายบนจอใหญ่ */}
         <button
           onClick={toggleSidebar}
           className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 hidden lg:block transition-all duration-200"
           aria-label={sidebarCollapsed ? "ขยายเมนู" : "ย่อเมนู"}
         >
           {sidebarCollapsed ? (
             <Menu className="h-5 w-5" />
           ) : (
             <PanelLeft className="h-5 w-5" />
           )}
         </button>
       </div>

       {/* Sidebar menu */}
       <div className="flex-1 overflow-y-auto py-6">
         {/* Buddhist Lent 2025 menu - ย้ายขึ้นมาบนสุด */}
         <div className="px-4 mb-4">
           <button
             onClick={() => setIsBuddhistLentMenuOpen(!isBuddhistLentMenuOpen)}
             className={cn(
               "group flex items-center w-full p-3 rounded-xl transition-all duration-300 border border-transparent",
               pathname?.startsWith("/dashboard/Buddhist2025")
                 ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg border-emerald-500/20"
                 : "hover:bg-slate-700/50 text-slate-300 hover:text-slate-100 hover:border-slate-600/30",
               sidebarCollapsed && "justify-center"
             )}
             title={sidebarCollapsed ? "Buddhist Lent 2025" : ""}
           >
             <div
               className={cn(
                 "flex items-center justify-center",
                 sidebarCollapsed ? "h-10 w-10" : "h-5 w-5"
               )}
             >
               <Church className={sidebarCollapsed ? "w-6 h-6" : "w-5 h-5"} />
             </div>
             {!sidebarCollapsed && (
               <div className="flex items-center justify-between w-full ml-3">
                 <div>
                   <span className="font-semibold">{buddhistLentMenu.name}</span>
                   <p className="text-xs text-slate-400 mt-0.5">
                     {buddhistLentMenu.description}
                   </p>
                 </div>
                 <ChevronDown
                   className={`w-4 h-4 transition-transform duration-300 ${
                     isBuddhistLentMenuOpen ? "rotate-180" : ""
                   }`}
                 />
               </div>
             )}
           </button>

           {/* Buddhist Lent submenu */}
           {(isBuddhistLentMenuOpen ||
             pathname?.startsWith("/dashboard/Buddhist2025")) &&
             !sidebarCollapsed && (
               <div className="animate-fadeDown mt-2">
                 <ul className="bg-slate-800/30 rounded-xl ml-3 mr-1 overflow-hidden backdrop-blur-sm border border-slate-700/30">
                   {buddhistLentMenu.subMenus.map((subMenu) => {
                     if (subMenu.requireAdmin && !isAdmin) {
                       return null;
                     }

                     const Icon = subMenu.icon;
                     const isSubActive =
                       pathname === subMenu.href ||
                       pathname?.startsWith(subMenu.href);

                     return (
                       <li key={subMenu.href}>
                         <Link
                           href={subMenu.href}
                           className={`flex items-center p-3 transition-all duration-200 ${
                             isSubActive
                               ? "bg-emerald-500/20 text-emerald-100 border-l-4 border-emerald-400"
                               : "text-slate-300 hover:bg-slate-700/40 hover:text-slate-100"
                           }`}
                         >
                           <Icon className="w-4 h-4 mr-3" />
                           <div>
                             <span className="text-sm font-medium">{subMenu.name}</span>
                             <p className="text-xs text-slate-400 mt-0.5">
                               {subMenu.description}
                             </p>
                           </div>
                         </Link>
                       </li>
                     );
                   })}
                 </ul>
               </div>
             )}
         </div>

         <div className="mt-8">
           {!sidebarCollapsed && (
             <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
               ระบบจัดการ
             </h3>
           )}

           {/* SoberCheers 2024 menu */}
           <div className="px-4 mb-4">
             <button
               onClick={() => setIsSoberMenuOpen(!isSoberMenuOpen)}
               className={cn(
                 "group flex items-center w-full p-3 rounded-xl transition-all duration-300 border border-transparent",
                 pathname?.startsWith("/dashboard/soberCheers") ||
                   pathname?.startsWith("/soberCheers")
                   ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg border-violet-500/20"
                   : "hover:bg-slate-700/50 text-slate-300 hover:text-slate-100 hover:border-slate-600/30",
                 sidebarCollapsed && "justify-center"
               )}
               title={sidebarCollapsed ? "SOBER CHEERs 2024" : ""}
             >
               <div
                 className={cn(
                   "flex items-center justify-center",
                   sidebarCollapsed ? "h-10 w-10" : "h-5 w-5"
                 )}
               >
                 <Wine className={sidebarCollapsed ? "w-6 h-6" : "w-5 h-5"} />
               </div>
               {!sidebarCollapsed && (
                 <div className="flex items-center justify-between w-full ml-3">
                   <div>
                     <span className="font-semibold">{soberCheersMenu.name}</span>
                     <p className="text-xs text-slate-400 mt-0.5">
                       {soberCheersMenu.description}
                     </p>
                   </div>
                   <ChevronDown
                     className={`w-4 h-4 transition-transform duration-300 ${
                       isSoberMenuOpen ? "rotate-180" : ""
                     }`}
                   />
                 </div>
               )}
             </button>

             {/* SoberCheers submenu */}
             {(isSoberMenuOpen ||
               pathname?.startsWith("/dashboard/soberCheers") ||
               pathname?.startsWith("/soberCheers")) &&
               !sidebarCollapsed && (
                 <div className="animate-fadeDown mt-2">
                   <ul className="bg-slate-800/30 rounded-xl ml-3 mr-1 overflow-hidden backdrop-blur-sm border border-slate-700/30">
                     {soberCheersMenu.subMenus.map((subMenu) => {
                       if (subMenu.requireAdmin && !isAdmin) {
                         return null;
                       }

                       const Icon = subMenu.icon;
                       const isSubActive =
                         pathname === subMenu.href ||
                         pathname?.startsWith(subMenu.href);

                       return (
                         <li key={subMenu.href}>
                           <Link
                             href={subMenu.href}
                             className={`flex items-center p-3 transition-all duration-200 ${
                               isSubActive
                                 ? "bg-violet-500/20 text-violet-100 border-l-4 border-violet-400"
                                 : "text-slate-300 hover:bg-slate-700/40 hover:text-slate-100"
                             }`}
                           >
                             <Icon className="w-4 h-4 mr-3" />
                             <div>
                               <span className="text-sm font-medium">{subMenu.name}</span>
                               <p className="text-xs text-slate-400 mt-0.5">
                                 {subMenu.description}
                               </p>
                             </div>
                           </Link>
                         </li>
                       );
                     })}
                   </ul>
                 </div>
               )}
           </div>

           {/* Form Return menu */}
           <div className="px-4 mb-4">
             <button
               onClick={() => setIsFormReturnMenuOpen(!isFormReturnMenuOpen)}
               className={cn(
                 "group flex items-center w-full p-3 rounded-xl transition-all duration-300 border border-transparent",
                 pathname?.startsWith("/dashboard/formReturn") ||
                   pathname?.startsWith("/form_return")
                   ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-blue-500/20"
                   : "hover:bg-slate-700/50 text-slate-300 hover:text-slate-100 hover:border-slate-600/30",
                 sidebarCollapsed && "justify-center"
               )}
               title={sidebarCollapsed ? "Form Return Management" : ""}
             >
               <div
                 className={cn(
                   "flex items-center justify-center",
                   sidebarCollapsed ? "h-10 w-10" : "h-5 w-5"
                 )}
               >
                 <ClipboardList className={sidebarCollapsed ? "w-6 h-6" : "w-5 h-5"} />
               </div>
               {!sidebarCollapsed && (
                 <div className="flex items-center justify-between w-full ml-3">
                   <div>
                     <span className="font-semibold">{formReturnMenu.name}</span>
                     <p className="text-xs text-slate-400 mt-0.5">
                       {formReturnMenu.description}
                     </p>
                   </div>
                   <ChevronDown
                     className={`w-4 h-4 transition-transform duration-300 ${
                       isFormReturnMenuOpen ? "rotate-180" : ""
                     }`}
                   />
                 </div>
               )}
             </button>

             {/* Form Return submenu */}
             {(isFormReturnMenuOpen ||
               pathname?.startsWith("/dashboard/formReturn") ||
               pathname?.startsWith("/form_return")) &&
               !sidebarCollapsed && (
                 <div className="animate-fadeDown mt-2">
                   <ul className="bg-slate-800/30 rounded-xl ml-3 mr-1 overflow-hidden backdrop-blur-sm border border-slate-700/30">
                     {formReturnMenu.subMenus.map((subMenu) => {
                       if (subMenu.requireAdmin && !isAdmin) {
                         return null;
                       }

                       const Icon = subMenu.icon;
                       const isSubActive =
                         pathname === subMenu.href ||
                         pathname?.startsWith(subMenu.href);

                       return (
                         <li key={subMenu.href}>
                           <Link
                             href={subMenu.href}
                             className={`flex items-center p-3 transition-all duration-200 ${
                               isSubActive
                                 ? "bg-blue-500/20 text-blue-100 border-l-4 border-blue-400"
                                 : "text-slate-300 hover:bg-slate-700/40 hover:text-slate-100"
                             }`}
                           >
                             <Icon className="w-4 h-4 mr-3" />
                             <div>
                               <span className="text-sm font-medium">{subMenu.name}</span>
                               <p className="text-xs text-slate-400 mt-0.5">
                                 {subMenu.description}
                               </p>
                             </div>
                           </Link>
                         </li>
                       );
                     })}
                   </ul>
                 </div>
               )}
           </div>
         </div>
       </div>

       {/* User info & logout */}
       <div className="border-t border-slate-700/50 p-4 bg-slate-800/30 backdrop-blur-sm">
         <div
           className={cn(
             "flex items-center bg-slate-700/30 p-3 rounded-xl backdrop-blur-sm border border-slate-600/20",
             sidebarCollapsed && "justify-center"
           )}
         >
           <div className="flex-shrink-0">
             <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg ring-2 ring-slate-600/30">
               {user?.image ? (
                 <img
                   src={user.image}
                   alt="Profile"
                   className="w-full h-full rounded-full object-cover"
                 />
               ) : (
                 <span className="text-sm font-semibold text-white">
                   {user?.firstName?.charAt(0) || user?.name?.charAt(0) || "U"}
                 </span>
               )}
             </div>
           </div>
           {!sidebarCollapsed && (
             <div className="ml-3">
               <p className="text-sm font-semibold text-slate-100">
                 {user?.firstName || user?.name || ""} {user?.lastName || ""}
               </p>
               <p className="text-xs text-slate-400">{user?.email || ""}</p>
               <p className="text-xs mt-1.5 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-blue-100 inline-block px-3 py-1 rounded-full border border-blue-400/20">
                 {user?.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
               </p>
             </div>
           )}
         </div>
         <button
           onClick={() => signOut({ callbackUrl: "/" })}
           className={cn(
             "mt-4 flex items-center p-3 rounded-xl w-full text-slate-300 hover:bg-red-500/20 hover:text-red-100 hover:border-red-400/30 border border-transparent transition-all duration-200",
             sidebarCollapsed && "justify-center"
           )}
           aria-label="ออกจากระบบ"
         >
           <LogOut className="w-5 h-5 flex-shrink-0" />
           {!sidebarCollapsed && (
             <span className="ml-3 font-medium">ออกจากระบบ</span>
           )}
         </button>
       </div>
     </aside>
   </>
 );
}