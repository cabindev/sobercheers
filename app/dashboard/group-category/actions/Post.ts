'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { CreateGroupCategoryData, GroupCategory } from '@/types/group';

const prisma = new PrismaClient();

export async function createGroupCategory(data: CreateGroupCategoryData): Promise<GroupCategory> {
  try {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('ชื่อหมวดหมู่เป็นข้อมูลที่จำเป็น');
    }
    
    // ตรวจสอบความยาวชื่อ
    if (data.name.trim().length > 100) {
      throw new Error('ชื่อหมวดหมู่ต้องไม่เกิน 100 ตัวอักษร');
    }
    
    // ตรวจสอบชื่อซ้ำ
    const existingCategory = await prisma.groupCategory.findFirst({
      where: { 
        name: data.name.trim()
      }
    });
    
    if (existingCategory) {
      throw new Error('ชื่อหมวดหมู่นี้มีอยู่แล้ว');
    }
    
    // ตรวจสอบคำอธิบาย
    if (data.description && data.description.trim().length > 500) {
      throw new Error('คำอธิบายต้องไม่เกิน 500 ตัวอักษร');
    }
    
    const groupCategory = await prisma.groupCategory.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null
      },
      include: {
        _count: {
          select: {
            buddhist2025: true
          }
        }
      }
    });
    
    // Revalidate cache
    revalidatePath('/group-category');
    revalidatePath('/Buddhist2025');
    
    return groupCategory;
  } catch (error) {
    console.error('Error creating group category:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('ไม่สามารถสร้างหมวดหมู่ได้');
  } finally {
    await prisma.$disconnect();
  }
}