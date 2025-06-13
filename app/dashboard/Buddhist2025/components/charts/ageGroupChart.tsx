// app/dashboard/Buddhist2025/components/charts/ageGroupChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getAgeGroupChartData } from '../../actions/GetChartData';

interface AgeGroupData {
  name: string;
  value: number;
}

const AgeGroupChart: React.FC = () => {
  const [ageGroupData, setAgeGroupData] = useState<AgeGroupData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getAgeGroupChartData();
        if (result.success && result.data) {
          setAgeGroupData(result.data);
          setTotalCount(result.data.reduce((sum, item) => sum + item.value, 0));
        }
      } catch (error) {
        console.error('Error fetching age group data:', error);
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

  if (!ageGroupData.length) {
    return <div className="text-center text-red-500">ไม่พบข้อมูลกลุ่มอายุ</div>;
  }

  const option = {
    title: {
      text: 'การแบ่งตามกลุ่มอายุ',
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
        const percentage = ((data.value / totalCount) * 100).toFixed(1);
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
      data: ageGroupData.map(item => item.name),
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        fontSize: 11,
        rotate: 45
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
        data: ageGroupData.map((item, index) => ({
          value: item.value,
          itemStyle: {
            // 🔥 ใช้สีธรรมดาแทน LinearGradient
            color: ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#1FB3D3', '#5F27CD'][index % 6]
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
    ],
    color: ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#1FB3D3', '#5F27CD']
  };

  return (
    <div className="bg-white h-full">
      {/* Header Stats */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-blue-600">{totalCount.toLocaleString()}</div>
            <div className="text-xs text-gray-600">ผู้เข้าร่วมทั้งหมด</div>
          </div>
          <div>
            <div className="text-xl font-bold text-purple-600">{ageGroupData.length}</div>
            <div className="text-xs text-gray-600">กลุ่มอายุ</div>
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
        <h4 className="text-sm font-semibold text-gray-700 mb-2">สรุปข้อมูลตามกลุ่มอายุ</h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {ageGroupData.map((item, index) => {
            const colors = ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#1FB3D3', '#5F27CD'];
            const color = colors[index % colors.length];
            const percentage = ((item.value / totalCount) * 100).toFixed(1);
            
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

export default AgeGroupChart;