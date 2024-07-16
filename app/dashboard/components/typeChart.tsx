import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register components to Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
};

const TypeChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        const { campaigns } = response.data;

        console.log('API response:', response.data); // เพิ่มการบันทึกเพื่อตรวจสอบข้อมูลที่ได้รับ

        const typeCounts: Record<string, number> = {};

        campaigns.forEach((campaign: any) => {
          if (typeCounts[campaign.type]) {
            typeCounts[campaign.type] += campaign._count.type;
          } else {
            typeCounts[campaign.type] = campaign._count.type;
          }
        });

        const labels = Object.keys(typeCounts).map(
          (type) => `${type} (${typeCounts[type]})`
        );
        const data = Object.values(typeCounts);

        setChartData({
          labels,
          datasets: [
            {
              label: 'จำนวนคน',
              data,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TypeChart;
