// app/dashboard/formReturn/page.tsx
import { getFormReturnStats, getFormReturns } from '@/app/form_return/actions/get';
import DashboardFormReturn from '@/components/form-return/DashboardFormReturn';
import DashboardError from '@/components/dashboard/DashboardError';
import { DashboardInitialData } from '@/types/dashboard';
import { unstable_cache } from 'next/cache';

// ✅ ปรับ dynamic และ revalidate
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    const params = await searchParams;
    
    const currentYear = 2025;
    const previousYear = 2024;
    
    const page = Math.max(1, parseInt(params.page || '1'));
    const search = params.search || '';
    const yearParam = params.year;
    const limit = Math.max(1, Math.min(100, parseInt(params.limit || '20')));
    const year = yearParam ? parseInt(yearParam) : currentYear;
    
    // ✅ ใช้ cache สำหรับ stats
    const getCachedStats = unstable_cache(
      async () => getFormReturnStats(),
      ['dashboard-stats'],
      {
        tags: ['form-stats'],
        revalidate: 60, // cache 1 นาที
      }
    );

    const [stats, formsData] = await Promise.allSettled([
      getCachedStats(),
      getFormReturns({ page, limit, search, year })
    ]);

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