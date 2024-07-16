import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const types = await prisma.soberCheers.findMany({
      distinct: ['type'],
      select: {
        type: true,
      },
    });

    const typeList = types.map(t => t.type).filter(Boolean);
    return NextResponse.json({ types: typeList });
  } catch (error) {
    console.error('Error in GET /api/soberCheers/type:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
