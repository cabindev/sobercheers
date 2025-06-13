'use server';

import { PrismaClient } from '@prisma/client';
import { GroupCategory, GroupCategoryFilters } from '@/types/group';

const prisma = new PrismaClient();

// ดึงข้อมูลทั้งหมด
export async function getAllGroupCategories(filters?: GroupCategoryFilters): Promise<GroupCategory[]> {
  try {
    const where: any = {};
    
    // Filter by search
    if (filters?.search) {
      where.OR = [
        { 
          name: { 
            contains: filters.search
          } 
        },
        { 
          description: { 
            contains: filters.search
          } 
        }
      ];
    }
    
    // Sorting
    const orderBy: any = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }
    
    const groupCategories = await prisma.groupCategory.findMany({
      where,
      orderBy,
      include: {
        _count: {
          select: {
            buddhist2025: true
          }
        }
      }
    });
    
    return groupCategories;
  } catch (error) {
    console.error('Error fetching group categories:', error);
    throw new Error('Failed to fetch group categories');
  } finally {
    await prisma.$disconnect();
  }
}

// ดึงข้อมูลทั้งหมด (สำหรับ dropdown)
export async function getActiveGroupCategories(): Promise<GroupCategory[]> {
  try {
    const groupCategories = await prisma.groupCategory.findMany({
      orderBy: { name: 'asc' }
    });
    
    return groupCategories;
  } catch (error) {
    console.error('Error fetching group categories:', error);
    throw new Error('Failed to fetch group categories');
  } finally {
    await prisma.$disconnect();
  }
}

// ดึงข้อมูลตาม ID
export async function getGroupCategoryById(id: number): Promise<GroupCategory | null> {
  try {
    const groupCategory = await prisma.groupCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            buddhist2025: true
          }
        }
      }
    });
    
    return groupCategory;
  } catch (error) {
    console.error('Error fetching group category by ID:', error);
    throw new Error('Failed to fetch group category');
  } finally {
    await prisma.$disconnect();
  }
}