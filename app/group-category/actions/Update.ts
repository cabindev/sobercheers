'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { UpdateGroupCategoryData, GroupCategory } from '@/types/group';

const prisma = new PrismaClient();

export async function updateGroupCategory(id: number, data: UpdateGroupCategoryData): Promise<GroupCategory> {
  try {
    // ตรวจสอบว่า category มีอยู่หรือไม่
    const existingCategory = await prisma.groupCategory.findUnique({
      where: { id }
    });
    
    if (!existingCategory) {
      throw new Error('ไม่พบหมวดหมู่ที่ต้องการแก้ไข');
    }
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        throw new Error('ชื่อหมวดหมู่เป็นข้อมูลที่จำเป็น');
      }
      
      if (data.name.trim().length > 100) {
        throw new Error('ชื่อหมวดหมู่ต้องไม่เกิน 100 ตัวอักษร');
      }
    }
    
    // ตรวจสอบคำอธิบาย
    if (data.description !== undefined && data.description && data.description.trim().length > 500) {
      throw new Error('คำอธิบายต้องไม่เกิน 500 ตัวอักษร');
    }
    
    // ตรวจสอบชื่อซ้ำ (ถ้ามีการเปลี่ยนชื่อ)
    if (data.name && data.name.trim().toLowerCase() !== existingCategory.name.toLowerCase()) {
      const duplicateCategory = await prisma.groupCategory.findFirst({
        where: { 
          name: data.name.trim(),
          id: { not: id }
        }
      });
      
      if (duplicateCategory) {
        throw new Error('ชื่อหมวดหมู่นี้มีอยู่แล้ว');
      }
    }
    
    // เตรียมข้อมูลสำหรับอัปเดต
    const updateData: {
      name?: string;
      description?: string | null;
    } = {};
    
    if (data.name !== undefined) {
      updateData.name = data.name.trim();
    }
    
    if (data.description !== undefined) {
      updateData.description = data.description?.trim() || null;
    }
    
    const updatedCategory = await prisma.groupCategory.update({
      where: { id },
      data: updateData,
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
    
    return updatedCategory;
  } catch (error) {
    console.error('Error updating group category:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('ไม่สามารถแก้ไขหมวดหมู่ได้');
  } finally {
    await prisma.$disconnect();
  }
}