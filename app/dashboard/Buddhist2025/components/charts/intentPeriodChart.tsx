// app/dashboard/Buddhist2025/components/charts/intentPeriodChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getIntentPeriodChartData } from '../../actions/GetChartData';
import LoadingSkeleton from '../ui/DashboardLoading';

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
      <div className="h-96 flex flex-col items-center justify-center">
        <LoadingSkeleton lines={5} className="w-full max-w-sm" />
        <span className="mt-4 text-gray-600">กำลังโหลดข้อมูลระยะเวลาตั้งใจ...</span>
      </div>
    );
  }

  if (!intentData.length) {
    return <div className="text-center text-red-500">ไม่พบข้อมูลระยะเวลาตั้งใจ</div>;
  }

  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return '0.0';
    return ((count / total) * 100).toFixed(1);
  };

  const option = {
    title: {
      text: 'ระยะเวลาตั้งใจเข้าพรรษา',
      left: 'left',
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
          <div>
            <strong>${params.name}</strong><br/>
            จำนวน: ${params.value.toLocaleString()} คน<br/>
            สัดส่วน: ${percentage}%
          </div>
        `;
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      type: 'scroll',
      textStyle: {
        fontSize: 10
      }
    },
    series: [
      {
        name: 'ระยะเวลาตั้งใจ',
        type: 'pie',
        radius: ['50%', '80%'],
        center: ['50%', '45%'],
        data: intentData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: [
              '#8B5CF6', // ม่วง
              '#06B6D4', // ฟ้า
              '#10B981', // เขียว
              '#F59E0B', // เหลือง
              '#EF4444', // แดง
              '#6B7280'  // เทา
            ][index % 6]
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 3
        },
        label: {
          show: true,
          formatter: (params: any) => {
            const percentage = calculatePercentage(params.value, totalCount);
            return `${percentage}%`;
          },
          fontSize: 12,
          fontWeight: 'bold'
        }
      }
    ]
  };

  return (
    <div className="bg-white h-full">
      {/* Header Stats */}
      <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-purple-600">{totalCount.toLocaleString()}</div>
            <div className="text-xs text-gray-600">ผู้ตอบแบบสอบถาม</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600">{intentData.length}</div>
            <div className="text-xs text-gray-600">ช่วงระยะเวลา</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
        />
      </div>

      {/* Data Summary */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">สรุปตามระยะเวลา</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {intentData.map((item, index) => {
            const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];
            const color = colors[index % colors.length];
            const percentage = calculatePercentage(item.value, totalCount);
            
            return (
              <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3 flex-1">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-gray-900">{item.value.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insight */}
      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <h5 className="text-sm font-semibold text-purple-800 mb-1">🎯 ข้อมูลเชิงลึก</h5>
        <div className="text-xs text-purple-700">
          {(() => {
            const longTerm = intentData.find(item => 
              item.name.includes('ตลอดชีวิต') || 
              item.name.includes('ถาวร') ||
              item.name.includes('1 ปี')
            );
            const longTermPercentage = longTerm ? 
              calculatePercentage(longTerm.value, totalCount) : '0';
            
            return (
              <span>
                🌟 ผู้ที่ตั้งใจระยะยาว: {longTermPercentage}% 
                - แสดงความมุ่งมั่นในการพัฒนาจิตใจ
              </span>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default IntentPeriodChart;