// DrinkingFrequencyChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';

interface FrequencyData {
  [key: string]: number;
}

const DrinkingFrequencyChart: React.FC = () => {
  const [frequencyData, setFrequencyData] = useState<FrequencyData | null>(null);
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [totalResponded, setTotalResponded] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/soberCheersCharts');
        const { drinkingFrequency, totalCount } = response.data;
        const newData: FrequencyData = { ...drinkingFrequency };
        
        if (newData['Unknown']) {
          newData['เลิกดื่มมาแล้วมากกว่า 3 ปี หรือ ไม่เคยดื่มเลยตลอดชีวิต'] = newData['Unknown'];
          delete newData['Unknown'];
        }
        
        setFrequencyData(newData);
        setTotalRegistered(totalCount);
        setTotalResponded(Object.values(newData).reduce((sum, count) => sum + (count || 0), 0));
      } catch (error) {
        console.error('Error fetching frequency data:', error);
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500"></div>
        <span className="ml-2 text-gray-600">กำลังโหลด...</span>
      </div>
    );
  }

  if (!frequencyData) {
    return <div className="text-center text-red-500">ไม่สามารถโหลดข้อมูลได้</div>;
  }

  // Prepare data for ECharts with shorter labels
  const chartData = Object.entries(frequencyData).map(([name, value]) => {
    // สร้าง label สั้นๆ สำหรับกราฟ
    const shortLabel = name.length > 25 ? `${name.substring(0, 22)}...` : name;
    
    return {
      name: shortLabel,
      fullName: name, // เก็บชื่อเต็มไว้สำหรับ tooltip
      value,
      percentage: calculatePercentage(value, totalResponded)
    };
  });

  const option = {
    title: {
      text: 'ความถี่ในการดื่ม',
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
        const respondedPercentage = calculatePercentage(params.value, totalResponded);
        const totalPercentage = calculatePercentage(params.value, totalRegistered);
        const fullName = chartData.find(item => item.name === params.name)?.fullName || params.name;
        
        return `
          <div style="max-width: 250px;">
            <strong>${fullName}</strong><br/>
            จำนวน: ${params.value.toLocaleString()} คน<br/>
            ผู้ตอบ: ${respondedPercentage}%<br/>
            ทั้งหมด: ${totalPercentage}%
          </div>
        `;
      }
    },
    legend: {
      show: false // ปิด legend เพื่อหลีกเลี่ยงการทับซ้อน
    },
    series: [
      {
        name: 'ความถี่ในการดื่ม',
        type: 'pie',
        radius: ['35%', '65%'],
        center: ['50%', '55%'],
        data: chartData.map(item => ({
          name: item.name,
          value: item.value
        })),
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
            const percentage = ((params.value / totalResponded) * 100).toFixed(1);
            return `${params.name}\n${percentage}%`;
          },
          fontSize: 11,
          fontWeight: 'normal',
          color: '#374151',
          distanceToLabelLine: 10,
          alignTo: 'edge',
          margin: 20
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
        avoidLabelOverlap: true,
        labelLayout: {
          hideOverlap: true
        }
      }
    ],
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#C7B198', '#FFB347', '#87CEEB']
  };

  return (
    <div className="bg-white">
      {/* Header Stats */}
      <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
        <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">📊 สถิติความถี่ในการดื่ม</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-3 rounded-lg border border-amber-100">
            <div className="text-2xl font-bold text-amber-600">{totalRegistered.toLocaleString()}</div>
            <div className="text-sm text-gray-600">ผู้ลงทะเบียนทั้งหมด</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-amber-100">
            <div className="text-2xl font-bold text-blue-600">{totalResponded.toLocaleString()}</div>
            <div className="text-sm text-gray-600">ตอบแบบสอบถาม</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-amber-100">
            <div className="text-2xl font-bold text-green-600">{calculatePercentage(totalResponded, totalRegistered)}%</div>
            <div className="text-sm text-gray-600">อัตราการตอบ</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart - ขยายขนาดให้ใหญ่ขึ้น */}
        <div className="xl:col-span-2">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="h-96">
              <ReactECharts
                option={option}
                style={{ height: '100%', width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Data Table & Legend */}
        <div className="xl:col-span-1 space-y-4">
          {/* Custom Legend */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">รายละเอียดข้อมูล</h4>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {chartData.map((item, index) => {
                const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#C7B198', '#FFB347', '#87CEEB'];
                const color = colors[index % colors.length];
                const respondedPercentage = calculatePercentage(item.value, totalResponded);
                
                return (
                  <div key={item.fullName} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white transition-colors">
                    <div 
                      className="w-4 h-4 rounded-full mt-1 flex-shrink-0" 
                      style={{ backgroundColor: color }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 break-words leading-tight">
                        {item.fullName}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {item.value.toLocaleString()} คน ({respondedPercentage}%)
                      </div>
                      {/* Progress bar */}
                      <div className="mt-1 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${respondedPercentage}%`,
                            backgroundColor: color
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">สรุปสถิติ</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ประเภทความถี่:</span>
                <span className="font-medium">{chartData.length} ประเภท</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ค่าเฉลี่ย/ประเภท:</span>
                <span className="font-medium">
                  {Math.round(totalResponded / chartData.length).toLocaleString()} คน
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ความถี่สูงสุด:</span>
                <span className="font-medium">
                  {chartData.reduce((max, item) => item.value > max.value ? item : max, chartData[0])?.value.toLocaleString() || 0} คน
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrinkingFrequencyChart;