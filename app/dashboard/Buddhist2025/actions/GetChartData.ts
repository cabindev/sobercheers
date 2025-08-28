// app/dashboard/Buddhist2025/actions/GetChartData.ts
'use server';

import prisma from '@/app/lib/db';

type ChartDataResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// 📊 ข้อมูลสำหรับ Gender Chart
export async function getGenderChartData(): Promise<ChartDataResult<Array<{ name: string; value: number }>>> {
  try {
    const genderStats = await prisma.buddhist2025.groupBy({
      by: ['gender'],
      _count: {
        gender: true
      },
      orderBy: {
        _count: {
          gender: 'desc'
        }
      }
    });

    const chartData = genderStats.map(item => ({
      name: item.gender || 'ไม่ระบุ',
      value: item._count.gender
    }));

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching gender chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch gender data'
    };
  }
}

// 🗺️ ข้อมูลสำหรับ Province Chart
export async function getProvinceChartData(): Promise<ChartDataResult<Array<{ name: string; value: number }>>> {
  try {
    const provinceStats = await prisma.buddhist2025.groupBy({
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

    const chartData = provinceStats.map(item => ({
      name: item.province,
      value: item._count.province
    }));

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching province chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch province data'
    };
  }
}

// 💭 ข้อมูลสำหรับ Motivation Chart - แก้ไข motivationsArray
export async function getMotivationChartData(): Promise<ChartDataResult<Array<{ name: string; value: number }>>> {
  try {
    const allRecords = await prisma.buddhist2025.findMany({
      select: {
        motivations: true
      }
    });

    // นับจำนวน motivations แต่ละประเภท
    const motivationCount: { [key: string]: number } = {};

    allRecords.forEach(record => {
      // แก้ไขการจัดการ Json field
      let motivationsArray: string[] = [];
      
      if (record.motivations) {
        if (Array.isArray(record.motivations)) {
          motivationsArray = record.motivations as string[];
        } else if (typeof record.motivations === 'string') {
          try {
            const parsed = JSON.parse(record.motivations);
            if (Array.isArray(parsed)) {
              motivationsArray = parsed as string[];
            }
          } catch (e) {
            console.warn('Failed to parse motivations:', record.motivations);
          }
        } else if (typeof record.motivations === 'object') {
          // กรณีที่เป็น object แล้ว
          motivationsArray = Object.values(record.motivations).filter(v => typeof v === 'string') as string[];
        }
      }

      motivationsArray.forEach((motivation: string) => {
        if (motivation && typeof motivation === 'string') {
          motivationCount[motivation] = (motivationCount[motivation] || 0) + 1;
        }
      });
    });

    const chartData = Object.entries(motivationCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching motivation chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch motivation data'
    };
  }
}

// 👥 ข้อมูลสำหรับ Age Group Chart
export async function getAgeGroupChartData(): Promise<ChartDataResult<Array<{ name: string; value: number }>>> {
  try {
    const ageData = await prisma.buddhist2025.findMany({
      select: {
        age: true
      },
      where: {
        age: {
          not: null
        }
      }
    });

    // จัดกลุ่มตามช่วงอายุ
    const ageGroups: { [key: string]: number } = {
      '18-25 ปี': 0,
      '26-35 ปี': 0,
      '36-45 ปี': 0,
      '46-55 ปี': 0,
      '56-65 ปี': 0,
      'มากกว่า 65 ปี': 0
    };

    ageData.forEach(record => {
      if (record.age) {
        const age = record.age;
        if (age >= 18 && age <= 25) ageGroups['18-25 ปี']++;
        else if (age >= 26 && age <= 35) ageGroups['26-35 ปี']++;
        else if (age >= 36 && age <= 45) ageGroups['36-45 ปี']++;
        else if (age >= 46 && age <= 55) ageGroups['46-55 ปี']++;
        else if (age >= 56 && age <= 65) ageGroups['56-65 ปี']++;
        else if (age > 65) ageGroups['มากกว่า 65 ปี']++;
      }
    });

    const chartData = Object.entries(ageGroups).map(([name, value]) => ({ name, value }));

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching age group chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch age group data'
    };
  }
}

// 🏛️ ข้อมูลสำหรับ Group Category Chart (Participation)
export async function getParticipationChartData(): Promise<ChartDataResult<Array<{ name: string; value: number }>>> {
  try {
    const participationStats = await prisma.buddhist2025.groupBy({
      by: ['groupCategoryId'],
      _count: {
        groupCategoryId: true
      },
      orderBy: {
        _count: {
          groupCategoryId: 'desc'
        }
      }
    });

    // ดึงชื่อ GroupCategory
    const groupCategories = await prisma.groupCategory.findMany({
      select: {
        id: true,
        name: true
      }
    });

    const chartData = participationStats.map(item => {
      const category = groupCategories.find(cat => cat.id === item.groupCategoryId);
      return {
        name: category?.name || 'ไม่ระบุ',
        value: item._count.groupCategoryId
      };
    });

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching participation chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch participation data'
    };
  }
}

// 📊 ข้อมูลสำหรับ Alcohol Consumption Chart
export async function getAlcoholConsumptionChartData(): Promise<ChartDataResult<Array<{ name: string; value: number }>>> {
  try {
    const alcoholStats = await prisma.buddhist2025.groupBy({
      by: ['alcoholConsumption'],
      _count: {
        alcoholConsumption: true
      },
      orderBy: {
        _count: {
          alcoholConsumption: 'desc'
        }
      }
    });

    const chartData = alcoholStats.map(item => ({
      name: item.alcoholConsumption,
      value: item._count.alcoholConsumption
    }));

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching alcohol consumption chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch alcohol consumption data'
    };
  }
}

// 🍷 ข้อมูลสำหรับ Drinking Frequency Chart - ใหม่
export async function getDrinkingFrequencyChartData(): Promise<{
  success: boolean;
  data?: Array<{ name: string; value: number }>;
  error?: string;
}> {
try {
  const allFrequencyStats = await prisma.buddhist2025.groupBy({
    by: ['drinkingFrequency'],
    _count: {
      drinkingFrequency: true
    },
    where: {
      AND: [
        {
          drinkingFrequency: {
            not: null
          }
        },
        {
          drinkingFrequency: {
            not: ''
          }
        }
      ]
    }
  });

    // สร้าง mapping สำหรับจัดกลุ่มข้อมูล
    const frequencyMapping = {
      'ทุกวัน (7 วัน/สัปดาห์)': 0,
      'เกือบทุกวัน (3-5 วัน/สัปดาห์)': 0,
      'ทุกสัปดาห์ (1-2 วัน/สัปดาห์)': 0,
      'ทุกเดือน (1-3 วัน/เดือน)': 0,
      'นาน ๆ ครั้ง (8-11 วัน/ปี)': 0
    };

    // จัดกลุ่มข้อมูลตามตัวเลือกหลัก
    allFrequencyStats.forEach(item => {
      const frequency = item.drinkingFrequency?.toLowerCase() || '';
      const count = item._count.drinkingFrequency;

      // ทุกวัน (7 วัน/สัปดาห์)
      if (frequency === 'ทุกวัน' || frequency === 'ทุกวัน (7 วัน/สัปดาห์)') {
        frequencyMapping['ทุกวัน (7 วัน/สัปดาห์)'] += count;
      }
      // เกือบทุกวัน (3-5 วัน/สัปดาห์)
      else if (
        frequency.includes('3-5') || 
        frequency.includes('4-5') || 
        frequency.includes('5-6') ||
        frequency.includes('สัปดาห์ละ 3') ||
        frequency.includes('สัปดาห์ละ 4') ||
        frequency.includes('สัปดาห์ละ 5') ||
        frequency === 'เกือบทุกวัน (3-5 วัน/สัปดาห์)'
      ) {
        frequencyMapping['เกือบทุกวัน (3-5 วัน/สัปดาห์)'] += count;
      }
      // ทุกสัปดาห์ (1-2 วัน/สัปดาห์)
      else if (
        frequency.includes('1-2') && frequency.includes('สัปดาห์') ||
        frequency.includes('สัปดาห์ละ 1') ||
        frequency.includes('สัปดาห์ละ 2') ||
        frequency.includes('2-3') && frequency.includes('สัปดาห์') ||
        frequency === 'ทุกสัปดาห์ (1-2 วัน/สัปดาห์)'
      ) {
        frequencyMapping['ทุกสัปดาห์ (1-2 วัน/สัปดาห์)'] += count;
      }
      // ทุกเดือน (1-3 วัน/เดือน)
      else if (
        frequency.includes('เดือน') && (
          frequency.includes('1-2') ||
          frequency.includes('1-3') ||
          frequency.includes('2-3') ||
          frequency.includes('เดือนละ 1') ||
          frequency.includes('เดือนละ 2') ||
          frequency.includes('เดือนละ 3')
        ) ||
        frequency === 'ทุกเดือน (1-3 วัน/เดือน)'
      ) {
        frequencyMapping['ทุกเดือน (1-3 วัน/เดือน)'] += count;
      }
      // นาน ๆ ครั้ง (8-11 วัน/ปี)
      else {
        frequencyMapping['นาน ๆ ครั้ง (8-11 วัน/ปี)'] += count;
      }
    });

    // แปลงเป็น array และเรียงลำดับ
    const chartData = Object.entries(frequencyMapping)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0)
      .sort((a, b) => {
        const order = [
          'ทุกวัน (7 วัน/สัปดาห์)',
          'เกือบทุกวัน (3-5 วัน/สัปดาห์)',
          'ทุกสัปดาห์ (1-2 วัน/สัปดาห์)',
          'ทุกเดือน (1-3 วัน/เดือน)',
          'นาน ๆ ครั้ง (8-11 วัน/ปี)'
        ];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching drinking frequency chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch drinking frequency data'
    };
  }
}

// ⏰ ข้อมูลสำหรับ Intent Period Chart - ใหม่
export async function getIntentPeriodChartData(): Promise<ChartDataResult<Array<{ name: string; value: number }>>> {
  try {
    const intentStats = await prisma.buddhist2025.groupBy({
      by: ['intentPeriod'],
      _count: {
        intentPeriod: true
      },
      where: {
        intentPeriod: {
          not: null
        }
      },
      orderBy: {
        _count: {
          intentPeriod: 'desc'
        }
      }
    });

    const chartData = intentStats.map(item => ({
      name: item.intentPeriod || 'ไม่ระบุ',
      value: item._count.intentPeriod
    }));

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching intent period chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch intent period data'
    };
  }
}

// 💰 ข้อมูลสำหรับ Monthly Expense Chart - ใหม่
export async function getMonthlyExpenseChartData(): Promise<ChartDataResult<Array<{ range: string; count: number; averageExpense: number }>>> {
  try {
    const expenseData = await prisma.buddhist2025.findMany({
      select: {
        monthlyExpense: true
      },
      where: {
        monthlyExpense: {
          not: null
        }
      }
    });

    // จัดกลุ่มตามช่วงรายจ่าย
    const expenseRanges: { [key: string]: { count: number; total: number } } = {
      '0-1,000 บาท': { count: 0, total: 0 },
      '1,001-3,000 บาท': { count: 0, total: 0 },
      '3,001-5,000 บาท': { count: 0, total: 0 },
      '5,001-10,000 บาท': { count: 0, total: 0 },
      '10,001-20,000 บาท': { count: 0, total: 0 },
      'มากกว่า 20,000 บาท': { count: 0, total: 0 }
    };

    expenseData.forEach(record => {
      if (record.monthlyExpense) {
        const expense = record.monthlyExpense;
        if (expense >= 0 && expense <= 1000) {
          expenseRanges['0-1,000 บาท'].count++;
          expenseRanges['0-1,000 บาท'].total += expense;
        } else if (expense >= 1001 && expense <= 3000) {
          expenseRanges['1,001-3,000 บาท'].count++;
          expenseRanges['1,001-3,000 บาท'].total += expense;
        } else if (expense >= 3001 && expense <= 5000) {
          expenseRanges['3,001-5,000 บาท'].count++;
          expenseRanges['3,001-5,000 บาท'].total += expense;
        } else if (expense >= 5001 && expense <= 10000) {
          expenseRanges['5,001-10,000 บาท'].count++;
          expenseRanges['5,001-10,000 บาท'].total += expense;
        } else if (expense >= 10001 && expense <= 20000) {
          expenseRanges['10,001-20,000 บาท'].count++;
          expenseRanges['10,001-20,000 บาท'].total += expense;
        } else if (expense > 20000) {
          expenseRanges['มากกว่า 20,000 บาท'].count++;
          expenseRanges['มากกว่า 20,000 บาท'].total += expense;
        }
      }
    });

    const chartData = Object.entries(expenseRanges).map(([range, data]) => ({
      range,
      count: data.count,
      averageExpense: data.count > 0 ? Math.round(data.total / data.count) : 0
    }));

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching monthly expense chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch monthly expense data'
    };
  }
}

// 🏥 ข้อมูลสำหรับ Health Impact Chart - ใหม่
export async function getHealthImpactChartData(): Promise<ChartDataResult<Array<{ name: string; value: number }>>> {
  try {
    const healthStats = await prisma.buddhist2025.groupBy({
      by: ['healthImpact'],
      _count: {
        healthImpact: true
      },
      orderBy: {
        _count: {
          healthImpact: 'desc'
        }
      }
    });

    const chartData = healthStats.map(item => ({
      name: item.healthImpact,
      value: item._count.healthImpact
    }));

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching health impact chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch health impact data'
    };
  }
}

// 🏆 ข้อมูลสำหรับ Top 10 Provinces Chart
export async function getTop10ProvincesChartData(): Promise<ChartDataResult<Array<{ name: string; value: number }>>> {
  try {
    const provinceStats = await prisma.buddhist2025.groupBy({
      by: ['province'],
      _count: {
        province: true
      },
      orderBy: {
        _count: {
          province: 'desc'
        }
      },
      take: 10
    });

    const chartData = provinceStats.map(item => ({
      name: item.province,
      value: item._count.province
    }));

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching top 10 provinces chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch top 10 provinces data'
    };
  }
}

// 📅 ข้อมูลสำหรับ Monthly Registration Chart - ใหม่
export async function getMonthlyRegistrationChartData(): Promise<ChartDataResult<Array<{ month: string; count: number }>>> {
  try {
    const monthlyData = await prisma.buddhist2025.findMany({
      select: {
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // จัดกลุ่มตามเดือน
    const monthlyCount: { [key: string]: number } = {};

    monthlyData.forEach(record => {
      const monthKey = record.createdAt.toLocaleDateString('th-TH', { 
        year: 'numeric', 
        month: 'long' 
      });
      monthlyCount[monthKey] = (monthlyCount[monthKey] || 0) + 1;
    });

    const chartData = Object.entries(monthlyCount).map(([month, count]) => ({
      month,
      count
    }));

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching monthly registration chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch monthly registration data'
    };
  }
}

// 🗺️ ข้อมูลสำหรับ Region Chart (ภูมิภาค)
export async function getRegionChartData(): Promise<ChartDataResult<Array<{ name: string; value: number }>>> {
  try {
    const regionStats = await prisma.buddhist2025.groupBy({
      by: ['type'],
      _count: {
        type: true
      },
      where: {
        type: {
          not: null
        }
      },
      orderBy: {
        _count: {
          type: 'desc'
        }
      }
    });

    const chartData = regionStats.map(item => ({
      name: item.type || 'ไม่ระบุ',
      value: item._count.type
    }));

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching region chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch region data'
    };
  }
}

// 💰 ข้อมูลสรุปค่าใช้จ่ายรายเดือน - ใหม่
export async function getMonthlyExpenseSummaryData(): Promise<ChartDataResult<{
  total: number;
  average: number;
  participantCount: number;
}>> {
  try {
    const expenseData = await prisma.buddhist2025.findMany({
      select: {
        monthlyExpense: true
      },
      where: {
        monthlyExpense: {
          not: null,
          gt: 0 // เฉพาะค่าที่มากกว่า 0
        }
      }
    });

    const participantCount = expenseData.length;
    
    if (participantCount === 0) {
      return {
        success: true,
        data: {
          total: 0,
          average: 0,
          participantCount: 0
        }
      };
    }

    const expenses = expenseData.map(item => item.monthlyExpense!);
    const total = expenses.reduce((sum, expense) => sum + expense, 0);
    const average = Math.round(total / participantCount);

    return {
      success: true,
      data: {
        total,
        average,
        participantCount
      }
    };
  } catch (error) {
    console.error('Error fetching monthly expense summary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch monthly expense summary'
    };
  }
}

// 📈 ข้อมูลสรุปทั้งหมดสำหรับ Dashboard
export async function getDashboardSummary(): Promise<ChartDataResult<{
  totalParticipants: number;
  totalProvinces: number;
  totalGroupCategories: number;
  avgAge: number;
}>> {
  try {
    const [
      totalParticipants,
      provinceCount,
      groupCategoryCount,
      ageData
    ] = await Promise.all([
      prisma.buddhist2025.count(),
      prisma.buddhist2025.groupBy({
        by: ['province'],
        _count: { province: true }
      }),
      prisma.groupCategory.count(),
      prisma.buddhist2025.findMany({
        select: { age: true },
        where: { age: { not: null } }
      })
    ]);

    const totalProvinces = provinceCount.length;
    const ages = ageData.map(item => item.age).filter(age => age !== null) as number[];
    const avgAge = ages.length > 0 ? Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length) : 0;

    return {
      success: true,
      data: {
        totalParticipants,
        totalProvinces,
        totalGroupCategories: groupCategoryCount,
        avgAge
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard summary'
    };
  }
}

// Type/Group Category Chart Data
export async function getTypeChartData(): Promise<ChartDataResult<Array<{ name: string; value: number }>>> {
  try {
    const typeData = await prisma.buddhist2025.groupBy({
      by: ['groupCategoryId'],
      _count: {
        groupCategoryId: true
      },
      orderBy: {
        _count: {
          groupCategoryId: 'desc'
        }
      }
    });

    // Get GroupCategory names
    const groupCategories = await prisma.groupCategory.findMany({
      select: {
        id: true,
        name: true
      }
    });

    const chartData = typeData.map(item => {
      const category = groupCategories.find(cat => cat.id === item.groupCategoryId);
      return {
        name: category?.name || 'ไม่ระบุ',
        value: item._count.groupCategoryId
      };
    });

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching type chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch type data'
    };
  }
}

