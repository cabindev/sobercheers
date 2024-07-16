import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const searchQuery = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const typeFilter = searchParams.get('type') || '';
  const skip = (page - 1) * limit;

  const whereCondition = {
    OR: [
      { firstName: { contains: searchQuery } },
      { lastName: { contains: searchQuery } },
      { phone: { contains: searchQuery } },
      // Add other fields you want to search here
    ],
    ...(typeFilter && { type: typeFilter }),
  };

  try {
    const [campaigns, totalItems, types] = await prisma.$transaction([
      prisma.campaignBuddhistLent.findMany({
        where: whereCondition,
        skip,
        take: limit,
      }),
      prisma.campaignBuddhistLent.count({
        where: whereCondition,
      }),
      prisma.campaignBuddhistLent.findMany({
        select: {
          type: true,
        },
        distinct: ['type'],
      }),
    ]);

    return NextResponse.json({ campaigns, totalItems, types });
  } catch (error) {
    console.error('Error in GET /api/table:', error);
    return NextResponse.json({ error: 'Failed to retrieve campaigns' }, { status: 500 });
  }
}
