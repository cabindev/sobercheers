// app/dashboard/Buddhist2025/create/page.tsx
import BuddhistLentForm from '@/app/Buddhist2025/components/BuddhistLentForm';

export default function DashboardCreateBuddhist2025Page() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">เพิ่มข้อมูลผู้เข้าร่วมเข้าพรรษา</h1>
        <p className="text-gray-600">กรอกข้อมูลผู้เข้าร่วมโครงการเข้าพรรษา พ.ศ. 2568</p>
      </div>
      <BuddhistLentForm isEdit={false} />
    </div>
  );
}

export const metadata = {
  title: 'เพิ่มข้อมูลผู้เข้าร่วมเข้าพรรษา - Dashboard',
  description: 'เพิ่มข้อมูลผู้เข้าร่วมโครงการเข้าพรรษา พ.ศ. 2568',
};