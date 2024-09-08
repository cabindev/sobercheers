'use client';

import React, { useState, useEffect } from 'react';

interface ProvinceData {
  province: string;
  count: number;
}

const TestApiPage: React.FC = () => {
  const [data, setData] = useState<ProvinceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/soberCheers/provinces');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('API response:', result); // Log the entire response
        if (Array.isArray(result.provinces)) {
          setData(result.provinces);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (e) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Province Data Test</h1>
      <p>Total provinces: {data.length}</p>
      <table>
        <thead>
          <tr>
            <th>Province</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.province}</td>
              <td>{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestApiPage;