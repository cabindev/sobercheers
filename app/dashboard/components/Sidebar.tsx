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

 const mainMenuItems = [
   {
     name: 'Profile',
     href: '/dashboard/profile',
     icon: User,
     description: 'ข้อมูลส่วนตัว'
   }
 ];

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
       href: '/dashboard/Buddhist2025/components/tables/buddhistTable',
       icon: Database,
       requireAdmin: true,
       description: 'ตารางข้อมูลผู้เข้าร่วม'
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
     {/* Overlay สำหรับกดปิด sidebar บนมือถือ */}
     {isMobileSidebarOpen && (
       <div
         className="fixed inset-0 bg-black/50 z-10 lg:hidden backdrop-blur-sm"
         onClick={() => toggleMobileSidebar(false)}
         aria-hidden="true"
       />
     )}

     <aside
       className={cn(
         "fixed inset-y-0 left-0 z-40 flex flex-col bg-gradient-to-b from-amber-600 to-amber-700 text-white transition-all duration-300 shadow-xl",
         sidebarCollapsed ? "w-20" : "w-72",
         "lg:translate-x-0",
         isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
       )}
     >
       {/* Sidebar header */}
       <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
         {!sidebarCollapsed ? (
           <div className="flex items-center">
             <Link href="/dashboard/Buddhist2025">
               <img
                 src="/x-left.png"
                 alt="SoberCheers Logo"
                 className="h-9 w-auto"
               />
             </Link>
             <Link href="/" className="ml-3">
               <span className="text-white font-bold text-lg bg-gradient-to-r from-white to-amber-100 text-transparent bg-clip-text">
                 SOBER CHEERs
               </span>
             </Link>
           </div>
         ) : (
           <Link href="/dashboard/Buddhist2025" className="mx-auto">
             <img
               src="/x-left.png"
               alt="SoberCheers Logo"
               className="h-10 w-auto"
             />
           </Link>
         )}

         {/* ปุ่มปิดบนมือถือ */}
         <button
           onClick={() => toggleMobileSidebar(false)}
           className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 lg:hidden"
           aria-label="ปิดเมนู"
         >
           <X className="h-5 w-5" />
         </button>

         {/* ปุ่มย่อ/ขยายบนจอใหญ่ */}
         <button
           onClick={toggleSidebar}
           className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 hidden lg:block"
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
       <div className="flex-1 overflow-y-auto py-5">
         {/* Buddhist Lent 2025 menu - ย้ายขึ้นมาบนสุด */}
         <div className="px-3 mb-3">
           <button
             onClick={() => setIsBuddhistLentMenuOpen(!isBuddhistLentMenuOpen)}
             className={cn(
               "group flex items-center w-full p-3 rounded-lg transition-all duration-200",
               pathname?.startsWith("/dashboard/Buddhist2025")
                 ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                 : "hover:bg-white/10 text-white/80 hover:text-white",
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
                   <span className="font-medium">{buddhistLentMenu.name}</span>
                   <p className="text-xs text-white/70 mt-0.5">
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
               <div className="animate-fadeDown mt-1">
                 <ul className="bg-white/5 rounded-lg ml-2 mr-2 overflow-hidden backdrop-blur-sm">
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
                               ? "bg-amber-400/20 text-amber-100"
                               : "text-white/80 hover:bg-white/10 hover:text-white"
                           }`}
                         >
                           <Icon className="w-4 h-4 mr-3" />
                           <div>
                             <span className="text-sm">{subMenu.name}</span>
                             <p className="text-xs text-white/60 mt-0.5">
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
             <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
               ระบบจัดการ
             </h3>
           )}

           {/* Profile menu */}
           <nav className="space-y-1 px-3 mb-6">
             {mainMenuItems.map((item) => {
               const Icon = item.icon;
               const isActive =
                 pathname === item.href ||
                 (item.href !== "/dashboard" && pathname?.startsWith(item.href));

               return (
                 <Link
                   key={item.href}
                   href={item.href}
                   className={cn(
                     "group flex items-center p-3 rounded-lg transition-all duration-200",
                     isActive
                       ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                       : "hover:bg-white/10 text-white/80 hover:text-white",
                     sidebarCollapsed ? "justify-center" : "space-x-3"
                   )}
                   title={sidebarCollapsed ? item.name : ""}
                 >
                   <div
                     className={cn(
                       "flex items-center justify-center",
                       sidebarCollapsed ? "h-10 w-10" : "h-5 w-5"
                     )}
                   >
                     <Icon
                       className={sidebarCollapsed ? "w-6 h-6" : "w-5 h-5"}
                     />
                   </div>
                   {!sidebarCollapsed && (
                     <div>
                       <span className="font-medium">{item.name}</span>
                       <p className="text-xs text-white/70 mt-0.5">
                         {item.description}
                       </p>
                     </div>
                   )}
                 </Link>
               );
             })}
           </nav>

           {/* SoberCheers 2024 menu */}
           <div className="px-3 mb-3">
             <button
               onClick={() => setIsSoberMenuOpen(!isSoberMenuOpen)}
               className={cn(
                 "group flex items-center w-full p-3 rounded-lg transition-all duration-200",
                 pathname?.startsWith("/dashboard/soberCheers") ||
                   pathname?.startsWith("/soberCheers")
                   ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                   : "hover:bg-white/10 text-white/80 hover:text-white",
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
                     <span className="font-medium">{soberCheersMenu.name}</span>
                     <p className="text-xs text-white/70 mt-0.5">
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
                 <div className="animate-fadeDown mt-1">
                   <ul className="bg-white/5 rounded-lg ml-2 mr-2 overflow-hidden backdrop-blur-sm">
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
                                 ? "bg-amber-400/20 text-amber-100"
                                 : "text-white/80 hover:bg-white/10 hover:text-white"
                             }`}
                           >
                             <Icon className="w-4 h-4 mr-3" />
                             <div>
                               <span className="text-sm">{subMenu.name}</span>
                               <p className="text-xs text-white/60 mt-0.5">
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
           <div className="px-3 mb-3">
             <button
               onClick={() => setIsFormReturnMenuOpen(!isFormReturnMenuOpen)}
               className={cn(
                 "group flex items-center w-full p-3 rounded-lg transition-all duration-200",
                 pathname?.startsWith("/dashboard/formReturn") ||
                   pathname?.startsWith("/form_return")
                   ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                   : "hover:bg-white/10 text-white/80 hover:text-white",
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
                     <span className="font-medium">{formReturnMenu.name}</span>
                     <p className="text-xs text-white/70 mt-0.5">
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
                 <div className="animate-fadeDown mt-1">
                   <ul className="bg-white/5 rounded-lg ml-2 mr-2 overflow-hidden backdrop-blur-sm">
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
                                 ? "bg-amber-400/20 text-amber-100"
                                 : "text-white/80 hover:bg-white/10 hover:text-white"
                             }`}
                           >
                             <Icon className="w-4 h-4 mr-3" />
                             <div>
                               <span className="text-sm">{subMenu.name}</span>
                               <p className="text-xs text-white/60 mt-0.5">
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
       <div className="border-t border-white/10 p-4">
         <div
           className={cn(
             "flex items-center bg-white/5 p-3 rounded-lg backdrop-blur-sm",
             sidebarCollapsed && "justify-center"
           )}
         >
           <div className="flex-shrink-0">
             <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
               {user?.image ? (
                 <img
                   src={user.image}
                   alt="Profile"
                   className="w-full h-full rounded-full object-cover"
                 />
               ) : (
                 <span className="text-sm font-medium text-white">
                   {user?.firstName?.charAt(0) || user?.name?.charAt(0) || "U"}
                 </span>
               )}
             </div>
           </div>
           {!sidebarCollapsed && (
             <div className="ml-3">
               <p className="text-sm font-medium text-white">
                 {user?.firstName || user?.name || ""} {user?.lastName || ""}
               </p>
               <p className="text-xs text-white/70">{user?.email || ""}</p>
               <p className="text-xs mt-1 bg-amber-400/20 text-amber-100 inline-block px-2 py-0.5 rounded-full">
                 {user?.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
               </p>
             </div>
           )}
         </div>
         <button
           onClick={() => signOut({ callbackUrl: "/" })}
           className={cn(
             "mt-4 flex items-center p-3 rounded-lg w-full text-white/80 hover:bg-red-500/20 hover:text-red-100 transition-all duration-200",
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