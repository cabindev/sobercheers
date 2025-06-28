// app/dashboard/components/DashboardCharts.tsx
'use client';

import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  getGenderChartData,
  getTop10ProvincesChartData,
  getAgeGroupChartData,
  getParticipationChartData
} from '../Buddhist2025/actions/GetChartData';

interface DashboardChartsProps {
  isAdmin: boolean;
}

export default function DashboardCharts({ isAdmin }: DashboardChartsProps) {
  const [genderData, setGenderData] = useState<any[]>([]);
  const [provinceData, setProvinceData] = useState<any[]>([]);
  const [ageGroupData, setAgeGroupData] = useState<any[]>([]);
  const [participationData, setParticipationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartsData();
  }, []);

  const loadChartsData = async () => {
    try {
      setLoading(true);
      const [genderResult, provinceResult, ageGroupResult, participationResult] = await Promise.all([
        getGenderChartData(),
        getTop10ProvincesChartData(),
        getAgeGroupChartData(),
        getParticipationChartData()
      ]);

      if (genderResult.success) setGenderData(genderResult.data || []);
      if (provinceResult.success) setProvinceData(provinceResult.data || []);
      if (ageGroupResult.success) setAgeGroupData(ageGroupResult.data || []);
      if (participationResult.success) setParticipationData(participationResult.data || []);
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
        fontSize: 14,
        fontWeight: 'normal',
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} คน ({d}%)',
      backgroundColor: 'white',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
        fontSize: 12
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: '5%',
      left: 'center',
      textStyle: {
        fontSize: 11,
        color: '#6B7280'
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '45%'],
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 6,
            shadowColor: 'rgba(0, 0, 0, 0.1)'
          }
        },
        data: genderData,
        color: ['#6B7280', '#9CA3AF', '#D1D5DB']
      }
    ]
  };

  // Top 10 Provinces Chart Options
  const provinceChartOptions = {
    title: {
      text: 'จังหวัดที่มีผู้เข้าร่วมมากที่สุด',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'white',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
        fontSize: 12
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '25%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: provinceData.map(item => item.name),
      axisLabel: {
        rotate: 45,
        fontSize: 10,
        color: '#6B7280',
        interval: 0
      },
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 10,
        color: '#6B7280'
      },
      axisLine: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#F3F4F6'
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: provinceData.map(item => item.value),
        itemStyle: {
          color: '#6B7280',
          borderRadius: [2, 2, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: '#4B5563'
          }
        }
      }
    ]
  };

  // Age Group Chart Options
  const ageGroupChartOptions = {
    title: {
      text: 'การแบ่งตามกลุ่มอายุ',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'white',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
        fontSize: 12
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '20%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ageGroupData.map(item => item.name),
      axisLabel: {
        rotate: 30,
        fontSize: 10,
        color: '#6B7280',
        interval: 0
      },
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 10,
        color: '#6B7280'
      },
      axisLine: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#F3F4F6'
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: ageGroupData.map(item => item.value),
        itemStyle: {
          color: '#9CA3AF',
          borderRadius: [2, 2, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: '#6B7280'
          }
        }
      }
    ]
  };

  // Participation Chart Options
  const participationChartOptions = {
    title: {
      text: 'การเข้าร่วมตามประเภทองค์กร',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'white',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
        fontSize: 12
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '25%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: participationData.slice(0, 6).map(item => item.name),
      axisLabel: {
        rotate: 45,
        fontSize: 10,
        color: '#6B7280',
        interval: 0
      },
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 10,
        color: '#6B7280'
      },
      axisLine: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#F3F4F6'
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: participationData.slice(0, 6).map(item => item.value),
        itemStyle: {
          color: '#D1D5DB',
          borderRadius: [2, 2, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: '#9CA3AF'
          }
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="animate-pulse">
              <div className="w-24 h-4 bg-gray-200 rounded mb-3"></div>
              <div className="w-full h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Gender Chart */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
        <ReactECharts 
          option={genderChartOptions} 
          style={{ height: '240px' }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      {/* Top 10 Provinces Chart */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
        <ReactECharts 
          option={provinceChartOptions} 
          style={{ height: '240px' }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      {/* Age Group Chart */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
        <ReactECharts 
          option={ageGroupChartOptions} 
          style={{ height: '240px' }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      {/* Participation Chart */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
        <ReactECharts 
          option={participationChartOptions} 
          style={{ height: '240px' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </div>
  );
}