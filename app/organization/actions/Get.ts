// app/organization/actions/Get.ts
// ระบบดึงข้อมูลองค์กร - แก้ไขแบบง่ายหลังจากปรับ schema
'use server';

import { PrismaClient } from '@prisma/client';
import { Organization } from '@/types/organization';

const prisma = new PrismaClient();

export interface OrganizationFilters {
  search?: string;
  organizationCategoryId?: number;
  province?: string;
  sortBy?: 'firstName' | 'createdAt' | 'numberOfSigners';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ดึงข้อมูลทั้งหมด - ปรับปรุงให้รองรับ optional organizationCategory
export async function getAllOrganizations(filters?: OrganizationFilters): Promise<{
  data: Organization[];
  total: number;
  page: number;
  totalPages: number;
}> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    // Filter by search
    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { phoneNumber: { contains: filters.search } },
        { addressLine1: { contains: filters.search } },
        { district: { contains: filters.search } },
        { amphoe: { contains: filters.search } },
        { province: { contains: filters.search } }
      ];
    }
    
    // Filter by organization category
    if (filters?.organizationCategoryId) {
      where.organizationCategoryId = filters.organizationCategoryId;
    }
    
    // Filter by province
    if (filters?.province) {
      where.province = filters.province;
    }
    
    // Sorting
    const orderBy: any = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }
    
    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          // 🔥 ตอนนี้ organizationCategory เป็น optional แล้ว จะไม่มี error
          organizationCategory: true
        }
      }),
      prisma.organization.count({ where })
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: organizations,
      total,
      page,
      totalPages
    };
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return {
      data: [],
      total: 0,
      page: filters?.page || 1,
      totalPages: 0
    };
  } finally {
    await prisma.$disconnect();
  }
}

// ดึงข้อมูลตาม ID
export async function getOrganizationById(id: number): Promise<Organization | null> {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        organizationCategory: true
      }
    });
    
    return organization;
  } catch (error) {
    console.error('Error fetching organization by ID:', error);
    throw new Error('Failed to fetch organization');
  } finally {
    await prisma.$disconnect();
  }
}

// ดึงสถิติ
export async function getOrganizationStats() {
  try {
    const [
      totalOrganizations,
      organizationsByCategory,
      organizationsByProvince,
      recentOrganizations
    ] = await Promise.all([
      prisma.organization.count(),
      
      // Group by organization category - ตอนนี้รองรับ null values แล้ว
      prisma.organization.groupBy({
        by: ['organizationCategoryId'],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      }),
      
      // Group by province
      prisma.organization.groupBy({
        by: ['province'],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 10
      }),
      
      // Recent organizations (last 7 days)
      prisma.organization.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    return {
      totalOrganizations,
      organizationsByCategory,
      organizationsByProvince,
      recentOrganizations
    };
  } catch (error) {
    console.error('Error fetching organization stats:', error);
    throw new Error('Failed to fetch organization stats');
  } finally {
    await prisma.$disconnect();
  }
}

// ดึงรายการจังหวัดที่มีข้อมูล
export async function getProvincesWithData(): Promise<string[]> {
  try {
    const provinces = await prisma.organization.findMany({
      select: {
        province: true
      },
      distinct: ['province'],
      where: {
        province: {
          not: ''
        }
      },
      orderBy: {
        province: 'asc'
      }
    });
    
    return provinces.map(item => item.province).filter(Boolean);
  } catch (error) {
    console.error('Error fetching provinces:', error);
    throw new Error('Failed to fetch provinces');
  } finally {
    await prisma.$disconnect();
  }
}

// ดึงสถิติตามองค์กร
export async function getOrganizationCategoryStats() {
  try {
    const result = await prisma.organizationCategory.findMany({
      select: {
        id: true,
        name: true,
        categoryType: true,
        _count: {
          select: {
            organizations: true
          }
        }
      },
      orderBy: {
        organizations: {
          _count: 'desc'
        }
      }
    });

    return result.map(category => ({
      organizationCategory: {
        id: category.id,
        name: category.name,
        categoryType: category.categoryType
      },
      count: category._count.organizations
    }));
  } catch (error) {
    console.error('Error fetching organization category stats:', error);
    throw new Error('Failed to fetch organization category stats');
  } finally {
    await prisma.$disconnect();
  }
}