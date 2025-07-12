// app/dashboard/components/TopNav.tsx
'use client'

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useDashboard } from '../context/DashboardContext';
import { useTopNav } from '../context/TopNavContext';
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
  onSelectAll?: () => void;
  selectedCount?: number;
  totalCount?: number;
  showSelectAll?: boolean;
}

export default function TopNav({ user }: TopNavProps) {
  const { toggleMobileSidebar, isMobileSidebarOpen } = useDashboard();
  const { showSelectAll, selectedCount, totalCount, onSelectAll } = useTopNav();
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
    <header className="bg-white h-12 flex items-center justify-between px-6 relative z-[60] shadow-sm">
      {/* Left side - Mobile hamburger + Brand */}
      <div className="flex items-center space-x-4">
        {/* Mobile hamburger button */}
        <button
          type="button"
          onClick={handleMenuToggle}
          className="p-1 text-gray-700 hover:bg-gray-100 rounded lg:hidden transition-colors"
          aria-label="เปิดเมนู"
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation'
          }}
        >
          <Menu className="h-4 w-4" />
        </button>
        
        {/* Brand/Title */}
        <div className="flex items-center">
          <h1 className="text-lg font-normal text-gray-900 hidden sm:block">
            Buddhist Lent Dashboard
          </h1>
          <h1 className="text-base font-normal text-gray-900 sm:hidden">
            Dashboard
          </h1>
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-xl mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search everything..."
            className="w-full pl-10 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Right side - Actions & User */}
      <div className="flex items-center space-x-1">
        {/* Select All Button - Only show when relevant */}
        {showSelectAll && totalCount > 0 && (
          <button 
            type="button"
            onClick={onSelectAll}
            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors font-medium"
            aria-label="เลือกทั้งหมด"
          >
            {selectedCount === totalCount ? 'Clear all' : `Select all (${totalCount})`}
          </button>
        )}

        {/* Selection indicator */}
        {selectedCount > 0 && (
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
            {selectedCount} selected
          </span>
        )}

        {/* Settings */}
        <button 
          type="button"
          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          aria-label="การตั้งค่า"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button 
          type="button"
          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors relative"
          aria-label="การแจ้งเตือน"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative ml-2">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded transition-colors"
            aria-label="เมนูผู้ใช้"
          >
            <img
              src={user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm text-gray-700 hidden lg:block font-normal">
              {user?.firstName || user?.name || "User"}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400 hidden lg:block" />
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