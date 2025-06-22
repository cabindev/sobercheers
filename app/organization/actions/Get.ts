// app/organization/actions/Get.ts
'use server';

import prisma from '@/app/lib/db';
import { Organization } from '@/types/organization';

export interface OrganizationFilters {
  search?: string;
  organizationCategoryId?: number;
  province?: string;
  sortBy?: 'firstName' | 'createdAt' | 'numberOfSigners';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ดึงข้อมูลทั้งหมด
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
    throw new Error('Failed to fetch organizations');
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
      
      // Group by organization category
      prisma.$queryRaw`
        SELECT 
          "organizationCategoryId",
          COUNT(*) as count
        FROM "Organization" 
        GROUP BY "organizationCategoryId"
        ORDER BY count DESC
      `,
      
      // Group by province  
      prisma.$queryRaw`
        SELECT 
          "province",
          COUNT(*) as count
        FROM "Organization" 
        GROUP BY "province"
        ORDER BY count DESC
        LIMIT 10
      `,
      
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
  }
}

// ดึงรายการจังหวัดที่มีข้อมูล
export async function getProvincesWithData(): Promise<string[]> {
  try {
    const result = await prisma.$queryRaw<Array<{ province: string }>>`
      SELECT DISTINCT "province" 
      FROM "Organization" 
      WHERE "province" IS NOT NULL 
      AND "province" != ''
      ORDER BY "province" ASC
    `;
    
    return result.map(item => item.province);
  } catch (error) {
    console.error('Error fetching provinces:', error);
    throw new Error('Failed to fetch provinces');
  }
}