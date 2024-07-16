import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register components to Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const AlcoholConsumptionChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        const { campaigns } = response.data;

        const alcoholCounts: Record<string, number> = {};

        campaigns.forEach((campaign: any) => {
          if (alcoholCounts[campaign.alcoholConsumption]) {
            alcoholCounts[campaign.alcoholConsumption] += campaign._count.alcoholConsumption;
          } else {
            alcoholCounts[campaign.alcoholConsumption] = campaign._count.alcoholConsumption;
          }
        });

        const labels = Object.keys(alcoholCounts).map(
          (alcoholConsumption) => `${alcoholConsumption} (${alcoholCounts[alcoholConsumption]})`
        );
        const data = Object.values(alcoholCounts);

        setChartData({
          labels,
          datasets: [
            {
              label: 'การบริโภคเครื่องดื่มแอลกอฮอล์',
              data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)'
              ],
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
      <h2 className="text-xl font-bold mb-2">การบริโภคเครื่องดื่มแอลกอฮอล์</h2>
      <p className="text-gray-500 mb-4">Overview of Alcohol Consumption</p>
      <div style={{ height: '300px', width: '300px' }}>
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default AlcoholConsumptionChart;
