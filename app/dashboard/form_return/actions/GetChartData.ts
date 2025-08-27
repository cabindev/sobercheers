// app/form_return/dashboard/actions/GetChartData.ts
'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface FormReturnChartData {
  stats2024: {
    totalForms: number;
    totalOrganizations: number;
    monthlyGrowth: number;
  };
  stats2025: {
    totalForms: number;
    totalOrganizations: number;
    monthlyGrowth: number;
  };
  provinceData: Array<{
    province: string;
    count: number;
    percentage: number;
  }>;
  typeData: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  monthlyData: Array<{
    month: string;
    count: number;
  }>;
}

export async function getFormReturnChartData(): Promise<FormReturnChartData> {
  try {
    // Set specific years
    const year2024Start = new Date('2024-01-01T00:00:00.000Z');
    const year2024End = new Date('2025-01-01T00:00:00.000Z');
    const year2025Start = new Date('2025-01-01T00:00:00.000Z');
    const year2025End = new Date('2026-01-01T00:00:00.000Z');

    // Current month for growth calculation (2025)
    const now = new Date();
    const currentMonthStart = new Date(2025, now.getMonth(), 1);
    const previousMonthStart = new Date(2025, now.getMonth() - 1, 1);

    // Get all data
    const [
      forms2024Count,
      forms2025Count,
      currentMonth2025Count,
      previousMonth2025Count,
      orgs2024Count,
      orgs2025Count,
      provinceStats,
      typeStats,
      monthlyStats2025
    ] = await Promise.all([
      // 2024 forms count
      prisma.form_return.count({
        where: {
          createdAt: { gte: year2024Start, lt: year2024End }
        }
      }),
      
      // 2025 forms count
      prisma.form_return.count({
        where: {
          createdAt: { gte: year2025Start, lt: year2025End }
        }
      }),
      
      // Current month 2025 count
      prisma.form_return.count({
        where: {
          createdAt: { gte: currentMonthStart }
        }
      }),
      
      // Previous month 2025 count
      prisma.form_return.count({
        where: {
          createdAt: { gte: previousMonthStart, lt: currentMonthStart }
        }
      }),

      // 2024 unique organizations
      prisma.form_return.groupBy({
        by: ['organizationName'],
        where: {
          createdAt: { gte: year2024Start, lt: year2024End }
        },
        _count: true
      }).then(results => results.length),

      // 2025 unique organizations
      prisma.form_return.groupBy({
        by: ['organizationName'],
        where: {
          createdAt: { gte: year2025Start, lt: year2025End }
        },
        _count: true
      }).then(results => results.length),

      // Province distribution
      prisma.form_return.groupBy({
        by: ['province'],
        _count: true,
        orderBy: {
          _count: {
            province: 'desc'
          }
        }
      }),

      // Type distribution
      prisma.form_return.groupBy({
        by: ['type'],
        _count: true,
        orderBy: {
          _count: {
            type: 'desc'
          }
        }
      }),

      // Monthly data for 2025
      prisma.form_return.findMany({
        where: {
          createdAt: { gte: year2025Start, lt: year2025End }
        },
        select: {
          createdAt: true
        }
      })
    ]);

    // Calculate monthly growth percentage for 2025
    const monthlyGrowth2025 = previousMonth2025Count > 0 
      ? ((currentMonth2025Count - previousMonth2025Count) / previousMonth2025Count) * 100 
      : currentMonth2025Count > 0 ? 100 : 0;

    const totalForms = forms2024Count + forms2025Count;

    // Process province data
    const provinceData = provinceStats.map(item => ({
      province: item.province,
      count: item._count,
      percentage: Math.round((item._count / totalForms) * 100 * 100) / 100
    }));

    // Process type data
    const typeData = typeStats.map(item => ({
      type: item.type,
      count: item._count,
      percentage: Math.round((item._count / totalForms) * 100 * 100) / 100
    }));

    // Process monthly data for 2025
    const monthlyMap = new Map<string, { count: number }>();
    const months = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    // Initialize all months with zero
    months.forEach(month => {
      monthlyMap.set(month, { count: 0 });
    });

    // Fill with actual data from 2025
    monthlyStats2025.forEach(form => {
      const month = months[form.createdAt.getMonth()];
      const current = monthlyMap.get(month) || { count: 0 };
      monthlyMap.set(month, {
        count: current.count + 1
      });
    });

    const monthlyData = months.map(month => ({
      month,
      ...monthlyMap.get(month)!
    }));

    return {
      stats2024: {
        totalForms: forms2024Count || 0,
        totalOrganizations: orgs2024Count || 0,
        monthlyGrowth: 0 // No monthly growth for 2024
      },
      stats2025: {
        totalForms: forms2025Count || 0,
        totalOrganizations: orgs2025Count || 0,
        monthlyGrowth: Math.round(monthlyGrowth2025 * 100) / 100
      },
      provinceData,
      typeData,
      monthlyData
    };

  } catch (error) {
    console.error('Error fetching form return chart data:', error);
    
    // Return empty data structure
    return {
      stats2024: {
        totalForms: 0,
        totalOrganizations: 0,
        monthlyGrowth: 0
      },
      stats2025: {
        totalForms: 0,
        totalOrganizations: 0,
        monthlyGrowth: 0
      },
      provinceData: [],
      typeData: [],
      monthlyData: []
    };
  } finally {
    await prisma.$disconnect();
  }
}