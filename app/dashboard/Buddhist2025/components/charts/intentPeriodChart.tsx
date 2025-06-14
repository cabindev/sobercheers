// app/dashboard/Buddhist2025/components/charts/intentPeriodChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getIntentPeriodChartData } from '../../actions/GetChartData';

interface IntentPeriodData {
  name: string;
  value: number;
}

const IntentPeriodChart: React.FC = () => {
  const [intentData, setIntentData] = useState<IntentPeriodData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getIntentPeriodChartData();
        if (result.success && result.data) {
          setIntentData(result.data);
          setTotalCount(result.data.reduce((sum, item) => sum + item.value, 0));
        }
      } catch (error) {
        console.error('Error fetching intent period data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border border-orange-200 border-t-orange-500"></div>
        <span className="ml-2 text-xs text-gray-500">กำลังโหลด...</span>
      </div>
    );
  }

  if (!intentData.length) {
    return <div className="text-center text-xs text-gray-500 py-8">ไม่พบข้อมูลระยะเวลาตั้งใจ</div>;
  }

  const option = {
    title: {
      text: 'ระยะเวลาตั้งใจเข้าพรรษา',
      left: 'center',
      textStyle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4B5563'
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'white',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      textStyle: {
        fontSize: 11,
        color: '#374151'
      },
      formatter: (params: any) => {
        const percentage = ((params.value / totalCount) * 100).toFixed(1);
        return `${params.name}: ${params.value.toLocaleString()} คน (${percentage}%)`;
      }
    },
    series: [
      {
        name: 'ระยะเวลาตั้งใจ',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '55%'],
        data: intentData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: ['#F59E0B', '#FCD34D', '#FEF3C7', '#F97316', '#FBBF24'][index % 5]
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 8,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.1)'
          }
        },
        label: {
          show: true,
          formatter: (params: any) => {
            const percentage = ((params.value / totalCount) * 100).toFixed(1);
            return `${params.name}\n${percentage}%`;
          },
          fontSize: 10,
          fontWeight: '400',
          color: '#4B5563'
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
      
      <div className="mt-3 space-y-1.5">
        {intentData.map((item, index) => {
          const colors = ['#F59E0B', '#FCD34D', '#FEF3C7', '#F97316', '#FBBF24'];
          const bgColors = ['bg-orange-50', 'bg-amber-50', 'bg-yellow-50', 'bg-orange-50', 'bg-amber-50'];
          const textColors = ['text-orange-700', 'text-amber-700', 'text-yellow-700', 'text-orange-700', 'text-amber-700'];
          
          const color = colors[index % colors.length];
          const bgColor = bgColors[index % bgColors.length];
          const textColor = textColors[index % textColors.length];
          const percentage = ((item.value / totalCount) * 100).toFixed(1);
          
          return (
            <div key={item.name} className={`flex items-center justify-between py-1.5 px-2 rounded ${bgColor} hover:opacity-80 transition-opacity`}>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: color }}
                ></div>
                <span className={`text-xs font-normal ${textColor}`}>{item.name}</span>
              </div>
              <div className="text-right">
                <div className={`text-xs font-medium ${textColor}`}>{item.value.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntentPeriodChart;