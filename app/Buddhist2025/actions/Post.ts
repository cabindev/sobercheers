// app/Buddhist2025/actions/Post.ts
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/app/lib/db';
import { CreateBuddhist2025Data } from '@/types/buddhist';

interface CreateResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export async function createBuddhist2025(data: CreateBuddhist2025Data): Promise<CreateResult> {
  try {
    console.log('Creating Buddhist2025 with data:', data);

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!data.firstName || !data.firstName.trim()) {
      return {
        success: false,
        error: 'กรุณากรอกชื่อ'
      };
    }

    if (!data.lastName || !data.lastName.trim()) {
      return {
        success: false,
        error: 'กรุณากรอกนามสกุล'
      };
    }

    if (!data.groupCategoryId) {
      return {
        success: false,
        error: 'กรุณาเลือกหมวดหมู่กลุ่ม'
      };
    }

    // ตรวจสอบเบอร์โทรซ้ำ (เฉพาะเมื่อกรอกเบอร์โทร)
    if (data.phone && data.phone.trim() !== '') {
      const phoneExists = await prisma.buddhist2025.findFirst({
        where: { phone: data.phone.trim() }
      });

      if (phoneExists) {
        return {
          success: false,
          error: `เบอร์โทรศัพท์ ${data.phone} ถูกใช้แล้วโดย ${phoneExists.firstName} ${phoneExists.lastName}`
        };
      }
    }

    // ตรวจสอบว่า GroupCategory มีอยู่จริง
    const groupCategory = await prisma.groupCategory.findUnique({
      where: { id: data.groupCategoryId }
    });

    if (!groupCategory) {
      return {
        success: false,
        error: 'หมวดหมู่กลุ่มที่เลือกไม่ถูกต้อง'
      };
    }

    // เตรียมข้อมูลสำหรับบันทึก
    const createData = {
      gender: data.gender?.trim() || null,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      age: data.age,
      addressLine1: data.addressLine1.trim(),
      district: data.district.trim(),
      amphoe: data.amphoe.trim(),
      province: data.province.trim(),
      zipcode: data.zipcode.trim(),
      type: data.type?.trim() || null,
      phone: data.phone?.trim() || null,
      alcoholConsumption: data.alcoholConsumption,
      drinkingFrequency: data.drinkingFrequency || null,
      intentPeriod: data.intentPeriod || null,
      monthlyExpense: data.monthlyExpense || null,
      motivations: data.motivations,
      healthImpact: data.healthImpact,
      groupCategoryId: data.groupCategoryId,
    };

    // สร้างข้อมูลใหม่
    const newBuddhist = await prisma.buddhist2025.create({
      data: createData,
      include: {
        groupCategory: true
      }
    });

    console.log('Created Buddhist2025 successfully:', newBuddhist.id);

    // Revalidate cache
    revalidatePath('/Buddhist2025');

    return {
      success: true,
      data: newBuddhist,
      message: 'สมัครเข้าพรรษาเรียบร้อยแล้ว'
    };

  } catch (error) {
    console.error('Error creating Buddhist2025:', error);
    
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
      error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างข้อมูล'
    };
  }
}