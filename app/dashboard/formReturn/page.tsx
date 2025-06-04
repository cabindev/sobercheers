import { getFormReturnStats, getFormReturns } from '@/lib/actions/form-return/get';
import DashboardFormReturn from '@/components/form-return/DashboardFormReturn';

// เพิ่มบรรทัดนี้
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
    year?: string;
    limit?: string;
  };
}

export default async function DashboardFormReturnPage({ searchParams }: PageProps) {
  try {
    const currentYear = 2025;
    const previousYear = 2024;
    
    // Get URL parameters with safe parsing
    const page = Math.max(1, parseInt(searchParams.page || '1'));
    const search = searchParams.search || '';
    const yearParam = searchParams.year;
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.limit || '20'))); // จำกัด limit ระหว่าง 1-100
    const year = yearParam ? parseInt(yearParam) : currentYear;
    
    // Fetch data
    const [stats, formsData] = await Promise.all([
      getFormReturnStats(),
      getFormReturns({ page, limit, search, year })
    ]);

    const initialData = {
      forms: formsData.forms || [],
      totalItems: formsData.totalItems || 0,
      currentYear,
      previousYear,
      currentYearCount: stats.currentYearCount || 0,
      previousYearCount: stats.previousYearCount || 0,
    };

    return <DashboardFormReturn initialData={initialData} />;
  } catch (error) {
    console.error('Error loading dashboard:', error);
    return <DashboardError />;
  }
}

function DashboardError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-4">เกิดข้อผิดพลาด</h2>
        <p className="text-slate-600 mb-8">
          ไม่สามารถโหลดข้อมูลแดชบอร์ดได้ กรุณาลองใหม่อีกครั้ง
        </p>
        
        <a 
          href="/dashboard/formReturn"
          className="inline-block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          รีเฟรชหน้า
        </a>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'แดชบอร์ด - คืนข้อมูลงดเหล้าเข้าพรรษา',
  description: 'แดชบอร์ดแสดงข้อมูลการส่งคืนแคมเปญงดเหล้าเข้าพรรษา',
};