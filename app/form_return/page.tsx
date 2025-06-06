// app/form_return/page.tsx
import { Suspense } from 'react';
import { getFormReturns } from './actions/get';
import SearchForm from '@/components/form-return/SearchForm';
import StreamedFormReturnList from '@/components/form-return/StreamedFormReturnList';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    limit?: string;
    success?: string;
    year?: string;
  }>;
}

async function getFormReturnData(searchParams: {
  search?: string;
  page?: string;
  limit?: string;
  success?: string;
  year?: string;
}) {
  const search = searchParams.search || '';
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '10');
  const year = searchParams.year ? parseInt(searchParams.year) : undefined;

  return await getFormReturns({ search, page, limit, year });
}

export default async function FormReturnPage({ searchParams }: PageProps) {
  // await searchParams ก่อนใช้งาน
  const params = await searchParams;
  const formReturnPromise = getFormReturnData(params);

  // Success message handling
  const showSuccess = params.success === 'true';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              ข้อมูลส่งคืนแคมเปญงดเหล้าเข้าพรรษา ปี 2568
            </h1>
            <p className="text-slate-600">
              รายการข้อมูลที่ได้รับการส่งคืนจากองค์กรต่างๆ
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-800 font-medium">
                  ส่งข้อมูลสำเร็จ! ขอบคุณสำหรับการส่งคืนข้อมูล
                </p>
              </div>
            </div>
          )}

          <SearchForm />

          <Suspense fallback={<FormReturnListSkeleton />}>
            <StreamedFormReturnList promise={formReturnPromise} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton
function FormReturnListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-100 rounded-lg p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'ข้อมูลส่งคืนแคมเปญงดเหล้าเข้าพรรษา',
  description: 'รายการข้อมูลที่ได้รับการส่งคืนจากองค์กรต่างๆ สำหรับแคมเปญงดเหล้าเข้าพรรษา ปี 2568',
};