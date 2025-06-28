// app/Buddhist2025/actions/Update.ts
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/app/lib/db';
import { UpdateBuddhist2025Data } from '@/types/buddhist';

interface UpdateResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export async function updateBuddhist2025(
  id: number, 
  data: UpdateBuddhist2025Data
): Promise<UpdateResult> {
  try {
    console.log('Updating Buddhist2025 with ID:', id, 'Data:', data);

    // ตรวจสอบว่ามีข้อมูลอยู่จริง
    const existing = await prisma.buddhist2025.findUnique({
      where: { id }
    });

    if (!existing) {
      return {
        success: false,
        error: 'ไม่พบข้อมูลที่ต้องการแก้ไข'
      };
    }

    // ตรวจสอบข้อมูลที่จำเป็น
    if (data.firstName !== undefined && !data.firstName.trim()) {
      return {
        success: false,
        error: 'กรุณากรอกชื่อ'
      };
    }

    if (data.lastName !== undefined && !data.lastName.trim()) {
      return {
        success: false,
        error: 'กรุณากรอกนามสกุล'
      };
    }

    // ตรวจสอบเบอร์โทรซ้ำ (เฉพาะเมื่อมีการเปลี่ยนแปลงและไม่เป็นค่าว่าง)
    if (data.phone && data.phone.trim() !== '' && data.phone !== existing.phone) {
      const phoneExists = await prisma.buddhist2025.findFirst({
        where: {
          phone: data.phone.trim(),
          id: { not: id } // ไม่รวมตัวเอง
        }
      });

      if (phoneExists) {
        return {
          success: false,
          error: `เบอร์โทรศัพท์ ${data.phone} ถูกใช้แล้วโดย ${phoneExists.firstName} ${phoneExists.lastName}`
        };
      }
    }

    // ตรวจสอบ GroupCategory (ถ้ามีการเปลี่ยนแปลง)
    if (data.groupCategoryId && data.groupCategoryId !== existing.groupCategoryId) {
      const groupCategory = await prisma.groupCategory.findUnique({
        where: { id: data.groupCategoryId }
      });

      if (!groupCategory) {
        return {
          success: false,
          error: 'หมวดหมู่กลุ่มที่เลือกไม่ถูกต้อง'
        };
      }
    }

    // เตรียมข้อมูลสำหรับอัพเดท
    const updateData: any = {
      updatedAt: new Date()
    };

    // เพิ่มฟิลด์ที่มีการส่งมา
    Object.keys(data).forEach(key => {
      const value = (data as any)[key];
      if (value !== undefined) {
        if (typeof value === 'string') {
          updateData[key] = value.trim() === '' ? null : value.trim();
        } else {
          updateData[key] = value;
        }
      }
    });

    // อัพเดทข้อมูล
    const updatedBuddhist = await prisma.buddhist2025.update({
      where: { id },
      data: updateData,
      include: {
        groupCategory: true
      }
    });

    console.log('Updated Buddhist2025 successfully:', updatedBuddhist.id);

    // Revalidate cache
    revalidatePath('/Buddhist2025');
    revalidatePath(`/Buddhist2025/edit/${id}`);

    return {
      success: true,
      data: updatedBuddhist,
      message: 'อัพเดทข้อมูลเรียบร้อยแล้ว'
    };

  } catch (error) {
    console.error('Error updating Buddhist2025:', error);
    
    // จัดการ Prisma errors เฉพาะ
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return {
          success: false,
          error: 'เบอร์โทรศัพท์นี้ถูกใช้แล้ว กรุณาใช้เบอร์อื่น'
        };
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล'
    };
  }
}