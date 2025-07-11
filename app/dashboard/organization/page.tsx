// app/dashboard/organization/page.tsx
import React from 'react';
import AllChartsOrganization from './components/charts/AllChartsOrganization';

export const metadata = {
  title: 'Organization Dashboard 2025',
  description: 'แดชบอร์ดสำหรับติดตามและวิเคราะห์ข้อมูลองค์กรที่เข้าร่วมระบบ พ.ศ. 2568',
};

export default function OrganizationDashboardPage() {
  return (
    <div className="w-full">
      <AllChartsOrganization />
    </div>
  );
}