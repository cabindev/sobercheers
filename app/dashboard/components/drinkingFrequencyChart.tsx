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
        const response = await axios.get('/api/dashboard');
        const { campaigns } = response.data;

        const newData: FrequencyData = {};
        let total = 0;

        campaigns.forEach((campaign: any) => {
          if (campaign.drinkingFrequency) {
            if (newData[campaign.drinkingFrequency]) {
              newData[campaign.drinkingFrequency] += campaign._count.drinkingFrequency;
            } else {
              newData[campaign.drinkingFrequency] = campaign._count.drinkingFrequency;
            }
            total += campaign._count.drinkingFrequency;
          }
        });

        if (newData['Unknown']) {
          newData['เลิกดื่มมาแล้วมากกว่า 3 ปี หรือ ไม่เคยดื่มเลยตลอดชีวิต'] = newData['Unknown'];
          delete newData['Unknown'];
        }

        setFrequencyData(newData);
        setTotalRegistered(campaigns.reduce((sum: number, campaign: any) => sum + campaign._count.drinkingFrequency, 0));
        setTotalResponded(total);
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">ความถี่ในการดื่ม (จำนวนคน)</h2>
      <p className="text-center mb-4">
        จำนวนผู้ลงทะเบียนทั้งหมด: {totalRegistered} คน | 
        ตอบแบบสอบถาม: {totalResponded} คน
        ({calculatePercentage(totalResponded, totalRegistered)}%)
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ความถี่</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนคน</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สัดส่วนผู้ตอบ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สัดส่วนทั้งหมด</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(frequencyData).map(([category, count], index) => {
              const percentageOfResponded = calculatePercentage(count, totalResponded);
              const percentageOfTotal = calculatePercentage(count, totalRegistered);
              return (
                <tr key={category}>
                  <td className="px-6 py-4 whitespace-nowrap">{category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{count}</td>
                  <td className="px-6 py-4 whitespace-nowrap relative">
                    <div 
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${percentageOfResponded}%`,
                        backgroundColor: colors[index % colors.length],
                        opacity: 0.3,
                      }}
                    ></div>
                    <span className="relative z-10">{percentageOfResponded}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{percentageOfTotal}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DrinkingFrequencyTable;