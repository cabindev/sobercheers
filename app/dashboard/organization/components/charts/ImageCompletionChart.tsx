// app/dashboard/organization/components/charts/ImageCompletionChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getImageCompletionChartData } from '../../actions/GetChartData';

interface ImageCompletionData {
  name: string;
  value: number;
}

const ImageCompletionChart: React.FC = () => {
  const [imageData, setImageData] = useState<ImageCompletionData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getImageCompletionChartData();
        if (result.success && result.data) {
          setImageData(result.data);
          setTotalCount(result.data.reduce((sum, item) => sum + item.value, 0));
        }
      } catch (error) {
        console.error('Error fetching image completion data:', error);
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

  if (!imageData.length) {
    return <div className="text-center text-xs text-gray-500 py-8">ไม่พบข้อมูลความครบถ้วนรูปภาพ</div>;
  }

  const option = {
    title: {
      text: 'ความครบถ้วนของรูปภาพ',
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
        const percentage = ((params.value / totalCount) * 100).toFixed(1);
        return `${params.name}: ${params.value.toLocaleString()} องค์กร (${percentage}%)`;
      }
    },
    series: [
      {
        name: 'ความครบถ้วนรูปภาพ',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '55%'],
        data: imageData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: (() => {
              // กำหนดสีตามประเภท
              if (item.name.includes('ไม่ครบ')) return '#EF4444'; // Red
              if (item.name.includes('ครบตามข้อกำหนด')) return '#10B981'; // Green
              if (item.name.includes('ครบทั้งหมด')) return '#059669'; // Dark Green
              return ['#34D399', '#6EE7B7', '#A7F3D0'][index % 3]; // Light greens
            })()
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 8,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.1)'
          }
        },
        label: {
          show: true,
          formatter: (params: any) => {
            const percentage = ((params.value / totalCount) * 100).toFixed(1);
            let shortName = params.name;
            if (params.name.includes('(')) {
              shortName = params.name.split('(')[0].trim();
            }
            if (shortName.length > 10) {
              shortName = shortName.substring(0, 8) + '...';
            }
            return `${shortName}\n${percentage}%`;
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
      
      <div className="mt-3 space-y-1.5">
        {imageData.map((item, index) => {
          // กำหนดสีตามประเภท
          let color, bgColor, textColor;
          if (item.name.includes('ไม่ครบ')) {
            color = '#EF4444';
            bgColor = 'bg-red-50';
            textColor = 'text-red-700';
          } else if (item.name.includes('ครบตามข้อกำหนด')) {
            color = '#10B981';
            bgColor = 'bg-green-50';
            textColor = 'text-green-700';
          } else if (item.name.includes('ครบทั้งหมด')) {
            color = '#059669';
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
          } else {
            color = ['#34D399', '#6EE7B7', '#A7F3D0'][index % 3];
            bgColor = 'bg-green-50';
            textColor = 'text-green-700';
          }
          
          const percentage = ((item.value / totalCount) * 100).toFixed(1);
          
          return (
            <div key={item.name} className={`flex items-center justify-between py-1.5 px-2 rounded ${bgColor} hover:opacity-80 transition-opacity`}>
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: color }}
                ></div>
                <span className={`text-xs font-normal ${textColor} truncate`} title={item.name}>
                  {item.name.length > 15 ? `${item.name.substring(0, 13)}...` : item.name}
                </span>
              </div>
              <div className="text-right">
                <div className={`text-xs font-medium ${textColor}`}>{item.value.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{percentage}%</div>
              </div>
            </div>
          );
        })}
        
        <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
          <div className="text-xs text-blue-700 text-center">
            <strong>หมายเหตุ:</strong> ข้อกำหนดขั้นต่ำคือ 2 รูป (รูปที่ 1 และ 2)
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCompletionChart;