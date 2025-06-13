// app/dashboard/Buddhist2025/components/charts/drinkingFrequencyChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getDrinkingFrequencyChartData } from '../../actions/GetChartData';
import LoadingSkeleton from '../ui/DashboardLoading';

interface DrinkingFrequencyData {
  name: string;
  value: number;
}

const DrinkingFrequencyChart: React.FC = () => {
  const [frequencyData, setFrequencyData] = useState<DrinkingFrequencyData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getDrinkingFrequencyChartData();
        if (result.success && result.data) {
          setFrequencyData(result.data);
          setTotalCount(result.data.reduce((sum, item) => sum + item.value, 0));
        }
      } catch (error) {
        console.error('Error fetching drinking frequency data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <LoadingSkeleton lines={4} className="w-full max-w-sm" />
        <span className="mt-4 text-gray-600">กำลังโหลดข้อมูลความถี่การดื่ม...</span>
      </div>
    );
  }

  if (!frequencyData.length) {
    return <div className="text-center text-red-500">ไม่พบข้อมูลความถี่การดื่ม</div>;
  }

  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return '0.0';
    return ((count / total) * 100).toFixed(1);
  };

  const option = {
    title: {
      text: 'ความถี่การดื่มแอลกอฮอล์',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const data = params[0];
        const percentage = calculatePercentage(data.value, totalCount);
        return `
          <div>
            <strong>${data.name}</strong><br/>
            จำนวน: ${data.value.toLocaleString()} คน<br/>
            สัดส่วน: ${percentage}%
          </div>
        `;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: frequencyData.map(item => item.name),
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        fontSize: 11,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} คน'
      }
    },
    series: [
      {
        name: 'จำนวนคน',
        type: 'bar',
        data: frequencyData.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: ['#DC2626', '#EA580C', '#D97706', '#CA8A04', '#65A30D', '#16A34A'][index % 6]
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c} คน',
          fontSize: 10
        }
      }
    ]
  };

  return (
    <div className="bg-white h-full">
      {/* Header Stats */}
      <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-red-600">{totalCount.toLocaleString()}</div>
            <div className="text-xs text-gray-600">ผู้ตอบแบบสอบถาม</div>
          </div>
          <div>
            <div className="text-xl font-bold text-orange-600">{frequencyData.length}</div>
            <div className="text-xs text-gray-600">ระดับความถี่</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
        />
      </div>

      {/* Summary Table */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">สรุปข้อมูลความถี่การดื่ม</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {frequencyData.map((item, index) => {
            const colors = ['#DC2626', '#EA580C', '#D97706', '#CA8A04', '#65A30D', '#16A34A'];
            const color = colors[index % colors.length];
            const percentage = calculatePercentage(item.value, totalCount);
            
            return (
              <div key={item.name} className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                </div>
                <div className="text-lg font-bold text-gray-900">{item.value.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{percentage}% ของทั้งหมด</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DrinkingFrequencyChart;