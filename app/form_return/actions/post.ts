// app/form_return/actions/post.ts
'use server';

import { FormReturnData } from '@/types/form-return';
import { writeFile } from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import prisma from '@/app/lib/db';
import fs from 'fs/promises';

export async function createFormReturn(formData: FormData): Promise<{
 success: boolean;
 data?: FormReturnData;
 error?: string;
}> {
 try {
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

   // Validation
   if (!firstName || !lastName || !organizationName || !addressLine1 || 
       !district || !amphoe || !province || !zipcode || !phoneNumber || 
       !numberOfSigners || !image1 || !image2) {
     return { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
   }

   if (phoneNumber.length !== 10) {
     return { success: false, error: 'หมายเลขโทรศัพท์ต้องมี 10 หลัก' };
   }

   if (numberOfSigners <= 1) {
     return { success: false, error: 'จำนวนผู้ลงนามต้องมากกว่า 1 คน' };
   }

   // Check if phone number already exists
   const existingForm = await prisma.form_return.findUnique({
     where: { phoneNumber }
   });

   if (existingForm) {
     return { success: false, error: 'เบอร์โทรศัพท์นี้ถูกใช้แล้ว' };
   }

   // Save images
   const image1Path = await saveImage(image1, '1');
   const image2Path = await saveImage(image2, '2');

   const newFormReturn = await prisma.form_return.create({
     data: {
       firstName,
       lastName,
       organizationName,
       addressLine1,
       district,
       amphoe,
       province,
       zipcode,
       type,
       phoneNumber,
       numberOfSigners,
       image1: image1Path,
       image2: image2Path,
     },
   });

   revalidatePath('/form_return');
   revalidatePath('/dashboard/formReturn');
   
   return { success: true, data: newFormReturn };
 } catch (error) {
   console.error('Error creating form return:', error);
   return { success: false, error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' };
 }
}

async function saveImage(file: File, suffix: string): Promise<string> {
 const buffer = Buffer.from(await file.arrayBuffer());
 const timestamp = new Date().getTime();
 const fileExtension = path.extname(file.name) || '.jpg';
 const fileName = `${timestamp}-${suffix}${fileExtension}`;
 const filePath = path.join(process.cwd(), 'public', 'images', fileName);
 
 // สร้างโฟลเดอร์ถ้ายังไม่มี
 const dir = path.dirname(filePath);
 await fs.mkdir(dir, { recursive: true });
 
 await writeFile(filePath, buffer);
 return `/images/${fileName}`;
}