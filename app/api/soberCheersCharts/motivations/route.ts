import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

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
    const motivations = await prisma.soberCheers.findMany({
      select: {
        motivations: true
      }
    });

    const motivationCounts: Record<string, number> = {
      'เพื่อลูกและครอบครัว': 0,
      'เพื่อสุขภาพของตนเอง': 0,
      'ได้บุญ/รักษาศีล': 0,
      'ผู้นำชุมชนชักชวน': 0,
      'คนรักและเพื่อนชวน': 0,
      'ประหยัดเงิน': 0,
      'เพื่อเป็นแบบอย่างที่ดีให้กับคนอื่น': 0
    };

    let totalResponses = 0;

    motivations.forEach(m => {
      try {
        const motivationArray = JSON.parse(m.motivations as string);
        motivationArray.forEach((motivation: string) => {
          if (motivation in motivationCounts) {
            motivationCounts[motivation]++;
          }
        });
        totalResponses++;
      } catch (error) {
        console.error('Invalid JSON in motivations:', m.motivations);
      }
    });

    revalidatePath('/soberCheersCharts/motivations');

    return NextResponse.json({ motivationCounts, totalResponses }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error) {
    console.error('Error in GET /api/soberCheersCharts/motivations:', error);
    return NextResponse.json({ error: 'Failed to fetch motivation data' }, { status: 500 });
  }
}