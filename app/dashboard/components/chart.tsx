import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register components to Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  maintainAspectRatio: false,
};

const RevenueChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        const { campaigns } = response.data;

        const labels = campaigns.map((campaign: any) => campaign.type);
        const data = campaigns.map((campaign: any) => campaign._count.type);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Campaigns by Type',
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

  return <div style={{ height: '300px' }}><Bar data={chartData} options={options} /></div>;
};

export default RevenueChart;
