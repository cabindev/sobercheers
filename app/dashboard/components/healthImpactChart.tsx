import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaRegUserCircle, FaHeartbeat, FaProcedures, FaRegSmileBeam } from 'react-icons/fa';

const HealthImpactList: React.FC = () => {
  const [data, setData] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        const { campaigns } = response.data;

        const healthImpactCounts: Record<string, number> = {};

        campaigns.forEach((campaign: any) => {
          if (healthImpactCounts[campaign.healthImpact]) {
            healthImpactCounts[campaign.healthImpact] += campaign._count.healthImpact;
          } else {
            healthImpactCounts[campaign.healthImpact] = campaign._count.healthImpact;
          }
        });

        setData(healthImpactCounts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const icons: Record<string, JSX.Element> = {
    'ไม่มีผลกระทบ': <FaRegSmileBeam className="h-10 w-10 text-green-500" />,
    'มีผลกระทบแต่ไม่ต้องการช่วยเหลือ': <FaProcedures className="h-10 w-10 text-yellow-500" />,
    'มีผลกระทบและควรได้รับการช่วยเหลือจากแพทย์หรือผู้เชี่ยวชาญด้านการบำบัดสุรา': <FaHeartbeat className="h-10 w-10 text-red-500" />,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">ผลกระทบต่อสุขภาพ</h2>
      <div>
        {Object.entries(data).map(([healthImpact, count]) => (
          <div key={healthImpact} className="flex items-center mb-4 p-4 bg-gray-50 rounded-md shadow-sm">
            {icons[healthImpact] || <FaRegUserCircle className="h-10 w-10 text-teal-500" />}
            <div className="ml-4">
              <p className="font-semibold text-gray-700">{healthImpact}</p>
              <p className="text-gray-500">{count.toLocaleString()} คน</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthImpactList;
