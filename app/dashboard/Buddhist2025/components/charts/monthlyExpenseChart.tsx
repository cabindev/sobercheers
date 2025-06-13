// app/dashboard/Buddhist2025/components/charts/monthlyExpenseChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getMonthlyExpenseChartData } from '../../actions/GetChartData';
import LoadingSkeleton from '../ui/DashboardLoading';
import DashboardLoading from '../ui/DashboardLoading';

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
      <div className="h-96 flex flex-col items-center justify-center">
        <DashboardLoading />
        <span className="mt-4 text-gray-600">กำลังโหลดข้อมูลรายจ่าย...</span>
      </div>
    );
  }

  if (!expenseData.length) {
    return <div className="text-center text-red-500">ไม่พบข้อมูลรายจ่ายรายเดือน</div>;
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
        const item = expenseData.find(exp => exp.range === data.name);
        const percentage = calculatePercentage(data.value, totalCount);
        return `
          <div>
            <strong>${data.name}</strong><br/>
            จำนวนคน: ${data.value.toLocaleString()} คน<br/>
            สัดส่วน: ${percentage}%<br/>
            รายจ่ายเฉลี่ย: ${item?.averageExpense.toLocaleString() || 0} บาท
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
      type: 'category',
      data: expenseData.map(item => item.range),
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        fontSize: 10,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} คน'
      }
    },
    series: [
      {
        name: 'จำนวนคน',
        type: 'bar',
        data: expenseData.map((item, index) => ({
          value: item.count,
          itemStyle: {
            color: ['#059669', '#0D9488', '#0891B2', '#0284C7', '#2563EB', '#7C3AED'][index % 6]
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c} คน',
          fontSize: 10
        }
      }
    ]
  };

  return (
    <div className="bg-white h-full">
      {/* Header Stats */}
      <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">{totalCount.toLocaleString()}</div>
            <div className="text-xs text-gray-600">ผู้ตอบ</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">{averageExpense}</div>
            <div className="text-xs text-gray-600">เฉลี่ย (บาท)</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">{expenseData.length}</div>
            <div className="text-xs text-gray-600">ช่วงราคา</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
        />
      </div>

      {/* Summary Table */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">สรุปข้อมูลรายจ่าย</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {expenseData.map((item, index) => {
            const colors = ['#059669', '#0D9488', '#0891B2', '#0284C7', '#2563EB', '#7C3AED'];
            const color = colors[index % colors.length];
            const percentage = calculatePercentage(item.count, totalCount);
            
            return (
              <div key={item.range} className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">{item.range}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="font-bold text-gray-900">{item.count.toLocaleString()} คน</div>
                    <div className="text-gray-500">{percentage}%</div>
                  </div>
                  <div>
                    <div className="font-bold text-green-600">{item.averageExpense.toLocaleString()} บาท</div>
                    <div className="text-gray-500">เฉลี่ย</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Insight */}
      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <h5 className="text-sm font-semibold text-green-800 mb-1">💰 ข้อมูลเชิงลึก</h5>
        <div className="text-xs text-green-700">
          💡 รายจ่ายเฉลี่ยต่อเดือน: {averageExpense} บาท - 
          การเข้าพรรษาช่วยประหยัดค่าใช้จ่ายและนำไปใช้ในทางที่เป็นประโยชน์
        </div>
      </div>
    </div>
  );
};

export default MonthlyExpenseChart;