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

function parseMotivations(motivationsData: any): string[] {
  if (Array.isArray(motivationsData)) {
    return motivationsData;
  }
  if (typeof motivationsData === 'string') {
    try {
      const parsed = JSON.parse(motivationsData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      // If JSON parsing fails, it might be the escaped string format
      const unescaped = motivationsData.replace(/\\"/g, '"');
      try {
        const parsed = JSON.parse(unescaped);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (error) {
        console.error('Failed to parse motivations:', motivationsData);
      }
    }
  }
  return [];
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
      const parsedMotivations = parseMotivations(m.motivations);
      if (parsedMotivations.length > 0) {
        parsedMotivations.forEach((motivation: string) => {
          if (motivation in motivationCounts) {
            motivationCounts[motivation]++;
          }
        });
        totalResponses++;
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