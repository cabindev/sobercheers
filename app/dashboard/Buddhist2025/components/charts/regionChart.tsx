// app/dashboard/Buddhist2025/components/charts/regionChart.tsx
'use client'
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getRegionChartData } from '../../actions/GetChartData';
import LoadingSkeleton from '../ui/DashboardLoading';
import { FaEllipsisV, FaDownload } from 'react-icons/fa';
import DashboardLoading from '../ui/DashboardLoading';

interface RegionData {
  name: string;
  value: number;
}

const RegionChart: React.FC = () => {
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getRegionChartData();
        if (result.success && result.data) {
          const sortedData = result.data.sort((a, b) => b.value - a.value);
          setRegionData(sortedData);
          setTotalCount(sortedData.reduce((sum, item) => sum + item.value, 0));

          // จัดเตรียมข้อมูลสำหรับ chart
          const labels = sortedData.map(item => item.name);
          const data = sortedData.map(item => item.value);
          setChartData({ labels, data });
        }
      } catch (error) {
        console.error('Error fetching region data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return '0.0';
    return ((count / total) * 100).toFixed(1);
  };

  const option = {
    title: {
      text: 'ภูมิภาคที่เข้าร่วม',
      left: 'center',
      textStyle: {
        fontSize: 18,
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
        const param = params[0];
        const percentage = calculatePercentage(param.value, totalCount);
        return `
          <div>
            <strong>${param.name}</strong><br/>
            จำนวน: ${param.value.toLocaleString()} คน<br/>
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
      name: 'จำนวนคน',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6B7280'
      },
      axisLabel: {
        formatter: '{value} คน',
        fontSize: 11
      }
    },
    yAxis: {
      type: 'category',
      data: chartData?.labels || [],
      name: 'ภูมิภาค',
      nameLocation: 'middle',
      nameGap: 60,
      nameTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6B7280'
      },
      axisLabel: {
        fontSize: 12
      }
    },
    series: [
      {
        name: 'จำนวนคน',
        type: 'bar',
        data: chartData?.data || [],
        itemStyle: {
          color: (params: any) => {
            const colors = [
              '#FF6B35', // ส้มแดง
              '#1E40AF', // น้ำเงิน
              '#059669', // เขียว
              '#DC2626', // แดง
              '#7C3AED', // ม่วง
              '#F59E0B', // เหลือง
              '#6B7280'  // เทา
            ];
            return colors[params.dataIndex % colors.length];
          },
          borderRadius: [0, 4, 4, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        label: {
          show: true,
          position: 'right',
          formatter: (params: any) => {
            const percentage = calculatePercentage(params.value, totalCount);
            return `${params.value.toLocaleString()} (${percentage}%)`;
          },
          fontSize: 10,
          fontWeight: 'bold'
        }
      }
    ]
  };

  const downloadChart = () => {
    // สร้าง CSV data
    const csvData = regionData.map(item => {
      const percentage = calculatePercentage(item.value, totalCount);
      return `${item.name},${item.value},${percentage}%`;
    });
    
    const csvContent = [
      'ภูมิภาค,จำนวนคน,สัดส่วน',
      ...csvData
    ].join('\n');

    // Download CSV
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ภูมิภาคเข้าร่วม_${new Date().toLocaleDateString('th-TH')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowDownloadMenu(false);
    console.log('Downloaded region chart data');
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <DashboardLoading />
        <span className="mt-4 text-gray-600">กำลังโหลดข้อมูลภูมิภาค...</span>
      </div>
    );
  }

  if (!regionData.length) {
    return <div className="text-center text-red-500">ไม่พบข้อมูลภูมิภาค</div>;
  }

  return (
    <div className="bg-white h-full">
      {/* Header Stats */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-blue-600">{totalCount.toLocaleString()}</div>
            <div className="text-xs text-gray-600">ผู้เข้าร่วมทั้งหมด</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-600">{regionData.length}</div>
            <div className="text-xs text-gray-600">ภูมิภาค</div>
          </div>
        </div>
      </div>

      {/* Chart with Download Button */}
      <div className="relative h-80">
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="ตัวเลือกเพิ่มเติม"
          >
            <FaEllipsisV />
          </button>
          {showDownloadMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-20">
              <button
                onClick={downloadChart}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FaDownload className="inline mr-2" /> ดาวน์โหลดข้อมูล
              </button>
            </div>
          )}
        </div>
        
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
        />
      </div>

      {/* Region Summary */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">🏆 อันดับภูมิภาค</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {regionData.map((item, index) => {
            const colors = ['#FF6B35', '#1E40AF', '#059669', '#DC2626', '#7C3AED', '#F59E0B', '#6B7280'];
            const color = colors[index % colors.length];
            const percentage = calculatePercentage(item.value, totalCount);
            
            return (
              <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="text-sm font-bold text-gray-500 w-6 text-center">#{index + 1}</div>
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-gray-900">{item.value.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regional Insight */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h5 className="text-sm font-semibold text-blue-800 mb-1">🗺️ ข้อมูลเชิงลึก</h5>
        <div className="text-xs text-blue-700">
          {(() => {
            if (regionData.length === 0) return 'ไม่มีข้อมูล';
            
            const maxRegion = regionData[0]; // เรียงแล้วตัวแรกคือมากสุด
            const maxPercentage = calculatePercentage(maxRegion.value, totalCount);
            
            return (
              <span>
                🏆 ภูมิภาคที่เข้าร่วมมากที่สุด: {maxRegion.name} ({maxPercentage}%) 
                - แสดงความสนใจในกิจกรรมเข้าพรรษา
              </span>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default RegionChart;