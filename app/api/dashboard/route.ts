import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // ดึงข้อมูลประเภทการลงทะเบียนจากตาราง CampaignBuddhistLent
    const campaigns = await prisma.campaignBuddhistLent.groupBy({
      by: ['type', 'alcoholConsumption', 'drinkingFrequency', 'intentPeriod', 'monthlyExpense', 'motivations', 'healthImpact'],
      _count: {
        type: true,
        alcoholConsumption: true,
        drinkingFrequency: true,
        intentPeriod: true,
        monthlyExpense: true,
        motivations: true,
        healthImpact: true,
      },
    });

    return new NextResponse(JSON.stringify({ campaigns }), { status: 200 });
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    return new NextResponse(JSON.stringify({ error: 'Could not fetch campaign data' }), { status: 500 });
  }
}
