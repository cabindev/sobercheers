// app/dashboard/Buddhist2025/components/charts/healthImpactChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getHealthImpactChartData } from '../../actions/GetChartData';
import LoadingSkeleton from '../ui/DashboardLoading';

interface HealthImpactData {
  name: string;
  value: number;
}

const HealthImpactChart: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthImpactData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getHealthImpactChartData();
        if (result.success && result.data) {
          setHealthData(result.data);
          setTotalCount(result.data.reduce((sum, item) => sum + item.value, 0));
        }
      } catch (error) {
        console.error('Error fetching health impact data:', error);
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
        <span className="mt-4 text-gray-600">กำลังโหลดข้อมูลผลกระทบต่อสุขภาพ...</span>
      </div>
    );
  }

  if (!healthData.length) {
    return <div className="text-center text-red-500">ไม่พบข้อมูลผลกระทบต่อสุขภาพ</div>;
  }

  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return '0.0';
    return ((count / total) * 100).toFixed(1);
  };

  const option = {
    title: {

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
        name: 'ผลกระทบต่อสุขภาพ',
        type: 'pie',
        radius: ['30%', '70%'],
        center: ['50%', '45%'],
        data: healthData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: [
              '#22C55E', // เขียว - ดีขึ้นมาก
              '#84CC16', // เขียวอ่อน - ดีขึ้น
              '#EAB308', // เหลือง - เหมือนเดิม
              '#F97316', // ส้ม - แย่ลง
              '#EF4444', // แดง - แย่ลงมาก
              '#6B7280'  // เทา - ไม่แน่ใจ
            ][index % 6]
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        itemStyle: {
          borderRadius: 10,
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
      <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-red-50 rounded-lg border border-green-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-green-600">{totalCount.toLocaleString()}</div>
            <div className="text-xs text-gray-600">ผู้ตอบแบบสอบถาม</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600">{healthData.length}</div>
            <div className="text-xs text-gray-600">ระดับผลกระทบ</div>
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
        <h4 className="text-sm font-semibold text-gray-700 mb-3">สรุปผลกระทบต่อสุขภาพ</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {healthData.map((item, index) => {
const colors = ['#22C55E', '#84CC16', '#EAB308', '#F97316', '#EF4444', '#6B7280'];
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

     {/* Health Insight */}
     <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
       <h5 className="text-sm font-semibold text-green-800 mb-1">🏥 ข้อมูลเชิงลึก</h5>
       <div className="text-xs text-green-700">
         {(() => {
           const improved = healthData.find(item => 
             item.name.includes('ดีขึ้น') || 
             item.name.includes('ดีมาก') ||
             item.name.includes('ปรับปรุง')
           );
           const improvedPercentage = improved ? 
             calculatePercentage(improved.value, totalCount) : '0';
           
           return (
             <span>
               🌟 ผู้ที่สุขภาพดีขึ้น: {improvedPercentage}% 
               - การเข้าพรรษาส่งผลดีต่อสุขภาพกายและใจ
             </span>
           );
         })()}
       </div>
     </div>
   </div>
 );
};

export default HealthImpactChart;