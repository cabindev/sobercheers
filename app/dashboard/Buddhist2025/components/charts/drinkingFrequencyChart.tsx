// app/dashboard/Buddhist2025/components/charts/drinkingFrequencyChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getDrinkingFrequencyChartData } from '../../actions/GetChartData';

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
          const orderedData = [
            'ทุกวัน (7 วัน/สัปดาห์)',
            'เกือบทุกวัน (3-5 วัน/สัปดาห์)',
            'ทุกสัปดาห์ (1-2 วัน/สัปดาห์)',
            'ทุกเดือน (1-3 วัน/เดือน)',
            'นาน ๆ ครั้ง (8-11 วัน/ปี)'
          ];

          const sortedData = orderedData
            .map(name => result.data?.find(item => item.name === name))
            .filter(item => item && item.value > 0) as DrinkingFrequencyData[];

          setFrequencyData(sortedData);
          setTotalCount(sortedData.reduce((sum, item) => sum + item.value, 0));
        }
      } catch (error) {
        console.error('Error fetching drinking frequency chart data:', error);
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

  if (!frequencyData.length) {
    return <div className="text-center text-xs text-gray-500 py-8">ไม่พบข้อมูลความถี่การดื่ม</div>;
  }

  const getDisplayName = (fullName: string) => {
    if (fullName === 'ทุกวัน (7 วัน/สัปดาห์)') return 'ทุกวัน';
    if (fullName === 'เกือบทุกวัน (3-5 วัน/สัปดาห์)') return 'เกือบทุกวัน';
    if (fullName === 'ทุกสัปดาห์ (1-2 วัน/สัปดาห์)') return 'ทุกสัปดาห์';
    if (fullName === 'ทุกเดือน (1-3 วัน/เดือน)') return 'ทุกเดือน';
    if (fullName === 'นาน ๆ ครั้ง (8-11 วัน/ปี)') return 'นาน ๆ ครั้ง';
    return fullName;
  };

  const chartData = frequencyData.map(item => ({
    name: getDisplayName(item.name),
    fullName: item.name,
    value: item.value
  }));

  const option = {
    title: {
      text: 'ความถี่การดื่มแอลกอฮอล์',
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
        const fullName = chartData.find(item => item.name === params.name)?.fullName || params.name;
        const percentage = ((params.value / totalCount) * 100).toFixed(1);
        return `${fullName}: ${params.value.toLocaleString()} คน (${percentage}%)`;
      }
    },
    series: [
      {
        name: 'ความถี่การดื่ม',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '55%'],
        data: chartData.map((item, index) => ({
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
        {frequencyData.map((item, index) => {
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
                <span className={`text-xs font-normal ${textColor}`}>{getDisplayName(item.name)}</span>
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

export default DrinkingFrequencyChart;