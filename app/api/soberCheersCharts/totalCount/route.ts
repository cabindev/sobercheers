// app/api/soberCheersCharts/totalCount/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const motivations = await prisma.soberCheers.findMany({
      select: {
        motivations: true
      }
    });

    const totalCount = await prisma.soberCheers.count();

    const motivationCounts: Record<string, number> = {
      'เพื่อลูกและครอบครัว': 0,
      'เพื่อสุขภาพของตนเอง': 0,
      'ได้บุญ/รักษาศีล': 0,
      'ผู้นำชุมชนชักชวน': 0,
      'คนรักและเพื่อนชวน': 0,
      'ประหยัดเงิน': 0,
      'เพื่อเป็นแบบอย่างที่ดีให้กับคนอื่น': 0
    };

    motivations.forEach(m => {
      const motivationArray = JSON.parse(m.motivations as string);
      motivationArray.forEach((motivation: string) => {
        if (motivation in motivationCounts) {
          motivationCounts[motivation]++;
        }
      });
    });

    return NextResponse.json({ motivationCounts, totalCount });
  } catch (error) {
    console.error('Error in GET /api/soberCheersCharts/totalCount:', error);
    return NextResponse.json({ error: 'Failed to fetch motivation data' }, { status: 500 });
  }
}