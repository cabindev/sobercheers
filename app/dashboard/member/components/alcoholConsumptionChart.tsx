import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { FaEllipsisV, FaDownload } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SoberCheersData {
  alcoholConsumption: string;
  _count: {
    alcoholConsumption: number;
  };
}

const AlcoholConsumptionChart: React.FC = () => {
  const [soberCheersData, setSoberCheersData] = useState<SoberCheersData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const chartRef = useRef<ChartJS<'pie', number[], string>>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ campaigns: SoberCheersData[] }>('/api/dashboard');
        setSoberCheersData(response.data.campaigns);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      }
    };
    fetchData();
  }, []);

  const chartData = useMemo(() => {
    const consumptionData = soberCheersData.reduce((acc, item) => {
      acc[item.alcoholConsumption] = (acc[item.alcoholConsumption] || 0) + item._count.alcoholConsumption;
      return acc;
    }, {} as Record<string, number>);

    const totalResponded = Object.values(consumptionData).reduce((sum, count) => sum + count, 0);

    return {
      labels: Object.keys(consumptionData),
      datasets: [
        {
          data: Object.values(consumptionData),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
          ],
          hoverBackgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
          ],
        },
      ],
      totalResponded,
    };
  }, [soberCheersData]);

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
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
            const percentage = ((value / chartData.totalResponded) * 100).toFixed(1);
            return `${label}: ${value} คน (${percentage}%)`;
          },
        },
      },
    },
  };

  const downloadChart = (format: 'png' | 'jpeg') => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image(format);
      const link = document.createElement('a');
      link.download = `alcohol-consumption-chart.${format}`;
      link.href = url;
      link.click();
    }
    setShowDownloadMenu(false);
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!chartData) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md relative h-80">
      <h3 className="text-lg font-semibold mb-2 text-center">การบริโภคแอลกอฮอล์</h3>
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
          options={options}
          data={chartData}
        />
      </div>
      <p className="text-xs text-center mt-2">
        จำนวนผู้ตอบแบบสอบถามทั้งหมด: {chartData.totalResponded} คน
      </p>
    </div>
  );
};

export default AlcoholConsumptionChart;