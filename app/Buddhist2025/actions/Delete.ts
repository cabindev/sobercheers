'use server';

import prisma from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

type DeleteResult = {
  success: boolean;
  message: string;
};

export async function deleteBuddhist2025(id: number): Promise<DeleteResult> {
  try {
    // ตรวจสอบว่า record มีอยู่หรือไม่
    const existing = await prisma.buddhist2025.findUnique({
      where: { id }
    });
    
    if (!existing) {
      return {
        success: false,
        message: 'ไม่พบข้อมูลที่ต้องการลบ'
      };
    }
    
    await prisma.buddhist2025.delete({
      where: { id }
    });
    
    // Revalidate cache
    revalidatePath('/Buddhist2025');
    revalidatePath('/dashboard');
    
    return {
      success: true,
      message: 'ลบข้อมูลเรียบร้อยแล้ว'
    };
  } catch (error) {
    console.error('Error deleting Buddhist2025:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'ไม่สามารถลบข้อมูลได้'
    };
  }
}