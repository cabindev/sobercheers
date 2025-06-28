// app/dashboard/Buddhist2025/components/charts/monthlyExpenseChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getMonthlyExpenseChartData } from '../../actions/GetChartData';

interface MonthlyExpenseData {
  range: string;
  count: number;
  averageExpense: number;
}

const MonthlyExpenseChart: React.FC = () => {
  const [expenseData, setExpenseData] = useState<MonthlyExpenseData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getMonthlyExpenseChartData();
        if (result.success && result.data) {
          setExpenseData(result.data);
          setTotalCount(result.data.reduce((sum, item) => sum + item.count, 0));
          setTotalExpense(result.data.reduce((sum, item) => sum + (item.averageExpense * item.count), 0));
        }
      } catch (error) {
        console.error('Error fetching monthly expense data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border border-orange-200 border-t-orange-500"></div>
        <span className="ml-2 text-xs text-gray-500">กำลังโหลด...</span>
      </div>
    );
  }

  if (!expenseData.length) {
    return <div className="text-center text-xs text-gray-500 py-8">ไม่พบข้อมูลรายจ่ายรายเดือน</div>;
  }

  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return '0.0';
    return ((count / total) * 100).toFixed(1);
  };

  const averageExpense = totalCount > 0 ? (totalExpense / totalCount).toFixed(0) : 0;

  const option = {
    title: {
      text: 'รายจ่ายต่อเดือนสำหรับเหล้า',
      left: 'center',
      textStyle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4B5563'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'white',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      textStyle: {
        fontSize: 11,
        color: '#374151'
      },
      formatter: (params: any) => {
        const data = params[0];
        const item = expenseData.find(exp => exp.range === data.name);
        const percentage = calculatePercentage(data.value, totalCount);
        return `${data.name}: ${data.value.toLocaleString()} คน (${percentage}%)<br/>เฉลี่ย: ${item?.averageExpense.toLocaleString() || 0} บาท`;
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
      data: expenseData.map(item => item.range),
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
        data: expenseData.map(item => ({
          value: item.count,
          itemStyle: {
            color: '#F59E0B',
            borderRadius: [3, 3, 0, 0]
          }
        })),
        barWidth: '60%',
        emphasis: {
          itemStyle: {
            color: '#F97316'
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
        {expenseData.slice(0, 4).map((item, index) => {
          const colors = ['#F59E0B', '#FCD34D', '#FEF3C7', '#F97316'];
          const bgColors = ['bg-orange-50', 'bg-amber-50', 'bg-yellow-50', 'bg-orange-50'];
          const textColors = ['text-orange-700', 'text-amber-700', 'text-yellow-700', 'text-orange-700'];
          
          const color = colors[index % colors.length];
          const bgColor = bgColors[index % bgColors.length];
          const textColor = textColors[index % textColors.length];
          const percentage = calculatePercentage(item.count, totalCount);
          
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
      </div>
    </div>
  );
};

export default MonthlyExpenseChart;