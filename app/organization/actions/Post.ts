// app/organization/actions/Post.ts
'use server';

import prisma from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

export interface CreateOrganizationData {
  firstName: string;
  lastName: string;
  organizationCategoryId: number;
  addressLine1: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  type: string;
  phoneNumber: string;
  numberOfSigners: number;
  image1: string;
  image2: string;
  image3?: string;
  image4?: string;
  image5?: string;
}

export async function createOrganization(data: CreateOrganizationData): Promise<{ success: boolean; message: string; id?: number }> {
  try {
    // Validation
    if (!data.firstName?.trim()) {
      throw new Error('ชื่อเป็นข้อมูลที่จำเป็น');
    }
    
    if (!data.lastName?.trim()) {
      throw new Error('นามสกุลเป็นข้อมูลที่จำเป็น');
    }
    
    if (!data.organizationCategoryId) {
      throw new Error('องค์กรเป็นข้อมูลที่จำเป็น');
    }
    
    if (!data.addressLine1?.trim()) {
      throw new Error('ที่อยู่เป็นข้อมูลที่จำเป็น');
    }
    
    if (!data.district?.trim()) {
      throw new Error('ตำบล/แขวงเป็นข้อมูลที่จำเป็น');
    }
    
    if (!data.amphoe?.trim()) {
      throw new Error('อำเภอ/เขตเป็นข้อมูลที่จำเป็น');
    }
    
    if (!data.province?.trim()) {
      throw new Error('จังหวัดเป็นข้อมูลที่จำเป็น');
    }
    
    if (!data.zipcode?.trim()) {
      throw new Error('รหัสไปรษณีย์เป็นข้อมูลที่จำเป็น');
    }
    
    if (!/^[0-9]{5}$/.test(data.zipcode)) {
      throw new Error('รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก');
    }
    
    if (!data.phoneNumber?.trim()) {
      throw new Error('เบอร์โทรศัพท์เป็นข้อมูลที่จำเป็น');
    }
    
    if (!/^[0-9]{10}$/.test(data.phoneNumber.replace(/[-\s]/g, ''))) {
      throw new Error('เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก');
    }
    
    if (!data.image1 || !data.image2) {
      throw new Error('รูปภาพที่ 1 และ 2 เป็นข้อมูลที่จำเป็น');
    }
    
    if (data.numberOfSigners < 1) {
      throw new Error('จำนวนผู้ลงนามต้องมากกว่า 0');
    }
    
    // Check if phone number already exists
    const existingOrganization = await prisma.organization.findFirst({
      where: { phoneNumber: data.phoneNumber }
    });
    
    if (existingOrganization) {
      throw new Error('เบอร์โทรศัพท์นี้มีการใช้งานแล้ว');
    }
    
    // Check if organization category exists
    const organizationCategory = await prisma.organizationCategory.findUnique({
      where: { id: data.organizationCategoryId }
    });
    
    if (!organizationCategory) {
      throw new Error('ไม่พบองค์กรที่เลือก');
    }
    
    if (!organizationCategory.isActive) {
      throw new Error('องค์กรที่เลือกไม่ได้เปิดใช้งาน');
    }
    
    const organization = await prisma.organization.create({
      data: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        organizationCategoryId: data.organizationCategoryId,
        addressLine1: data.addressLine1.trim(),
        district: data.district.trim(),
        amphoe: data.amphoe.trim(),
        province: data.province.trim(),
        zipcode: data.zipcode.trim(),
        type: data.type.trim() || '',
        phoneNumber: data.phoneNumber.trim(),
        numberOfSigners: data.numberOfSigners,
        image1: data.image1,
        image2: data.image2,
        image3: data.image3 || null,
        image4: data.image4 || null,
        image5: data.image5 || null
      }
    });
    
    // Revalidate cache
    revalidatePath('/organization');
    
    return {
      success: true,
      message: 'ส่งข้อมูลเรียบร้อยแล้ว',
      id: organization.id
    };
  } catch (error) {
    console.error('Error creating organization:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'ไม่สามารถส่งข้อมูลได้';
    
    return {
      success: false,
      message: errorMessage
    };
  }
}
