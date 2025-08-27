// app/dashboard/form_return/2025/page.tsx
import React from 'react';
import DashboardFormReturn2025 from './components/DashboardFormReturn2025';

export const metadata = {
  title: 'Dashboard Form Return 2025',
  description: 'แดชบอร์ดสำหรับติดตามข้อมูลการคืนฟอร์มงดเหล้าเข้าพรรษา ปี 2025',
};

export default function FormReturn2025DashboardPage() {
  return (
    <div className="w-full">
      <DashboardFormReturn2025 />
    </div>
  );
}