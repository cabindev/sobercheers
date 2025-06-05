// lib/actions/form-return/get.ts
'use server';

import { PrismaClient } from '@prisma/client';
import { unstable_cache } from 'next/cache';
import { FormReturnData } from '@/types/form-return';

// เพิ่ม connection handling
const prisma = new PrismaClient({
  log: ['query', 'error'],
  errorFormat: 'pretty',
});

// เพิ่ม connection test
async function testConnection() {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export async function getFormReturnById(id: number): Promise<{
  success: boolean;
  data?: FormReturnData;
  error?: string;
}> {
  try {
    // ตรวจสอบการเชื่อมต่อก่อน
    const isConnected = await testConnection();
    if (!isConnected) {
      return { success: false, error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' };
    }

    const form = await prisma.form_return.findUnique({
      where: { id }
    });

    if (!form) {
      return { success: false, error: 'ไม่พบข้อมูล' };
    }

    return { success: true, data: form };
  } catch (error) {
    console.error('Error fetching form return:', error);
    return { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' };
  }
}

// แก้ไข getFormReturns ให้ handle error ดีขึ้น
export async function getFormReturns(searchParams: {
  search?: string;
  page?: number;
  limit?: number;
  year?: number;
}) {
  const { search = '', page = 1, limit = 10, year } = searchParams;
  const skip = (page - 1) * limit;

  try {
    // ตรวจสอบการเชื่อมต่อก่อน
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Database connection failed');
      return { 
        forms: [], 
        totalItems: 0, 
        page, 
        limit,
        error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' 
      };
    }

    const whereCondition: any = {};

    if (search) {
      whereCondition.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { organizationName: { contains: search } },
        { phoneNumber: { contains: search } },
      ];
    }

    if (year) {
      const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${year + 1}-01-01T00:00:00.000Z`);
      
      whereCondition.createdAt = {
        gte: startOfYear,
        lt: endOfYear
      };
    }

    const [forms, totalItems] = await Promise.race([
      prisma.$transaction([
        prisma.form_return.findMany({
          where: whereCondition,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.form_return.count({
          where: whereCondition,
        }),
      ]),
      // เพิ่ม timeout 10 วินาที
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 10000)
      )
    ]) as [any[], number];

    return { forms, totalItems, page, limit };
  } catch (error) {
    console.error('Error fetching forms:', error);
    
    // Return safe fallback data
    return { 
      forms: [], 
      totalItems: 0, 
      page, 
      limit,
      error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล'
    };
  }
}

// แก้ไข getFormReturnStats
export async function getFormReturnStats(): Promise<{
  totalForms: number;
  totalSigners: number;
  currentYearCount: number;
  previousYearCount: number;
  error?: string;
}> {
  try {
    // ตรวจสอบการเชื่อมต่อก่อน
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Database connection failed for stats');
      return {
        totalForms: 0,
        totalSigners: 0,
        currentYearCount: 0,
        previousYearCount: 0,
        error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้'
      };
    }

    const currentYear = 2025;
    const previousYear = 2024;
    
    const currentYearStart = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const currentYearEnd = new Date(`${currentYear + 1}-01-01T00:00:00.000Z`);
    const previousYearStart = new Date(`${previousYear}-01-01T00:00:00.000Z`);
    const previousYearEnd = new Date(`${previousYear + 1}-01-01T00:00:00.000Z`);

    const [
      totalForms, 
      totalSignersResult, 
      currentYearCount,
      previousYearCount
    ] = await Promise.race([
      prisma.$transaction([
        prisma.form_return.count(),
        prisma.form_return.aggregate({
          _sum: {
            numberOfSigners: true
          }
        }),
        prisma.form_return.count({
          where: {
            createdAt: {
              gte: currentYearStart,
              lt: currentYearEnd
            }
          }
        }),
        prisma.form_return.count({
          where: {
            createdAt: {
              gte: previousYearStart,
              lt: previousYearEnd
            }
          }
        })
      ]),
      // เพิ่ม timeout 10 วินาที
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 10000)
      )
    ]) as [number, any, number, number];

    return {
      totalForms: totalForms || 0,
      totalSigners: totalSignersResult._sum.numberOfSigners || 0,
      currentYearCount: currentYearCount || 0,
      previousYearCount: previousYearCount || 0
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    
    return {
      totalForms: 0,
      totalSigners: 0,
      currentYearCount: 0,
      previousYearCount: 0,
      error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล'
    };
  }
}

export async function checkPhoneNumberExists(phoneNumber: string, excludeId?: number): Promise<boolean> {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      return false;
    }

    const form = await prisma.form_return.findFirst({
      where: {
        phoneNumber,
        ...(excludeId && { NOT: { id: excludeId } })
      }
    });
    return !!form;
  } catch (error) {
    console.error('Error checking phone number:', error);
    return false;
  }
}

// เพิ่มฟังก์ชันสำหรับ cleanup connection
export async function closeConnection() {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}

// ลบ unstable_cache ออกเพื่อหลีกเลี่ยงปัญหาบน production
// export const getFormReturns = unstable_cache(...) // ลบออก

export async function getFormReturnsRealtime(searchParams: {
  search?: string;
  page?: number;
  limit?: number;
  year?: number;
}) {
  // ใช้ getFormReturns แทน
  return getFormReturns(searchParams);
}