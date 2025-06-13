// app/dashboard/Buddhist2025/components/charts/genderChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getGenderChartData } from '../../actions/GetChartData';

interface GenderData {
  name: string;
  value: number;
}

const GenderChart: React.FC = () => {
  const [genderData, setGenderData] = useState<GenderData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getGenderChartData();
        if (result.success && result.data) {
          setGenderData(result.data);
          setTotalCount(result.data.reduce((sum, item) => sum + item.value, 0));
        }
      } catch (error) {
        console.error('Error fetching gender data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
        <span className="ml-2 text-gray-600">กำลังโหลด...</span>
      </div>
    );
  }

  if (!genderData.length) {
    return <div className="text-center text-red-500">ไม่พบข้อมูลเพศ</div>;
  }

  const option = {
    title: {
      text: 'การแบ่งตามเพศ',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const percentage = ((params.value / totalCount) * 100).toFixed(1);
        return `${params.name}: ${params.value.toLocaleString()} คน (${percentage}%)`;
      }
    },
    series: [
      {
        name: 'เพศ',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: genderData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: ['#FF6B9D', '#4ECDC4', '#FFA07A'][index % 3]
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
          formatter: (params: any) => {
            const percentage = ((params.value / totalCount) * 100).toFixed(1);
            return `${params.name}\n${percentage}%`;
          },
          fontSize: 12,
          fontWeight: 'bold'
        }
      }
    ]
  };

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="flex-1">
        <ReactECharts
          option={option}
          style={{ height: '300px', width: '100%' }}
        />
      </div>
      
      {/* Summary */}
      <div className="mt-4 space-y-2">
        {genderData.map((item, index) => {
          const colors = ['#FF6B9D', '#4ECDC4', '#FFA07A'];
          const color = colors[index % colors.length];
          const percentage = ((item.value / totalCount) * 100).toFixed(1);
          
          return (
            <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{item.value.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GenderChart;