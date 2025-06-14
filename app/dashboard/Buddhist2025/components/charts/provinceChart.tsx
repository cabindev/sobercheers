// app/dashboard/Buddhist2025/components/charts/provinceChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getTop10ProvincesChartData } from '../../actions/GetChartData';

interface ProvinceData {
  name: string;
  value: number;
}

const ProvinceChart: React.FC = () => {
  const [provinceData, setProvinceData] = useState<ProvinceData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getTop10ProvincesChartData();
        if (result.success && result.data) {
          const sortedData = result.data.sort((a, b) => b.value - a.value);
          setProvinceData(sortedData);
          setTotalCount(sortedData.reduce((sum, item) => sum + item.value, 0));
        }
      } catch (error) {
        console.error('Error fetching province data:', error);
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

  if (!provinceData.length) {
    return <div className="text-center text-xs text-gray-500 py-8">ไม่พบข้อมูลจังหวัด</div>;
  }

  const chartData = provinceData.slice().reverse();
  const yAxisLabels = chartData.map((item, index) => {
    const rank = provinceData.length - index;
    return `${rank}. ${item.name}`;
  });

  const option = {
    title: {
      text: 'อันดับ 10 จังหวัดที่มีผู้เข้าร่วมมากที่สุด',
      left: 'center',
      textStyle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4B5563'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'white',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      textStyle: {
        fontSize: 11,
        color: '#374151'
      },
      formatter: (params: any) => {
        const data = params[0];
        const percentage = totalCount > 0 ? ((data.value / totalCount) * 100).toFixed(1) : '0';
        const originalIndex = chartData.length - data.dataIndex - 1;
        const rank = originalIndex + 1;
        const provinceName = provinceData[originalIndex].name;
        
        return `อันดับ ${rank}: ${provinceName}<br/>${data.value.toLocaleString()} คน (${percentage}%)`;
      }
    },
    grid: {
      left: '25%',
      right: '10%',
      top: '15%',
      bottom: '5%',
      containLabel: false
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 9,
        color: '#6B7280'
      },
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#F3F4F6',
          type: 'solid'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: yAxisLabels,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        fontSize: 9,
        color: '#374151',
        margin: 10,
        formatter: (value: string) => {
          const parts = value.split('. ');
          if (parts.length > 1) {
            const rank = parts[0];
            const province = parts[1];
            return province.length > 12 ? `${rank}. ${province.substring(0, 10)}...` : value;
          }
          return value;
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: chartData.map(item => item.value),
        barWidth: '60%',
        itemStyle: {
          color: (params: any) => {
            const rank = chartData.length - params.dataIndex;
            if (rank === 1) return '#F59E0B'; // Gold - Orange
            if (rank === 2) return '#FCD34D'; // Silver - Amber
            if (rank === 3) return '#FEF3C7'; // Bronze - Yellow
            return '#F97316'; // Default orange
          },
          borderRadius: [0, 3, 3, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 6,
            shadowColor: 'rgba(0, 0, 0, 0.1)'
          }
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c}',
          fontSize: 9,
          color: '#374151',
          fontWeight: '500'
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
        {provinceData.slice(0, 5).map((item, index) => {
          const colors = ['#F59E0B', '#FCD34D', '#FEF3C7', '#F97316', '#FBBF24'];
          const bgColors = ['bg-orange-50', 'bg-amber-50', 'bg-yellow-50', 'bg-orange-50', 'bg-amber-50'];
          const textColors = ['text-orange-700', 'text-amber-700', 'text-yellow-700', 'text-orange-700', 'text-amber-700'];
          
          const color = colors[index % colors.length];
          const bgColor = bgColors[index % bgColors.length];
          const textColor = textColors[index % textColors.length];
          const percentage = ((item.value / totalCount) * 100).toFixed(1);
          const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
          
          return (
            <div key={item.name} className={`flex items-center justify-between py-1.5 px-2 rounded ${bgColor} hover:opacity-80 transition-opacity`}>
              <div className="flex items-center space-x-2">
                <div className="text-xs">{emoji}</div>
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

export default ProvinceChart;