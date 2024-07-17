import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const typeRegions = await prisma.soberCheers.findMany({
      select: {
        type: true,
      },
      distinct: ['type'],
    });

    const uniqueTypeRegions = typeRegions.map(t => t.type);

    return NextResponse.json({ typeRegions: uniqueTypeRegions });
  } catch (error) {
    console.error('Error fetching type regions:', error);
    return NextResponse.json({ error: 'Failed to fetch type regions' }, { status: 500 });
  }
}