// app/components/Navbar.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  User, 
  LogOut, 
  Menu, 
  BarChart3, 
  Users, 
  UserCog, 
  Plus,
  ClipboardList,
  ChevronDown,
  X
} from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormReturnMenuOpen, setIsFormReturnMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === 'admin';
  
  // ซ่อน Navbar ในหน้า dashboard - ตรวจสอบหลังจาก Hooks ทั้งหมด
  const isDashboardPage = pathname?.startsWith('/dashboard');

  // ปิดเมนูเมื่อคลิกนอก dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-menu')) {
        setIsFormReturnMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Return null หลังจาก Hooks ทั้งหมดถูกเรียกแล้ว
  if (isDashboardPage) {
    return null;
  }

  const formReturnMenuItems = [
    {
      key: 'viewFormReturn',
      label: 'คืนข้อมูลงดเหล้าเข้าพรรษา',
      href: '/dashboard/formReturn',
      icon: <ClipboardList className="w-4 h-4" />,
      description: 'รายการคืนข้อมูล'
    },
    {
      key: 'createFormReturn',
      label: 'เพิ่มข้อมูลงดเหล้าเข้าพรรษา',
      href: '/form_return/create',
      icon: <Plus className="w-4 h-4" />,
      description: 'สร้างฟอร์มคืนข้อมูลใหม่'
    }
  ];

  const userMenuItems = [
    {
      key: 'home',
      label: 'Home',
      href: 'https://sdnthailand.com/',
      icon: <Home className="w-4 h-4" />
    },
    {
      key: 'profile',
      label: 'Profile',
      href: '/profile',
      icon: <User className="w-4 h-4" />
    }
  ];

  return (
    <nav className="relative z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo และ Brand */}
          <div className="flex items-center">
            <img className="h-12 w-12" src="/x-left.png" alt="Logo" />
            <span className="mx-2 text-lg font-bold text-center bg-gradient-to-r from-amber-500 to-amber-700 text-transparent bg-clip-text">
              BUDDHIST LENT
            </span>
            <Link
              href="https://sdnthailand.com/"
              className="ml-4 text-gray-700 hover:text-amber-500 transition-colors hidden md:block"
            >
              Home
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {status === "loading" ? (
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              isAdmin && (
                <>
                  {/* Dashboard Link (ไม่ใช่ dropdown) */}
                  <Link
                    href="/dashboard"
                    className="flex items-center text-gray-700 hover:text-amber-500 transition-colors px-3 py-2 rounded-md"
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Dashboard
                  </Link>

                  {/* Form Return Dropdown */}
                  <div className="relative dropdown-menu">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFormReturnMenuOpen(!isFormReturnMenuOpen);
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center text-gray-700 hover:text-amber-500 transition-colors px-3 py-2 rounded-md"
                    >
                      <ClipboardList className="w-4 h-4 mr-1" />
                      คืนข้อมูลงดเหล้าเข้าพรรษา
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    
                    {isFormReturnMenuOpen && (
                      <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fadeDown">
                        {formReturnMenuItems.map((item) => (
                          <Link
                            key={item.key}
                            href={item.href}
                            className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                            onClick={() => setIsFormReturnMenuOpen(false)}
                          >
                            <div className="mr-3 mt-0.5">{item.icon}</div>
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )
            )}

            {/* User Menu */}
            {status === "loading" ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session && session.user ? (
              <div className="relative dropdown-menu">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setIsFormReturnMenuOpen(false);
                  }}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    src={
                      session.user.image ||
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                    }
                    alt="User profile"
                    className="w-8 h-8 rounded-full cursor-pointer object-cover border-2 border-amber-200 hover:border-amber-400 transition-colors"
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fadeDown">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {session.user.firstName || session.user.firstName}
                      </p>
                      <p className="text-xs text-gray-500">{session.user.email}</p>
                    </div>
                    
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </Link>
                    ))}
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: "/" });
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="ml-2">Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push("/auth/signin")}
                className="bg-amber-500 hover:bg-amber-600 text-white border-none px-4 py-2 rounded-md transition-colors"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            {status === "loading" ? (
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-amber-500 transition-colors p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 bg-white py-4 animate-fadeDown">
            <div className="space-y-1">
              <Link
                href="https://sdnthailand.com/"
                className="flex items-center px-3 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-4 h-4 mr-3" />
                Home
              </Link>

              {isAdmin && (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart3 className="w-4 h-4 mr-3" />
                    Dashboard
                  </Link>

                  <div className="px-3 py-2 mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Form Return</p>
                  </div>
                  {formReturnMenuItems.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="flex items-center px-6 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="mr-3">{item.icon}</div>
                      {item.label}
                    </Link>
                  ))}
                </>
              )}

              {session && session.user ? (
                <>
                  <div className="px-3 py-2 mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">บัญชีผู้ใช้</p>
                  </div>
                  <div className="flex items-center px-3 py-2 bg-gray-50 rounded-md mx-3">
                    <img
                      src={
                        session.user.image ||
                        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                      }
                      alt="User profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {session.user.firstName || session.user.firstName}
                      </p>
                      <p className="text-xs text-gray-500">{session.user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-6 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    router.push("/auth/signin");
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}