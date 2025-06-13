import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import { FaChild, FaHeartbeat, FaPray, FaUsers, FaHeart, FaMoneyBillWave, FaStar } from 'react-icons/fa';

interface MotivationData {
  label: string;
  count: number;
  percentage: number;
  icon: JSX.Element;
}

const motivationIcons = {
  'เพื่อลูกและครอบครัว': <FaChild />,
  'เพื่อสุขภาพของตนเอง': <FaHeartbeat />,
  'ได้บุญ/รักษาศีล': <FaPray />,
  'ผู้นำชุมชนชักชวน': <FaUsers />,
  'คนรักและเพื่อนชวน': <FaHeart />,
  'ประหยัดเงิน': <FaMoneyBillWave />,
  'เพื่อเป็นแบบอย่างที่ดีให้กับคนอื่น': <FaStar />,
};

const MotivationChart: React.FC = () => {
  const [motivationsData, setMotivationsData] = useState<MotivationData[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/soberCheersCharts/motivations');
        const { motivationCounts, totalResponses } = response.data;

        const processedData = Object.entries(motivationCounts)
          .map(([key, value]) => ({
            label: key,
            count: value as number,
            percentage: ((value as number) / totalResponses) * 100,
            icon: motivationIcons[key as keyof typeof motivationIcons],
          }))
          .sort((a, b) => b.count - a.count);

        setMotivationsData(processedData);
        setTotalResponses(totalResponses);
      } catch (error) {
        console.error('Error fetching motivation data:', error);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // สร้าง short labels สำหรับกราฟ
  const createShortLabel = (label: string) => {
    const shortLabels: { [key: string]: string } = {
      'เพื่อลูกและครอบครัว': 'ลูกและครอบครัว',
      'เพื่อสุขภาพของตนเอง': 'สุขภาพ',
      'ได้บุญ/รักษาศีล': 'ได้บุญ/รักษาศีล',
      'ผู้นำชุมชนชักชวน': 'ผู้นำชุมชน',
      'คนรักและเพื่อนชวน': 'คนรักและเพื่อน',
      'ประหยัดเงิน': 'ประหยัดเงิน',
      'เพื่อเป็นแบบอย่างที่ดีให้กับคนอื่น': 'เป็นแบบอย่าง'
    };
    return shortLabels[label] || label;
  };

  const option = {
    title: {
      text: 'แรงจูงใจในการงดดื่ม',
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
        const fullItem = motivationsData.find(item => createShortLabel(item.label) === params.name);
        const fullLabel = fullItem ? fullItem.label : params.name;
        const percentage = ((params.value / totalResponses) * 100).toFixed(1);
        return `
          <div style="max-width: 200px;">
            <strong>${fullLabel}</strong><br/>
            จำนวน: ${params.value.toLocaleString()} คน<br/>
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
        radius: ['30%', '70%'],
        center: ['50%', '55%'],
        data: motivationsData.map(item => ({
          name: createShortLabel(item.label),
          value: item.count
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
            const percentage = ((params.value / totalResponses) * 100).toFixed(1);
            return `${params.name}\n${percentage}%`;
          },
          fontSize: 11,
          fontWeight: 'normal',
          color: '#374151',
          distanceToLabelLine: 8,
          alignTo: 'edge'
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 15,
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
    color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E91E63', '#795548']
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500 mx-auto mb-2"></div>
          <span className="text-gray-600">กำลังโหลด...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Header Stats */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-2">💡 แรงจูงใจในการงดเหล้า</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg border border-purple-100">
              <div className="text-2xl font-bold text-purple-600">{totalResponses.toLocaleString()}</div>
              <div className="text-sm text-gray-600">ผู้ตอบแบบสอบถาม</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-purple-100">
              <div className="text-2xl font-bold text-blue-600">{motivationsData.length}</div>
              <div className="text-sm text-gray-600">ประเภทแรงจูงใจ</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-purple-100">
              <div className="text-2xl font-bold text-green-600">
                {motivationsData.length > 0 ? motivationsData[0].count.toLocaleString() : 0}
              </div>
              <div className="text-sm text-gray-600">แรงจูงใจสูงสุด</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Chart - ใช้พื้นที่ 3 columns */}
        <div className="xl:col-span-3">
          <div className="bg-gray-50 rounded-lg p-4 h-96">
            <ReactECharts
              option={option}
              style={{ height: '100%', width: '100%' }}
            />
          </div>
        </div>

        {/* Legend with icons - ใช้พื้นที่ 2 columns */}
        <div className="xl:col-span-2">
          <div className="bg-gray-50 rounded-lg p-4 h-96">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">รายละเอียดแรงจูงใจ</h4>
            <div className="space-y-3 overflow-y-auto h-80">
              {motivationsData.map((item, index) => {
                const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E91E63', '#795548'];
                const color = colors[index % colors.length];
                
                return (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-l-4" style={{ borderLeftColor: color }}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: color }}>
                          {item.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-gray-900 mb-1 leading-tight">
                          {item.label}
                        </h5>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-gray-900">
                            {item.count.toLocaleString()} คน
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            {item.percentage.toFixed(1)}%
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${item.percentage}%`,
                              backgroundColor: color
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800 text-center">
          📝 <strong>หมายเหตุ:</strong> ผู้ลงทะเบียนสามารถเลือกแรงจูงใจได้มากกว่าหนึ่งข้อ
        </p>
      </div>
    </div>
  );
};

export default MotivationChart;