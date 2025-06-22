// app/organization/actions/Update.ts
'use server';

import prisma from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

export interface UpdateOrganizationData {
  firstName?: string;
  lastName?: string;
  organizationCategoryId?: number;
  addressLine1?: string;
  district?: string;
  amphoe?: string;
  province?: string;
  zipcode?: string;
  type?: string;
  phoneNumber?: string;
  numberOfSigners?: number;
  image1?: string;
  image2?: string;
  image3?: string | null;
  image4?: string | null;
  image5?: string | null;
}

export async function updateOrganization(id: number, data: UpdateOrganizationData): Promise<{ success: boolean; message: string }> {
  try {
    // Check if organization exists
    const existingOrganization = await prisma.organization.findUnique({
      where: { id }
    });
    
    if (!existingOrganization) {
      throw new Error('ไม่พบข้อมูลที่ต้องการแก้ไข');
    }
    
    // Validation for updated fields
    if (data.firstName !== undefined && !data.firstName?.trim()) {
      throw new Error('ชื่อเป็นข้อมูลที่จำเป็น');
    }
    
    if (data.lastName !== undefined && !data.lastName?.trim()) {
      throw new Error('นามสกุลเป็นข้อมูลที่จำเป็น');
    }
    
    if (data.zipcode !== undefined && !/^[0-9]{5}$/.test(data.zipcode)) {
      throw new Error('รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก');
    }
    
    if (data.phoneNumber !== undefined && !/^[0-9]{10}$/.test(data.phoneNumber.replace(/[-\s]/g, ''))) {
      throw new Error('เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก');
    }
    
    if (data.numberOfSigners !== undefined && data.numberOfSigners < 1) {
      throw new Error('จำนวนผู้ลงนามต้องมากกว่า 0');
    }
    
    // Check phone number uniqueness (if updating)
    if (data.phoneNumber && data.phoneNumber !== existingOrganization.phoneNumber) {
      const phoneExists = await prisma.organization.findFirst({
        where: { 
          phoneNumber: data.phoneNumber,
          id: { not: id }
        }
      });
      
      if (phoneExists) {
        throw new Error('เบอร์โทรศัพท์นี้มีการใช้งานแล้ว');
      }
    }
    
    // Check organization category (if updating)
    if (data.organizationCategoryId) {
      const organizationCategory = await prisma.organizationCategory.findUnique({
        where: { id: data.organizationCategoryId }
      });
      
      if (!organizationCategory) {
        throw new Error('ไม่พบองค์กรที่เลือก');
      }
      
      if (!organizationCategory.isActive) {
        throw new Error('องค์กรที่เลือกไม่ได้เปิดใช้งาน');
      }
    }
    
    // Prepare update data
    const updateData: any = {};
    
    Object.keys(data).forEach(key => {
      const value = (data as any)[key];
      if (value !== undefined) {
        if (typeof value === 'string' && value.trim() !== '') {
          updateData[key] = value.trim();
        } else {
          updateData[key] = value;
        }
      }
    });
    
    await prisma.organization.update({
      where: { id },
      data: updateData
    });
    
    // Revalidate cache
    revalidatePath('/organization');
    
    return {
      success: true,
      message: 'แก้ไขข้อมูลเรียบร้อยแล้ว'
    };
  } catch (error) {
    console.error('Error updating organization:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'ไม่สามารถแก้ไขข้อมูลได้';
    
    return {
      success: false,
      message: errorMessage
    };
  }
}
