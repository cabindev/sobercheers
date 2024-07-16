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
    tooltip: {
      callbacks: {
        label: function (context: any) {
          return `${context.dataset.label}: ${context.raw}`;
        }
      }
    }
  }
};

const DrinkingFrequencyChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        const { campaigns } = response.data;

        const drinkingFrequencyCounts: Record<string, number> = {};

        campaigns.forEach((campaign: any) => {
          if (campaign.drinkingFrequency) {
            if (drinkingFrequencyCounts[campaign.drinkingFrequency]) {
              drinkingFrequencyCounts[campaign.drinkingFrequency] += campaign._count.drinkingFrequency;
            } else {
              drinkingFrequencyCounts[campaign.drinkingFrequency] = campaign._count.drinkingFrequency;
            }
          }
        });

        const labels = Object.keys(drinkingFrequencyCounts).map(
          (drinkingFrequency) => `${drinkingFrequency} (${drinkingFrequencyCounts[drinkingFrequency]})`
        );
        const data = Object.values(drinkingFrequencyCounts);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Drinking Frequency',
              data,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
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

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">ความถี่ในการดื่ม</h2>
      <p className="text-gray-500 mb-4">Overview of Drinking Frequency</p>
      <div style={{ height: '300px', width: '100%' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DrinkingFrequencyChart;
