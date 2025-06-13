// app/dashboard/Buddhist2025/components/charts/allChartBuddhist.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { 
  FaUsers, 
  FaChartBar, 
  FaVenusMars, 
  FaCalendarAlt, 
  FaHeart,
  FaTrophy,
  FaUser,
  FaGlobe,
  FaBuilding,
  FaClock,
  FaDollarSign,
  FaStethoscope,
  FaWineBottle,
  FaMap,
  FaCalculator
} from 'react-icons/fa';
import { getDashboardSummary } from '../../actions/GetChartData';
import GenderChart from './genderChart';
import ProvinceChart from './provinceChart';
import RegionChart from './regionChart';
import MotivationChart from './motivationChart';
import AgeGroupChart from './ageGroupChart';
import AlcoholConsumptionChart from './alcoholConsumptionChart';
import DrinkingFrequencyChart from './drinkingFrequencyChart';
import IntentPeriodChart from './intentPeriodChart';
import MonthlyExpenseChart from './monthlyExpenseChart';
import MonthlyExpenseSummary from './monthlyExpenseSummary';
import HealthImpactChart from './healthImpactChart';
import DashboardLoading from '../ui/DashboardLoading';

interface CountCardProps {
  icon: React.ReactNode;
  title: string;
  count: string;
  unit: string;
  color: string;
  bgColor: string;
}

const CountCard: React.FC<CountCardProps> = ({ 
  icon, 
  title, 
  count, 
  unit, 
  color, 
  bgColor
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-2">
          {title}
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {count}
        </div>
        <div className="text-sm text-gray-500 font-medium">
          {unit}
        </div>
      </div>
      <div className={`${color} ${bgColor} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
        <div className="text-2xl">
          {icon}
        </div>
      </div>
    </div>
  </div>
);

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
  description?: string;
  height?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  children, 
  icon, 
  className = '', 
  description,
  height = "min-h-[350px]"
}) => (
  <div className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${className}`}>
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-start space-x-3">
        <div className="text-2xl text-orange-500 p-2 bg-orange-50 rounded-xl">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </div>
    <div className={height}>
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

  // แสดง loading จนกว่าข้อมูลจะโหลดเสร็จ
  if (isLoading || !dashboardData) {
    return <DashboardLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      <div className="p-4 lg:p-6">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text mb-3">
              🙏 Buddhist Lent 2025 Dashboard
            </h1>
            <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              แดชบอร์ดสำหรับติดตามและวิเคราะห์ข้อมูลผู้เข้าร่วมกิจกรรมเข้าพรรษา พ.ศ. 2568
            </p>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-orange-400 to-amber-500 mx-auto rounded-full"></div>
          </div>

          {/* Stats Cards - ใช้ข้อมูลที่โหลดเสร็จแล้ว */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <CountCard
              icon={<FaUser />}
              title="ผู้ลงทะเบียนทั้งหมด"
              count={`${dashboardData.totalParticipants.toLocaleString()}`}
              unit="คน"
              color="text-orange-500"
              bgColor="bg-orange-50"
            />
            <CountCard
              icon={<FaGlobe />}
              title="จังหวัดที่เข้าร่วม"
              count={`${dashboardData.totalProvinces}`}
              unit="จังหวัด"
              color="text-blue-500"
              bgColor="bg-blue-50"
            />
            <CountCard
              icon={<FaBuilding />}
              title="หมวดหมู่กลุ่ม"
              count={`${dashboardData.totalGroupCategories}`}
              unit="ประเภท"
              color="text-purple-500"
              bgColor="bg-purple-50"
            />
            <CountCard
              icon={<FaTrophy />}
              title="อายุเฉลี่ย"
              count={`${dashboardData.avgAge}`}
              unit="ปี"
              color="text-green-500"
              bgColor="bg-green-50"
            />
          </div>

          {/* Main Geographic Section - Province, Region, Gender */}
          <div className="grid grid-cols-1 xl:grid-cols-6 gap-6 mb-8">
            <ChartCard
              title="การกระจายตามจังหวัด"
              description="แสดงการกระจายผู้เข้าร่วมตามจังหวัดต่างๆ"
              icon={<FaChartBar />}
              className="xl:col-span-2"
              height="min-h-[450px]"
            >
              <ProvinceChart />
            </ChartCard>
            
            <ChartCard
              title="การกระจายตามภูมิภาค"
              description="แสดงการกระจายผู้เข้าร่วมตามภูมิภาคของประเทศไทย"
              icon={<FaMap />}
              className="xl:col-span-2"
              height="min-h-[450px]"
            >
              <RegionChart />
            </ChartCard>
            
            <ChartCard 
              title="การแบ่งตามเพศ" 
              description="สัดส่วนผู้เข้าร่วมแยกตามเพศ"
              icon={<FaVenusMars />}
              className="xl:col-span-2"
              height="min-h-[450px]"
            >
              <GenderChart />
            </ChartCard>
          </div>

          {/* Age Group และ Motivation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard 
              title="กลุ่มอายุผู้เข้าร่วม" 
              description="การแบ่งกลุ่มตามช่วงอายุของผู้เข้าร่วมกิจกรรม"
              icon={<FaUsers />}
              height="min-h-[450px]"
            >
              <AgeGroupChart />
            </ChartCard>
            
            <ChartCard 
              title="แรงจูงใจในการเข้าร่วม" 
              description="ปัจจัยที่เป็นแรงจูงใจให้เข้าร่วมกิจกรรมเข้าพรรษา"
              icon={<FaHeart />}
              height="min-h-[450px]"
            >
              <MotivationChart />
            </ChartCard>
          </div>

          {/* Alcohol Consumption และ Drinking Frequency */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard 
              title="ระดับการดื่มแอลกอฮอล์" 
              description="สถิติการดื่มแอลกอฮอล์ของผู้เข้าร่วม"
              icon={<FaCalendarAlt />}
              height="min-h-[450px]"
            >
              <AlcoholConsumptionChart />
            </ChartCard>
            
            <ChartCard 
              title="ความถี่การดื่มเหล้า" 
              description="ความถี่ในการดื่มเหล้าของผู้เข้าร่วม"
              icon={<FaWineBottle />}
              height="min-h-[450px]"
            >
              <DrinkingFrequencyChart />
            </ChartCard>
          </div>


          {/* Intent Period และ Monthly Expense Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard 
              title="ระยะเวลาตั้งใจเข้าพรรษา" 
              description="ระยะเวลาที่ผู้เข้าร่วมตั้งใจจะงดเหล้า"
              icon={<FaClock />}
              height="min-h-[500px]"
            >
              <IntentPeriodChart />
            </ChartCard>
            
            <ChartCard 
              title="รายจ่ายต่อเดือนสำหรับเหล้า" 
              description="จำนวนเงินที่ใช้จ่ายสำหรับเหล้าต่อเดือน (แบบกราฟ)"
              icon={<FaDollarSign />}
              height="min-h-[500px]"
            >
              <MonthlyExpenseChart />
            </ChartCard>
          </div>

          {/* Health Impact - full width */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <ChartCard 
              title="ผลกระทบต่อสุขภาพ" 
              description="ผลกระทบที่เกิดขึ้นต่อสุขภาพจากการงดเหล้า"
              icon={<FaStethoscope />}
              height="min-h-[450px]"
            >
              <HealthImpactChart />
            </ChartCard>
          </div>
          {/* Monthly Expense Summary - ส่วนสำคัญ */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                <FaCalculator className="text-green-600" />
                การวิเคราะห์ค่าใช้จ่ายและการประหยัด
              </h2>
              <p className="text-gray-600">
                ข้อมูลการใช้จ่ายและผลประโยชน์ที่จะได้รับจากการเข้าร่วมกิจกรรม
              </p>
            </div>
            <MonthlyExpenseSummary />
          </div>

          {/* Footer */}
          <div className="text-center mt-12 py-8 border-t border-gray-200 bg-white rounded-2xl shadow-sm">
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">
                🙏 Buddhist Lent 2025 Dashboard
              </p>
              <p className="text-sm text-gray-600">
                พัฒนาเพื่อติดตามกิจกรรมเข้าพรรษา ประจำปี พ.ศ. 2568
              </p>
              <p className="text-xs text-gray-500">
                © 2025 - ข้อมูลอัพเดทล่าสุด: {new Date().toLocaleDateString('th-TH')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBuddhist;