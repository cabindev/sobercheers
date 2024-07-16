'use client';
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import axios from 'axios';
import DashboardCard from './components/dashboardCard';
import TypeChart from './components/typeChart';
import AlcoholConsumptionChart from './components/alcoholConsumptionChart';
import DrinkingFrequencyChart from './components/drinkingFrequencyChart';
import MotivationChart from './components/motivationChart';
import HealthImpactChart from './components/healthImpactChart';
import { UserIcon } from '@heroicons/react/outline';
import IntentPeriodChart from './components/intentPeriodChart';
import { FaAddressCard, FaUsers } from 'react-icons/fa';
import TablePage from './table/page';

const Dashboard: NextPage = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [clientsCount, setClientsCount] = useState<number | null>(null);
  const [sumSigners, setSumSigners] = useState<number | null>(null);
  const [showTable, setShowTable] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await axios.get('/api/auth/signup');
        setUserCount(res.data.userCount);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    const fetchClientsCount = async () => {
      try {
        const res = await axios.get('/api/form_return?count=true');
        setClientsCount(res.data.totalForms);
      } catch (error) {
        console.error('Error fetching clients count:', error);
      }
    };

    const fetchSumSigners = async () => {
      try {
        const res = await axios.get('/api/form_return?sumSigners=true');
        setSumSigners(res.data.sumSigners);
      } catch (error) {
        console.error('Error fetching sum of signers:', error);
      }
    };

    fetchUserCount();
    fetchClientsCount();
    fetchSumSigners();
  }, []);

  const handleShowTable = () => {
    setShowTable(!showTable);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard
            title="สมาชิก/member"
            value={userCount !== null ? `${userCount.toLocaleString()} คน` : 'Loading...'}
            icon={<UserIcon className="h-6 w-6 text-blue-500" />}
            bgColor="bg-blue-50"
          />
          <DashboardCard
            title="องค์กร : คืนข้อมูลเข้าพรรษา"
            value={clientsCount !== null ? `${clientsCount.toLocaleString()} หน่วยงาน` : 'Loading...'}
            icon={<FaAddressCard className="h-6 w-6 text-yellow-500" />}
            bgColor="bg-yellow-50"
          />
          <DashboardCard
            title="ยอดรวมคนเข้าร่วม : คืนข้อมูลเข้าพรรษา"
            value={sumSigners !== null ? `${sumSigners.toLocaleString()} คน` : 'Loading...'}
            icon={<FaUsers className="h-6 w-6 text-purple-500" />}
            bgColor="bg-purple-50"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">สมาชิก แต่ละภาค</h2>
            <div className="text-gray-500">ทั้งหมดที่ลงทะเบียน</div>
            <div className="mt-4">
              <TypeChart />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Alcohol Consumption</h2>
            <div className="text-gray-500">Overview of Alcohol Consumption</div>
            <div className="mt-4">
              <AlcoholConsumptionChart />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Drinking Frequency</h2>
            <div className="text-gray-500">Overview of Drinking Frequency</div>
            <div className="mt-4">
              <DrinkingFrequencyChart />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Intent Period</h2>
            <div className="text-gray-500">Overview of Intent Period</div>
            <div className="mt-4">
              <IntentPeriodChart/>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Motivation</h2>
            <div className="text-gray-500">Overview of Motivation</div>
            <div className="mt-4">
              <MotivationChart />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Health Impact</h2>
            <div className="text-gray-500">Overview of Health Impact</div>
            <div className="mt-4">
              <HealthImpactChart />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h2 className="text-xl font-bold mb-4">สมาชิกคนงดเหล้าเข้าพรรษา</h2>
          <button 
            onClick={handleShowTable} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {showTable ? 'ซ่อนข้อมูลสมาชิก' : 'แสดงข้อมูลสมาชิก'}
          </button>
          {showTable && <TablePage />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
