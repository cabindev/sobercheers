import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const soberCheers = await prisma.soberCheers.findUnique({
      where: { id: Number(params.id) },
    });
    return NextResponse.json(soberCheers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch soberCheers' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const formData = await req.json();

  const {
    firstName,
    lastName,
    gender,
    birthday,
    addressLine1,
    district,
    amphoe,
    province,
    zipcode,
    type,
    phone,
    job,
    alcoholConsumption,
    drinkingFrequency,
    intentPeriod,
    monthlyExpense,
    motivations,
    healthImpact,
  } = formData;

  if (alcoholConsumption === 'ดื่ม (ย้อนหลังไป 1 ปี)' || alcoholConsumption === 'เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี') {
    if (!drinkingFrequency || !intentPeriod || (monthlyExpense && isNaN(parseInt(monthlyExpense)))) {
      return NextResponse.json({ error: 'Missing required fields for current drinkers or recent quitters' }, { status: 400 });
    }
  }

  try {
    const updatedSoberCheers = await prisma.soberCheers.update({
      where: { id: Number(params.id) },
      data: {
        firstName,
        lastName,
        gender,
        birthday: new Date(birthday),
        addressLine1,
        district,
        amphoe,
        province,
        zipcode,
        type,
        phone: phone || null,
        job,
        alcoholConsumption,
        drinkingFrequency: ['ดื่ม (ย้อนหลังไป 1 ปี)', 'เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี'].includes(alcoholConsumption)
          ? drinkingFrequency
          : null,
        intentPeriod: ['ดื่ม (ย้อนหลังไป 1 ปี)', 'เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี'].includes(alcoholConsumption)
          ? intentPeriod
          : null,
        monthlyExpense: ['ดื่ม (ย้อนหลังไป 1 ปี)', 'เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี'].includes(alcoholConsumption)
          ? parseInt(monthlyExpense.toString().replace(/,/g, '')) || 0
          : null,
        motivations,
        healthImpact,
      },
    });

    revalidatePath('/soberCheers');

    return NextResponse.json(updatedSoberCheers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update soberCheers' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const data = await req.json();

  try {
    // ตรวจสอบว่า id ถูกต้องและมีอยู่จริง
    const existingSoberCheer = await prisma.soberCheers.findUnique({
      where: { id },
    });

    if (!existingSoberCheer) {
      return NextResponse.json({ error: 'SoberCheer not found' }, { status: 404 });
    }

    // แปลงข้อมูลวันที่เกิดให้เป็น Date object
    if (data.birthday) {
      data.birthday = new Date(data.birthday);
    }

    // แปลง monthlyExpense เป็นตัวเลข (ถ้ามี)
    if (data.monthlyExpense) {
      data.monthlyExpense = parseInt(data.monthlyExpense.toString().replace(/,/g, ''));
    }

    // อัปเดตข้อมูล
    const updatedSoberCheer = await prisma.soberCheers.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        birthday: data.birthday,
        addressLine1: data.addressLine1,
        district: data.district,
        amphoe: data.amphoe,
        province: data.province,
        zipcode: data.zipcode,
        type: data.type,
        // เพิ่มฟิลด์อื่นๆ ตามที่ต้องการอัปเดต
      },
    });

    revalidatePath('/soberCheers');

    return NextResponse.json(updatedSoberCheer);
  } catch (error) {
    console.error('Error updating SoberCheer:', error);
    return NextResponse.json({ error: 'Failed to update SoberCheer' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deletedSoberCheers = await prisma.soberCheers.delete({
      where: { id: Number(params.id) },
    });

    revalidatePath('/soberCheers');

    return NextResponse.json(deletedSoberCheers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete soberCheers' }, { status: 500 });
  }
}