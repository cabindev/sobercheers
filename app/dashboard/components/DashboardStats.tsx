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

type ChangeType = 'increase' | 'decrease' | 'stable';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/50">
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-slate-200 rounded-lg mb-3"></div>
              <div className="w-20 h-6 bg-slate-200 rounded mb-2"></div>
              <div className="w-24 h-4 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-full bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">ไม่สามารถโหลดข้อมูลสถิติได้: {error}</p>
          <button 
            onClick={loadStats}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'ผู้ลงทะเบียนเข้าร่วม',
      change: '+12%',
      changeType: 'increase' as ChangeType
    },
    {
      title: 'จังหวัดที่เข้าร่วม',
      value: stats.totalProvinces.toString(),
      icon: MapPin,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      description: 'จังหวัดทั่วประเทศ',
      change: '+3',
      changeType: 'increase' as ChangeType
    },
    {
      title: 'หมวดหมู่องค์กร',
      value: stats.totalGroupCategories.toString(),
      icon: Building2,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
      description: 'ประเภทองค์กร',
      change: '0',
      changeType: 'stable' as ChangeType
    },
    {
      title: 'อายุเฉลี่ย',
      value: `${stats.avgAge} ปี`,
      icon: TrendingUp,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      description: 'อายุเฉลี่ยผู้เข้าร่วม',
      change: '+1.2',
      changeType: 'increase' as ChangeType
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'increase' ? 'text-green-600 bg-green-50' :
                stat.changeType === 'decrease' ? 'text-red-600 bg-red-50' :
                'text-slate-600 bg-slate-50'
              }`}>
                {stat.change}
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-slate-900">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-slate-700">
                {stat.title}
              </p>
              <p className="text-xs text-slate-500">
                {stat.description}
              </p>
            </div>

            <div className="mt-4">
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div 
                  className={`bg-gradient-to-r ${stat.color} h-1.5 rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min((index + 1) * 25, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}