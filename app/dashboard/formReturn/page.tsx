// app/dashboard/formReturn/page.tsx
import { getFormReturnStats, getFormReturns } from '@/app/form_return/actions/get';
import DashboardFormReturn from '@/components/form-return/DashboardFormReturn';
import DashboardError from '@/components/dashboard/DashboardError';
import { DashboardInitialData } from '@/types/dashboard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// เปลี่ยน type ของ searchParams
type PageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    year?: string;
    limit?: string;
  }>;
};

export default async function DashboardFormReturnPage({ searchParams }: PageProps) {
  try {
    // await searchParams ก่อนใช้งาน
    const params = await searchParams;
    
    const currentYear = 2025;
    const previousYear = 2024;
    
    const page = Math.max(1, parseInt(params.page || '1'));
    const search = params.search || '';
    const yearParam = params.year;
    const limit = Math.max(1, Math.min(100, parseInt(params.limit || '20')));
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

    const initialData: DashboardInitialData = {
      forms: formsResult.forms || [],
      totalItems: formsResult.totalItems || 0,
      totalPages: formsResult.totalPages || 0,
      currentPage: formsResult.currentPage || page,
      currentYear,
      previousYear,
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

export const metadata = {
  title: 'Dashboard - ข้อมูลส่งคืนแคมเปญงดเหล้าเข้าพรรษา',
  description: 'แดชบอร์ดสำหรับจัดการข้อมูลส่งคืนแคมเปญงดเหล้าเข้าพรรษา',
};