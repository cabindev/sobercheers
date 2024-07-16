import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  indexAxis: 'y' as const, // Set the index axis to y for horizontal bar chart
  maintainAspectRatio: false,
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Intent Period Overview',
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          return `${context.dataset.label}: ${context.raw}`;
        }
      }
    }
  },
};

const IntentPeriodChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        const { campaigns } = response.data;

        const intentPeriodCounts: Record<string, number> = {};

        campaigns.forEach((campaign: any) => {
          if (campaign.intentPeriod) {
            if (intentPeriodCounts[campaign.intentPeriod]) {
              intentPeriodCounts[campaign.intentPeriod] += campaign._count.intentPeriod;
            } else {
              intentPeriodCounts[campaign.intentPeriod] = campaign._count.intentPeriod;
            }
          }
        });

        const labels = Object.keys(intentPeriodCounts).map(
          (intentPeriod) => `${intentPeriod} (${intentPeriodCounts[intentPeriod]})`
        );
        const data = Object.values(intentPeriodCounts);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Intent Period',
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
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">ความตั้งใจในการงดดื่ม</h2>
      <p className="text-gray-500 mb-4">Overview of Intent Period</p>
      <div style={{ height: '300px', width: '100%' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default IntentPeriodChart;
