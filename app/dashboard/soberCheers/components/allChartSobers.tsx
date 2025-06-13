// app/dashboard/soberCheers/components/allChartSobers.tsx
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaAddressCard, FaChartBar, FaVenusMars, FaWineGlass, FaCalendarAlt, FaMoneyBillWave, FaHeartbeat, FaUser, FaTrophy, FaGlobe, FaMapMarkedAlt } from 'react-icons/fa';
import AlcoholConsumptionChart from './consumptionChart';
import GenderChart from './genderChart';
import TypeChart from './type';
import DrinkingFrequencyChart from './drinkingFrequency';
import IntentPeriodChart from './intentPeriod';
import MonthlyExpenseSummary from './monthlyExpense';
import HealthImpactChart from './healthyImpact';
import MotiVation from './motivations';
import ProvinceCount from './ProvinceCount';
import ProvinceMap from './ProvinceMap';

const TotalCount: React.FC = () => {
  const [totalRegistered, setTotalRegistered] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTotalRegistered = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/soberCheersCharts/totalCount');
        setTotalRegistered(response.data.totalCount);
      } catch (error) {
        console.error('Error fetching total registered:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTotalRegistered();
  }, []);

  return (
    <CountCard
      icon={<FaUser />}
      title="ผู้ลงทะเบียนทั้งหมด"
      count={`${totalRegistered.toLocaleString()}`}
      unit="คน"
      color="text-amber-500"
      bgColor="bg-amber-50"
      isLoading={isLoading}
    />
  );
};

// เพิ่ม Stats Cards อื่นๆ
const StatsCards: React.FC = () => {
  const [stats, setStats] = useState({
    provinces: 0,
    regions: 0,
    avgAge: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [provinceRes, chartRes] = await Promise.all([
          axios.get('/api/soberCheers/provinces'),
          axios.get('/api/soberCheersCharts')
        ]);
        
        const provinces = provinceRes.data.provinces?.length || 0;
        const regions = new Set(chartRes.data.soberCheers?.map((item: any) => item.type)).size || 0;
        
        // คำนวณอายุเฉลี่ย
        const ages = chartRes.data.soberCheers?.map((item: any) => {
          if (item.birthday) {
            const ageDifMs = Date.now() - new Date(item.birthday).getTime();
            const ageDate = new Date(ageDifMs);
            return Math.abs(ageDate.getUTCFullYear() - 1970);
          }
          return 0;
        }).filter((age: number) => age > 0) || [];
        
        const avgAge = ages.length > 0 ? Math.round(ages.reduce((sum: number, age: number) => sum + age, 0) / ages.length) : 0;
        
        setStats({ provinces, regions, avgAge });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <CountCard
        icon={<FaGlobe />}
        title="จังหวัดที่เข้าร่วม"
        count={`${stats.provinces}`}
        unit="จังหวัด"
        color="text-blue-500"
        bgColor="bg-blue-50"
        isLoading={loading}
      />
      <CountCard
        icon={<FaTrophy />}
        title="อายุเฉลี่ย"
        count={`${stats.avgAge}`}
        unit="ปี"
        color="text-green-500"
        bgColor="bg-green-50"
        isLoading={loading}
      />
    </>
  );
};

interface CountCardProps {
  icon: React.ReactNode;
  title: string;
  count: string;
  unit: string;
  color: string;
  bgColor: string;
  isLoading?: boolean;
}

const CountCard: React.FC<CountCardProps> = ({ 
  icon, 
  title, 
  count, 
  unit, 
  color, 
  bgColor, 
  isLoading = false 
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-2">
          {title}
        </div>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded-md animate-pulse w-20"></div>
            <div className="h-4 bg-gray-200 rounded-md animate-pulse w-12"></div>
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {count}
            </div>
            <div className="text-sm text-gray-500 font-medium">
              {unit}
            </div>
          </>
        )}
      </div>
      <div className={`${color} ${bgColor} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
        <div className="text-2xl">
          {icon}
        </div>
      </div>
    </div>
    
    {/* Progress indicator */}
    <div className="mt-4 bg-gray-100 rounded-full h-1.5">
      <div 
        className={`${bgColor.replace('bg-', 'bg-gradient-to-r from-').replace('-50', '-400 to-').replace('to-', '')}${bgColor.replace('bg-', '').replace('-50', '-600')} h-1.5 rounded-full transition-all duration-1000`}
        style={{ width: isLoading ? '0%' : '100%' }}
      ></div>
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
        <div className="text-2xl text-amber-500 p-2 bg-amber-50 rounded-xl">{icon}</div>
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

const DashboardSober: React.FC = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-t-4 border-amber-300 opacity-30"></div>
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold text-amber-700">กำลังโหลด Dashboard</h3>
            <p className="text-amber-600 mt-1">กรุณารอสักครู่...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="p-4 lg:p-6">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text mb-3">
              🍺 SOBER CHEERs Dashboard
            </h1>
            <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              แดชบอร์ดสำหรับติดตามและวิเคราะห์ข้อมูลผู้เข้าร่วมโครงการงดเหล้าเข้าพรรษา
            </p>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full"></div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
            <TotalCount />
            <StatsCards />
          </div>

          {/* Main Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
            <ChartCard
              title="การกระจายตามภูมิภาค"
              description="แสดงการกระจายผู้เข้าร่วมตามภูมิภาคต่างๆ ของประเทศไทย"
              icon={<FaChartBar />}
              className="xl:col-span-3"
              height="min-h-[450px]"
            >
              <TypeChart />
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

          {/* Province Ranking - Full Width */}
          <div className="mb-8">
            <ChartCard
              title="🏆 อันดับจังหวัดที่มีผู้ลงทะเบียนมากที่สุด"
              description="สถิติการลงทะเบียนงดเหล้าเข้าพรรษาจากทุกจังหวัดในประเทศไทย เรียงลำดับจากมากไปน้อย"
              icon={<FaTrophy />}
              height="min-h-[600px]"
            >
              <ProvinceCount />
            </ChartCard>
          </div>

          {/* Province Map - Full Width */}
          <div className="mb-8">
            <ChartCard
              title="🗺️ แผนที่การกระจายตามจังหวัด"
              description="การแสดงผลข้อมูลบนแผนที่ประเทศไทย พร้อม Top 10 จังหวัดและสถิติสรุป"
              icon={<FaMapMarkedAlt />}
              height="min-h-[600px]"
            >
              <ProvinceMap />
            </ChartCard>
          </div>
          
          {/* Drinking Frequency - Full Width */}
          <div className="mb-8">
            <ChartCard
              title="ความถี่ในการดื่มเหล้า"
              description="สถิติความถี่ในการดื่มของผู้เข้าร่วมก่อนงดเหล้า แสดงในรูปแบบกราฟและตาราง"
              icon={<FaWineGlass />}
              height="min-h-[500px]"
            >
              <DrinkingFrequencyChart />
            </ChartCard>
          </div>

          {/* Consumption and Intent */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard 
              title="ปริมาณการบริโภคเหล้า" 
              description="ระดับการบริโภคเหล้าก่อนเข้าร่วมโครงการ"
              icon={<FaWineGlass />}
              height="min-h-[400px]"
            >
              <AlcoholConsumptionChart />
            </ChartCard>
            
            <ChartCard 
              title="ระยะเวลาที่ตั้งใจงด" 
              description="ช่วงเวลาที่ผู้เข้าร่วมตั้งใจจะงดเหล้า"
              icon={<FaCalendarAlt />}
              height="min-h-[400px]"
            >
              <IntentPeriodChart />
            </ChartCard>
          </div>

          {/* Expense and Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard 
              title="ค่าใช้จ่ายรายเดือน" 
              description="ค่าใช้จ่ายเฉลี่ยในการซื้อเครื่องดื่มแอลกอฮอล์"
              icon={<FaMoneyBillWave />}
              height="min-h-[400px]"
            >
              <MonthlyExpenseSummary />
            </ChartCard>
            
            <ChartCard 
              title="ผลกระทบต่อสุขภาพ" 
              description="การรับรู้ผลกระทบของเหล้าต่อสุขภาพ"
              icon={<FaHeartbeat />}
              height="min-h-[400px]"
            >
              <HealthImpactChart />
            </ChartCard>
          </div>
          
          {/* Motivation - Full Width */}
          <div className="mb-8">
            <ChartCard 
              title="แรงจูงใจในการงดเหล้า" 
              description="ปัจจัยที่เป็นแรงจูงใจให้ผู้เข้าร่วมตัดสินใจงดเหล้า พร้อมแสดงสัดส่วนและสถิติ"
              icon={<FaHeartbeat />} 
              height="min-h-[450px]"
            >
              <MotiVation />
            </ChartCard>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 py-8 border-t border-gray-200 bg-white rounded-2xl shadow-sm">
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">
                🏆 SOBER CHEERs Dashboard
              </p>
              <p className="text-sm text-gray-600">
                พัฒนาเพื่อติดตามโครงการงดเหล้าเข้าพรรษา ประจำปี 2567
              </p>
              <p className="text-xs text-gray-500">
                © 2024 - ข้อมูลอัพเดทล่าสุด: {new Date().toLocaleDateString('th-TH')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSober;