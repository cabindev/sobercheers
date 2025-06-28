// app/Buddhist2025/actions/Get.ts
'use server';

import prisma from '@/app/lib/db';
import { Buddhist2025, Buddhist2025Filters } from '@/types/buddhist';

type GetResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// ✅ แก้ไขการค้นหาให้รองรับทุกฐานข้อมูล
export async function getAllBuddhist2025(filters?: Buddhist2025Filters): Promise<GetResult<Buddhist2025[]>> {
  try {
    const where: any = {};
    
    // ✅ Filter by search - เอา mode ออก
    if (filters?.search) {
      const searchTerm = filters.search.trim();
      if (searchTerm) {
        where.OR = [
          { firstName: { contains: searchTerm } },
          { lastName: { contains: searchTerm } },
          { phone: { contains: searchTerm } },
          { district: { contains: searchTerm } },
          { amphoe: { contains: searchTerm } },
          { province: { contains: searchTerm } }
        ];
      }
    }
    
    // Filter by group category
    if (filters?.groupCategoryId) {
      where.groupCategoryId = filters.groupCategoryId;
    }
    
    // Filter by province
    if (filters?.province) {
      where.province = filters.province;
    }
    
    // Filter by alcohol consumption
    if (filters?.alcoholConsumption) {
      where.alcoholConsumption = filters.alcoholConsumption;
    }
    
    // Sorting
    const orderBy: any = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }
    
    // Pagination
    const skip = filters?.page && filters?.limit ? (filters.page - 1) * filters.limit : undefined;
    const take = filters?.limit;
    
    const rawData = await prisma.buddhist2025.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        groupCategory: true
      }
    });
    
    // แปลง null เป็น undefined สำหรับ description
    const buddhist2025List = rawData.map(item => ({
      ...item,
      groupCategory: {
        ...item.groupCategory,
        description: item.groupCategory.description ?? undefined
      }
    })) as Buddhist2025[];
    
    return {
      success: true,
      data: buddhist2025List
    };
  } catch (error) {
    console.error('Error fetching Buddhist2025:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Buddhist2025 data'
    };
  }
}

// ✅ แก้ไข count function
export async function getBuddhist2025Count(filters?: Buddhist2025Filters): Promise<GetResult<number>> {
  try {
    const where: any = {};
    
    if (filters?.search) {
      const searchTerm = filters.search.trim();
      if (searchTerm) {
        where.OR = [
          { firstName: { contains: searchTerm } },
          { lastName: { contains: searchTerm } },
          { phone: { contains: searchTerm } },
          { district: { contains: searchTerm } },
          { amphoe: { contains: searchTerm } },
          { province: { contains: searchTerm } }
        ];
      }
    }
    
    if (filters?.groupCategoryId) {
      where.groupCategoryId = filters.groupCategoryId;
    }
    
    if (filters?.province) {
      where.province = filters.province;
    }
    
    if (filters?.alcoholConsumption) {
      where.alcoholConsumption = filters.alcoholConsumption;
    }
    
    const count = await prisma.buddhist2025.count({ where });
    
    return {
      success: true,
      data: count
    };
  } catch (error) {
    console.error('Error counting Buddhist2025:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to count Buddhist2025'
    };
  }
}

// ดึงข้อมูลตาม ID
export async function getBuddhist2025ById(id: number): Promise<GetResult<Buddhist2025 | null>> {
  try {
    const rawData = await prisma.buddhist2025.findUnique({
      where: { id },
      include: {
        groupCategory: true
      }
    });
    
    if (!rawData) {
      return {
        success: true,
        data: null
      };
    }
    
    // แปลง null เป็น undefined สำหรับ description
    const buddhist2025 = {
      ...rawData,
      groupCategory: {
        ...rawData.groupCategory,
        description: rawData.groupCategory.description ?? undefined,
      },
    } as Buddhist2025;
    
    return {
      success: true,
      data: buddhist2025
    };
  } catch (error) {
    console.error('Error fetching Buddhist2025 by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Buddhist2025'
    };
  }
}

// ดึงข้อมูลพร้อม pagination
export async function getBuddhist2025WithPagination(
  page: number = 1,
  limit: number = 10,
  filters?: Omit<Buddhist2025Filters, 'page' | 'limit'>
): Promise<GetResult<{
  data: Buddhist2025[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}>> {
  try {
    const [dataResult, countResult] = await Promise.all([
      getAllBuddhist2025({ ...filters, page, limit }),
      getBuddhist2025Count(filters)
    ]);

    if (!dataResult.success || !countResult.success) {
      return {
        success: false,
        error: dataResult.error || countResult.error || 'Failed to fetch data'
      };
    }

    const total = countResult.data || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        data: dataResult.data || [],
        total,
        page,
        limit,
        totalPages
      }
    };
  } catch (error) {
    console.error('Error fetching paginated Buddhist2025:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch paginated data'
    };
  }
}