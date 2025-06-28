// app/dashboard/components/DashboardStats.tsx
'use client';

import { useEffect, useState } from 'react';
import { getDashboardSummary } from '../Buddhist2025/actions/GetChartData';
import { 
  Users, 
  MapPin, 
  Building2, 
  TrendingUp
} from 'lucide-react';

interface DashboardStatsProps {
  isAdmin: boolean;
}

interface StatsData {
  totalParticipants: number;
  totalProvinces: number;
  totalGroupCategories: number;
  avgAge: number;
}

export default function DashboardStats({ isAdmin }: DashboardStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const result = await getDashboardSummary();
      
      if (result.success && result.data) {
        setStats(result.data);
      } else {
        setError(result.error || 'Failed to load stats');
      }
    } catch (err) {
      setError('Error loading dashboard stats');
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="animate-pulse">
              <div className="w-6 h-6 bg-gray-200 rounded mb-2"></div>
              <div className="w-16 h-4 bg-gray-200 rounded mb-1"></div>
              <div className="w-20 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 text-sm">ไม่สามารถโหลดข้อมูลสถิติได้: {error}</p>
          <button 
            onClick={loadStats}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  const statsConfig = [
    {
      title: 'ผู้เข้าร่วมทั้งหมด',
      value: stats.totalParticipants.toLocaleString(),
      icon: Users,
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
      description: 'ผู้ลงทะเบียนเข้าร่วม'
    },
    {
      title: 'จังหวัดที่เข้าร่วม',
      value: stats.totalProvinces.toString(),
      icon: MapPin,
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
      description: 'จังหวัดทั่วประเทศ'
    },
    {
      title: 'หมวดหมู่องค์กร',
      value: stats.totalGroupCategories.toString(),
      icon: Building2,
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
      description: 'ประเภทองค์กร'
    },
    {
      title: 'อายุเฉลี่ย',
      value: `${stats.avgAge} ปี`,
      icon: TrendingUp,
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
      description: 'อายุเฉลี่ยผู้เข้าร่วม'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-gray-900">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-gray-700">
                {stat.title}
              </p>
              <p className="text-xs text-gray-500">
                {stat.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}