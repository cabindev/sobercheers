// lib/actions/form-return/get.ts
'use server';

import { PrismaClient } from '@prisma/client';
import { unstable_cache } from 'next/cache';
import { FormReturnData } from '@/types/form-return';

const prisma = new PrismaClient();

export async function getFormReturnById(id: number): Promise<{
  success: boolean;
  data?: FormReturnData;
  error?: string;
}> {
  try {
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

// ใช้ cache สำหรับ list
export const getFormReturns = unstable_cache(
  async (searchParams: {
    search?: string;
    page?: number;
    limit?: number;
    year?: number;
  }) => {
    const { search = '', page = 1, limit = 10, year } = searchParams;
    const skip = (page - 1) * limit;

    try {
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

      const [forms, totalItems] = await prisma.$transaction([
        prisma.form_return.findMany({
          where: whereCondition,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.form_return.count({
          where: whereCondition,
        }),
      ]);

      return { forms, totalItems, page, limit };
    } catch (error) {
      console.error('Error fetching forms:', error);
      throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
  },
  ['form-returns'],
  {
    revalidate: 60,
    tags: ['form-returns']
  }
);

// สำหรับ real-time data (ไม่ cache)
export async function getFormReturnsRealtime(searchParams: {
  search?: string;
  page?: number;
  limit?: number;
  year?: number;
}) {
  const { search = '', page = 1, limit = 10, year } = searchParams;
  const skip = (page - 1) * limit;

  try {
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

    const [forms, totalItems] = await prisma.$transaction([
      prisma.form_return.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.form_return.count({
        where: whereCondition,
      }),
    ]);

    return { forms, totalItems, page, limit };
  } catch (error) {
    console.error('Error fetching forms:', error);
    throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล');
  }
}

export async function checkPhoneNumberExists(phoneNumber: string, excludeId?: number): Promise<boolean> {
  try {
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

// ฟังก์ชัน statistics แบบเรียบง่าย
export async function getFormReturnStats(): Promise<{
  totalForms: number;
  totalSigners: number;
  currentYearCount: number;
  previousYearCount: number;
}> {
  try {
    // ใช้ปี คศ โดยตรง
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
    ] = await prisma.$transaction([
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
    ]);

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
      previousYearCount: 0
    };
  }
}