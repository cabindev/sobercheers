// app/dashboard/formReturn/page.tsx
import { getFormReturnStats, getFormReturns } from '@/app/form_return/actions/get';
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
    
    const page = Math.max(1, parseInt(searchParams.page || '1'));
    const search = searchParams.search || '';
    const yearParam = searchParams.year;
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.limit || '20')));
    const year = yearParam ? parseInt(yearParam) : currentYear;
    
    // เพิ่ม logging
    console.log('Dashboard params:', { page, search, year, limit });
    
    // เพิ่ม timeout และ error handling
    const [stats, formsData] = await Promise.allSettled([
      getFormReturnStats(),
      getFormReturns({ page, limit, search, year })
    ]);

    // Log results
    console.log('Stats result:', stats);
    console.log('Forms result:', formsData);

    const statsResult = stats.status === 'fulfilled' ? stats.value : {
      totalForms: 0,
      totalSigners: 0,
      currentYearCount: 0,
      previousYearCount: 0,
      monthlyGrowth: 0,
      error: stats.status === 'rejected' ? stats.reason : undefined
    };
    
    const formsResult = formsData.status === 'fulfilled' ? formsData.value : {
      forms: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: page,
      error: formsData.status === 'rejected' ? formsData.reason : undefined
    };

    // Log final data
    console.log('Stats data:', statsResult);
    console.log('Forms count:', formsResult.forms.length);
    console.log('Total items:', formsResult.totalItems);

    // ตรวจสอบ error
    if (statsResult.error || formsResult.error) {
      console.error('Dashboard errors:', {
        stats: statsResult.error,
        forms: formsResult.error
      });
    }

    const initialData = {
      forms: formsResult.forms || [],
      totalItems: formsResult.totalItems || 0,
      totalPages: formsResult.totalPages || 0,
      currentPage: formsResult.currentPage || page,
      currentYear,
      previousYear,
      // ใช้ข้อมูลจาก stats ที่ถูกต้อง
      totalForms: statsResult.totalForms || 0,
      totalSigners: statsResult.totalSigners || 0,
      currentYearCount: statsResult.currentYearCount || 0,
      previousYearCount: statsResult.previousYearCount || 0,
      monthlyGrowth: statsResult.monthlyGrowth || 0,
    };

    return <DashboardFormReturn initialData={initialData} />;
  } catch (error) {
    console.error('Error loading dashboard:', error);
    return <DashboardError error={error} />;
  }
}

function DashboardError({ error }: { error?: any }) {
  // Log error details
  if (error) {
    console.error('Dashboard error details:', {
      message: error.message,
      stack: error.stack
    });
  }

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
          ระบบกำลังอยู่ในระหว่างการบำรุงรักษา<br/>
          กรุณาลองใหม่อีกครั้งในภายหลัง
        </p>
        
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
            <p className="text-sm text-red-800 font-mono">
              {error.message || 'Unknown error'}
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          <a 
            href="/dashboard/formReturn"
            className="inline-block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            ลองใหม่อีกครั้ง
          </a>
          <a 
            href="/"
            className="inline-block w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
          >
            กลับหน้าแรก
          </a>
        </div>
      </div>
    </div>
  );
}