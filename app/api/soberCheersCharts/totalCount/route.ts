// api/soberCheersCharts/totalCount/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // นับจำนวนผู้ลงทะเบียนทั้งหมด
    const totalCount = await prisma.soberCheers.count();

    return NextResponse.json({ 
      totalCount
    });
  } catch (error) {
    console.error('Error in GET /api/soberCheersCharts/totalCount:', error);
    return NextResponse.json({ error: 'Failed to fetch total registered count' }, { status: 500 });
  }
}
