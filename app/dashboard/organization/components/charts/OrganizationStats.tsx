// app/dashboard/organization/components/charts/OrganizationStats.tsx
// เอา emoji icons ออกจาก stat cards
'use client'
import React, { useEffect, useState } from 'react';
import { getOrganizationDashboardSummary } from '../../actions/GetChartData';

interface OrganizationStatsData {
  totalOrganizations: number;
  totalProvinces: number;
  totalCategories: number;
  totalSigners: number;
  avgSignersPerOrganization: number;
  organizationsWithCompleteImages: number;
  recentOrganizations: number;
}

interface StatCardProps {
  title: string;
  value: string;
  unit: string;
  description: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  unit, 
  description,
  color
}) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </div>
    </div>
    <div className="text-2xl font-semibold text-green-600 mb-1">
      {value}
    </div>
    <div className="text-xs text-gray-600">
      {unit}
    </div>
    <div className="text-xs text-gray-400 mt-1">
      {description}
    </div>
  </div>
);

const OrganizationStats: React.FC = () => {
  const [statsData, setStatsData] = useState<OrganizationStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        setIsLoading(true);
        const result = await getOrganizationDashboardSummary();
        if (result.success && result.data) {
          setStatsData(result.data);
        }
      } catch (error) {
        console.error('Error fetching organization stats data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStatsData();
  }, []);

  if (isLoading || !statsData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        title="องค์กรทั้งหมด | Total Organizations"
        value={statsData.totalOrganizations.toLocaleString()}
        unit="องค์กร | Organizations"
        description="จำนวนองค์กรที่ลงทะเบียนทั้งหมด"
        color="text-green-600"
      />
      
      <StatCard
        title="จังหวัดที่เข้าร่วม | Participating Provinces"
        value={statsData.totalProvinces.toString()}
        unit="จังหวัด | Provinces"
        description="จังหวัดที่มีองค์กรเข้าร่วม"
        color="text-green-600"
      />
      
      <StatCard
        title="หมวดหมู่องค์กร | Organization Categories"
        value={statsData.totalCategories.toString()}
        unit="ประเภท | Types"
        description="หมวดหมู่องค์กรที่เปิดใช้งาน"
        color="text-green-600"
      />
      
      <StatCard
        title="ผู้ลงนามรวม | Total Signers"
        value={statsData.totalSigners.toLocaleString()}
        unit="คน | People"
        description={`เฉลี่ย ${statsData.avgSignersPerOrganization} คน/องค์กร`}
        color="text-green-600"
      />
    </div>
  );
};

export default OrganizationStats;