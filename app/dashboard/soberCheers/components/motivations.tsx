import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaChild, FaHeartbeat, FaPray, FaUsers, FaHeart, FaMoneyBillWave, FaStar } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MotivationData {
  label: string;
  count: number;
  percentage: number;
  icon: JSX.Element;
}

const motivationIcons = {
  'เพื่อลูกและครอบครัว': <FaChild />,
  'เพื่อสุขภาพของตนเอง': <FaHeartbeat />,
  'ได้บุญ/รักษาศีล': <FaPray />,
  'ผู้นำชุมชนชักชวน': <FaUsers />,
  'คนรักและเพื่อนชวน': <FaHeart />,
  'ประหยัดเงิน': <FaMoneyBillWave />,
  'เพื่อเป็นแบบอย่างที่ดีให้กับคนอื่น': <FaStar />,
};

const MotivationChart: React.FC = () => {
  const [motivationsData, setMotivationsData] = useState<MotivationData[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/soberCheersCharts/totalCount');
        const { motivationCounts, totalCount } = response.data;

        const processedData = Object.entries(motivationCounts)
          .map(([key, value]) => ({
            label: key,
            count: value as number,
            percentage: ((value as number) / totalCount) * 100,
            icon: motivationIcons[key as keyof typeof motivationIcons],
          }))
          .sort((a, b) => b.count - a.count);

        setMotivationsData(processedData);
        setTotalResponses(totalCount);
      } catch (error) {
        console.error('Error fetching motivation data:', error);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-4">กำลังโหลด...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  const chartData = {
    labels: motivationsData.map(item => item.label),
    datasets: [
      {
        data: motivationsData.map(item => item.count),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'
        ]
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / totalResponses) * 100).toFixed(1);
            return `${label}: ${value} คน (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2 text-center">แรงจูงใจในการงดดื่ม</h2>
      <p className="text-sm text-center mb-4">ผู้ลงทะเบียนทั้งหมด: {totalResponses} คน</p>
      <div className="h-48 mb-4">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="space-y-2 text-sm">
        {motivationsData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <span>{item.count} คน ({item.percentage.toFixed(1)}%)</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-500 text-center">
        หมายเหตุ: ผู้ลงทะเบียนสามารถเลือกแรงจูงใจได้มากกว่าหนึ่งข้อ
      </p>
    </div>
  );
};

export default MotivationChart;