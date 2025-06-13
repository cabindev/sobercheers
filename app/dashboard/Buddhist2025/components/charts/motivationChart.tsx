// app/dashboard/Buddhist2025/components/charts/motivationChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getMotivationChartData } from '../../actions/GetChartData';

interface MotivationData {
  name: string;
  value: number;
}

const MotivationChart: React.FC = () => {
  const [motivationData, setMotivationData] = useState<MotivationData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getMotivationChartData();
        if (result.success && result.data) {
          setMotivationData(result.data);
          setTotalCount(result.data.reduce((sum, item) => sum + item.value, 0));
        }
      } catch (error) {
        console.error('Error fetching motivation data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return '0.0';
    return ((count / total) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
        <span className="ml-2 text-gray-600">กำลังโหลด...</span>
      </div>
    );
  }

  if (!motivationData.length) {
    return <div className="text-center text-red-500">ไม่พบข้อมูลแรงจูงใจ</div>;
  }

  const chartData = motivationData.map((item, index) => ({
    ...item,
    itemStyle: {
      color: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
        '#98D8C8', '#C7B198', '#FFB347', '#87CEEB',
        '#DDA0DD', '#F0E68C', '#FA8072', '#20B2AA'
      ][index % 12]
    }
  }));

  const option = {
    title: {
      text: 'แรงจูงใจในการเข้าร่วม',
      left: 'center',
      top: 20,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const percentage = calculatePercentage(params.value, totalCount);
        return `
          <div style="max-width: 250px;">
            <strong>${params.name}</strong><br/>
            จำนวน: ${params.value.toLocaleString()} ครั้ง<br/>
            สัดส่วน: ${percentage}%
          </div>
        `;
      }
    },
    legend: {
      show: false
    },
    series: [
      {
        name: 'แรงจูงใจ',
        type: 'pie',
        radius: ['35%', '65%'],
        center: ['50%', '55%'],
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: (params: any) => {
            const percentage = calculatePercentage(params.value, totalCount);
            const shortName = params.name.length > 15 ? 
              `${params.name.substring(0, 12)}...` : params.name;
            return `${shortName}\n${percentage}%`;
          },
          fontSize: 11,
          fontWeight: 'normal',
          color: '#374151',
          distanceToLabelLine: 10
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 20,
          smooth: 0.2,
          lineStyle: {
            color: '#9CA3AF',
            width: 1
          }
        },
        avoidLabelOverlap: true
      }
    ]
  };

  return (
    <div className="bg-white h-full">
      {/* Header Stats */}
      <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{motivationData.length}</div>
          <div className="text-sm text-gray-600">ประเภทแรงจูงใจ</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
        />
      </div>

      {/* Legend Table */}
      <div className="mt-4 max-h-60 overflow-y-auto">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">รายละเอียดแรงจูงใจ</h4>
        <div className="space-y-1">
          {motivationData.map((item, index) => {
            const colors = [
              '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
              '#98D8C8', '#C7B198', '#FFB347', '#87CEEB',
              '#DDA0DD', '#F0E68C', '#FA8072', '#20B2AA'
            ];
            const color = colors[index % colors.length];
            const percentage = calculatePercentage(item.value, totalCount);
            
            return (
              <div key={item.name} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 text-xs">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="font-medium text-gray-900 truncate" title={item.name}>
                    {item.name}
                  </span>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="font-semibold text-gray-900">{item.value}</div>
                  <div className="text-gray-500">({percentage}%)</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MotivationChart;