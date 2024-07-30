import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyExpenseChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        const { campaigns } = response.data;

        const monthlyExpenseCounts: Record<string, number> = {};

        campaigns.forEach((campaign: any) => {
          if (monthlyExpenseCounts[campaign.monthlyExpense]) {
            monthlyExpenseCounts[campaign.monthlyExpense] += campaign._count.monthlyExpense;
          } else {
            monthlyExpenseCounts[campaign.monthlyExpense] = campaign._count.monthlyExpense;
          }
        });

        const labels = Object.keys(monthlyExpenseCounts);
        const data = Object.values(monthlyExpenseCounts);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Monthly Expense',
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

  return <div style={{ height: '300px' }}><Bar data={chartData} /></div>;
};

export default MonthlyExpenseChart;
