// IntentPeriodChart.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { FaEllipsisV, FaDownload } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartData = ChartData<'pie', number[], string>;
type PieChartOptions = ChartOptions<'pie'>;

interface IntentPeriodData {
  [key: string]: number;
}

const IntentPeriodChart: React.FC = () => {
  const [chartData, setChartData] = useState<PieChartData | null>(null);
  const [totalResponded, setTotalResponded] = useState(0);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const chartRef = useRef<ChartJS<'pie', number[], string>>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ intentPeriod: IntentPeriodData, totalCount: number }>('/api/soberCheersCharts');
        const { intentPeriod, totalCount } = response.data;
        
        const newData: IntentPeriodData = { ...intentPeriod };
        if (newData['Unknown']) {
          newData['เลิกดื่มมาแล้วมากกว่า 3 ปี หรือ ไม่เคยดื่มเลยตลอดชีวิต'] = newData['Unknown'];
          delete newData['Unknown'];
        }

        const labels = Object.keys(newData);
        const data = Object.values(newData);
        const totalResponded = data.reduce((sum, count) => sum + count, 0);
        
        const backgroundColors = [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ];

        setChartData({
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColors.slice(0, data.length),
            hoverBackgroundColor: backgroundColors.slice(0, data.length)
          }]
        });
        setTotalResponded(totalResponded);
      } catch (error) {
        console.error('Error fetching intent period data:', error);
      }
    };

    fetchData();
  }, []);

  const options: PieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          font: { size: 10 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            const percentage = ((value / totalResponded) * 100).toFixed(1);
            return `${label}: ${value} คน (${percentage}%)`;
          }
        }
      }
    }
  };

  const downloadChart = (format: 'png' | 'jpeg') => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image(format);
      const link = document.createElement('a');
      link.download = `intent-period-chart.${format}`;
      link.href = url;
      link.click();
    }
    setShowDownloadMenu(false);
  };

  if (!chartData) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md relative h-80">
      <h3 className="text-lg font-semibold mb-2 text-center">ระยะเวลาที่ตั้งใจจะเลิกดื่ม</h3>
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => setShowDownloadMenu(!showDownloadMenu)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FaEllipsisV />
        </button>
        {showDownloadMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
            <button
              onClick={() => downloadChart('png')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaDownload className="inline mr-2" /> ดาวน์โหลด PNG
            </button>
            <button
              onClick={() => downloadChart('jpeg')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaDownload className="inline mr-2" /> ดาวน์โหลด JPEG
            </button>
          </div>
        )}
      </div>
      <div className="h-64">
        <Pie 
          ref={chartRef}
          data={chartData}
          options={options}
        />
      </div>
      <p className="text-xs text-center mt-2">
        จำนวนผู้ตอบแบบสอบถามทั้งหมด: {totalResponded} คน
      </p>
    </div>
  );
};

export default IntentPeriodChart;