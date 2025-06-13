// app/dashboard/components/DashboardCharts.tsx
'use client';

import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  getGenderChartData,
  getProvinceChartData,
  getMotivationChartData,
  getParticipationChartData
} from '../Buddhist2025/actions/GetChartData';

interface DashboardChartsProps {
  isAdmin: boolean;
}

export default function DashboardCharts({ isAdmin }: DashboardChartsProps) {
  const [genderData, setGenderData] = useState<any[]>([]);
  const [participationData, setParticipationData] = useState<any[]>([]);
  const [motivationData, setMotivationData] = useState<any[]>([]);
  const [provinceData, setProvinceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartsData();
  }, []);

  const loadChartsData = async () => {
    try {
      setLoading(true);
      const [genderResult, participationResult, motivationResult, provinceResult] = await Promise.all([
        getGenderChartData(),
        getParticipationChartData(),
        getMotivationChartData(),
        getProvinceChartData()
      ]);

      if (genderResult.success) setGenderData(genderResult.data || []);
      if (participationResult.success) setParticipationData(participationResult.data || []);
      if (motivationResult.success) setMotivationData(motivationResult.data || []);
      if (provinceResult.success) setProvinceData((provinceResult.data || []).slice(0, 10)); // Top 10
    } catch (error) {
      console.error('Error loading charts data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gender Chart Options
  const genderChartOptions = {
    title: {
      text: 'การกระจายตามเพศ',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'เพศ',
        type: 'pie',
        radius: ['30%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: false
        },
        data: genderData,
        color: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B']
      }
    ]
  };

  // Participation Chart Options
  const participationChartOptions = {
    title: {
      text: 'การเข้าร่วมตามประเภทองค์กร',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: participationData.slice(0, 8).map(item => item.name),
      axisLabel: {
        rotate: 45,
        fontSize: 10,
        interval: 0
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'จำนวนผู้เข้าร่วม',
        type: 'bar',
        data: participationData.slice(0, 8).map(item => item.value),
        itemStyle: {
          color: new (window as any).echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#60A5FA' },
            { offset: 1, color: '#3B82F6' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new (window as any).echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#93C5FD' },
              { offset: 1, color: '#60A5FA' }
            ])
          }
        }
      }
    ]
  };

  // Motivation Chart Options
  const motivationChartOptions = {
    title: {
      text: 'แรงจูงใจในการเข้าร่วม',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: motivationData.slice(0, 6).map(item => item.name),
      axisLabel: {
        rotate: 45,
        fontSize: 10,
        interval: 0
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'จำนวน',
        type: 'bar',
        data: motivationData.slice(0, 6).map(item => item.value),
        itemStyle: {
          color: new (window as any).echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#34D399' },
            { offset: 1, color: '#10B981' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new (window as any).echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#6EE7B7' },
              { offset: 1, color: '#34D399' }
            ])
          }
        }
      }
    ]
  };

  // Province Chart Options
  const provinceChartOptions = {
    title: {
      text: 'จังหวัดที่มีผู้เข้าร่วมมากที่สุด (Top 10)',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: provinceData.map(item => item.name),
      axisLabel: {
        rotate: 45,
        fontSize: 10,
        interval: 0
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'จำนวนผู้เข้าร่วม',
        type: 'bar',
        data: provinceData.map(item => item.value),
        itemStyle: {
          color: new (window as any).echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#A78BFA' },
            { offset: 1, color: '#8B5CF6' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new (window as any).echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#C4B5FD' },
              { offset: 1, color: '#A78BFA' }
            ])
          }
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/50">
            <div className="animate-pulse">
              <div className="w-32 h-6 bg-slate-200 rounded mb-4"></div>
              <div className="w-full h-64 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gender Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-shadow">
        <ReactECharts 
          option={genderChartOptions} 
          style={{ height: '300px' }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      {/* Participation Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-shadow">
        <ReactECharts 
          option={participationChartOptions} 
          style={{ height: '300px' }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      {/* Motivation Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-shadow">
        <ReactECharts 
          option={motivationChartOptions} 
          style={{ height: '300px' }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      {/* Province Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-shadow">
        <ReactECharts 
          option={provinceChartOptions} 
          style={{ height: '300px' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </div>
  );
}