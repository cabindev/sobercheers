// app/dashboard/Buddhist2025/list/page.tsx
import BuddhistLentList from '@/app/Buddhist2025/components/BuddhistLentList';

export default function DashboardBuddhistLentListPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">รายชื่อผู้สมัครเข้าพรรษา</h1>
        <p className="text-gray-600 mt-1">จัดการและติดตามข้อมูลผู้สมัครเข้าพรรษา พ.ศ. 2568</p>
      </div>
      
      <BuddhistLentList />
    </div>
  );
}

export const metadata = {
  title: 'รายชื่อผู้สมัครเข้าพรรษา - Dashboard',
  description: 'จัดการและติดตามข้อมูลผู้สมัครเข้าพรรษา พ.ศ. 2568',
};