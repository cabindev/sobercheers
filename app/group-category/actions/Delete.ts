'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function deleteGroupCategory(id: number): Promise<{ success: boolean; message: string }> {
  try {
    // ตรวจสอบว่า category มีอยู่หรือไม่
    const existingCategory = await prisma.groupCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            buddhist2025: true
          }
        }
      }
    });
    
    if (!existingCategory) {
      throw new Error('ไม่พบหมวดหมู่ที่ต้องการลบ');
    }
    
    // ตรวจสอบว่ามีข้อมูล Buddhist2025 ที่เชื่อมโยงอยู่หรือไม่
    if (existingCategory._count.buddhist2025 > 0) {
      throw new Error(`ไม่สามารถลบหมวดหมู่นี้ได้ เนื่องจากมีผู้สมัครอยู่ ${existingCategory._count.buddhist2025} คน`);
    }
    
    await prisma.groupCategory.delete({
      where: { id }
    });
    
    // Revalidate cache
    revalidatePath('/group-category');
    revalidatePath('/Buddhist2025');
    
    return {
      success: true,
      message: 'ลบหมวดหมู่เรียบร้อยแล้ว'
    };
  } catch (error) {
    console.error('Error deleting group category:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete group category';
    
    return {
      success: false,
      message: errorMessage
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Soft delete (เปลี่ยนสถานะเป็น inactive แทนการลบ)
export async function softDeleteGroupCategory(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const existingCategory = await prisma.groupCategory.findUnique({
      where: { id }
    });
    
    if (!existingCategory) {
      throw new Error('ไม่พบหมวดหมู่ที่ต้องการ');
    }
    
    await prisma.groupCategory.update({
      where: { id },
      data: { isActive: false }
    });
    
    revalidatePath('/group-category');
    revalidatePath('/Buddhist2025');
    
    return {
      success: true,
      message: 'ปิดใช้งานหมวดหมู่เรียบร้อยแล้ว'
    };
  } catch (error) {
    console.error('Error soft deleting group category:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to deactivate group category';
    
    return {
      success: false,
      message: errorMessage
    };
  } finally {
    await prisma.$disconnect();
  }
}