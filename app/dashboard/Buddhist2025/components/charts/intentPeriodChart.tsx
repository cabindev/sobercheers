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
      <div className="h-96 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-lg">
        {/* Loading Animation */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-purple-400 rounded-full animate-spin opacity-60" style={{ animationDirection: 'reverse' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        </div>
        
        <div className="flex space-x-1 mt-4">
          <div className="w-1 h-4 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1 h-4 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1 h-4 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <span className="mt-4 text-purple-600 font-medium">กำลังโหลดข้อมูลระยะเวลาตั้งใจ...</span>
      </div>
    );
  }

  if (!intentData.length) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🎯</div>
        <div className="text-center text-red-500 font-medium">ไม่พบข้อมูลระยะเวลาตั้งใจ</div>
        <div className="text-sm text-gray-500 mt-2">ลองรีเฟรชหน้าใหม่หรือติดต่อผู้ดูแลระบบ</div>
      </div>
    );
  }

  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return '0.0';
    return ((count / total) * 100).toFixed(1);
  };

  const option = {
    title: {
      text: 'ระยะเวลาตั้งใจเข้าพรรษา',
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
          <div style="padding: 8px; border-radius: 6px;">
            <div style="font-weight: bold; margin-bottom: 4px;">🎯 ${params.name}</div>
            <div>จำนวน: <span style="font-weight: bold;">${params.value.toLocaleString()} คน</span></div>
            <div>สัดส่วน: <span style="font-weight: bold; color: #7C3AED;">${percentage}%</span></div>
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
              '#8B5CF6', // ม่วง - ระยะยาว
              '#06B6D4', // ฟ้า - ระยะกลาง
              '#10B981', // เขียว - ระยะสั้น
              '#F59E0B', // เหลือง - ทดลอง
              '#EF4444', // แดง - ไม่แน่นอน
              '#6B7280'  // เทา - อื่นๆ
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
        },
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  };

  return (
    <div className="bg-white h-full rounded-lg">
      {/* Header Stats */}
      <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-lg border border-purple-100 shadow-sm">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <div className="text-xl font-bold text-purple-600">{totalCount.toLocaleString()}</div>
            <div className="text-xs text-gray-600 font-medium">ผู้ตอบแบบสอบถาม</div>
          </div>
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <div className="text-xl font-bold text-blue-600">{intentData.length}</div>
            <div className="text-xs text-gray-600 font-medium">ช่วงระยะเวลา</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 p-2">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      {/* Data Summary */}
      <div className="mt-4 px-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          📊 สรุปตามระยะเวลา
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {intentData.map((item, index) => {
            const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];
            const color = colors[index % colors.length];
            const percentage = calculatePercentage(item.value, totalCount);
            
            // กำหนด icon และระดับความมุ่งมั่นตามระยะเวลา
            const getCommitmentLevel = (name: string) => {
              if (name.includes('ตลอดชีวิต') || name.includes('ถาวร')) return { icon: '🌟', level: 'สูงมาก', color: '#8B5CF6' };
              if (name.includes('1 ปี') || name.includes('ปี')) return { icon: '⭐', level: 'สูง', color: '#06B6D4' };
              if (name.includes('6 เดือน')) return { icon: '🎯', level: 'ปานกลาง', color: '#10B981' };
              if (name.includes('3 เดือน')) return { icon: '📅', level: 'เริ่มต้น', color: '#F59E0B' };
              return { icon: '❓', level: 'ไม่แน่นอน', color: '#6B7280' };
            };
            
            const commitment = getCommitmentLevel(item.name);
            
            return (
              <div 
                key={item.name} 
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm flex-shrink-0" 
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="text-lg">{commitment.icon}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900 block">{item.name}</span>
                    <span 
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${commitment.color}20`, 
                        color: commitment.color 
                      }}
                    >
                      {commitment.level}
                    </span>
                  </div>
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

      {/* Insights */}
      <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
        <h5 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-1">
          🎯 ข้อมูลเชิงลึกด้านความมุ่งมั่น
        </h5>
        <div className="text-xs text-purple-700 space-y-1">
          {(() => {
            const longTerm = intentData.find(item => 
              item.name.includes('ตลอดชีวิต') || 
              item.name.includes('ถาวร') ||
              item.name.includes('1 ปี')
            );
            const mediumTerm = intentData.find(item => 
              item.name.includes('6 เดือน')
            );
            const shortTerm = intentData.find(item => 
              item.name.includes('3 เดือน')
            );
            
            const longTermPercentage = longTerm ? calculatePercentage(longTerm.value, totalCount) : '0';
            const mediumTermPercentage = mediumTerm ? calculatePercentage(mediumTerm.value, totalCount) : '0';
            const shortTermPercentage = shortTerm ? calculatePercentage(shortTerm.value, totalCount) : '0';
            
            return (
              <div className="space-y-1">
                <div>🌟 ความมุ่งมั่นระยะยาว: <strong>{longTermPercentage}%</strong> - แสดงความตั้งใจจริงในการเปลี่ยนแปลง</div>
                <div>🎯 ความมุ่งมั่นระยะกลาง: <strong>{mediumTermPercentage}%</strong> - มีแผนชัดเจนในการลดการดื่ม</div>
                <div>📅 เริ่มต้นระยะสั้น: <strong>{shortTermPercentage}%</strong> - ขั้นตอนแรกของการเปลี่ยนแปลง</div>
                <div className="mt-2 p-2 bg-white rounded border-l-4 border-purple-500">
                  <strong>💡 สรุป:</strong> ระยะเวลาที่ตั้งใจแสดงถึงระดับความมุ่งมั่นและโอกาสความสำเร็จในการงดเหล้า
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default IntentPeriodChart;