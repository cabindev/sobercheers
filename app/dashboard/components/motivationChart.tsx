import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface MotivationCount {
  motivation: string;
  count: number;
}

const MotivationChart: React.FC = () => {
  const [motivationCounts, setMotivationCounts] = useState<MotivationCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        const { campaigns } = response.data;

        if (!campaigns || !Array.isArray(campaigns)) {
          throw new Error('Invalid data format');
        }

        const counts: Record<string, number> = {};

        campaigns.forEach((campaign: any) => {
          const motivations = campaign.motivation;
          if (motivations && Array.isArray(motivations)) {
            motivations.forEach((motivation: string) => {
              if (counts[motivation]) {
                counts[motivation] += 1;
              } else {
                counts[motivation] = 1;
              }
            });
          }
        });

        const countsArray = Object.keys(counts).map((key) => ({
          motivation: key,
          count: counts[key],
        }));

        setMotivationCounts(countsArray);
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">แรงจูงใจในการงดดื่ม</h2>
      <div className="space-y-4">
        {motivationCounts.map((item) => (
          <div
            key={item.motivation}
            className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm"
          >
            <span className="text-gray-700 font-medium">{item.motivation}</span>
            <span className="text-gray-700 font-bold">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MotivationChart;
