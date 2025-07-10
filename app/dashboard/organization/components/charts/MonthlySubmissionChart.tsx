// app/dashboard/organization/components/charts/MonthlySubmissionChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getMonthlySubmissionChartData } from '../../actions/GetChartData';

interface MonthlyData {
  month: string;
  count: number;
}

const MonthlySubmissionChart: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getMonthlySubmissionChartData();
        if (result.success && result.data) {
          setMonthlyData(result.data);
        }
      } catch (error) {
        console.error('Error fetching monthly submission data:', error);
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

  if (!monthlyData.length) {
    return <div className="text-center text-xs text-gray-500 py-8">ไม่พบข้อมูลรายเดือน</div>;
  }

  // คำนวณสถิติ
  const totalSubmissions = monthlyData.reduce((sum, item) => sum + item.count, 0);
  const avgPerMonth = (totalSubmissions / monthlyData.length).toFixed(1);
  const maxMonth = monthlyData.reduce((max, item) => item.count > max.count ? item : max);
  const minMonth = monthlyData.reduce((min, item) => item.count < min.count ? item : min);

  const option = {
    title: {
      text: 'การส่งข้อมูลรายเดือน',
      left: 'center',
      textStyle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4B5563'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'white',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      textStyle: {
        fontSize: 11,
        color: '#374151'
      },
      formatter: (params: any) => {
        const data = params[0];
        return `${data.name}: ${data.value.toLocaleString()} องค์กร`;
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: monthlyData.map(item => item.month),
      axisLabel: {
        fontSize: 9,
        color: '#6B7280',
        rotate: 30,
        interval: 0
      },
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 9,
        color: '#6B7280'
      },
      axisLine: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#F3F4F6'
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: monthlyData.map(item => ({
          value: item.count,
          itemStyle: {
            color: '#10B981',
            borderRadius: [3, 3, 0, 0]
          }
        })),
        barWidth: '60%',
        emphasis: {
          itemStyle: {
            color: '#059669',
            shadowBlur: 6,
            shadowColor: 'rgba(0, 0, 0, 0.1)'
          }
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
      
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="bg-green-50 rounded p-2 text-center border border-green-200">
          <div className="text-xs text-green-700 mb-1">รวมทั้งหมด</div>
          <div className="text-sm font-medium text-green-800">{totalSubmissions}</div>
          <div className="text-xs text-green-600">องค์กร</div>
        </div>
        
        <div className="bg-green-50 rounded p-2 text-center border border-green-200">
          <div className="text-xs text-green-700 mb-1">เฉลี่ยต่อเดือน</div>
          <div className="text-sm font-medium text-green-800">{avgPerMonth}</div>
          <div className="text-xs text-green-600">องค์กร</div>
        </div>
        
        <div className="bg-green-50 rounded p-2 text-center border border-green-200">
          <div className="text-xs text-green-700 mb-1">สูงสุด</div>
          <div className="text-sm font-medium text-green-800">{maxMonth.count}</div>
          <div className="text-xs text-green-600">{maxMonth.month.split(' ')[0]}</div>
        </div>
        
        <div className="bg-green-50 rounded p-2 text-center border border-green-200">
          <div className="text-xs text-green-700 mb-1">ต่ำสุด</div>
          <div className="text-sm font-medium text-green-800">{minMonth.count}</div>
          <div className="text-xs text-green-600">{minMonth.month.split(' ')[0]}</div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySubmissionChart;