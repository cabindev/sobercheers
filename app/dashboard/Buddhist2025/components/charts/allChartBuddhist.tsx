// app/dashboard/Buddhist2025/components/charts/allChartBuddhist.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { getDashboardSummary } from '../../actions/GetChartData';
import DashboardLoading from '../ui/DashboardLoading'; // เพิ่ม import นี้
import GenderChart from './genderChart';
import ProvinceChart from './provinceChart';
import RegionChart from './regionChart';
import MotivationChart from './motivationChart';
import AgeGroupChart from './ageGroupChart';
import TypeChart from './typeChart';
import AlcoholConsumptionChart from './alcoholConsumptionChart';
import DrinkingFrequencyChart from './drinkingFrequencyChart';
import IntentPeriodChart from './intentPeriodChart';
import MonthlyExpenseChart from './monthlyExpenseChart';
import MonthlyExpenseSummary from './monthlyExpenseSummary';
import HealthImpactChart from './healthImpactChart';

interface CountCardProps {
  title: string;
  count: string;
  unit: string;
  color: string;
}

const CountCard: React.FC<CountCardProps> = ({ 
  title, 
  count, 
  unit, 
  color
}) => (
  <div className="bg-white p-4 rounded-lg border border-emerald-100 hover:shadow-lg transition-all hover:shadow-emerald-100/50">
    <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2">
      {title}
    </div>
    <div className="text-2xl font-semibold text-emerald-800 mb-1">
      {count}
    </div>
    <div className="text-xs text-emerald-700">
      {unit}
    </div>
  </div>
);

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  children, 
  className = '', 
  description
}) => (
  <div className={`bg-white rounded-lg border border-emerald-100 hover:shadow-lg transition-all hover:shadow-emerald-100/50 ${className}`}>
    <div className="p-4 border-b border-emerald-50">
      <h3 className="text-sm font-medium text-emerald-800">{title}</h3>
      {description && (
        <p className="text-xs text-emerald-600 mt-1">{description}</p>
      )}
    </div>
    <div className="p-0">
      {children}
    </div>
  </div>
);

const DashboardBuddhist: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const result = await getDashboardSummary();
        if (result.success && result.data) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // ใช้ DashboardLoading component แทน
  if (isLoading || !dashboardData) {
    return <DashboardLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-emerald-800 mb-2">
              Buddhist Lent 2025 Dashboard
            </h1>
            <p className="text-sm text-emerald-600">
              แดชบอร์ดติดตามและวิเคราะห์ข้อมูลผู้เข้าร่วมกิจกรรมเข้าพรรษา พ.ศ. 2568 | Dashboard for tracking and analyzing Buddhist Lent activity participants 2025
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <CountCard
              title="ผู้ลงทะเบียนทั้งหมด | Total Registrations"
              count={`${dashboardData.totalParticipants.toLocaleString()}`}
              unit="คน | People"
              color="blue"
            />
            <CountCard
              title="จังหวัดที่เข้าร่วม | Participating Provinces"
              count={`${dashboardData.totalProvinces}`}
              unit="จังหวัด | Provinces"
              color="green"
            />
            <CountCard
              title="หมวดหมู่กลุ่ม | Group Categories"
              count={`${dashboardData.totalGroupCategories}`}
              unit="ประเภท | Types"
              color="purple"
            />
            <CountCard
              title="อายุเฉลี่ย | Average Age"
              count={`${dashboardData.avgAge}`}
              unit="ปี | Years"
              color="orange"
            />
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <ChartCard
              title="การกระจายตามจังหวัด | Provincial Distribution"
              description="แสดงการกระจายผู้เข้าร่วมตามจังหวัดต่างๆ | Distribution of participants by provinces"
            >
              <ProvinceChart />
            </ChartCard>
            
            <ChartCard
              title="การกระจายตามภูมิภาค | Regional Distribution"
              description="แสดงการกระจายผู้เข้าร่วมตามภูมิภาคของประเทศไทย | Distribution by Thai regions"
            >
              <RegionChart />
            </ChartCard>
            
            <ChartCard 
              title="ประเภทผู้เข้าร่วม | Participant Types"
              description="การแบ่งตามประเภทหรือหมวดหมู่ของผู้เข้าร่วม | Distribution by participant categories"
            >
              <TypeChart />
            </ChartCard>
            
            <ChartCard 
              title="การแบ่งตามเพศ | Gender Distribution"
              description="สัดส่วนผู้เข้าร่วมแยกตามเพศ | Participant ratio by gender"
            >
              <GenderChart />
            </ChartCard>
          </div>

          {/* Age and Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard 
              title="กลุ่มอายุผู้เข้าร่วม | Age Groups"
              description="การแบ่งกลุ่มตามช่วงอายุของผู้เข้าร่วมกิจกรรม | Age distribution of participants"
            >
              <AgeGroupChart />
            </ChartCard>
            
            <ChartCard 
              title="แรงจูงใจในการเข้าร่วม | Motivation Factors"
              description="ปัจจัยที่เป็นแรงจูงใจให้เข้าร่วมกิจกรรมเข้าพรรษา | Factors motivating participation in Buddhist Lent"
            >
              <MotivationChart />
            </ChartCard>
          </div>

          {/* Alcohol Consumption Section */}
          <div className="mb-6">
            <div className="text-center mb-6">
              <h2 className="text-lg font-medium text-emerald-800 mb-2">
                ข้อมูลการดื่มแอลกอฮอล์ | Alcohol Consumption Data
              </h2>
              <p className="text-xs text-emerald-600">
                สถิติและผลกระทบจากการงดแอลกอฮอล์ของผู้เข้าร่วม | Statistics and effects of alcohol abstinence among participants
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard 
                title="ระดับการดื่มแอลกอฮอล์ | Alcohol Consumption Levels"
                description="สถิติการดื่มแอลกอฮอล์ของผู้เข้าร่วม | Alcohol consumption statistics of participants"
              >
                <AlcoholConsumptionChart />
              </ChartCard>
              
              <ChartCard 
                title="ความถี่การดื่มแอลกอฮอล์ | Drinking Frequency"
                description="ความถี่ในการดื่มของผู้ที่มีประวัติการดื่มแอลกอฮอล์ | Drinking frequency among those with drinking history"
              >
                <DrinkingFrequencyChart />
              </ChartCard>
            </div>
          </div>

          {/* Detailed Analysis for Drinkers */}
          <div className="mb-6">
            <div className="text-center mb-6">
              <h2 className="text-lg font-medium text-emerald-800 mb-2">
                ข้อมูลเชิงลึกสำหรับผู้ที่มีประวัติการดื่ม | Detailed Data for Those with Drinking History
              </h2>
              <p className="text-xs text-emerald-600">
                ข้อมูลเฉพาะผู้ที่เคยดื่มแอลกอฮอล์และได้กรอกข้อมูลเพิ่มเติม | Specific data for those with alcohol consumption history who provided additional information
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ChartCard 
                title="รายจ่ายต่อเดือนสำหรับแอลกอฮอล์ | Monthly Alcohol Expenses"
                description="จำนวนเงินที่ผู้มีประวัติการดื่มใช้จ่ายต่อเดือน | Monthly spending on alcohol by those with drinking history"
              >
                <MonthlyExpenseChart />
              </ChartCard>
              
              <ChartCard 
                title="ผลกระทบต่อสุขภาพ | Health Impact"
                description="ผลกระทบที่เกิดขึ้นต่อสุขภาพจากการงดแอลกอฮอล์ | Health effects from abstaining alcohol"
              >
                <HealthImpactChart />
              </ChartCard>
              
              <ChartCard 
                title="ระยะเวลาตั้งใจเข้าพรรษา | Intended Abstinence Period"
                description="ระยะเวลาที่ผู้มีประวัติการดื่มตั้งใจจะงดแอลกอฮอล์ | Intended alcohol abstinence duration for those with drinking history"
              >
                <IntentPeriodChart />
              </ChartCard>
            </div>
          </div>

          {/* Financial Analysis */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-lg font-medium text-emerald-800 mb-2">
                การวิเคราะห์ค่าใช้จ่ายและการประหยัด | Cost Analysis & Savings
              </h2>
              <p className="text-xs text-emerald-600">
                ข้อมูลการใช้จ่ายและผลประโยชน์ที่จะได้รับจากการเข้าร่วมกิจกรรม | Expense data and benefits from participation in the activity
              </p>
            </div>
            <MonthlyExpenseSummary />
          </div>

          {/* Footer */}
          <div className="text-center py-6 border-t border-emerald-200 bg-white rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-700">
                Buddhist Lent 2025 Dashboard
              </p>
              <p className="text-xs text-emerald-600">
                พัฒนาเพื่อติดตามกิจกรรมเข้าพรรษา ประจำปี พ.ศ. 2568 | Developed for Buddhist Lent Activity Tracking 2025
              </p>
              <p className="text-xs text-emerald-500">
                ข้อมูลอัพเดทล่าสุด | Last Updated: {new Date().toLocaleDateString('th-TH')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBuddhist;