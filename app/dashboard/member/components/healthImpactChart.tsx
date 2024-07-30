import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaRegUserCircle, FaHeartbeat, FaProcedures, FaRegSmileBeam } from 'react-icons/fa';

interface HealthImpactData {
  [key: string]: number;
}

const HealthImpactChart: React.FC = () => {
  const [data, setData] = useState<HealthImpactData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        const { campaigns } = response.data;

        const healthImpactCounts: HealthImpactData = {};

        campaigns.forEach((campaign: any) => {
          if (healthImpactCounts[campaign.healthImpact]) {
            healthImpactCounts[campaign.healthImpact] += campaign._count.healthImpact;
          } else {
            healthImpactCounts[campaign.healthImpact] = campaign._count.healthImpact;
          }
        });

        setData(healthImpactCounts);
      } catch (error) {
        console.error('Error fetching health impact data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

  const levels = [
    { key: 'ไม่มีผลกระทบ', color: '#4CAF50', icon: <FaRegSmileBeam className="h-10 w-10 text-green-500" /> },
    { key: 'มีผลกระทบแต่ไม่ต้องการช่วยเหลือ', color: '#FFC107', icon: <FaProcedures className="h-10 w-10 text-yellow-500" /> },
    { key: 'มีผลกระทบและควรได้รับการช่วยเหลือจากแพทย์หรือผู้เชี่ยวชาญด้านการบำบัดฯ', color: '#FF5722', icon: <FaHeartbeat className="h-10 w-10 text-red-500" /> }
  ];

  const total = Object.values(data).reduce((sum, value) => sum + value, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">ผลกระทบต่อสุขภาพ</h2>
      <div className="space-y-4">
        {levels.map((level) => {
          const count = data[level.key] || 0;
          const percentage = (count / total) * 100;
          return (
            <div key={level.key} className="flex items-center space-x-4">
              <div className="w-12">{level.icon}</div>
              <div className="flex-grow">
                <div className="text-sm mb-1">{level.key}</div>
                <div className="flex items-center space-x-2">
                  <div className="flex-grow bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      style={{ width: `${percentage}%`, backgroundColor: level.color }}
                      className="h-full rounded-full transition-all duration-500 ease-in-out"
                    ></div>
                  </div>
                  <div className="text-sm whitespace-nowrap">
                    {count} คน ({percentage.toFixed(1)}%)
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-center mt-6 text-sm text-gray-600">
        จำนวนผู้ตอบแบบสอบถามทั้งหมด: {total} คน
      </p>
    </div>
  );
};

export default HealthImpactChart;