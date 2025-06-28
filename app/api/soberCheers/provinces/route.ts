import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// เพิ่มบรรทัดนี้
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const provinceCounts = await prisma.soberCheers.groupBy({
      by: ['province'],
      _count: {
        province: true
      },
      orderBy: {
        _count: {
          province: 'desc'
        }
      }
    });

    const formattedData = provinceCounts.map(item => ({
      province: item.province,
      count: item._count.province
    }));

    return NextResponse.json({ provinces: formattedData });
  } catch (error) {
    console.error('Error fetching province data:', error);
    return NextResponse.json({ error: 'Failed to fetch province data' }, { status: 500 });
  }
}