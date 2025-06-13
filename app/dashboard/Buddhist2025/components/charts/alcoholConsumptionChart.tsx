// app/dashboard/Buddhist2025/components/charts/alcoholConsumptionChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getAlcoholConsumptionChartData } from '../../actions/GetChartData';

interface AlcoholData {
  name: string;
  value: number;
}

const AlcoholConsumptionChart: React.FC = () => {
  const [alcoholData, setAlcoholData] = useState<AlcoholData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getAlcoholConsumptionChartData();
        if (result.success && result.data) {
          setAlcoholData(result.data);
          setTotalCount(result.data.reduce((sum, item) => sum + item.value, 0));
        }
      } catch (error) {
        console.error('Error fetching alcohol consumption data:', error);
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

  if (!alcoholData.length) {
    return <div className="text-center text-red-500">ไม่พบข้อมูลการบริโภคเหล้า</div>;
  }

  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return '0.0';
    return ((count / total) * 100).toFixed(1);
  };

  const option = {
    title: {
      text: 'ระดับการบริโภคเหล้า',
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
        name: 'ระดับการบริโภคเหล้า',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        data: alcoholData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: [
              '#EF4444', // แดง - ดื่มมาก
              '#F97316', // ส้ม - ดื่มปานกลาง  
              '#EAB308', // เหลือง - ดื่มน้อย
              '#10B981', // เขียว - ไม่ดื่ม/เลิกแล้ว
              '#6B7280'  // เทา - ไม่ระบุ
            ][index % 5]
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
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
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
      <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-green-50 rounded-lg border border-red-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-red-600">{totalCount.toLocaleString()}</div>
            <div className="text-xs text-gray-600">ผู้ตอบแบบสอบถาม</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-600">{alcoholData.length}</div>
            <div className="text-xs text-gray-600">ระดับการบริโภค</div>
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
        <h4 className="text-sm font-semibold text-gray-700 mb-3">สรุปตามระดับการบริโภค</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {alcoholData.map((item, index) => {
            const colors = ['#EF4444', '#F97316', '#EAB308', '#10B981', '#6B7280'];
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
        <h5 className="text-sm font-semibold text-green-800 mb-1">💡 ข้อมูลเชิงลึก</h5>
        <div className="text-xs text-green-700">
          {(() => {
            const nonDrinkers = alcoholData.find(item => 
              item.name.includes('ไม่ดื่ม') || 
              item.name.includes('เลิก') || 
              item.name.includes('ไม่เคย')
            );
            const nonDrinkerPercentage = nonDrinkers ? 
              calculatePercentage(nonDrinkers.value, totalCount) : '0';
            
            return (
              <span>
                🌱 ผู้ที่ไม่ดื่มเหล้าหรือเลิกแล้ว: {nonDrinkerPercentage}% 
                - เป็นแรงบันดาลใจให้กับการเข้าพรรษา
              </span>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default AlcoholConsumptionChart;