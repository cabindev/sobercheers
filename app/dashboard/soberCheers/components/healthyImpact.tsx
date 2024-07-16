import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface HealthImpactData {
  [key: string]: number;
}

const HealthImpactChart: React.FC = () => {
  const [data, setData] = useState<HealthImpactData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/soberCheersCharts');
        const { healthImpact } = response.data;
        setData(healthImpact);
      } catch (error) {
        console.error('Error fetching health impact data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

  const levels = [
    { key: 'ไม่มีผลกระทบ', color: '#4CAF50' },
    { key: 'มีผลกระทบแต่ไม่ต้องการช่วยเหลือ', color: '#FFC107' },
    { key: 'มีผลกระทบและควรได้รับการช่วยเหลือจากแพทย์หรือผู้เชี่ยวชาญด้านการบำบัดฯ', color: '#FF5722' }
  ];

  const total = Object.values(data).reduce((sum, value) => sum + value, 0);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>ผลกระทบต่อสุขภาพ</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {levels.map((level) => {
          const count = data[level.key] || 0;
          const percentage = (count / total) * 100;
          return (
            <div key={level.key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '60%', fontSize: '14px' }}>{level.key}</div>
              <div style={{ width: '40%', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                  width: `${percentage}%`, 
                  height: '20px', 
                  backgroundColor: level.color,
                  borderRadius: '10px',
                  transition: 'width 0.5s ease-in-out'
                }}></div>
                <div style={{ minWidth: '90px', textAlign: 'right', fontSize: '14px' }}>
                  {count} คน ({percentage.toFixed(1)}%)
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        จำนวนผู้ตอบแบบสอบถามทั้งหมด: {total} คน
      </p>
    </div>
  );
};

export default HealthImpactChart;