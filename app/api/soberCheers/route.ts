import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// เพิ่มบรรทัดนี้
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'desc';
  const type = searchParams.get('type') || '';

  const where = {
    AND: [
      search ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { addressLine1: { contains: search, mode: 'insensitive' } },
          { district: { contains: search, mode: 'insensitive' } },
          { amphoe: { contains: search, mode: 'insensitive' } },
          { province: { contains: search, mode: 'insensitive' } },
        ],
      } : {},
      type ? { type: { equals: type, mode: 'insensitive' } } : {},
    ],
  };

  try {
    const soberCheers = await prisma.soberCheers.findMany({
      where,
      orderBy: { createdAt: sort === 'asc' ? 'asc' : 'desc' },
    });
    return NextResponse.json({ soberCheers, totalItems: soberCheers.length });
  } catch (error) {
    console.error('Error in GET /api/soberCheers:', error);
    return NextResponse.json({ error: 'Failed to fetch soberCheers' }, { status: 500 });
  }
}

interface SoberCheersFormData {
  firstName: string;
  lastName: string;
  gender: string;
  birthday: string;
  addressLine1: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  type: string;
  phone: string;
  job: string;
  alcoholConsumption: string;
  drinkingFrequency: string | null;
  intentPeriod: string | null;
  monthlyExpense: number | null;
  motivations: string[];
  healthImpact: string;
}

function isValidPhoneNumber(phone: string) {
  return /^[0-9]{10}$/.test(phone);
}

function isValidDate(dateString: string) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export async function POST(req: NextRequest) {
  try {
    const formData: SoberCheersFormData = await req.json();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'gender', 'birthday', 'addressLine1', 'district', 'amphoe', 'province', 'zipcode', 'job', 'alcoholConsumption', 'healthImpact'];
    for (const field of requiredFields) {
      if (!formData[field as keyof SoberCheersFormData]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate phone number
    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    // Validate date
    if (!isValidDate(formData.birthday)) {
      return NextResponse.json({ error: 'Invalid birthday format' }, { status: 400 });
    }

    // Validate gender
    if (!['ชาย', 'หญิง', 'LGBTQ'].includes(formData.gender)) {
      return NextResponse.json({ error: 'Invalid gender' }, { status: 400 });
    }

    // Validate conditional fields
    if (['ดื่ม (ย้อนหลังไป 1 ปี)', 'เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี'].includes(formData.alcoholConsumption)) {
      if (!formData.drinkingFrequency || !formData.intentPeriod || formData.monthlyExpense === null) {
        return NextResponse.json({ error: 'Missing required fields for drinkers or recent quitters' }, { status: 400 });
      }
    }

    const newSoberCheers = await prisma.soberCheers.create({
      data: {
        ...formData,
        gender: formData.gender,
        birthday: new Date(formData.birthday),
        drinkingFrequency: ['ดื่ม (ย้อนหลังไป 1 ปี)', 'เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี'].includes(formData.alcoholConsumption) 
          ? formData.drinkingFrequency 
          : null,
        intentPeriod: ['ดื่ม (ย้อนหลังไป 1 ปี)', 'เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี'].includes(formData.alcoholConsumption) 
          ? formData.intentPeriod 
          : null,
        monthlyExpense: ['ดื่ม (ย้อนหลังไป 1 ปี)', 'เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี'].includes(formData.alcoholConsumption) 
          ? formData.monthlyExpense 
          : null,
        motivations: JSON.stringify(formData.motivations),
      },
    });
      
    revalidatePath('/soberCheers');
    return NextResponse.json(newSoberCheers, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/soberCheers:', error);
    return NextResponse.json({ error: 'Failed to create soberCheers' }, { status: 500 });
  }
}