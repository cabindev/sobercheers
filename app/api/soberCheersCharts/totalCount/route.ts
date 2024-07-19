// app/api/soberCheersCharts/totalCount/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Create a single instance of PrismaClient
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export async function GET(req: NextRequest) {
  try {
    // นับจำนวนผู้ลงทะเบียนทั้งหมด
    const totalCount = await prisma.soberCheers.count();

    // Revalidate the path
    revalidatePath('/soberCheersCharts/totalCount');

    return NextResponse.json({ totalCount }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error) {
    console.error('Error in GET /api/soberCheersCharts/totalCount:', error);
    return NextResponse.json({ error: 'Failed to fetch total registered count' }, { status: 500 });
  }
}