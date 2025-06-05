// components/form-return/StreamedFormReturnList.tsx
'use client';

import { use } from 'react';
import { FormReturnData } from "@/types/form-return";
import FormReturnList from './FormReturnList';

interface StreamedFormReturnListProps {
  promise: Promise<{
    forms: FormReturnData[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    error?: string;
  }>;
}

export default function StreamedFormReturnList({ promise }: StreamedFormReturnListProps) {
  try {
    // ใช้ React 18 use() hook เพื่อ unwrap Promise
    const data = use(promise);
    
    // ตรวจสอบ error
    if (data.error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          เกิดข้อผิดพลาด: {data.error}
        </div>
      );
    }

    // คำนวณ limit จาก totalItems และ totalPages
    const limit = data.totalPages > 0 ? Math.ceil(data.totalItems / data.totalPages) : 10;

    return (
      <FormReturnList 
        forms={data.forms} 
        totalItems={data.totalItems}
        currentPage={data.currentPage}
        limit={limit}
      />
    );
  } catch (error) {
    // Error boundary สำหรับ Promise rejection
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        เกิดข้อผิดพลาดในการโหลดข้อมูล
      </div>
    );
  }
}