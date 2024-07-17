'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaAddressCard, FaChartBar, FaVenusMars, FaWineGlass, FaCalendarAlt, FaMoneyBillWave, FaHeartbeat } from 'react-icons/fa';
import { UserOutlined } from '@ant-design/icons';
import AlcoholConsumptionChart from './consumptionChart';
import GenderChart from './genderChart';
import TypeChart from './type';
import DrinkingFrequencyChart from './drinkingFrequency';
import IntentPeriodChart from './intentPeriod';
import MonthlyExpenseSummary from './monthlyExpense';
import HealthImpactChart from './healthyImpact';
import MotiVation from './motivations';

const TotalCount: React.FC = () => {
  const [totalRegistered, setTotalRegistered] = useState<number>(0);

  useEffect(() => {
    const fetchTotalRegistered = async () => {
      try {
        const response = await axios.get('/api/soberCheersCharts/totalCount');
        setTotalRegistered(response.data.totalCount);
      } catch (error) {
        console.error('Error fetching total registered:', error);
      }
    };
    fetchTotalRegistered();
  }, []);

  return (
    <CountCard
      icon={<UserOutlined />}
      title="สมาชิก/ลงทะเบียน"
      count={`${totalRegistered.toLocaleString()} คน`}
      color="text-blue-500"
    />
  );
};

const ClientCount: React.FC = () => {
  const [clientsCount, setClientsCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchClientsCount = async () => {
      try {
        const res = await axios.get('/api/form_return?count=true');
        setClientsCount(res.data.totalForms);
      } catch (error) {
        console.error('Error fetching clients count:', error);
      }
    };

    fetchClientsCount();
  }, []);

  return (
    <CountCard
      icon={<FaAddressCard />}
      title="องค์กร : คืนข้อมูลเข้าพรรษา"
      count={clientsCount !== null ? `${clientsCount.toLocaleString()} หน่วยงาน` : 'Loading...'}
      color="text-yellow-500"
    />
  );
};

const SignerCount: React.FC = () => {
  const [sumSigners, setSumSigners] = useState<number | null>(null);

  useEffect(() => {
    const fetchSumSigners = async () => {
      try {
        const res = await axios.get('/api/form_return?sumSigners=true');
        setSumSigners(res.data.sumSigners);
      } catch (error) {
        console.error('Error fetching sum of signers:', error);
      }
    };

    fetchSumSigners();
  }, []);

  return (
    <CountCard
      icon={<FaUsers />}
      title="ยอดรวมคนเข้าร่วม : คืนข้อมูลเข้าพรรษา"
      count={sumSigners !== null ? `${sumSigners.toLocaleString()} คน` : 'Loading...'}
      color="text-purple-500"
    />
  );
};

interface CountCardProps {
  icon: React.ReactNode;
  title: string;
  count: string;
  color: string;
}

const CountCard: React.FC<CountCardProps> = ({ icon, title, count, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center`}>
    <div className={`mr-4 text-4xl ${color}`}>{icon}</div>
    <div>
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{count}</div>
    </div>
  </div>
);

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, icon, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${className}`}>
    <div className="flex items-center mb-4">
      <div className="mr-2 text-2xl text-indigo-500">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

const DashboardSober: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10 text-amber-500">SOBER CHEERs Dashboard</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <TotalCount />
          <ClientCount />
          <SignerCount />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ChartCard title="Type Distribution" icon={<FaChartBar />} className="lg:col-span-2">
            <TypeChart />
          </ChartCard>
          <ChartCard title="Gender Distribution" icon={<FaVenusMars />}>
            <GenderChart />
          </ChartCard>
        </div>
        
        <ChartCard title="Drinking Frequency" icon={<FaWineGlass />} className="mb-8">
          <DrinkingFrequencyChart />
        </ChartCard>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Alcohol Consumption" icon={<FaWineGlass />}>
            <AlcoholConsumptionChart />
          </ChartCard>
          <ChartCard title="Intent Period" icon={<FaCalendarAlt />}>
            <IntentPeriodChart />
          </ChartCard>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Monthly Expense Summary" icon={<FaMoneyBillWave />}>
            <MonthlyExpenseSummary />
          </ChartCard>
          <ChartCard title="Health Impact" icon={<FaHeartbeat />}>
            <HealthImpactChart />
          </ChartCard>
        </div>
        <ChartCard title="Motivation" icon={<FaWineGlass />} className="mb-8">
          <MotiVation />
        </ChartCard>
      </div>
    </div>
  );
};

export default DashboardSober;