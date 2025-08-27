// app/dashboard/form_return/page.tsx
import React from 'react';
import DashboardFormReturn from './components/charts/allChartFormReturn';

export const metadata = {
  title: 'Form Return Dashboard',
  description: 'แดชบอร์ดสำหรับติดตามและวิเคราะห์ข้อมูลการคืนฟอร์มงดเหล้าเข้าพรรษา',
};

export default function FormReturnDashboardPage() {
  return (
    <div className="w-full">
      <DashboardFormReturn />
    </div>
  );
}