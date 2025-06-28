// app/dashboard/Buddhist2025/actions/GetTableData.ts
'use server';

import prisma from '@/app/lib/db';

type TableDataResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// 📋 ข้อมูลทั้งหมดสำหรับ Table
export async function getAllBuddhist2025Data(): Promise<TableDataResult<{
  buddhist2025: Array<{
    id: number;
    firstName: string;
    lastName: string;
    gender: string | null;
    age: number | null;
    phone: string | null;
    province: string;
    district: string;
    amphoe: string;
    zipcode: string;
    addressLine1: string;
    type: string | null;
    groupCategoryId: number;
    alcoholConsumption: string;
    drinkingFrequency: string | null;
    intentPeriod: string | null;
    monthlyExpense: number | null;
    healthImpact: string;
    motivations: any;
    createdAt: Date;
    groupCategory: {
      id: number;
      name: string;
    };
  }>;
  groupCategories: Array<{
    id: number;
    name: string;
  }>;
}>> {
  try {
    const [buddhist2025Data, groupCategories] = await Promise.all([
      prisma.buddhist2025.findMany({
        include: {
          groupCategory: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.groupCategory.findMany({
        select: {
          id: true,
          name: true
        },
        orderBy: {
          name: 'asc'
        }
      })
    ]);

    return {
      success: true,
      data: {
        buddhist2025: buddhist2025Data,
        groupCategories: groupCategories
      }
    };
  } catch (error) {
    console.error('Error fetching Buddhist2025 data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Buddhist2025 data'
    };
  }
}

// 🔍 ข้อมูลเฉพาะตาม ID
export async function getBuddhist2025ById(id: number): Promise<TableDataResult<{
  id: number;
  firstName: string;
  lastName: string;
  gender: string | null;
  age: number | null;
  phone: string | null;
  province: string;
  district: string;
  amphoe: string;
  zipcode: string;
  addressLine1: string;
  type: string | null;
  groupCategoryId: number;
  alcoholConsumption: string;
  drinkingFrequency: string | null;
  intentPeriod: string | null;
  monthlyExpense: number | null;
  healthImpact: string;
  motivations: any;
  createdAt: Date;
  groupCategory: {
    id: number;
    name: string;
  };
}>> {
  try {
    const data = await prisma.buddhist2025.findUnique({
      where: { id },
      include: {
        groupCategory: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!data) {
      return {
        success: false,
        error: 'Data not found'
      };
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error fetching Buddhist2025 by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Buddhist2025 data'
    };
  }
}

// 📊 ข้อมูลสถิติพื้นฐานสำหรับ Table
export async function getBuddhist2025TableStats(): Promise<TableDataResult<{
  totalRecords: number;
  totalProvinces: number;
  totalGroupCategories: number;
  recentRegistrations: number;
  avgMonthlyExpense: number;
  totalMaleParticipants: number;
  totalFemaleParticipants: number;
  avgAge: number;
}>> {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalRecords,
      provinceCount,
      groupCategoryCount,
      recentRegistrations,
      expenseData,
      genderStats,
      ageData
    ] = await Promise.all([
      prisma.buddhist2025.count(),
      prisma.buddhist2025.groupBy({
        by: ['province'],
        _count: { province: true }
      }),
      prisma.groupCategory.count(),
      prisma.buddhist2025.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        }
      }),
      prisma.buddhist2025.findMany({
        select: {
          monthlyExpense: true
        },
        where: {
          monthlyExpense: {
            not: null,
            gt: 0
          }
        }
      }),
      prisma.buddhist2025.groupBy({
        by: ['gender'],
        _count: {
          gender: true
        },
        where: {
          gender: {
            not: null
          }
        }
      }),
      prisma.buddhist2025.findMany({
        select: {
          age: true
        },
        where: {
          age: {
            not: null
          }
        }
      })
    ]);

    const expenses = expenseData.map(item => item.monthlyExpense!);
    const avgMonthlyExpense = expenses.length > 0 
      ? Math.round(expenses.reduce((sum, expense) => sum + expense, 0) / expenses.length)
      : 0;

    const maleCount = genderStats.find(stat => stat.gender === 'ชาย')?._count.gender || 0;
    const femaleCount = genderStats.find(stat => stat.gender === 'หญิง')?._count.gender || 0;

    const ages = ageData.map(item => item.age).filter(age => age !== null) as number[];
    const avgAge = ages.length > 0 
      ? Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length) 
      : 0;

    return {
      success: true,
      data: {
        totalRecords,
        totalProvinces: provinceCount.length,
        totalGroupCategories: groupCategoryCount,
        recentRegistrations,
        avgMonthlyExpense,
        totalMaleParticipants: maleCount,
        totalFemaleParticipants: femaleCount,
        avgAge
      }
    };
  } catch (error) {
    console.error('Error fetching Buddhist2025 table stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch table stats'
    };
  }
}
// 🏷️ ข้อมูลสำหรับ Filter Options
export async function getBuddhist2025FilterOptions(): Promise<TableDataResult<{
  provinces: string[];
  types: string[];
  genders: string[];
  alcoholConsumptions: string[];
  drinkingFrequencies: string[];
  intentPeriods: string[];
  healthImpacts: string[];
  groupCategories: Array<{ id: number; name: string }>;
}>> {
  try {
    const [data, groupCategories] = await Promise.all([
      prisma.buddhist2025.findMany({
        select: {
          province: true,
          type: true,
          gender: true,
          alcoholConsumption: true,
          drinkingFrequency: true,
          intentPeriod: true,
          healthImpact: true
        }
      }),
      prisma.groupCategory.findMany({
        select: {
          id: true,
          name: true
        },
        orderBy: {
          name: 'asc'
        }
      })
    ]);

    // แยกการประมวลผลออกมาเป็นตัวแปรแต่ละตัว
    const provinces = Array.from(new Set(
      data.map(item => item.province)
        .filter((value): value is string => value != null && value !== '')
    )).sort();

    const types = Array.from(new Set(
      data.map(item => item.type)
        .filter((value): value is string => value != null && value !== '')
    )).sort();

    const genders = Array.from(new Set(
      data.map(item => item.gender)
        .filter((value): value is string => value != null && value !== '')
    )).sort();

    const alcoholConsumptions = Array.from(new Set(
      data.map(item => item.alcoholConsumption)
        .filter((value): value is string => value != null && value !== '')
    )).sort();

    const drinkingFrequencies = Array.from(new Set(
      data.map(item => item.drinkingFrequency)
        .filter((value): value is string => value != null && value !== '')
    )).sort();

    const intentPeriods = Array.from(new Set(
      data.map(item => item.intentPeriod)
        .filter((value): value is string => value != null && value !== '')
    )).sort();

    const healthImpacts = Array.from(new Set(
      data.map(item => item.healthImpact)
        .filter((value): value is string => value != null && value !== '')
    )).sort();

    return {
      success: true,
      data: {
        provinces,
        types,
        genders,
        alcoholConsumptions,
        drinkingFrequencies,
        intentPeriods,
        healthImpacts,
        groupCategories
      }
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch filter options'
    };
  }
}

// 🔍 ค้นหาข้อมูลด้วยคำค้นหา (Advanced Search)
export async function searchBuddhist2025Data(searchParams: {
  searchTerm?: string;
  province?: string;
  type?: string;
  gender?: string;
  groupCategoryId?: number;
  alcoholConsumption?: string;
  drinkingFrequency?: string;
  intentPeriod?: string;
  healthImpact?: string;
  minAge?: number;
  maxAge?: number;
  minExpense?: number;
  maxExpense?: number;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}): Promise<TableDataResult<{
  data: Array<{
    id: number;
    firstName: string;
    lastName: string;
    gender: string | null;
    age: number | null;
    phone: string | null;
    province: string;
    district: string;
    amphoe: string;
    zipcode: string;
    addressLine1: string;
    type: string | null;
    groupCategoryId: number;
    alcoholConsumption: string;
    drinkingFrequency: string | null;
    intentPeriod: string | null;
    monthlyExpense: number | null;
    healthImpact: string;
    motivations: any;
    createdAt: Date;
    groupCategory: {
      id: number;
      name: string;
    };
  }>;
  totalCount: number;
  hasMore: boolean;
}>> {
  try {
    const {
      searchTerm,
      province,
      type,
      gender,
      groupCategoryId,
      alcoholConsumption,
      drinkingFrequency,
      intentPeriod,
      healthImpact,
      minAge,
      maxAge,
      minExpense,
      maxExpense,
      dateFrom,
      dateTo,
      limit = 20,
      offset = 0
    } = searchParams;

    const whereConditions: any = {};

    if (searchTerm) {
      whereConditions.OR = [
        { firstName: { contains: searchTerm } },
        { lastName: { contains: searchTerm } },
        { phone: { contains: searchTerm } }
      ];
    }

    if (province) whereConditions.province = { contains: province };
    if (type) whereConditions.type = { contains: type };
    if (gender) whereConditions.gender = gender;
    if (groupCategoryId) whereConditions.groupCategoryId = groupCategoryId;
    if (alcoholConsumption) whereConditions.alcoholConsumption = { contains: alcoholConsumption };
    if (drinkingFrequency) whereConditions.drinkingFrequency = { contains: drinkingFrequency };
    if (intentPeriod) whereConditions.intentPeriod = { contains: intentPeriod };
    if (healthImpact) whereConditions.healthImpact = { contains: healthImpact };

    if (minAge !== undefined || maxAge !== undefined) {
      whereConditions.age = {};
      if (minAge !== undefined) whereConditions.age.gte = minAge;
      if (maxAge !== undefined) whereConditions.age.lte = maxAge;
    }

    if (minExpense !== undefined || maxExpense !== undefined) {
      whereConditions.monthlyExpense = {};
      if (minExpense !== undefined) whereConditions.monthlyExpense.gte = minExpense;
      if (maxExpense !== undefined) whereConditions.monthlyExpense.lte = maxExpense;
    }

    if (dateFrom || dateTo) {
      whereConditions.createdAt = {};
      if (dateFrom) whereConditions.createdAt.gte = dateFrom;
      if (dateTo) whereConditions.createdAt.lte = dateTo;
    }

    const [data, totalCount] = await Promise.all([
      prisma.buddhist2025.findMany({
        where: whereConditions,
        include: {
          groupCategory: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: offset
      }),
      prisma.buddhist2025.count({
        where: whereConditions
      })
    ]);

    const hasMore = offset + limit < totalCount;

    return {
      success: true,
      data: {
        data,
        totalCount,
        hasMore
      }
    };
  } catch (error) {
    console.error('Error searching Buddhist2025 data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search data'
    };
  }
}

// 📈 สถิติขั้นสูงสำหรับ Dashboard
export async function getBuddhist2025AdvancedStats(): Promise<TableDataResult<{
  registrationTrend: Array<{ date: string; count: number }>;
  topProvinces: Array<{ province: string; count: number }>;
  topGroupCategories: Array<{ name: string; count: number }>;
  expenseDistribution: Array<{ range: string; count: number }>;
  ageDistribution: Array<{ ageGroup: string; count: number }>;
  intentPeriodStats: Array<{ period: string; count: number; percentage: number }>;
}>> {
  try {
    const [allData, registrationData, groupCategories] = await Promise.all([
      prisma.buddhist2025.findMany({
        select: {
          province: true,
          groupCategoryId: true,
          age: true,
          monthlyExpense: true,
          intentPeriod: true,
          createdAt: true
        }
      }),
      prisma.buddhist2025.findMany({
        select: {
          createdAt: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      }),
      prisma.groupCategory.findMany({
        select: {
          id: true,
          name: true
        }
      })
    ]);

    // 1. Registration Trend (last 30 days)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const registrationTrend = last30Days.map(date => {
      const count = registrationData.filter(item => 
        item.createdAt.toISOString().split('T')[0] === date
      ).length;
      return { date, count };
    });

    // 2. Top 10 Provinces - ใช้ reduce แบบเดียวกับตัวอย่าง
    const provinceCount = allData.reduce<Record<string, number>>((acc, item) => {
      const province = item.province || 'Unknown';
      acc[province] = (acc[province] || 0) + 1;
      return acc;
    }, {});

    const topProvinces = Object.entries(provinceCount)
      .map(([province, count]) => ({ province, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 3. Top Group Categories - ใช้ reduce แบบเดียวกับตัวอย่าง
    const groupCategoryCount = allData.reduce<Record<string, number>>((acc, item) => {
      const group = groupCategories.find(g => g.id === item.groupCategoryId);
      const groupName = group?.name || 'Unknown';
      acc[groupName] = (acc[groupName] || 0) + 1;
      return acc;
    }, {});

    const topGroupCategories = Object.entries(groupCategoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 4. Expense Distribution - ใช้ reduce แบบเดียวกับตัวอย่าง
    const expenseDistribution = allData.reduce<Record<string, number>>((acc, item) => {
      if (!item.monthlyExpense) {
        acc['Unknown'] = (acc['Unknown'] || 0) + 1;
        return acc;
      }

      const expense = item.monthlyExpense;
      let range = 'Unknown';
      
      if (expense >= 0 && expense <= 1000) range = '0-1,000';
      else if (expense >= 1001 && expense <= 3000) range = '1,001-3,000';
      else if (expense >= 3001 && expense <= 5000) range = '3,001-5,000';
      else if (expense >= 5001 && expense <= 10000) range = '5,001-10,000';
      else if (expense >= 10001 && expense <= 20000) range = '10,001-20,000';
      else if (expense > 20000) range = 'มากกว่า 20,000';

      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {});

    const expenseDistributionArray = Object.entries(expenseDistribution)
      .map(([range, count]) => ({ range, count }));

    // 5. Age Distribution - ใช้ reduce แบบเดียวกับตัวอย่าง
    const ageDistribution = allData.reduce<Record<string, number>>((acc, item) => {
      if (!item.age) {
        acc['Unknown'] = (acc['Unknown'] || 0) + 1;
        return acc;
      }

      const age = item.age;
      let ageGroup = 'Unknown';
      
      if (age >= 18 && age <= 25) ageGroup = '18-25 ปี';
      else if (age >= 26 && age <= 35) ageGroup = '26-35 ปี';
      else if (age >= 36 && age <= 45) ageGroup = '36-45 ปี';
      else if (age >= 46 && age <= 55) ageGroup = '46-55 ปี';
      else if (age >= 56 && age <= 65) ageGroup = '56-65 ปี';
      else if (age > 65) ageGroup = 'มากกว่า 65 ปี';

      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {});

    const ageDistributionArray = Object.entries(ageDistribution)
      .map(([ageGroup, count]) => ({ ageGroup, count }));

    // 6. Intent Period Stats - ใช้ reduce แบบเดียวกับตัวอย่าง
    const intentPeriodCount = allData.reduce<Record<string, number>>((acc, item) => {
      const period = item.intentPeriod || 'Unknown';
      acc[period] = (acc[period] || 0) + 1;
      return acc;
    }, {});

    const totalIntentResponses = allData.length;
    const intentPeriodStats = Object.entries(intentPeriodCount)
      .map(([period, count]) => ({
        period,
        count,
        percentage: totalIntentResponses > 0 ? Math.round((count / totalIntentResponses) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    return {
      success: true,
      data: {
        registrationTrend,
        topProvinces,
        topGroupCategories,
        expenseDistribution: expenseDistributionArray,
        ageDistribution: ageDistributionArray,
        intentPeriodStats
      }
    };
  } catch (error) {
    console.error('Error fetching advanced stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch advanced stats'
    };
  }
}

// 📊 สรุปข้อมูลรายเดือน
export async function getBuddhist2025MonthlyReport(year: number = new Date().getFullYear()): Promise<TableDataResult<{
  monthlyData: Array<{
    month: number;
    monthName: string;
    registrations: number;
    totalExpense: number;
    avgExpense: number;
    maleCount: number;
    femaleCount: number;
    topProvince: string;
  }>;
  yearSummary: {
    totalRegistrations: number;
    totalExpense: number;
    avgMonthlyRegistrations: number;
    peakMonth: string;
    topProvince: string;
  };
}>> {
  try {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    const data = await prisma.buddhist2025.findMany({
      where: {
        createdAt: {
          gte: startOfYear,
          lte: endOfYear
        }
      },
      select: {
        createdAt: true,
        monthlyExpense: true,
        gender: true,
        province: true
      }
    });

    const monthlyStats: { [key: number]: any } = {};
    
    for (let month = 0; month < 12; month++) {
      monthlyStats[month] = {
        month: month + 1,
        monthName: new Date(2024, month, 1).toLocaleDateString('th-TH', { month: 'long' }),
        registrations: 0,
        totalExpense: 0,
        expenses: [],
        maleCount: 0,
        femaleCount: 0,
        provinces: {}
      };
    }

    data.forEach(item => {
      const month = item.createdAt.getMonth();
      const monthData = monthlyStats[month];
      
      monthData.registrations++;
      
      if (item.monthlyExpense) {
        monthData.totalExpense += item.monthlyExpense;
        monthData.expenses.push(item.monthlyExpense);
      }
      
      if (item.gender === 'ชาย') monthData.maleCount++;
      if (item.gender === 'หญิง') monthData.femaleCount++;
      
      if (item.province) {
        monthData.provinces[item.province] = (monthData.provinces[item.province] || 0) + 1;
      }
    });

    const monthlyData = Object.values(monthlyStats).map((month: any) => {
      const avgExpense = month.expenses.length > 0 
        ? Math.round(month.totalExpense / month.expenses.length) 
        : 0;
      
      const topProvince = Object.entries(month.provinces)
        .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '-';

      return {
        month: month.month,
        monthName: month.monthName,
        registrations: month.registrations,
        totalExpense: month.totalExpense,
        avgExpense,
        maleCount: month.maleCount,
        femaleCount: month.femaleCount,
        topProvince
      };
    });

    const totalRegistrations = data.length;
    const totalExpense = data.reduce((sum, item) => sum + (item.monthlyExpense || 0), 0);
    const avgMonthlyRegistrations = Math.round(totalRegistrations / 12);
    
    const peakMonthData = monthlyData.reduce((peak, current) => 
      current.registrations > peak.registrations ? current : peak
    );
    const peakMonth = peakMonthData.monthName;

    const provinceCount = data.reduce<Record<string, number>>((acc, item) => {
      const province = item.province || 'Unknown';
      acc[province] = (acc[province] || 0) + 1;
      return acc;
    }, {});

    const topProvince = Object.entries(provinceCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '-';

    return {
      success: true,
      data: {
        monthlyData,
        yearSummary: {
          totalRegistrations,
          totalExpense,
          avgMonthlyRegistrations,
          peakMonth,
          topProvince
        }
      }
    };
  } catch (error) {
    console.error('Error fetching monthly report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch monthly report'
    };
  }
}