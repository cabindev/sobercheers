import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const phoneNumber = searchParams.get('phoneNumber');
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    if (phoneNumber) {
      // Fetch the form by phone number
      const forms = await prisma.form_return.findMany({
        where: { phoneNumber: phoneNumber },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      });
      return NextResponse.json({ forms });
    } else if (searchParams.has('count')) {
      // Fetch the total count of forms
      const totalForms = await prisma.form_return.count();
      return NextResponse.json({ totalForms });
    } else if (searchParams.has('sumSigners')) {
      // Fetch the sum of numberOfSigners
      const sumSigners = await prisma.form_return.aggregate({
        _sum: {
          numberOfSigners: true,
        },
      });
      return NextResponse.json({ sumSigners: sumSigners._sum.numberOfSigners || 0 });
    } else {
      // Fetch the list of forms
      const [forms, totalForms] = await prisma.$transaction([
        prisma.form_return.findMany({
          where: {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
            ],
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.form_return.count({
          where: {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
            ],
          },
        }),
      ]);

      const totalPages = Math.ceil(totalForms / limit);
      return NextResponse.json({ forms, totalPages });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const organizationName = formData.get('organizationName') as string;
    const addressLine1 = formData.get('addressLine1') as string;
    const district = formData.get('district') as string;
    const amphoe = formData.get('amphoe') as string;
    const province = formData.get('province') as string;
    const zipcode = formData.get('zipcode') as string;
    const district_code = parseInt(formData.get('district_code') as string);
    const type = formData.get('type') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const numberOfSigners = formData.get('numberOfSigners') as string;
    const image1 = formData.get('image1') as File | null;
    const image2 = formData.get('image2') as File | null;

    if (!image1 || !image2) {
      return NextResponse.json({ error: 'Both image1 and image2 are required' }, { status: 400 });
    }

    const bufferData1 = Buffer.from(await image1.arrayBuffer());
    const timestamp1 = new Date().getTime();
    const fileExtension1 = path.extname(image1.name) || '.jpg';
    const fileName1 = `${timestamp1}-1${fileExtension1}`;
    const pathOfImage1 = `./public/images/${fileName1}`;
    const image1Path = `/images/${fileName1}`;
    await writeFile(pathOfImage1, bufferData1);

    const bufferData2 = Buffer.from(await image2.arrayBuffer());
    const timestamp2 = new Date().getTime();
    const fileExtension2 = path.extname(image2.name) || '.jpg';
    const fileName2 = `${timestamp2}-2${fileExtension2}`;
    const pathOfImage2 = `./public/images/${fileName2}`;
    const image2Path = `/images/${fileName2}`;
    await writeFile(pathOfImage2, bufferData2);

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
        numberOfSigners: parseInt(numberOfSigners),
        image1: image1Path,
        image2: image2Path,
      },
    });

    return NextResponse.json(newFormReturn);
  } catch (error) {
    console.error('Error in POST /api/form_return:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
