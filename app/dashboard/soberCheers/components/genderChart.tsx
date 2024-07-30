'use client';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { FaEllipsisV, FaDownload } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SoberCheersData {
  gender: string;
}

const GenderChart: React.FC = () => {
  const [soberCheersData, setSoberCheersData] = useState<SoberCheersData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const chartRef = useRef<ChartJS<'pie', number[], string>>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ soberCheers: SoberCheersData[] }>('/api/soberCheersCharts');
        setSoberCheersData(response.data.soberCheers);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      }
    };
    fetchData();
  }, []);

  const chartData = useMemo(() => {
    const genderData = soberCheersData.reduce((acc, item) => {
      acc[item.gender] = (acc[item.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(genderData),
      datasets: [
        {
          data: Object.values(genderData),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',  // Pink for หญิง
            'rgba(54, 162, 235, 0.8)',  // Blue for ชาย
            'rgba(75, 192, 192, 0.8)',  // Teal for LGBTQ
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [soberCheersData]);

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((acc: number, data: number) => acc + data, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  const downloadChart = (format: 'png' | 'jpeg') => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image(format);
      const link = document.createElement('a');
      link.download = `gender-distribution-chart.${format}`;
      link.href = url;
      link.click();
    }
    setShowDownloadMenu(false);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (soberCheersData.length === 0) {
    return <div>Loading...</div>;
  }

  const genderData = soberCheersData.reduce((acc, item) => {
    acc[item.gender] = (acc[item.gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md relative">
      <div className="absolute top-2 right-2">
        <button
          onClick={() => setShowDownloadMenu(!showDownloadMenu)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FaEllipsisV />
        </button>
        {showDownloadMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <button
              onClick={() => downloadChart('png')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaDownload className="inline mr-2" /> Download PNG
            </button>
            <button
              onClick={() => downloadChart('jpeg')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaDownload className="inline mr-2" /> Download JPEG
            </button>
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-4 text-center">การบริโภคแอลกอฮอล์ตามเพศ</h3>
      <div className="flex justify-center items-center mb-4">
        <div className="w-3/4">
          <Pie
            ref={chartRef}
            options={options}
            data={chartData}
          />
        </div>
      </div>
   <div className="grid grid-cols-2 gap-4 mt-4">
  {Object.entries(genderData).map(([gender, count]) => (
    <div key={gender} className="text-center p-3 rounded-lg" style={{
      backgroundColor: 
        gender === 'ชาย' ? 'rgba(54, 162, 235, 0.2)' : 
        gender === 'หญิง' ? 'rgba(255, 99, 132, 0.2)' :
        'rgba(75, 192, 192, 0.2)'  // For LGBTQ
    }}>
      <span className="text-lg font-bold">{gender}</span>
      <span className="block text-2xl font-semibold">{count} คน</span>
      <span className="text-sm">
        ({((count / soberCheersData.length) * 100).toFixed(1)}%)
      </span>
    </div>
  ))}
</div>
    </div>
  );
};

export default GenderChart;