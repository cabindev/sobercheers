import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const count = await prisma.soberCheers.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error in GET /api/soberSheers/count:', error);
    return NextResponse.json({ error: 'Failed to fetch participant count' }, { status: 500 });
  }
}