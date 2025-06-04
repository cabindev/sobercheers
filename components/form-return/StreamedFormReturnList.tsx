// components/form-return/StreamedFormReturnList.tsx
'use client';

import { use } from 'react';
import { FormReturnData } from "@/types/form-return";
import FormReturnList from './FormReturnList';

interface StreamedFormReturnListProps {
  promise: Promise<{
    forms: FormReturnData[];
    totalItems: number;
    page: number;
    limit: number;
  }>;
}

export default function StreamedFormReturnList({ promise }: StreamedFormReturnListProps) {
  // ใช้ React 18 use() hook เพื่อ unwrap Promise
  const { forms, totalItems, page, limit } = use(promise);

  return (
    <FormReturnList 
      forms={forms} 
      totalItems={totalItems}
      currentPage={page}
      limit={limit}
    />
  );
}