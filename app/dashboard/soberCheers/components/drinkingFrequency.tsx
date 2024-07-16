import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface FrequencyData {
  [key: string]: number;
}

const DrinkingFrequencyTable: React.FC = () => {
  const [frequencyData, setFrequencyData] = useState<FrequencyData | null>(null);
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [totalResponded, setTotalResponded] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/soberCheersCharts');
        const { drinkingFrequency, totalCount } = response.data;
        const newData: FrequencyData = { ...drinkingFrequency };
        if (newData['Unknown']) {
          newData['เลิกดื่มมาแล้วมากกว่า 3 ปี หรือ ไม่เคยดื่มเลยตลอดชีวิต'] = newData['Unknown'];
          delete newData['Unknown'];
        }
        setFrequencyData(newData);
        setTotalRegistered(totalCount);
        setTotalResponded(Object.values(newData).reduce((sum, count) => sum + (count || 0), 0));
      } catch (error) {
        console.error('Error fetching frequency data:', error);
      }
    };
    fetchData();
  }, []);

  if (!frequencyData) {
    return <div>Loading...</div>;
  }

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#C7B198'];

  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return '0.0';
    return ((count / total) * 100).toFixed(1);
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>ความถี่ในการดื่ม (จำนวนคน)</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px' }}>
        จำนวนผู้ลงทะเบียนทั้งหมด: {totalRegistered} คน | 
        ตอบแบบสอบถาม: {totalResponded} คน 
        ({calculatePercentage(totalResponded, totalRegistered)}%)
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '12px' }}>ความถี่</th>
            <th style={{ padding: '12px' }}>จำนวนคน</th>
            <th style={{ padding: '12px' }}>สัดส่วนผู้ตอบ</th>
            <th style={{ padding: '12px' }}>สัดส่วนทั้งหมด</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(frequencyData).map(([category, count], index) => {
            const percentageOfResponded = calculatePercentage(count, totalResponded);
            const percentageOfTotal = calculatePercentage(count, totalRegistered);
            return (
              <tr key={category} style={{ borderBottom: '1px solid #ddd', position: 'relative' }}>
                <td style={{ padding: '12px' }}>{category}</td>
                <td style={{ padding: '12px' }}>{count}</td>
                <td style={{ padding: '12px', position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${percentageOfResponded}%`,
                    backgroundColor: colors[index % colors.length],
                    opacity: 0.3,
                    height: '100%'
                  }}></div>
                  {percentageOfResponded}%
                </td>
                <td style={{ padding: '12px' }}>
                  {percentageOfTotal}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DrinkingFrequencyTable;
