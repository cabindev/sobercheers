// app/dashboard/organization-dashboard/tables/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Table } from 'lucide-react';

export const metadata = {
  title: 'ตารางข้อมูลองค์กร - Organization Dashboard',
  description: 'ตารางข้อมูลองค์กรที่เข้าร่วมระบบ พ.ศ. 2568',
};

export default function OrganizationDashboardTablesPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Table className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              ตารางข้อมูลองค์กร
            </h1>
            <p className="text-sm text-gray-600">
              ดูและจัดการข้อมูลองค์กรในรูปแบบตาราง
            </p>
          </div>
        </div>
        
        <Link
          href="/dashboard/organization-dashboard"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>กลับสู่ Dashboard</span>
        </Link>
      </div>

      {/* Redirect Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-800 mb-4">
          <Table className="h-12 w-12 mx-auto mb-2" />
          <h2 className="text-lg font-medium">ตารางข้อมูลองค์กร</h2>
        </div>
        
        <p className="text-green-700 mb-4">
          ตารางข้อมูลองค์กรใช้ระบบเดียวกับหน้าจัดการองค์กรหลัก
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/organization"
            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Table className="h-4 w-4 mr-2" />
            ไปยังตารางข้อมูลองค์กร
          </Link>
          
          <Link
            href="/dashboard/organization-dashboard"
            className="inline-flex items-center justify-center px-4 py-2 text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับสู่ Dashboard
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/organization"
          className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-lg inline-block mb-3">
              <Table className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">ตารางข้อมูล</h3>
            <p className="text-sm text-gray-600">ดูรายการองค์กรทั้งหมด</p>
          </div>
        </Link>

        <Link
          href="/dashboard/organization/create"
          className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-lg inline-block mb-3">
              <span className="text-green-600 text-xl">➕</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">เพิ่มองค์กร</h3>
            <p className="text-sm text-gray-600">เพิ่มข้อมูลองค์กรใหม่</p>
          </div>
        </Link>

        <Link
          href="/dashboard/organization-dashboard"
          className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-lg inline-block mb-3">
              <span className="text-green-600 text-xl">📊</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Dashboard</h3>
            <p className="text-sm text-gray-600">วิเคราะห์ข้อมูลและกราฟ</p>
          </div>
        </Link>
      </div>
    </div>
  );
}