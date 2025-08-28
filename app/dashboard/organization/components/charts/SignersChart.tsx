// app/dashboard/organization/components/charts/SignersChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getSignersChartData } from '../../actions/GetChartData';

interface SignersData {
  range: string;
  count: number;
  totalSigners: number;
}

const SignersChart: React.FC = () => {
  const [signersData, setSignersData] = useState<SignersData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalSigners, setTotalSigners] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getSignersChartData();
        if (result.success && result.data) {
          setSignersData(result.data);
          setTotalCount(result.data.reduce((sum, item) => sum + item.count, 0));
          setTotalSigners(result.data.reduce((sum, item) => sum + item.totalSigners, 0));
        }
      } catch (error) {
        console.error('Error fetching signers data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border border-emerald-200 border-t-emerald-500"></div>
        <span className="ml-2 text-xs text-emerald-600">กำลังโหลด...</span>
      </div>
    );
  }

  if (!signersData.length) {
    return <div className="text-center text-xs text-emerald-600 py-8">ไม่พบข้อมูลผู้ลงนาม</div>;
  }

  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return '0.0';
    return ((count / total) * 100).toFixed(1);
  };

  const averageSigners = totalCount > 0 ? (totalSigners / totalCount).toFixed(1) : 0;

  const option = {
    title: {
      text: 'การกระจายตามจำนวนผู้ลงนาม',
      left: 'center',
      textStyle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#065F46'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'white',
      borderColor: '#A7F3D0',
      borderWidth: 1,
      textStyle: {
        fontSize: 11,
        color: '#374151'
      },
      formatter: (params: any) => {
        const data = params[0];
        const item = signersData.find(s => s.range === data.name);
        const percentage = calculatePercentage(data.value, totalCount);
        const avgInRange = item && item.count > 0 ? (item.totalSigners / item.count).toFixed(1) : '0';
        return `${data.name}: ${data.value.toLocaleString()} องค์กร (${percentage}%)<br/>รวม: ${item?.totalSigners.toLocaleString() || 0} คน<br/>เฉลี่ย: ${avgInRange} คน/องค์กร`;
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
      data: signersData.map(item => item.range),
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      },
      axisLabel: {
        fontSize: 9,
        color: '#6B7280',
        rotate: 30,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#F3F4F6',
          type: 'solid'
        }
      },
      axisLabel: {
        fontSize: 9,
        color: '#6B7280',
        formatter: '{value}'
      }
    },
    series: [
      {
        type: 'bar',
        data: signersData.map(item => ({
          value: item.count,
          itemStyle: {
            color: '#10B981',
            borderRadius: [3, 3, 0, 0]
          }
        })),
        barWidth: '60%',
        emphasis: {
          itemStyle: {
            color: '#059669'
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
      
      <div className="mt-3 space-y-1.5">
        {signersData.slice(0, 4).map((item, index) => {
          const colors = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'];
          const bgColors = ['bg-emerald-50', 'bg-emerald-100', 'bg-emerald-50', 'bg-emerald-100'];
          const textColors = ['text-emerald-700', 'text-emerald-800', 'text-emerald-700', 'text-emerald-800'];
          
          const color = colors[index % colors.length];
          const bgColor = bgColors[index % bgColors.length];
          const textColor = textColors[index % textColors.length];
          const percentage = calculatePercentage(item.count, totalCount);
          const avgInRange = item.count > 0 ? (item.totalSigners / item.count).toFixed(1) : '0';
          
          return (
            <div key={item.range} className={`flex items-center justify-between py-1.5 px-2 rounded ${bgColor} hover:opacity-80 transition-opacity`}>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: color }}
                ></div>
                <span className={`text-xs font-normal ${textColor}`}>{item.range.split(' ')[0]}</span>
              </div>
              <div className="text-right">
                <div className={`text-xs font-medium ${textColor}`}>{item.count.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{percentage}%</div>
              </div>
            </div>
          );
        })}
        
        <div className="mt-2 p-2 bg-emerald-50 rounded border border-emerald-200">
          <div className="text-xs text-emerald-700 text-center">
            <strong>สรุป:</strong> รวม {totalSigners.toLocaleString()} คน จาก {totalCount.toLocaleString()} องค์กร
            <br />เฉลี่ย {averageSigners} คน/องค์กร
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignersChart;