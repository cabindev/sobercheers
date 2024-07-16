import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'desc';

    const where = search
      ? {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
          ],
        }
      : {};

    const soberCheers = await prisma.soberCheers.findMany({
      where,
      orderBy: { createdAt: sort === 'asc' ? 'asc' : 'desc' },
    });

    // Calculate type counts
    const typeCounts = soberCheers.reduce<Record<string, number>>((acc, item) => {
      const type = item.type as string || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Calculate drinking frequency counts
    const drinkingFrequency = soberCheers.reduce<Record<string, number>>((acc, item) => {
      const frequency = item.drinkingFrequency as string || 'Unknown';
      acc[frequency] = (acc[frequency] || 0) + 1;
      return acc;
    }, {});

    // Calculate intent period counts
    const intentPeriod = soberCheers.reduce<Record<string, number>>((acc, item) => {
      const period = item.intentPeriod as string || 'Unknown';
      acc[period] = (acc[period] || 0) + 1;
      return acc;
    }, {});

    // Calculate motivations counts
    const motivations = soberCheers.reduce<Record<string, number>>((acc, item) => {
      const motivation = item.motivations as string || 'Unknown';
      acc[motivation] = (acc[motivation] || 0) + 1;
      return acc;
    }, {});

    // Calculate monthly expenses
    const monthlyExpenses = soberCheers.map(item => item.monthlyExpense || 0);
    const totalMonthlyExpense = monthlyExpenses.reduce((sum, expense) => sum + expense, 0);
    const validExpenseCount = monthlyExpenses.filter(expense => expense > 0).length;
    const averageMonthlyExpense = validExpenseCount > 0 ? totalMonthlyExpense / validExpenseCount : 0;

    // Calculate health impact
    const healthImpact = soberCheers.reduce<Record<string, number>>((acc, item) => {
      const impact = item.healthImpact as string || 'Unknown';
      acc[impact] = (acc[impact] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({ 
      soberCheers,
      typeCounts,
      drinkingFrequency,
      intentPeriod,
      motivations,
      monthlyExpenseSummary: {
        total: totalMonthlyExpense,
        average: averageMonthlyExpense,
        participantCount: validExpenseCount
      },
      healthImpact,
      totalCount: soberCheers.length
    });
  } catch (error) {
    console.error('Error in GET /api/soberCheersCharts:', error);
    return NextResponse.json({ error: 'Failed to fetch soberCheersCharts' }, { status: 500 });
  }
}