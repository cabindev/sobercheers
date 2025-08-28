// app/dashboard/organization/components/charts/OrganizationCategoryChart.tsx
// แก้ไข Error: Encountered two children with the same key โดยเพิ่ม unique identifier
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getOrganizationCategoryChartData } from '../../actions/GetChartData';

interface CategoryData {
  name: string;
  value: number;
}

const OrganizationCategoryChart: React.FC = () => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getOrganizationCategoryChartData();
        if (result.success && result.data) {
          setCategoryData(result.data);
          setTotalCount(result.data.reduce((sum, item) => sum + item.value, 0));
        }
      } catch (error) {
        console.error('Error fetching organization category data:', error);
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

  if (!categoryData.length) {
    return <div className="text-center text-xs text-emerald-600 py-8">ไม่พบข้อมูลหมวดหมู่องค์กร</div>;
  }

  const option = {
    title: {
      text: 'การแบ่งตามหมวดหมู่องค์กร',
      left: 'center',
      textStyle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#065F46'
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'white',
      borderColor: '#A7F3D0',
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
        name: 'หมวดหมู่องค์กร',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '55%'],
        data: categoryData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5', '#ECFDF5'][index % 6] // Green tones
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
            const shortName = params.name.length > 12 ? 
              `${params.name.substring(0, 10)}...` : params.name;
            return `${shortName}\n${percentage}%`;
          },
          fontSize: 10,
          fontWeight: '400',
          color: '#065F46'
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
        {categoryData.map((item, index) => {
          const colors = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'];
          const bgColors = ['bg-emerald-50', 'bg-emerald-100', 'bg-emerald-50', 'bg-emerald-100', 'bg-emerald-50'];
          const textColors = ['text-emerald-700', 'text-emerald-800', 'text-emerald-700', 'text-emerald-800', 'text-emerald-700'];
          
          const color = colors[index % colors.length];
          const bgColor = bgColors[index % bgColors.length];
          const textColor = textColors[index % textColors.length];
          const percentage = ((item.value / totalCount) * 100).toFixed(1);
          
          // สร้าง unique key โดยรวม index เข้าด้วยเพื่อป้องกัน duplicate keys
          const uniqueKey = `${item.name}-${index}-${item.value}`;
          
          return (
            <div key={uniqueKey} className={`flex items-center justify-between py-1.5 px-2 rounded ${bgColor} hover:opacity-80 transition-opacity`}>
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: color }}
                ></div>
                <span className={`text-xs font-normal ${textColor} truncate`} title={item.name}>
                  {item.name.length > 20 ? `${item.name.substring(0, 18)}...` : item.name}
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
  );
};

export default OrganizationCategoryChart;