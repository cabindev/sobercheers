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
     name: 'จัดการกลุ่มองค์กร',
     href: '/dashboard/group-category',
     icon: UserCheck,
     requireAdmin: true,
     description: 'จัดการข้อมูลกลุ่มองค์กร'
    },
    {
     name: 'เพิ่มข้อมูลผู้เข้าร่วม',
     href: '/dashboard/Buddhist2025/create',
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
     {/* Mobile hamburger button */}
     <button
       onClick={() => toggleMobileSidebar(true)}
       className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-sm lg:hidden hover:bg-gray-50"
       aria-label="เปิดเมนู"
     >
       <Menu className="h-5 w-5 text-gray-600" />
     </button>

     {/* Overlay สำหรับกดปิด sidebar บนมือถือ */}
     {isMobileSidebarOpen && (
       <div
         className="fixed inset-0 bg-black/20 z-30 lg:hidden"
         onClick={() => toggleMobileSidebar(false)}
         aria-hidden="true"
       />
     )}

     <aside
       className={cn(
         "fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-gray-200 transition-all duration-200",
         sidebarCollapsed ? "w-16" : "w-64",
         "lg:translate-x-0",
         isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
       )}
     >
       {/* Sidebar header */}
       <div className="flex h-14 items-center justify-between border-b border-gray-200 px-3 bg-gray-50">
         {!sidebarCollapsed ? (
           <div className="flex items-center">
             <Link href="/dashboard/Buddhist2025">
               <img
                 src="/x-right.png"
                 alt="Logo"
                 className="h-7 w-auto"
               />
             </Link>
             <Link href="/" className="ml-2">
               <span className="text-gray-800 font-medium text-sm">
                 BUDDHIST LENT 
               </span>
             </Link>
           </div>
         ) : (
           <Link href="/dashboard/Buddhist2025" className="mx-auto">
             <img
               src="/x-left.png"
               alt="Logo"
               className="h-7 w-auto"
             />
           </Link>
         )}

         {/* ปุ่มปิดบนมือถือ */}
         <button
           onClick={() => toggleMobileSidebar(false)}
           className="p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
           aria-label="ปิดเมนู"
         >
           <X className="h-4 w-4" />
         </button>

         {/* ปุ่มย่อ/ขยายบนจอใหญ่ */}
         <button
           onClick={toggleSidebar}
           className="p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 hidden lg:block"
           aria-label={sidebarCollapsed ? "ขยายเมนู" : "ย่อเมนู"}
         >
           {sidebarCollapsed ? (
             <Menu className="h-4 w-4" />
           ) : (
             <PanelLeft className="h-4 w-4" />
           )}
         </button>
       </div>

       {/* Sidebar menu */}
       <div className="flex-1 overflow-y-auto py-4">
         {/* Buddhist Lent 2025 menu - ย้ายขึ้นมาบนสุด */}
         <div className="px-2 mb-2">
           <button
             onClick={() => setIsBuddhistLentMenuOpen(!isBuddhistLentMenuOpen)}
             className={cn(
               "group flex items-center w-full p-2 rounded text-sm transition-colors",
               pathname?.startsWith("/dashboard/Buddhist2025")
                 ? "bg-orange-50 text-orange-700 border-l-2 border-orange-500"
                 : "text-gray-700 hover:bg-gray-50",
               sidebarCollapsed && "justify-center"
             )}
             title={sidebarCollapsed ? "Buddhist Lent 2025" : ""}
           >
             <div
               className={cn(
                 "flex items-center justify-center",
                 sidebarCollapsed ? "h-8 w-8" : "h-4 w-4"
               )}
             >
               <Church className={sidebarCollapsed ? "w-5 h-5" : "w-4 h-4"} />
             </div>
             {!sidebarCollapsed && (
               <div className="flex items-center justify-between w-full ml-2">
                 <div>
                   <span className="font-normal text-sm">{buddhistLentMenu.name}</span>
                   <p className="text-xs text-gray-500 mt-0.5">
                     {buddhistLentMenu.description}
                   </p>
                 </div>
                 <ChevronDown
                   className={`w-3 h-3 transition-transform ${
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
               <div className="mt-1 ml-2">
                 <ul className="space-y-1">
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
                           className={`flex items-center p-2 text-sm rounded transition-colors ${
                             isSubActive
                               ? "bg-orange-100 text-orange-800"
                               : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                           }`}
                         >
                           <Icon className="w-4 h-4 mr-2" />
                           <div>
                             <span className="text-xs font-normal">{subMenu.name}</span>
                             <p className="text-xs text-gray-400 mt-0.5">
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

         <div className="mt-6">
           {!sidebarCollapsed && (
             <h3 className="px-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
               ระบบจัดการ
             </h3>
           )}

           {/* SoberCheers 2024 menu */}
           <div className="px-2 mb-2">
             <button
               onClick={() => setIsSoberMenuOpen(!isSoberMenuOpen)}
               className={cn(
                 "group flex items-center w-full p-2 rounded text-sm transition-colors",
                 pathname?.startsWith("/dashboard/soberCheers") ||
                   pathname?.startsWith("/soberCheers")
                   ? "bg-green-50 text-green-700 border-l-2 border-green-500"
                   : "text-gray-700 hover:bg-gray-50",
                 sidebarCollapsed && "justify-center"
               )}
               title={sidebarCollapsed ? "SOBER CHEERs 2024" : ""}
             >
               <div
                 className={cn(
                   "flex items-center justify-center",
                   sidebarCollapsed ? "h-8 w-8" : "h-4 w-4"
                 )}
               >
                 <Wine className={sidebarCollapsed ? "w-5 h-5" : "w-4 h-4"} />
               </div>
               {!sidebarCollapsed && (
                 <div className="flex items-center justify-between w-full ml-2">
                   <div>
                     <span className="font-normal text-sm">{soberCheersMenu.name}</span>
                     <p className="text-xs text-gray-500 mt-0.5">
                       {soberCheersMenu.description}
                     </p>
                   </div>
                   <ChevronDown
                     className={`w-3 h-3 transition-transform ${
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
                 <div className="mt-1 ml-2">
                   <ul className="space-y-1">
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
                             className={`flex items-center p-2 text-sm rounded transition-colors ${
                               isSubActive
                                 ? "bg-green-100 text-green-800"
                                 : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                             }`}
                           >
                             <Icon className="w-4 h-4 mr-2" />
                             <div>
                               <span className="text-xs font-normal">{subMenu.name}</span>
                               <p className="text-xs text-gray-400 mt-0.5">
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
           <div className="px-2 mb-2">
             <button
               onClick={() => setIsFormReturnMenuOpen(!isFormReturnMenuOpen)}
               className={cn(
                 "group flex items-center w-full p-2 rounded text-sm transition-colors",
                 pathname?.startsWith("/dashboard/formReturn") ||
                   pathname?.startsWith("/form_return")
                   ? "bg-purple-50 text-purple-700 border-l-2 border-purple-500"
                   : "text-gray-700 hover:bg-gray-50",
                 sidebarCollapsed && "justify-center"
               )}
               title={sidebarCollapsed ? "Form Return Management" : ""}
             >
               <div
                 className={cn(
                   "flex items-center justify-center",
                   sidebarCollapsed ? "h-8 w-8" : "h-4 w-4"
                 )}
               >
                 <ClipboardList className={sidebarCollapsed ? "w-5 h-5" : "w-4 h-4"} />
               </div>
               {!sidebarCollapsed && (
                 <div className="flex items-center justify-between w-full ml-2">
                   <div>
                     <span className="font-normal text-sm">{formReturnMenu.name}</span>
                     <p className="text-xs text-gray-500 mt-0.5">
                       {formReturnMenu.description}
                     </p>
                   </div>
                   <ChevronDown
                     className={`w-3 h-3 transition-transform ${
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
                 <div className="mt-1 ml-2">
                   <ul className="space-y-1">
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
                             className={`flex items-center p-2 text-sm rounded transition-colors ${
                               isSubActive
                                 ? "bg-purple-100 text-purple-800"
                                 : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                             }`}
                           >
                             <Icon className="w-4 h-4 mr-2" />
                             <div>
                               <span className="text-xs font-normal">{subMenu.name}</span>
                               <p className="text-xs text-gray-400 mt-0.5">
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
       <div className="border-t border-gray-200 p-3 bg-gray-50">
         <div
           className={cn(
             "flex items-center bg-white p-2 rounded border border-gray-200",
             sidebarCollapsed && "justify-center"
           )}
         >
           <div className="flex-shrink-0">
             <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
               {user?.image ? (
                 <img
                   src={user.image}
                   alt="Profile"
                   className="w-full h-full rounded-full object-cover"
                 />
               ) : (
                 <span className="text-xs font-medium text-gray-600">
                   {user?.firstName?.charAt(0) || user?.name?.charAt(0) || "U"}
                 </span>
               )}
             </div>
           </div>
           {!sidebarCollapsed && (
             <div className="ml-2">
               <p className="text-xs font-medium text-gray-900">
                 {user?.firstName || user?.name || ""} {user?.lastName || ""}
               </p>
               <p className="text-xs text-gray-500">{user?.email || ""}</p>
               <p className="text-xs mt-1 bg-gray-100 text-gray-600 inline-block px-2 py-0.5 rounded border border-gray-200">
                 {user?.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
               </p>
             </div>
           )}
         </div>
         <button
           onClick={() => signOut({ callbackUrl: "/" })}
           className={cn(
             "mt-2 flex items-center p-2 rounded w-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-sm transition-colors",
             sidebarCollapsed && "justify-center"
           )}
           aria-label="ออกจากระบบ"
         >
           <LogOut className="w-4 h-4 flex-shrink-0" />
           {!sidebarCollapsed && (
             <span className="ml-2 font-normal">ออกจากระบบ</span>
           )}
         </button>
       </div>
     </aside>
   </>
 );
}