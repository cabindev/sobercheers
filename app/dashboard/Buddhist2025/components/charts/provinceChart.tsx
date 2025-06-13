// app/dashboard/Buddhist2025/components/charts/provinceChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getTop10ProvincesChartData } from '../../actions/GetChartData';

interface ProvinceData {
  name: string;
  value: number;
}

const ProvinceChart: React.FC = () => {
  const [provinceData, setProvinceData] = useState<ProvinceData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getTop10ProvincesChartData();
        if (result.success && result.data) {
          // เรียงข้อมูลจากมากไปน้อย (มากสุดอันดับ 1)
          const sortedData = result.data.sort((a, b) => b.value - a.value);
          setProvinceData(sortedData);
          setTotalCount(sortedData.reduce((sum, item) => sum + item.value, 0));
        }
      } catch (error) {
        console.error('Error fetching province data:', error);
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

  if (!provinceData.length) {
    return <div className="text-center text-red-500">ไม่พบข้อมูลจังหวัด</div>;
  }

  // เตรียมข้อมูลสำหรับกราฟ (เรียงกลับเพื่อให้อันดับ 1 อยู่บนสุด)
  const chartData = provinceData.slice().reverse();
  const yAxisLabels = chartData.map((item, index) => {
    const rank = provinceData.length - index; // คำนวณอันดับ
    return `${rank}. ${item.name}`;
  });

  const option = {
    title: {
      text: 'อันดับ 10 จังหวัดที่มีผู้เข้าร่วมมากที่สุด',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const data = params[0];
        const percentage = totalCount > 0 ? ((data.value / totalCount) * 100).toFixed(1) : '0';
        const originalIndex = chartData.length - data.dataIndex - 1; // หาอันดับจริง
        const rank = originalIndex + 1;
        const provinceName = provinceData[originalIndex].name;
        
        return `
          <div style="padding: 8px;">
            <div style="font-weight: bold; color: #FF6B35; margin-bottom: 4px;">
              🏆 อันดับที่ ${rank}
            </div>
            <div style="font-weight: bold; margin-bottom: 4px;">
              ${provinceName}
            </div>
            <div style="color: #666;">
              จำนวน: <span style="color: #FF6B35; font-weight: bold;">${data.value.toLocaleString()}</span> คน
            </div>
            <div style="color: #666;">
              สัดส่วน: <span style="color: #FF6B35; font-weight: bold;">${percentage}%</span>
            </div>
          </div>
        `;
      }
    },
    grid: {
      left: '20%',
      right: '8%',
      top: '15%',
      bottom: '5%',
      containLabel: false
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}',
        fontSize: 11,
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#F3F4F6',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: yAxisLabels,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        fontSize: 12,
        color: '#374151',
        fontWeight: 'normal',
        formatter: (value: string) => {
          // ตัดชื่อจังหวัดให้สั้นลงถ้ายาวเกินไป
          const parts = value.split('. ');
          if (parts.length > 1) {
            const rank = parts[0];
            const province = parts[1];
            return province.length > 12 ? `${rank}. ${province.substring(0, 10)}...` : value;
          }
          return value;
        }
      }
    },
    series: [
      {
        name: 'จำนวนคน',
        type: 'bar',
        data: chartData.map(item => item.value),
        itemStyle: {
          color: (params: any) => {
            // สีที่แตกต่างกันตามอันดับ
            const colors = [
              '#FFD700', // Gold - อันดับ 1
              '#C0C0C0', // Silver - อันดับ 2  
              '#CD7F32', // Bronze - อันดับ 3
              '#FF6B35', // Orange - อันดับ 4-10
              '#FF8C42',
              '#FF6B35',
              '#E55B13',
              '#CC4125',
              '#B8421A',
              '#A33B1A'
            ];
            const rank = chartData.length - params.dataIndex;
            return colors[rank - 1] || '#FF6B35';
          },
          borderRadius: [0, 4, 4, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        label: {
          show: true,
          position: 'right',
          formatter: (params: any) => {
            return `${params.value.toLocaleString()} คน`;
          },
          fontSize: 11,
          color: '#374151',
          fontWeight: 'bold'
        }
      }
    ]
  };

  return (
    <div className="bg-white h-full">
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
      />
      
      {/* แสดงสรุปข้อมูลเพิ่มเติม */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">จังหวัดอันดับ 1:</span>
            <div className="font-bold text-orange-600 flex items-center">
              🥇 {provinceData[0]?.name} ({provinceData[0]?.value.toLocaleString()} คน)
            </div>
          </div>
          <div>
            <span className="text-gray-600">รวมทั้งหมด:</span>
            <div className="font-bold text-blue-600">
              {totalCount.toLocaleString()} คน
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvinceChart;