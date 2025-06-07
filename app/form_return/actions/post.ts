// lib/actions/form-return/post.ts
'use server';

import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs/promises';
import { revalidatePath } from 'next/cache';
import { FormReturnData } from '@/types/form-return';
import prisma from '@/app/lib/db';

export async function createFormReturn(formData: FormData): Promise<{
  success: boolean;
  data?: FormReturnData;
  error?: string;
}> {
  try {
    // Extract form data
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const organizationName = formData.get('organizationName') as string;
    const addressLine1 = formData.get('addressLine1') as string;
    const district = formData.get('district') as string;
    const amphoe = formData.get('amphoe') as string;
    const province = formData.get('province') as string;
    const zipcode = formData.get('zipcode') as string;
    const type = formData.get('type') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const numberOfSigners = parseInt(formData.get('numberOfSigners') as string);
    const image1 = formData.get('image1') as File | null;
    const image2 = formData.get('image2') as File | null;

    // Enhanced Validation
    if (!firstName?.trim() || !lastName?.trim() || !organizationName?.trim() || 
        !addressLine1?.trim() || !district?.trim() || !amphoe?.trim() || 
        !province?.trim() || !zipcode?.trim() || !type?.trim() || 
        !phoneNumber?.trim() || !numberOfSigners || !image1 || !image2) {
      return { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(phoneNumber.trim())) {
      return { success: false, error: 'หมายเลขโทรศัพท์ต้องเป็นตัวเลข 10 หลัก' };
    }

    if (!phoneNumber.trim().startsWith('0')) {
      return { success: false, error: 'หมายเลขโทรศัพท์ต้องขึ้นต้นด้วย 0' };
    }

    // Number of signers validation
    if (numberOfSigners <= 1) {
      return { success: false, error: 'จำนวนผู้ลงนามต้องมากกว่า 1 คน' };
    }

    if (numberOfSigners > 1000000) {
      return { success: false, error: 'จำนวนผู้ลงนามมากเกินไป' };
    }

    // File validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (image1.size > maxSize || image2.size > maxSize) {
      return { success: false, error: 'รูปภาพมีขนาดใหญ่เกินไป (สูงสุด 10MB)' };
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(image1.type) || !allowedTypes.includes(image2.type)) {
      return { success: false, error: 'รูปภาพต้องเป็นไฟล์ JPEG, PNG หรือ WebP เท่านั้น' };
    }

    // Check if phone number already exists
    const existingForm = await prisma.form_return.findUnique({
      where: { phoneNumber: phoneNumber.trim() }
    });

    if (existingForm) {
      return { success: false, error: 'เบอร์โทรศัพท์นี้ถูกใช้แล้ว' };
    }

    // Save images sequentially
    let image1Path: string;
    let image2Path: string;

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Saving images...');
      }
      
      image1Path = await saveImage(image1, 'img1');
      image2Path = await saveImage(image2, 'img2');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Images saved successfully:', { image1Path, image2Path });
      }
    } catch (imageError) {
      console.error('Image saving error:', imageError);
      return { 
        success: false, 
        error: `ไม่สามารถบันทึกรูปภาพได้: ${imageError instanceof Error ? imageError.message : 'ข้อผิดพลาดที่ไม่ทราบสาเหตุ'}` 
      };
    }

    // Create form return record
    const newFormReturn = await prisma.form_return.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        organizationName: organizationName.trim(),
        addressLine1: addressLine1.trim(),
        district: district.trim(),
        amphoe: amphoe.trim(),
        province: province.trim(),
        zipcode: zipcode.trim(),
        type: type.trim(),
        phoneNumber: phoneNumber.trim(),
        numberOfSigners,
        image1: image1Path,
        image2: image2Path,
      },
    });

    // ✅ Revalidate หลายหน้าที่เกี่ยวข้อง
    revalidatePath('/form_return');
    revalidatePath('/form_return/create');
    revalidatePath('/dashboard/formReturn');
    revalidatePath('/dashboard');
    
    // ✅ Log สำเร็จ
    if (process.env.NODE_ENV === 'development') {
      console.log('Form return created successfully:', newFormReturn.id);
    }
    
    // ✅ Return ข้อมูลที่สร้างสำเร็จ รวมทั้ง ID
    return { success: true, data: newFormReturn };

  } catch (error) {
    console.error('Error creating form return:', error);
    
    // Enhanced error handling
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return { success: false, error: 'ข้อมูลซ้ำกับที่มีอยู่แล้ว' };
      }
      if (error.message.includes('ENOSPC')) {
        return { success: false, error: 'เนื้อที่จัดเก็บไม่เพียงพอ' };
      }
      if (error.message.includes('EACCES')) {
        return { success: false, error: 'ไม่มีสิทธิ์เขียนไฟล์' };
      }
      return { success: false, error: `เกิดข้อผิดพลาด: ${error.message}` };
    }
    
    return { success: false, error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' };
  }
}

// ✅ ปรับปรุง saveImage function - เก็บใน public/images โดยตรง
async function saveImage(file: File, prefix: string): Promise<string> {
  if (!file || file.size === 0) {
    throw new Error('ไฟล์รูปภาพไม่ถูกต้อง');
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = path.extname(file.name).toLowerCase() || '.jpg';
    
    // Validate file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error('รูปแบบไฟล์ไม่ถูกต้อง (รองรับเฉพาะ jpg, jpeg, png, webp)');
    }
    
    const fileName = `${prefix}-${timestamp}-${randomString}${fileExtension}`;
    // เก็บใน public/images โดยตรง
    const uploadsDir = path.join(process.cwd(), 'public', 'images');
    const filePath = path.join(uploadsDir, fileName);
    
    // สร้างโฟลเดอร์ถ้ายังไม่มี
    await fs.mkdir(uploadsDir, { recursive: true });
    
    // ตรวจสอบว่าไฟล์ที่จะสร้างไม่ซ้ำ
    try {
      await fs.access(filePath);
      // ถ้าไฟล์มีอยู่แล้ว ให้สร้างชื่อใหม่
      const newRandomString = Math.random().toString(36).substring(2, 8);
      const newFileName = `${prefix}-${timestamp}-${newRandomString}${fileExtension}`;
      const newFilePath = path.join(uploadsDir, newFileName);
      await writeFile(newFilePath, buffer);
      return `/images/${newFileName}`;
    } catch {
      // ถ้าไฟล์ไม่มีอยู่ ให้สร้างปกติ
      await writeFile(filePath, buffer);
      return `/images/${fileName}`;
    }
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error saving image:', error);
    }
    
    if (error instanceof Error) {
      if (error.message.includes('ENOSPC')) {
        throw new Error('เนื้อที่จัดเก็บไม่เพียงพอ');
      }
      if (error.message.includes('EACCES')) {
        throw new Error('ไม่มีสิทธิ์เขียนไฟล์');
      }
      if (error.message.includes('EMFILE') || error.message.includes('ENFILE')) {
        throw new Error('ระบบเปิดไฟล์เกินขีดจำกัด');
      }
      throw error;
    }
    
    throw new Error('ไม่สามารถบันทึกรูปภาพได้');
  }
}

// ✅ ปรับปรุง deleteFile function
async function deleteFile(filePath: string): Promise<void> {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    await fs.unlink(fullPath);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Deleted file:', filePath);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to delete file:', filePath, error);
    }
  }
}

export { saveImage, deleteFile };