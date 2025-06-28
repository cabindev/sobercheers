// app/dashboard/Buddhist2025/page.tsx
import React from 'react';
import DashboardBuddhist from './components/charts/allChartBuddhist';

export const metadata = {
  title: 'Buddhist Lent 2025 Dashboard',
  description: 'แดชบอร์ดสำหรับติดตามและวิเคราะห์ข้อมูลผู้เข้าร่วมกิจกรรมเข้าพรรษา พ.ศ. 2568',
};

export default function Buddhist2025DashboardPage() {
  return (
    <div className="w-full">
      <DashboardBuddhist />
    </div>
  );
}