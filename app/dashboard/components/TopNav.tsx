// app/dashboard/components/TopNav.tsx
'use client'

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useDashboard } from '../context/DashboardContext';
import { cn } from '@/lib/utils';
import { 
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface TopNavProps {
  user: any;
}

export default function TopNav({ user }: TopNavProps) {
  const { toggleMobileSidebar } = useDashboard();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 h-12 flex items-center justify-between px-4">
      {/* Left side - Search */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="ค้นหา..."
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-300"
          />
        </div>
      </div>

      {/* Right side - Notifications & User */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors">
          <Settings className="w-4 h-4" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded transition-colors"
          >
            <img
              src={user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover border border-gray-200"
            />
            <span className="text-sm text-gray-700 hidden md:block">
              {user?.firstName || user?.name || "User"}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400 hidden md:block" />
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
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setIsUserMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}