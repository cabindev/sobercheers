// app/dashboard/components/TopNav.tsx
'use client'

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useDashboard } from '../context/DashboardContext';
import { cn } from '@/lib/utils';
import { 
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Menu
} from 'lucide-react';

interface TopNavProps {
  user: any;
}

export default function TopNav({ user }: TopNavProps) {
  const { toggleMobileSidebar, isMobileSidebarOpen } = useDashboard();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    toggleMobileSidebar(!isMobileSidebarOpen);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 relative z-[60]">
      {/* Left side - Mobile hamburger + Search */}
      <div className="flex items-center flex-1 max-w-md">
        {/* Mobile hamburger button */}
        <div className="lg:hidden mr-3">
          <button
            type="button"
            onClick={handleMenuToggle}
            className="flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors relative z-[70]"
            aria-label="เปิดเมนู"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="ค้นหา..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right side - Notifications & User */}
      <div className="flex items-center space-x-2">
        {/* Notifications */}
        <button 
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="การแจ้งเตือน"
        >
          <Bell className="w-5 h-5" />
        </button>

        {/* Settings */}
        <button 
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="การตั้งค่า"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="เมนูผู้ใช้"
          >
            <img
              src={user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover border border-gray-200"
            />
            <span className="text-sm text-gray-700 hidden md:block font-medium">
              {user?.firstName || user?.name || "User"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
          </button>

          {/* User Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded border border-gray-200 shadow-lg py-1 z-50">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-normal text-gray-900">
                  {user?.firstName || user?.name || ""} {user?.lastName || ""}
                </p>
                <p className="text-xs text-gray-500">{user?.email || ""}</p>
                <p className="text-xs mt-1 text-gray-500">
                  {user?.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
                </p>
              </div>
              
                <button
                type="button"
                onClick={() => {
                  window.location.href = "/dashboard/profile";
                  setIsUserMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                <User className="w-4 h-4 mr-2" />
                Profile
                </button>
              
              <button
                type="button"
                onClick={() => {
                  // Navigate to settings
                  setIsUserMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
              
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setIsUserMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  ออกจากระบบ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}