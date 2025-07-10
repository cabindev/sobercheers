// app/dashboard/organization/components/charts/ContactStatsChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getContactStatsChartData } from '../../actions/GetChartData';

interface ContactStatsData {
  phoneNumberStats: Array<{ name: string; value: number }>;
  completenessStats: Array<{ name: string; value: number }>;
}

const ContactStatsChart: React.FC = () => {
  const [contactData, setContactData] = useState<ContactStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getContactStatsChartData();
        if (result.success && result.data) {
          setContactData(result.data);
        }
      } catch (error) {
        console.error('Error fetching contact stats data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border border-green-200 border-t-green-500"></div>
        <span className="ml-2 text-xs text-gray-500">กำลังโหลด...</span>
      </div>
    );
  }

  if (!contactData) {
    return <div className="text-center text-xs text-gray-500 py-8">ไม่พบข้อมูลสถิติติดต่อ</div>;
  }

  const phoneTotal = contactData.phoneNumberStats.reduce((sum, item) => sum + item.value, 0);
  const completenessTotal = contactData.completenessStats.reduce((sum, item) => sum + item.value, 0);

  const option = {
    title: {
      text: 'สถิติข้อมูลติดต่อ',
      left: 'center',
      textStyle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4B5563'
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'white',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      textStyle: {
        fontSize: 11,
        color: '#374151'
      },
      formatter: (params: any) => {
        const percentage = ((params.value / (params.seriesName === 'เบอร์โทรศัพท์' ? phoneTotal : completenessTotal)) * 100).toFixed(1);
        return `${params.name}: ${params.value.toLocaleString()} องค์กร (${percentage}%)`;
      }
    },
    legend: {
      bottom: '0%',
      textStyle: {
        fontSize: 10,
        color: '#4B5563'
      }
    },
    series: [
      {
        name: 'เบอร์โทรศัพท์',
        type: 'pie',
        radius: [0, '35%'],
        center: ['25%', '45%'],
        data: contactData.phoneNumberStats.map((item, index) => ({
          ...item,
          itemStyle: {
            color: item.name.includes('มี') ? '#10B981' : '#EF4444'
          }
        })),
        label: {
          show: true,
          formatter: (params: any) => {
            const percentage = ((params.value / phoneTotal) * 100).toFixed(1);
            return `${params.name}\n${percentage}%`;
          },
          fontSize: 9,
          fontWeight: '400',
          color: '#4B5563'
        }
      },
      {
        name: 'ความครบถ้วน',
        type: 'pie',
        radius: [0, '35%'],
        center: ['75%', '45%'],
        data: contactData.completenessStats.map((item, index) => ({
          ...item,
          itemStyle: {
            color: item.name.includes('ครบถ้วน') ? '#10B981' : '#F59E0B'
          }
        })),
        label: {
          show: true,
          formatter: (params: any) => {
            const percentage = ((params.value / completenessTotal) * 100).toFixed(1);
            return `${params.name}\n${percentage}%`;
          },
          fontSize: 9,
          fontWeight: '400',
          color: '#4B5563'
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
      
      <div className="mt-3 space-y-2">
        {/* Phone Number Stats */}
        <div className="bg-gray-50 rounded p-2 border border-gray-200">
          <div className="text-xs font-medium text-gray-700 mb-2">สถิติเบอร์โทรศัพท์</div>
          <div className="grid grid-cols-2 gap-2">
            {contactData.phoneNumberStats.map((item, index) => {
              const color = item.name.includes('มี') ? '#10B981' : '#EF4444';
              const bgColor = item.name.includes('มี') ? 'bg-green-50' : 'bg-red-50';
              const textColor = item.name.includes('มี') ? 'text-green-700' : 'text-red-700';
              const percentage = ((item.value / phoneTotal) * 100).toFixed(1);
              
              return (
                <div key={item.name} className={`flex items-center justify-between py-1 px-2 rounded ${bgColor}`}>
                  <div className="flex items-center space-x-1">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className={`text-xs ${textColor}`}>
                      {item.name.replace('เบอร์โทรศัพท์', '').replace('มี', '✓').replace('ไม่มี', '✗')}
                    </span>
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

        {/* Completeness Stats */}
        <div className="bg-gray-50 rounded p-2 border border-gray-200">
          <div className="text-xs font-medium text-gray-700 mb-2">ความครบถ้วนข้อมูล</div>
          <div className="grid grid-cols-2 gap-2">
            {contactData.completenessStats.map((item, index) => {
              const color = item.name.includes('ครบถ้วน') ? '#10B981' : '#F59E0B';
              const bgColor = item.name.includes('ครบถ้วน') ? 'bg-green-50' : 'bg-yellow-50';
              const textColor = item.name.includes('ครบถ้วน') ? 'text-green-700' : 'text-yellow-700';
              const percentage = ((item.value / completenessTotal) * 100).toFixed(1);
              
              return (
                <div key={item.name} className={`flex items-center justify-between py-1 px-2 rounded ${bgColor}`}>
                  <div className="flex items-center space-x-1">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className={`text-xs ${textColor}`}>
                      {item.name.includes('ครบถ้วน') ? '✓ ครบถ้วน' : '⚠ ไม่ครบ'}
                    </span>
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
        
        <div className="p-2 bg-blue-50 rounded border border-blue-200">
          <div className="text-xs text-blue-700 text-center">
            <strong>ข้อมูลครบถ้วน:</strong> ชื่อ + นามสกุล + ที่อยู่ + เบอร์โทร
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactStatsChart;