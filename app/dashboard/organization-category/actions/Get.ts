// app/dashboard/organization-category/actions/Get.ts
'use server';

import prisma from '@/app/lib/db';
import { OrganizationCategory, OrganizationCategoryFilters } from '@/types/organization';

// ดึงข้อมูลทั้งหมด
export async function getAllOrganizationCategories(filters?: OrganizationCategoryFilters): Promise<OrganizationCategory[]> {
  try {
    const where: any = {};
    
    // Filter by search
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { shortName: { contains: filters.search } },
        { description: { contains: filters.search } },
        { categoryType: { contains: filters.search } }
      ];
    }
    
    // Filter by category type
    if (filters?.categoryType) {
      where.categoryType = filters.categoryType;
    }
    
    // Filter by active status
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    
    // Sorting
    const orderBy: any = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'desc';
    } else {
      orderBy.sortOrder = 'asc';
    }
    
    const organizationCategories = await prisma.organizationCategory.findMany({
      where,
      orderBy,
      include: {
        _count: {
          select: {
            organizations: true
          }
        }
      }
    });
    
    return organizationCategories;
  } catch (error) {
    console.error('Error fetching organization categories:', error);
    throw new Error('Failed to fetch organization categories');
  }
}

// ดึงข้อมูลที่ active (สำหรับ dropdown)
export async function getActiveOrganizationCategories(): Promise<OrganizationCategory[]> {
  try {
    const organizationCategories = await prisma.organizationCategory.findMany({
      where: { isActive: true },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });
    
    return organizationCategories;
  } catch (error) {
    console.error('Error fetching active organization categories:', error);
    throw new Error('Failed to fetch organization categories');
  }
}

// ดึงข้อมูลตาม ID
export async function getOrganizationCategoryById(id: number): Promise<OrganizationCategory | null> {
  try {
    const organizationCategory = await prisma.organizationCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            organizations: true
          }
        }
      }
    });
    
    return organizationCategory;
  } catch (error) {
    console.error('Error fetching organization category by ID:', error);
    throw new Error('Failed to fetch organization category');
  }
}