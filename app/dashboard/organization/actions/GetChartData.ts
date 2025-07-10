// app/dashboard/organization/actions/GetChartData.ts
'use server';

import prisma from '@/app/lib/db';

type ChartDataResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// 📊 ข้อมูลสำหรับ Organization Category Chart
export async function getOrganizationCategoryChartData(): Promise<ChartDataResult<Array<{ name: string; value: number }>>> {
  try {
    const categoryStats = await prisma.organization.groupBy({
      by: ['organizationCategoryId'],
      _count: {
        organizationCategoryId: true
      },
      orderBy: {
        _count: {
          organizationCategoryId: 'desc'
        }
      }
    });

    // ดึงชื่อ OrganizationCategory
    const organizationCategories = await prisma.organizationCategory.findMany({
      select: {
        id: true,
        name: true
      }
    });

    const chartData = categoryStats.map(item => {
      const category = organizationCategories.find(cat => cat.id === item.organizationCategoryId);
      return {
        name: category?.name || 'ไม่ระบุ',
        value: item._count.organizationCategoryId
      };
    });

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching organization category chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch organization category data'
    };
  }
}

// 🗺️ ข้อมูลสำหรับ Province Distribution Chart
export async function getProvinceDistributionChartData(): Promise<ChartDataResult<Array<{ name: string; value: number }>>> {
  try {
    const provinceStats = await prisma.organization.groupBy({
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
    console.error('Error fetching province distribution chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch province distribution data'
    };
  }
}

// 👥 ข้อมูลสำหรับ Signers Chart
export async function getSignersChartData(): Promise<ChartDataResult<Array<{ range: string; count: number; totalSigners: number }>>> {
  try {
    const signersData = await prisma.organization.findMany({
      select: {
        numberOfSigners: true
      },
      where: {
        numberOfSigners: {
          gt: 0
        }
      }
    });

    // จัดกลุ่มตามช่วงจำนวนผู้ลงนาม
    const signersRanges: { [key: string]: { count: number; total: number } } = {
      '1-5 คน': { count: 0, total: 0 },
      '6-10 คน': { count: 0, total: 0 },
      '11-20 คน': { count: 0, total: 0 },
      '21-50 คน': { count: 0, total: 0 },
      '51-100 คน': { count: 0, total: 0 },
      'มากกว่า 100 คน': { count: 0, total: 0 }
    };

    signersData.forEach(record => {
      if (record.numberOfSigners) {
        const signers = record.numberOfSigners;
        if (signers >= 1 && signers <= 5) {
          signersRanges['1-5 คน'].count++;
          signersRanges['1-5 คน'].total += signers;
        } else if (signers >= 6 && signers <= 10) {
          signersRanges['6-10 คน'].count++;
          signersRanges['6-10 คน'].total += signers;
        } else if (signers >= 11 && signers <= 20) {
          signersRanges['11-20 คน'].count++;
          signersRanges['11-20 คน'].total += signers;
        } else if (signers >= 21 && signers <= 50) {
          signersRanges['21-50 คน'].count++;
          signersRanges['21-50 คน'].total += signers;
        } else if (signers >= 51 && signers <= 100) {
          signersRanges['51-100 คน'].count++;
          signersRanges['51-100 คน'].total += signers;
        } else if (signers > 100) {
          signersRanges['มากกว่า 100 คน'].count++;
          signersRanges['มากกว่า 100 คน'].total += signers;
        }
      }
    });

    const chartData = Object.entries(signersRanges).map(([range, data]) => ({
      range,
      count: data.count,
      totalSigners: data.total
    }));

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching signers chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch signers data'
    };
  }
}

// 📈 ข้อมูลสำหรับ Submission Trend Chart
export async function getSubmissionTrendChartData(): Promise<ChartDataResult<Array<{ date: string; count: number }>>> {
  try {
    const submissionData = await prisma.organization.findMany({
      select: {
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // จัดกลุ่มตามวัน (30 วันย้อนหลัง)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const trendData = last30Days.map(date => {
      const count = submissionData.filter(item => 
        item.createdAt.toISOString().split('T')[0] === date
      ).length;
      return { date, count };
    });

    return {
      success: true,
      data: trendData
    };
  } catch (error) {
    console.error('Error fetching submission trend chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch submission trend data'
    };
  }
}

// 🖼️ ข้อมูลสำหรับ Image Completion Chart
export async function getImageCompletionChartData(): Promise<ChartDataResult<Array<{ name: string; value: number }>>> {
  try {
    const allOrganizations = await prisma.organization.findMany({
      select: {
        image1: true,
        image2: true,
        image3: true,
        image4: true,
        image5: true
      }
    });

    // นับจำนวนองค์กรตามความครบถ้วนของรูปภาพ
    const imageCount: { [key: string]: number } = {
      'มีรูป 2 รูป (ครบตามข้อกำหนด)': 0,
      'มีรูป 3 รูป': 0,
      'มีรูป 4 รูป': 0,
      'มีรูป 5 รูป (ครบทั้งหมด)': 0,
      'ไม่ครบตามข้อกำหนด': 0
    };

    allOrganizations.forEach(org => {
      const images = [org.image1, org.image2, org.image3, org.image4, org.image5];
      const validImages = images.filter(img => img !== null && img !== '').length;
      
      if (validImages < 2) {
        imageCount['ไม่ครบตามข้อกำหนด']++;
      } else if (validImages === 2) {
        imageCount['มีรูป 2 รูป (ครบตามข้อกำหนด)']++;
      } else if (validImages === 3) {
        imageCount['มีรูป 3 รูป']++;
      } else if (validImages === 4) {
        imageCount['มีรูป 4 รูป']++;
      } else if (validImages === 5) {
        imageCount['มีรูป 5 รูป (ครบทั้งหมด)']++;
      }
    });

    const chartData = Object.entries(imageCount)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching image completion chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch image completion data'
    };
  }
}

// 📅 ข้อมูลสำหรับ Monthly Submission Chart
export async function getMonthlySubmissionChartData(): Promise<ChartDataResult<Array<{ month: string; count: number }>>> {
  try {
    const monthlyData = await prisma.organization.findMany({
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
    console.error('Error fetching monthly submission chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch monthly submission data'
    };
  }
}

// 🏆 ข้อมูลสำหรับ Top 10 Provinces Chart
export async function getTop10ProvincesChartData(): Promise<ChartDataResult<Array<{ name: string; value: number }>>> {
  try {
    const provinceStats = await prisma.organization.groupBy({
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

// 🗺️ ข้อมูลสำหรับ Organization Type Chart (ประเภทองค์กร)
export async function getOrganizationTypeChartData(): Promise<ChartDataResult<Array<{ name: string; value: number }>>> {
  try {
    // ดึงข้อมูลทั้งหมดแล้วกรองใน JavaScript เพื่อหลีกเลี่ยงปัญหา Prisma
    const allOrganizations = await prisma.organization.findMany({
      select: {
        type: true
      }
    });

    // นับประเภทองค์กร
    const typeCount: { [key: string]: number } = {};
    
    allOrganizations.forEach(org => {
      if (org.type && org.type.trim() !== '') {
        typeCount[org.type] = (typeCount[org.type] || 0) + 1;
      }
    });

    // แปลงประเภทองค์กรให้เป็นภาษาไทย
    const typeMapping = {
      'PUBLIC': 'ภาครัฐ',
      'PRIVATE': 'เอกชน',
      'NGO': 'องค์กรพัฒนาเอกชน',
      'ACADEMIC': 'สถาบันการศึกษา'
    };

    const chartData = Object.entries(typeCount)
      .map(([type, count]) => ({
        name: typeMapping[type as keyof typeof typeMapping] || type || 'ไม่ระบุ',
        value: count
      }))
      .sort((a, b) => b.value - a.value);

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching organization type chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch organization type data'
    };
  }
}

// 📊 ข้อมูลสรุปทั้งหมดสำหรับ Dashboard
export async function getOrganizationDashboardSummary(): Promise<ChartDataResult<{
  totalOrganizations: number;
  totalProvinces: number;
  totalCategories: number;
  totalSigners: number;
  avgSignersPerOrganization: number;
  organizationsWithCompleteImages: number;
  recentOrganizations: number;
}>> {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalOrganizations,
      provinceCount,
      categoryCount,
      signersData,
      imageData,
      recentOrganizations
    ] = await Promise.all([
      prisma.organization.count(),
      prisma.organization.groupBy({
        by: ['province'],
        _count: { province: true }
      }),
      prisma.organizationCategory.count({
        where: { isActive: true }
      }),
      prisma.organization.findMany({
        select: { numberOfSigners: true },
        where: { 
          numberOfSigners: { 
            gt: 0 
          } 
        }
      }),
      prisma.organization.findMany({
        select: {
          image1: true,
          image2: true,
          image3: true,
          image4: true,
          image5: true
        }
      }),
      prisma.organization.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        }
      })
    ]);

    const totalProvinces = provinceCount.length;
    const signers = signersData.map(item => item.numberOfSigners).filter(s => s !== null) as number[];
    const totalSigners = signers.reduce((sum, count) => sum + count, 0);
    const avgSignersPerOrganization = signers.length > 0 ? Math.round(totalSigners / signers.length) : 0;

    // นับองค์กรที่มีรูปภาพครบ (อย่างน้อย 2 รูป)
    const organizationsWithCompleteImages = imageData.filter(org => {
      const images = [org.image1, org.image2, org.image3, org.image4, org.image5];
      const validImages = images.filter(img => img !== null && img !== '').length;
      return validImages >= 2;
    }).length;

    return {
      success: true,
      data: {
        totalOrganizations,
        totalProvinces,
        totalCategories: categoryCount,
        totalSigners,
        avgSignersPerOrganization,
        organizationsWithCompleteImages,
        recentOrganizations
      }
    };
  } catch (error) {
    console.error('Error fetching organization dashboard summary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch organization dashboard summary'
    };
  }
}

// 📞 ข้อมูลสำหรับ Contact Stats Chart (สถิติข้อมูลติดต่อ)
export async function getContactStatsChartData(): Promise<ChartDataResult<{
  phoneNumberStats: Array<{ name: string; value: number }>;
  completenessStats: Array<{ name: string; value: number }>;
}>> {
  try {
    const contactData = await prisma.organization.findMany({
      select: {
        phoneNumber: true,
        firstName: true,
        lastName: true,
        addressLine1: true
      }
    });

    // สถิติเบอร์โทรศัพท์
    const phoneStats = {
      'มีเบอร์โทรศัพท์': 0,
      'ไม่มีเบอร์โทรศัพท์': 0
    };

    // สถิติความครบถ้วนของข้อมูลติดต่อ
    const completenessStats = {
      'ข้อมูลครบถ้วน': 0,
      'ข้อมูลไม่ครบถ้วน': 0
    };

    contactData.forEach(org => {
      // ตรวจสอบเบอร์โทรศัพท์
      if (org.phoneNumber && org.phoneNumber.trim() !== '') {
        phoneStats['มีเบอร์โทรศัพท์']++;
      } else {
        phoneStats['ไม่มีเบอร์โทรศัพท์']++;
      }

      // ตรวจสอบความครบถ้วน (ชื่อ, นามสกุล, ที่อยู่, เบอร์โทร)
      const isComplete = org.firstName && org.firstName.trim() !== '' &&
                        org.lastName && org.lastName.trim() !== '' &&
                        org.addressLine1 && org.addressLine1.trim() !== '' &&
                        org.phoneNumber && org.phoneNumber.trim() !== '';

      if (isComplete) {
        completenessStats['ข้อมูลครบถ้วน']++;
      } else {
        completenessStats['ข้อมูลไม่ครบถ้วน']++;
      }
    });

    const phoneNumberStats = Object.entries(phoneStats).map(([name, value]) => ({ name, value }));
    const completenessStatsArray = Object.entries(completenessStats).map(([name, value]) => ({ name, value }));

    return {
      success: true,
      data: {
        phoneNumberStats,
        completenessStats: completenessStatsArray
      }
    };
  } catch (error) {
    console.error('Error fetching contact stats chart data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch contact stats data'
    };
  }
}