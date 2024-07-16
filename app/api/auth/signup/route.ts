import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const image = formData.get('image') as File | null;

    // Check if user with the same email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse(JSON.stringify({ error: 'มีอีเมลนี้แล้ว ในระบบ' }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    let imagePath = '';
    if (image) {
      const bufferData = Buffer.from(await image.arrayBuffer());
      const timestamp = new Date().getTime();
      const fileExtension = path.extname(image.name) || '.jpg';
      const fileName = `${timestamp}${fileExtension}`;
      const imageSavePath = path.join(process.cwd(), 'public/img', fileName);

      await fs.writeFile(imageSavePath, bufferData);
      imagePath = `/img/${fileName}`;
    }

    // Create the new user
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        image: imagePath || null,
      },
    });

    // Return success response
    return new NextResponse(JSON.stringify({ message: 'User created successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new NextResponse(JSON.stringify({ error: 'User could not be created' }), { status: 500 });
  }
}
export async function GET(request: NextRequest) {
  try {
    const userCount = await prisma.user.count();

    return new NextResponse(JSON.stringify({ userCount }), { status: 200 });
  } catch (error) {
    console.error('Error fetching user count:', error);
    return new NextResponse(JSON.stringify({ error: 'Could not fetch user count' }), { status: 500 });
  }
}