// app/Buddhist2025/create/page.tsx
import BuddhistLentForm from '../components/BuddhistLentForm';

export default function CreateBuddhist2025Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <BuddhistLentForm isEdit={false} />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'ลงทะเบียนเข้าพรรษา 2025',
  description: 'ลงทะเบียนเข้าร่วมโครงการเข้าพรรษา 2025',
};