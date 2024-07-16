import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MotiVation: React.FC = () => {
  const [intentPeriodData, setIntentPeriodData] = useState<any>(null);
  const [motivationsData, setMotivationsData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/soberCheersCharts');
        console.log('API response:', response.data); // Debug API response
        const { intentPeriod, motivations, totalCount } = response.data;

        if (!intentPeriod || !motivations) {
          console.error('No intentPeriod or motivations data found');
          return;
        }

        // Process intentPeriod data
        const processedIntentPeriodData = { ...intentPeriod };
        if (processedIntentPeriodData['Unknown']) {
          processedIntentPeriodData['เลิกดื่มมาแล้วมากกว่า 3 ปี หรือ ไม่เคยดื่มเลยตลอดชีวิต'] = processedIntentPeriodData['Unknown'];
          delete processedIntentPeriodData['Unknown'];
        }

        const intentPeriodPercentages = Object.entries(processedIntentPeriodData).map(([key, value]) => ({
          label: key,
          percentage: ((value as number) / totalCount * 100).toFixed(2),
        }));

        setIntentPeriodData(intentPeriodPercentages);

        // Process motivations data
        const processedMotivationsData = { ...motivations };
        if (processedMotivationsData['Unknown']) {
          processedMotivationsData['ไม่ระบุ'] = processedMotivationsData['Unknown'];
          delete processedMotivationsData['Unknown'];
        }

        const motivationsPercentages = Object.entries(processedMotivationsData).map(([key, value]) => ({
          label: key,
          percentage: ((value as number) / totalCount * 100).toFixed(2),
        }));

        setMotivationsData(motivationsPercentages);

      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  if (!intentPeriodData || !motivationsData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>ตั้งใจงดดื่มแบบใหนบ้าง (เปอร์เซ็นต์)</h2>
      <table>
        <thead>
          <tr>
            <th>หมวดหมู่</th>
            <th>เปอร์เซ็นต์</th>
          </tr>
        </thead>
        <tbody>
          {intentPeriodData.map((item: any, index: number) => (
            <tr key={index}>
              <td>{item.label}</td>
              <td>{item.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '20px' }}>แรงจูงใจในการงดดื่ม (เปอร์เซ็นต์)</h2>
      <table>
        <thead>
          <tr>
            <th>หมวดหมู่</th>
            <th>เปอร์เซ็นต์</th>
          </tr>
        </thead>
        <tbody>
          {motivationsData.map((item: any, index: number) => (
            <tr key={index}>
              <td>{item.label}</td>
              <td>{item.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MotiVation;
