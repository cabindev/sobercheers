// app/dashboard/form_return/2024/page.tsx
import React from 'react';
import DashboardFormReturn2024 from './components/DashboardFormReturn2024';

export const metadata = {
  title: 'Dashboard Form Return 2024',
  description: 'แดชบอร์ดสำหรับติดตามข้อมูลการคืนฟอร์มงดเหล้าเข้าพรรษา ปี 2024',
};

export default function FormReturn2024DashboardPage() {
  return (
    <div className="w-full">
      <DashboardFormReturn2024 />
    </div>
  );
}