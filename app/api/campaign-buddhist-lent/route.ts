import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const campaigns = await prisma.campaignBuddhistLent.findMany({
      where: { userId: parseInt(userId) },
    });

    if (campaigns.length > 0) {
      return NextResponse.json({ campaigns, completed: true });
    } else {
      return NextResponse.json({ campaigns: [], completed: false });
    }
  } catch (error) {
    console.error('Error in GET /api/campaign_buddhist_lent:', error);
    return NextResponse.json({ error: 'Failed to retrieve campaign status' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      firstName,
      lastName,
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
      userId
    } = await request.json();

    // ตรวจสอบความถูกต้องของข้อมูลตาม conditional logic
    if (alcoholConsumption === 'ดื่ม (ย้อนหลังไป 1 ปี)') {
      if (!drinkingFrequency || !intentPeriod || isNaN(monthlyExpense)) {
        return NextResponse.json({ error: 'Missing required fields for drinkers' }, { status: 400 });
      }
    }

    const newCampaign = await prisma.campaignBuddhistLent.create({
      data: {
        userId,
        firstName,
        lastName,
        birthday: new Date(birthday),
        addressLine1,
        district,
        amphoe,
        province,
        zipcode,
        type,
        phone,
        job,
        alcoholConsumption,
        drinkingFrequency: drinkingFrequency || '',
        intentPeriod: intentPeriod || '',
        monthlyExpense: monthlyExpense || 0,
        motivation: motivations,
        healthImpact
      },
    });

    return NextResponse.json(newCampaign);
  } catch (error) {
    console.error('Error in POST /api/campaign-buddhist-lent:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}
