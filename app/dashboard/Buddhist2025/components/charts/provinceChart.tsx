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
          setProvinceData(result.data);
          setTotalCount(result.data.reduce((sum, item) => sum + item.value, 0));
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

  const option = {
    title: {
      text: 'Top 10 จังหวัดที่มีผู้เข้าร่วมมากที่สุด',
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
        return `
          <div>
            <strong>${data.name}</strong><br/>
            จำนวน: ${data.value.toLocaleString()} คน<br/>
            สัดส่วน: ${percentage}%
          </div>
        `;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} คน'
      }
    },
    yAxis: {
      type: 'category',
      data: provinceData.map(item => item.name).reverse(),
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        fontSize: 11
      }
    },
    series: [
      {
        name: 'จำนวนคน',
        type: 'bar',
        data: provinceData.map(item => item.value).reverse(),
        itemStyle: {
          // 🔥 ใช้สีธรรมดาแทน LinearGradient
          color: '#FF6B35'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c} คน',
          fontSize: 10
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
    </div>
  );
};

export default ProvinceChart;