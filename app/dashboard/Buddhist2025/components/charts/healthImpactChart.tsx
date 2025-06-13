// app/dashboard/Buddhist2025/components/charts/healthImpactChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getHealthImpactChartData } from '../../actions/GetChartData';

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
      <div className="h-96 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-lg">
        {/* Loading Animation */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-green-400 rounded-full animate-spin opacity-60" style={{ animationDirection: 'reverse' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        
        <div className="flex space-x-1 mt-4">
          <div className="w-1 h-4 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1 h-4 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <span className="mt-4 text-green-600 font-medium">กำลังโหลดข้อมูลผลกระทบต่อสุขภาพ...</span>
      </div>
    );
  }

  if (!healthData.length) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🏥</div>
        <div className="text-center text-red-500 font-medium">ไม่พบข้อมูลผลกระทบต่อสุขภาพ</div>
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
      text: 'ผลกระทบต่อสุขภาพ',
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
            <div style="font-weight: bold; margin-bottom: 4px;">🏥 ${params.name}</div>
            <div>จำนวน: <span style="font-weight: bold;">${params.value.toLocaleString()} คน</span></div>
            <div>สัดส่วน: <span style="font-weight: bold; color: #059669;">${percentage}%</span></div>
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
              '#22C55E', // เขียวเข้ม - ดีขึ้นมาก
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
    <div className="bg-white h-full rounded-lg">
      {/* Header Stats */}
      <div className="mb-4 p-4 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-lg border border-green-100 shadow-sm">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <div className="text-xl font-bold text-green-600">{totalCount.toLocaleString()}</div>
            <div className="text-xs text-gray-600 font-medium">ผู้ตอบแบบสอบถาม</div>
          </div>
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <div className="text-xl font-bold text-blue-600">{healthData.length}</div>
            <div className="text-xs text-gray-600 font-medium">ระดับผลกระทบ</div>
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
          📊 สรุปผลกระทบต่อสุขภาพ
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {healthData.map((item, index) => {
            const colors = ['#22C55E', '#84CC16', '#EAB308', '#F97316', '#EF4444', '#6B7280'];
            const color = colors[index % colors.length];
            const percentage = calculatePercentage(item.value, totalCount);
            
            // กำหนด icon และสีตามประเภทผลกระทบ
            const getHealthIcon = (name: string) => {
              if (name.includes('ดีขึ้น') || name.includes('ดีมาก')) return '✅';
              if (name.includes('เหมือนเดิม')) return '⚪';
              if (name.includes('แย่ลง')) return '❌';
              return '❓';
            };
            
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
                    <span className="text-lg">{getHealthIcon(item.name)}</span>
                  </div>
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

      {/* Health Insights */}
      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <h5 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-1">
          🏥 ข้อมูลเชิงลึกด้านสุขภาพ
        </h5>
        <div className="text-xs text-green-700 space-y-1">
          {(() => {
            const improved = healthData.find(item => 
              item.name.includes('ดีขึ้น') || 
              item.name.includes('ดีมาก') ||
              item.name.includes('ปรับปรุง')
            );
            const worsened = healthData.find(item => 
              item.name.includes('แย่ลง') || 
              item.name.includes('เสื่อม')
            );
            const unchanged = healthData.find(item => 
              item.name.includes('เหมือนเดิม') || 
              item.name.includes('ไม่เปลี่ยน')
            );
            
            const improvedPercentage = improved ? calculatePercentage(improved.value, totalCount) : '0';
            const worsenedPercentage = worsened ? calculatePercentage(worsened.value, totalCount) : '0';
            const unchangedPercentage = unchanged ? calculatePercentage(unchanged.value, totalCount) : '0';
            
            return (
              <div className="space-y-1">
                <div>🌟 ผู้ที่สุขภาพดีขึ้น: <strong>{improvedPercentage}%</strong> - การเข้าพรรษาส่งผลดีต่อร่างกายและจิตใจ</div>
                <div>⚪ สุขภาพคงเดิม: <strong>{unchangedPercentage}%</strong> - ยังคงรักษาสุขภาพได้ดี</div>
                {parseFloat(worsenedPercentage) > 0 && (
                  <div>⚠️ ผู้ที่สุขภาพแย่ลง: <strong>{worsenedPercentage}%</strong> - ควรติดตามและให้คำปรึกษา</div>
                )}
                <div className="mt-2 p-2 bg-white rounded border-l-4 border-green-500">
                  <strong>💡 คำแนะนำ:</strong> ผลการศึกษาแสดงให้เห็นว่าการงดเหล้าช่วยปรับปรุงสุขภาพกายและใจได้อย่างมีนัยสำคัญ
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default HealthImpactChart;