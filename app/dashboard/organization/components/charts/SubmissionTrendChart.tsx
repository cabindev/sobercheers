// app/dashboard/organization/components/charts/SubmissionTrendChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getSubmissionTrendChartData } from '../../actions/GetChartData';

interface TrendData {
  date: string;
  count: number;
}

const SubmissionTrendChart: React.FC = () => {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getSubmissionTrendChartData();
        if (result.success && result.data) {
          setTrendData(result.data);
        }
      } catch (error) {
        console.error('Error fetching submission trend data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border border-green-200 border-t-green-500"></div>
        <span className="ml-2 text-xs text-gray-500">กำลังโหลด...</span>
      </div>
    );
  }

  if (!trendData.length) {
    return <div className="text-center text-xs text-gray-500 py-8">ไม่พบข้อมูลแนวโน้ม</div>;
  }

  // คำนวณสถิติพื้นฐาน
  const totalSubmissions = trendData.reduce((sum, item) => sum + item.count, 0);
  const avgPerDay = (totalSubmissions / trendData.length).toFixed(1);
  const maxDay = trendData.reduce((max, item) => item.count > max.count ? item : max);
  const recentWeek = trendData.slice(-7).reduce((sum, item) => sum + item.count, 0);

  const option = {
    title: {
      text: 'แนวโน้มการส่งข้อมูล (30 วันล่าสุด)',
      left: 'center',
      textStyle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4B5563'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'white',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      textStyle: {
        fontSize: 11,
        color: '#374151'
      },
      formatter: (params: any) => {
        const data = params[0];
        const date = new Date(data.name).toLocaleDateString('th-TH', {
          weekday: 'long',
          day: 'numeric',
          month: 'short'
        });
        return `${date}<br/>${data.value} องค์กรส่งข้อมูล`;
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: trendData.map(item => item.date),
      axisLabel: {
        fontSize: 8,
        color: '#6B7280',
        formatter: (value: string) => {
          const date = new Date(value);
          return `${date.getDate()}/${date.getMonth() + 1}`;
        },
        interval: Math.floor(trendData.length / 10) // แสดงทุก ๆ 3 วัน
      },
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 9,
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
        type: 'line',
        data: trendData.map(item => item.count),
        smooth: true,
        lineStyle: {
          color: '#10B981',
          width: 2
        },
        itemStyle: {
          color: '#10B981',
          borderColor: '#ffffff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(16, 185, 129, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(16, 185, 129, 0.05)'
              }
            ]
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 6,
            shadowColor: 'rgba(16, 185, 129, 0.3)'
          }
        }
      }
    ]
  };

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="flex-1">
        <ReactECharts
          option={option}
          style={{ height: '240px', width: '100%' }}
        />
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="bg-green-50 rounded p-2 text-center border border-green-200">
          <div className="text-xs text-green-700 mb-1">รวม 30 วัน</div>
          <div className="text-sm font-medium text-green-800">{totalSubmissions}</div>
          <div className="text-xs text-green-600">องค์กร</div>
        </div>
        
        <div className="bg-green-50 rounded p-2 text-center border border-green-200">
          <div className="text-xs text-green-700 mb-1">เฉลี่ยต่อวัน</div>
          <div className="text-sm font-medium text-green-800">{avgPerDay}</div>
          <div className="text-xs text-green-600">องค์กร</div>
        </div>
        
        <div className="bg-green-50 rounded p-2 text-center border border-green-200">
          <div className="text-xs text-green-700 mb-1">สูงสุดต่อวัน</div>
          <div className="text-sm font-medium text-green-800">{maxDay.count}</div>
          <div className="text-xs text-green-600">องค์กร</div>
        </div>
        
        <div className="bg-green-50 rounded p-2 text-center border border-green-200">
          <div className="text-xs text-green-700 mb-1">7 วันล่าสุด</div>
          <div className="text-sm font-medium text-green-800">{recentWeek}</div>
          <div className="text-xs text-green-600">องค์กร</div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionTrendChart;