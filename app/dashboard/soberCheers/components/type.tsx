'use client'
import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import axios from 'axios';
import { FaEllipsisV, FaDownload } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ChartDataType = ChartData<'bar', number[], string>;
type ChartOptionsType = ChartOptions<'bar'>;

interface TypeCount {
  [key: string]: number;
}

const TypeChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartDataType | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const chartRef = useRef<ChartJS>(null);

  const options: ChartOptionsType = {
    indexAxis: 'y', // ใช้แกน y เป็นแกนหลัก (แสดงแนวนอน)
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'ภูมิภาคที่เข้าร่วม',
        font: {
          size: 20,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `จำนวน: ${context.parsed.x}`, // เปลี่ยนจาก y เป็น x
        },
      },
    },
    scales: {
      x: { // เปลี่ยนจาก y เป็น x
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 14
          }
        },
        title: {
          display: true,
          text: 'จำนวนคน',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
      },
      y: { // เปลี่ยนจาก x เป็น y
        ticks: {
          font: {
            size: 14,
          },
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
        },
        title: {
          display: true,
          text: 'ภูมิภาค',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ typeCounts: TypeCount }>('/api/soberCheersCharts');
        const { typeCounts } = response.data;

        const sortedData = Object.entries(typeCounts)
          .sort((a, b) => b[1] - a[1]);
        
        const labels = sortedData.map(([label, count]) => `${label} (${count})`);
        const data = sortedData.map(([, count]) => count);

        const colors = [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(201, 203, 207, 0.8)'
        ];

        setChartData({
          labels,
          datasets: [
            {
              label: "จำนวนคน",
              data,
              backgroundColor: colors,
              borderColor: colors.map(color => color.replace('0.8', '1')),
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  const downloadChart = (format: 'png' | 'jpeg') => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image(format);
      const link = document.createElement('a');
      link.download = `type-chart.${format}`;
      link.href = url;
      link.click();
    }
    setShowDownloadMenu(false);
  };

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-md" style={{ height: '80vh', width: '100%' }}>
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
      <Bar 
        ref={chartRef as React.RefObject<ChartJS<'bar', number[], string>>}
        data={chartData}
        options={options}
      />
    </div>
  );
};

export default TypeChart;